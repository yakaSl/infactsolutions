'use server';
/**
 * @fileOverview Mock Google review data for the testimonials section.
 *
 * - getGoogleReviews - A function that returns validated review data.
 * - GoogleReview - The type for a single Google review.
 */

import * as z from 'zod';

const GoogleReviewSchema = z.object({
    author_name: z.string().describe("The name of the reviewer."),
    rating: z.number().min(1).max(5).describe("The star rating from 1 to 5."),
    text: z.string().describe("The text content of the review."),
    profile_photo_url: z.string().refine(
      (value) => value.startsWith('/') || z.string().url().safeParse(value).success,
      { message: "Expected an absolute URL or a local asset path." }
    ).describe("A URL or local asset path to the reviewer's profile photo."),
    relative_time_description: z.string().describe("How long ago the review was posted (e.g., 'a month ago')."),
});

export type GoogleReview = z.infer<typeof GoogleReviewSchema>;

const GetGoogleReviewsOutputSchema = z.array(GoogleReviewSchema);
export type GetGoogleReviewsOutput = z.infer<typeof GetGoogleReviewsOutputSchema>;

export async function getGoogleReviews(): Promise<GetGoogleReviewsOutput> {
  return GetGoogleReviewsOutputSchema.parse(mockReviews);
}

// Mock data until a real Google Reviews integration is implemented.
const mockReviews: GetGoogleReviewsOutput = [
    {
        author_name: "Alex Thompson",
        profile_photo_url: "/testimonials/alex-thompson.png",
        rating: 5,
        relative_time_description: "2 weeks ago",
        text: "INFACT SOLUTIONS delivered a phenomenal product. Their team is professional, skilled, and incredibly responsive. They took our vision and turned it into a reality that exceeded our expectations. Highly recommend!",
    },
    {
        author_name: "Samantha Miller",
        profile_photo_url: "/testimonials/samantha-miller.png",
        rating: 5,
        relative_time_description: "a month ago",
        text: "Working with this team was a game-changer for our business. The custom software they developed has streamlined our processes and saved us countless hours. Their expertise in cloud solutions is top-notch.",
    },
    {
        author_name: "David Rodriguez",
        profile_photo_url: "/testimonials/david-rodriguez.png",
        rating: 4,
        relative_time_description: "3 weeks ago",
        text: "The mobile app is fantastic—intuitive, fast, and beautifully designed. They listened to our feedback and delivered a product our users love. There were a few minor delays, but the final result was worth it.",
    },
    {
        author_name: "Jessica Chen",
        profile_photo_url: "/testimonials/jessica-chen.png",
        rating: 5,
        relative_time_description: "2 months ago",
        text: "From start to finish, the process was seamless. Their project management is excellent, and they kept us in the loop at every stage. We're thrilled with our new analytics dashboard. It's powerful and easy to use.",
    },
     {
        author_name: "Chris Williams",
        profile_photo_url: "/testimonials/chris-williams.png",
        rating: 5,
        relative_time_description: "a week ago",
        text: "Truly a team of experts. They tackled our complex cybersecurity needs with confidence and delivered a robust solution that gives us peace of mind. Their professionalism is unmatched. I would not hesitate to work with them again.",
    },
];
