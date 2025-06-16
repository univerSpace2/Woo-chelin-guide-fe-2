// Supabase 관련 모든 함수들을 한곳에서 export

// 클라이언트
export { supabase, supabaseAdmin } from './client';
export type { SupabaseClient } from './client';

// 인증
export {
    getCurrentUser,
    onAuthStateChange,
    signIn,
    signOut,
    signUp,
    updatePassword,
    updateUserProfile,
} from './auth';

// 레스토랑
export {
    createRestaurant,
    deleteRestaurant,
    getNearbyRestaurants,
    getRestaurantDetail,
    getRestaurants,
    updateRestaurant,
} from './restaurants';

// 리뷰 및 댓글
export {
    createComment,
    createReview,
    deleteComment,
    deleteReview,
    getRestaurantReviews,
    getReviewLikeStatus,
    getUserReviews,
    toggleReviewLike,
    updateComment,
    updateReview,
} from './reviews';

// 스토리지
export {
    createStorageBucket,
    deleteFile,
    deleteRestaurantPhoto,
    extractFilePathFromUrl,
    uploadImage,
    uploadMultipleImages,
    uploadRestaurantPhotos,
} from './storage';
