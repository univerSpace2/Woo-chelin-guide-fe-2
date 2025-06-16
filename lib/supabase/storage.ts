import type { ApiResponse, FileUploadResponse } from '@/types';
import { ERROR_MESSAGES, FILE_CONSTRAINTS } from '@/types/constants';
import { supabase } from './client';

// 파일 유효성 검사
function validateFile(file: File): string | null {
    // 파일 크기 검사
    if (file.size > FILE_CONSTRAINTS.MAX_FILE_SIZE) {
        return ERROR_MESSAGES.FILE_TOO_LARGE;
    }

    // 파일 타입 검사
    if (!FILE_CONSTRAINTS.ALLOWED_TYPES.includes(file.type)) {
        return ERROR_MESSAGES.INVALID_FILE_TYPE;
    }

    return null;
}

// 고유한 파일명 생성
function generateUniqueFileName(file: File): string {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = file.name.split('.').pop();
    return `${timestamp}-${randomString}.${extension}`;
}

// 단일 이미지 업로드
export async function uploadImage(
    file: File,
    bucket: string = process.env.NEXT_PUBLIC_STORAGE_BUCKET || 'photos',
    folder?: string,
): Promise<ApiResponse<FileUploadResponse>> {
    try {
        // 파일 유효성 검사
        const validationError = validateFile(file);
        if (validationError) {
            return {
                success: false,
                error: validationError,
            };
        }

        // 파일명 생성
        const fileName = generateUniqueFileName(file);
        const filePath = folder ? `${folder}/${fileName}` : fileName;

        // 파일 업로드
        const { data, error } = await supabase.storage.from(bucket).upload(filePath, file, {
            cacheControl: '3600',
            upsert: false,
        });

        if (error) {
            throw new Error(error.message);
        }

        // 공개 URL 생성
        const {
            data: { publicUrl },
        } = supabase.storage.from(bucket).getPublicUrl(filePath);

        return {
            success: true,
            data: {
                url: publicUrl,
                key: filePath,
                size: file.size,
                type: file.type,
            },
        };
    } catch (error: any) {
        return {
            success: false,
            error: error.message || ERROR_MESSAGES.SERVER_ERROR,
        };
    }
}

// 다중 이미지 업로드
export async function uploadMultipleImages(
    files: File[],
    bucket: string = process.env.NEXT_PUBLIC_STORAGE_BUCKET || 'photos',
    folder?: string,
): Promise<ApiResponse<FileUploadResponse[]>> {
    try {
        // 파일 개수 검사
        if (files.length > FILE_CONSTRAINTS.MAX_FILES_COUNT) {
            return {
                success: false,
                error: ERROR_MESSAGES.TOO_MANY_FILES,
            };
        }

        // 모든 파일 유효성 검사
        for (const file of files) {
            const validationError = validateFile(file);
            if (validationError) {
                return {
                    success: false,
                    error: `${file.name}: ${validationError}`,
                };
            }
        }

        // 병렬 업로드
        const uploadPromises = files.map((file) => uploadImage(file, bucket, folder));
        const results = await Promise.all(uploadPromises);

        // 실패한 업로드 확인
        const failedUploads = results.filter((result) => !result.success);
        if (failedUploads.length > 0) {
            return {
                success: false,
                error: `${failedUploads.length}개 파일 업로드에 실패했습니다.`,
            };
        }

        // 성공한 업로드 결과 반환
        const successfulUploads = results
            .filter((result) => result.success && result.data)
            .map((result) => result.data!);

        return {
            success: true,
            data: successfulUploads,
        };
    } catch (error: any) {
        return {
            success: false,
            error: error.message || ERROR_MESSAGES.SERVER_ERROR,
        };
    }
}

// 레스토랑 사진 업로드 및 DB 저장
export async function uploadRestaurantPhotos(
    restaurantId: number,
    files: File[],
    userId: string,
): Promise<ApiResponse<FileUploadResponse[]>> {
    try {
        // 이미지 업로드
        const uploadResult = await uploadMultipleImages(
            files,
            'photos',
            `restaurants/${restaurantId}`,
        );

        if (!uploadResult.success || !uploadResult.data) {
            return uploadResult;
        }

        // DB에 사진 정보 저장
        const photoData = uploadResult.data.map((upload) => ({
            restaurant_id: restaurantId,
            url: upload.url,
            alt: '', // 기본값, 나중에 업데이트 가능
            uploaded_by: userId,
        }));

        const { data: photos, error: dbError } = await supabase
            .from('photos')
            .insert(photoData)
            .select();

        if (dbError) {
            // 업로드된 파일들 정리 (선택사항)
            await Promise.all(uploadResult.data.map((upload) => deleteFile(upload.key, 'photos')));

            throw new Error(dbError.message);
        }

        return {
            success: true,
            data: uploadResult.data,
            message: '사진이 성공적으로 업로드되었습니다.',
        };
    } catch (error: any) {
        return {
            success: false,
            error: error.message || ERROR_MESSAGES.SERVER_ERROR,
        };
    }
}

// 파일 삭제
export async function deleteFile(
    filePath: string,
    bucket: string = process.env.NEXT_PUBLIC_STORAGE_BUCKET || 'photos',
): Promise<ApiResponse<null>> {
    try {
        const { error } = await supabase.storage.from(bucket).remove([filePath]);

        if (error) {
            throw new Error(error.message);
        }

        return {
            success: true,
            message: '파일이 삭제되었습니다.',
        };
    } catch (error: any) {
        return {
            success: false,
            error: error.message || ERROR_MESSAGES.SERVER_ERROR,
        };
    }
}

// 레스토랑 사진 삭제 (DB 및 스토리지)
export async function deleteRestaurantPhoto(
    photoId: number,
    userId: string,
): Promise<ApiResponse<null>> {
    try {
        // 사진 정보 조회 및 권한 확인
        const { data: photo, error: photoError } = await supabase
            .from('photos')
            .select(
                `
                *,
                restaurants!inner(created_by)
            `,
            )
            .eq('id', photoId)
            .single();

        if (photoError) {
            throw new Error(photoError.message);
        }

        // 권한 확인 (레스토랑 소유자 또는 사진 업로더)
        const restaurant = photo.restaurants as any;
        if (photo.uploaded_by !== userId && restaurant.created_by !== userId) {
            return {
                success: false,
                error: ERROR_MESSAGES.FORBIDDEN,
            };
        }

        // DB에서 사진 정보 삭제
        const { error: deleteError } = await supabase.from('photos').delete().eq('id', photoId);

        if (deleteError) {
            throw new Error(deleteError.message);
        }

        // 스토리지에서 파일 삭제
        const urlParts = photo.url.split('/');
        const fileName = urlParts[urlParts.length - 1];
        const filePath = `restaurants/${photo.restaurant_id}/${fileName}`;

        await deleteFile(filePath, 'photos');

        return {
            success: true,
            message: '사진이 삭제되었습니다.',
        };
    } catch (error: any) {
        return {
            success: false,
            error: error.message || ERROR_MESSAGES.SERVER_ERROR,
        };
    }
}

// 스토리지 버킷 생성 (관리자용)
export async function createStorageBucket(
    bucketName: string,
    isPublic: boolean = true,
): Promise<ApiResponse<null>> {
    try {
        const { error } = await supabase.storage.createBucket(bucketName, {
            public: isPublic,
            allowedMimeTypes: FILE_CONSTRAINTS.ALLOWED_TYPES,
            fileSizeLimit: FILE_CONSTRAINTS.MAX_FILE_SIZE,
        });

        if (error) {
            throw new Error(error.message);
        }

        return {
            success: true,
            message: `스토리지 버킷 '${bucketName}'이 생성되었습니다.`,
        };
    } catch (error: any) {
        return {
            success: false,
            error: error.message || ERROR_MESSAGES.SERVER_ERROR,
        };
    }
}

// 파일 URL에서 파일 경로 추출
export function extractFilePathFromUrl(url: string): string | null {
    try {
        const urlObj = new URL(url);
        const pathParts = urlObj.pathname.split('/');
        const bucketIndex = pathParts.findIndex((part) => part === 'object');

        if (bucketIndex === -1 || bucketIndex >= pathParts.length - 2) {
            return null;
        }

        return pathParts.slice(bucketIndex + 2).join('/');
    } catch {
        return null;
    }
}
