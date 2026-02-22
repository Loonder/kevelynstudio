import { getReviews } from "@/actions/review-actions";
import ReviewsClient from "../../../components/admin/reviews/reviews-client";

export const dynamic = "force-dynamic";

export default async function ReviewsAdminPage() {
    const reviewsData = await getReviews();
    return <ReviewsClient initialReviews={reviewsData} />;
}





