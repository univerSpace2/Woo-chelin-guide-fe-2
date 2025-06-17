import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * 레스토랑 타입과 카테고리에 따른 기본 이미지를 반환하는 함수
 */
export function getDefaultRestaurantImage(type: string, category?: string): string {
    // 타입 기반으로 기본 이미지 결정
    switch (type) {
        case '점심':
            return '/images/lunch-default.png';
        case '회식':
            return '/images/dinner-default.png';
        case '카페':
            return '/images/cafe-default.png';
        default:
            // 카테고리 기반으로 추가 분류
            if (category) {
                const lowerCategory = category.toLowerCase();
                if (
                    lowerCategory.includes('카페') ||
                    lowerCategory.includes('커피') ||
                    lowerCategory.includes('디저트')
                ) {
                    return '/images/cafe-default.png';
                }
                if (
                    lowerCategory.includes('한식') ||
                    lowerCategory.includes('중식') ||
                    lowerCategory.includes('양식') ||
                    lowerCategory.includes('일식') ||
                    lowerCategory.includes('분식') ||
                    lowerCategory.includes('치킨')
                ) {
                    return '/images/lunch-default.png';
                }
                if (
                    lowerCategory.includes('술집') ||
                    lowerCategory.includes('바') ||
                    lowerCategory.includes('펍')
                ) {
                    return '/images/dinner-default.png';
                }
            }
            // 기본값은 점심 이미지
            return '/images/lunch-default.png';
    }
}
