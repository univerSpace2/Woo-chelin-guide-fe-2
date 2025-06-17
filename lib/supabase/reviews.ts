import type {
    ApiResponse,
    Comment,
    CommentFormData,
    Review,
    ReviewFormData,
    ReviewWithComments,
} from '@/types';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/types/constants';
import { supabase } from './client';
import { refreshRestaurantStats } from './restaurants';

// 리뷰 생성
export async function createReview(
    formData: ReviewFormData,
    userId: string,
    userName: string,
): Promise<ApiResponse<Review>> {
    try {
        // 리뷰 생성 (중복 체크 제거 - 여러 리뷰 작성 가능)
        const { data, error } = await supabase
            .from('reviews')
            .insert({
                restaurant_id: formData.restaurantId,
                author_id: userId,
                author_name: userName,
                rating: formData.rating,
                content: formData.content,
            })
            .select()
            .single();

        if (error) {
            throw new Error(error.message);
        }

        // 레스토랑 통계 업데이트
        await refreshRestaurantStats(formData.restaurantId);

        return {
            success: true,
            message: SUCCESS_MESSAGES.REVIEW_CREATED,
            data,
        };
    } catch (error: any) {
        return {
            success: false,
            error: error.message || ERROR_MESSAGES.SERVER_ERROR,
        };
    }
}

// 리뷰 수정
export async function updateReview(
    reviewId: number,
    updates: { rating?: number; content?: string },
    userId: string,
): Promise<ApiResponse<Review>> {
    try {
        // 기존 리뷰 정보 가져오기 (권한 확인 및 레스토랑 ID 필요)
        const { data: review, error: checkError } = await supabase
            .from('reviews')
            .select('author_id, restaurant_id')
            .eq('id', reviewId)
            .single();

        if (checkError) {
            throw new Error(checkError.message);
        }

        if (review.author_id !== userId) {
            return {
                success: false,
                error: ERROR_MESSAGES.FORBIDDEN,
            };
        }

        // 리뷰 업데이트
        const { data, error } = await supabase
            .from('reviews')
            .update(updates)
            .eq('id', reviewId)
            .select()
            .single();

        if (error) {
            throw new Error(error.message);
        }

        // 레스토랑 통계 업데이트
        await refreshRestaurantStats(review.restaurant_id);

        return {
            success: true,
            message: '리뷰가 수정되었습니다.',
            data,
        };
    } catch (error: any) {
        return {
            success: false,
            error: error.message || ERROR_MESSAGES.SERVER_ERROR,
        };
    }
}

// 리뷰 삭제
export async function deleteReview(reviewId: number, userId: string): Promise<ApiResponse<null>> {
    try {
        // 삭제 전 권한 확인 및 레스토랑 ID 가져오기
        const { data: review, error: checkError } = await supabase
            .from('reviews')
            .select('author_id, restaurant_id')
            .eq('id', reviewId)
            .single();

        if (checkError) {
            throw new Error(checkError.message);
        }

        if (review.author_id !== userId) {
            return {
                success: false,
                error: ERROR_MESSAGES.FORBIDDEN,
            };
        }

        // 리뷰 삭제
        const { error } = await supabase.from('reviews').delete().eq('id', reviewId);

        if (error) {
            throw new Error(error.message);
        }

        // 레스토랑 통계 업데이트
        await refreshRestaurantStats(review.restaurant_id);

        return {
            success: true,
            message: '리뷰가 삭제되었습니다.',
        };
    } catch (error: any) {
        return {
            success: false,
            error: error.message || ERROR_MESSAGES.SERVER_ERROR,
        };
    }
}

// 레스토랑 리뷰 목록 조회
export async function getRestaurantReviews(
    restaurantId: number,
): Promise<ApiResponse<ReviewWithComments[]>> {
    try {
        const { data, error } = await supabase
            .from('reviews')
            .select(
                `
                *,
                comments (*)
            `,
            )
            .eq('restaurant_id', restaurantId)
            .order('created_at', { ascending: false });

        if (error) {
            throw new Error(error.message);
        }

        return {
            success: true,
            data: data || [],
        };
    } catch (error: any) {
        return {
            success: false,
            error: error.message || ERROR_MESSAGES.SERVER_ERROR,
        };
    }
}

// 사용자 리뷰 목록 조회
export async function getUserReviews(userId: string): Promise<ApiResponse<ReviewWithComments[]>> {
    try {
        const { data, error } = await supabase
            .from('reviews')
            .select(
                `
                *,
                comments (*),
                restaurants (name, category, main_image)
            `,
            )
            .eq('author_id', userId)
            .order('created_at', { ascending: false });

        if (error) {
            throw new Error(error.message);
        }

        return {
            success: true,
            data: data || [],
        };
    } catch (error: any) {
        return {
            success: false,
            error: error.message || ERROR_MESSAGES.SERVER_ERROR,
        };
    }
}

// 댓글 생성
export async function createComment(
    formData: CommentFormData,
    userId: string,
    userName: string,
): Promise<ApiResponse<Comment>> {
    try {
        const { data, error } = await supabase
            .from('comments')
            .insert({
                review_id: formData.reviewId,
                author_id: userId,
                author_name: userName,
                content: formData.content,
            })
            .select()
            .single();

        if (error) {
            throw new Error(error.message);
        }

        return {
            success: true,
            message: SUCCESS_MESSAGES.COMMENT_CREATED,
            data,
        };
    } catch (error: any) {
        return {
            success: false,
            error: error.message || ERROR_MESSAGES.SERVER_ERROR,
        };
    }
}

// 댓글 수정
export async function updateComment(
    commentId: number,
    content: string,
    userId: string,
): Promise<ApiResponse<Comment>> {
    try {
        // 권한 확인
        const { data: comment, error: checkError } = await supabase
            .from('comments')
            .select('author_id')
            .eq('id', commentId)
            .single();

        if (checkError) {
            throw new Error(checkError.message);
        }

        if (comment.author_id !== userId) {
            return {
                success: false,
                error: ERROR_MESSAGES.FORBIDDEN,
            };
        }

        // 댓글 업데이트
        const { data, error } = await supabase
            .from('comments')
            .update({ content })
            .eq('id', commentId)
            .select()
            .single();

        if (error) {
            throw new Error(error.message);
        }

        return {
            success: true,
            message: '댓글이 수정되었습니다.',
            data,
        };
    } catch (error: any) {
        return {
            success: false,
            error: error.message || ERROR_MESSAGES.SERVER_ERROR,
        };
    }
}

// 댓글 삭제
export async function deleteComment(commentId: number, userId: string): Promise<ApiResponse<null>> {
    try {
        // 권한 확인
        const { data: comment, error: checkError } = await supabase
            .from('comments')
            .select('author_id')
            .eq('id', commentId)
            .single();

        if (checkError) {
            throw new Error(checkError.message);
        }

        if (comment.author_id !== userId) {
            return {
                success: false,
                error: ERROR_MESSAGES.FORBIDDEN,
            };
        }

        // 댓글 삭제
        const { error } = await supabase.from('comments').delete().eq('id', commentId);

        if (error) {
            throw new Error(error.message);
        }

        return {
            success: true,
            message: '댓글이 삭제되었습니다.',
        };
    } catch (error: any) {
        return {
            success: false,
            error: error.message || ERROR_MESSAGES.SERVER_ERROR,
        };
    }
}

// 리뷰 좋아요 토글
export async function toggleReviewLike(
    reviewId: number,
    userId: string,
): Promise<ApiResponse<{ isLiked: boolean }>> {
    try {
        // 현재 좋아요 상태 확인
        const { data: existingLike, error: checkError } = await supabase
            .from('review_likes')
            .select('id')
            .eq('review_id', reviewId)
            .eq('user_id', userId)
            .single();

        if (checkError && checkError.code !== 'PGRST116') {
            throw new Error(checkError.message);
        }

        if (existingLike) {
            // 좋아요 취소
            const { error } = await supabase
                .from('review_likes')
                .delete()
                .eq('review_id', reviewId)
                .eq('user_id', userId);

            if (error) {
                throw new Error(error.message);
            }

            return {
                success: true,
                data: { isLiked: false },
                message: '좋아요를 취소했습니다.',
            };
        } else {
            // 좋아요 추가
            const { error } = await supabase.from('review_likes').insert({
                review_id: reviewId,
                user_id: userId,
            });

            if (error) {
                throw new Error(error.message);
            }

            return {
                success: true,
                data: { isLiked: true },
                message: '좋아요를 눌렀습니다.',
            };
        }
    } catch (error: any) {
        return {
            success: false,
            error: error.message || ERROR_MESSAGES.SERVER_ERROR,
        };
    }
}

// 사용자의 리뷰 좋아요 상태 확인
export async function getReviewLikeStatus(
    reviewIds: number[],
    userId: string,
): Promise<ApiResponse<{ [reviewId: number]: boolean }>> {
    try {
        const { data, error } = await supabase
            .from('review_likes')
            .select('review_id')
            .in('review_id', reviewIds)
            .eq('user_id', userId);

        if (error) {
            throw new Error(error.message);
        }

        const likeStatus: { [reviewId: number]: boolean } = {};
        reviewIds.forEach((id) => {
            likeStatus[id] = false;
        });

        if (data) {
            data.forEach((like) => {
                likeStatus[like.review_id] = true;
            });
        }

        return {
            success: true,
            data: likeStatus,
        };
    } catch (error: any) {
        return {
            success: false,
            error: error.message || ERROR_MESSAGES.SERVER_ERROR,
        };
    }
}
