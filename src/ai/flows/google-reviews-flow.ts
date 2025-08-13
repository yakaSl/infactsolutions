'use server';
/**
 * @fileOverview A flow for fetching Google Reviews.
 *
 * - getGoogleReviews - A function that fetches real Google reviews.
 * - GoogleReview - The type for a single Google review.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {defineTool} from 'genkit/tool';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const GoogleReviewSchema = z.object({
    author_name: z.string().describe("The name of the reviewer."),
    rating: z.number().min(1).max(5).describe("The star rating from 1 to 5."),
    text: z.string().describe("The text content of the review."),
    profile_photo_url: z.string().url().describe("A URL to the reviewer's profile photo."),
    relative_time_description: z.string().describe("How long ago the review was posted (e.g., 'a month ago')."),
});

export type GoogleReview = z.infer<typeof GoogleReviewSchema>;

const GetGoogleReviewsOutputSchema = z.array(GoogleReviewSchema);
export type GetGoogleReviewsOutput = z.infer<typeof GetGoogleReviewsOutputSchema>;


const fetchGoogleReviewsTool = defineTool(
  {
    name: 'fetchGoogleReviews',
    description: 'Fetches the latest reviews for a business from the Google Places API.',
    inputSchema: z.object({
      apiKey: z.string().describe("The Google Cloud API key with Places API enabled."),
      placeId: z.string().describe("The Google Place ID for the business."),
    }),
    outputSchema: GetGoogleReviewsOutputSchema,
  },
  async ({apiKey, placeId}) => {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,rating,reviews&key=${apiKey}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        const errorBody = await response.json();
        console.error('Google Places API Error:', errorBody);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.status !== 'OK') {
        console.error('Google Places API Status Error:', data.error_message || data.status);
        throw new Error(`Google Places API error: ${data.error_message || data.status}`);
      }
      // The API returns reviews, we just need to type them and return
      return data.result.reviews as GetGoogleReviewsOutput;
    } catch (error) {
      console.error('Failed to fetch Google reviews:', error);
      // In case of an error, return an empty array to avoid crashing the page.
      // A more robust solution might involve returning cached or mock data.
      return [];
    }
  }
);


const getGoogleReviewsFlow = ai.defineFlow(
  {
    name: 'getGoogleReviewsFlow',
    outputSchema: GetGoogleReviewsOutputSchema,
  },
  async () => {
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    const placeId = process.env.GOOGLE_PLACE_ID;

    if (!apiKey || !placeId) {
      console.warn("GOOGLE_PLACES_API_KEY or GOOGLE_PLACE_ID is not set in .env.local. Returning mock data.");
      return mockReviews;
    }

    return await fetchGoogleReviewsTool({ apiKey, placeId });
  }
);

export async function getGoogleReviews(): Promise<GetGoogleReviewsOutput> {
  return await getGoogleReviewsFlow();
}


// Mock data to be used as a fallback if the API keys are not provided.
const mockReviews: GetGoogleReviewsOutput = [
    {
        author_name: "Alex Thompson",
        profile_photo_url: "https://placehold.co/100x100.png",
        rating: 5,
        relative_time_description: "2 weeks ago",
        text: "INFACT SOLUTIONS delivered a phenomenal product. Their team is professional, skilled, and incredibly responsive. They took our vision and turned it into a reality that exceeded our expectations. Highly recommend!",
    },
    {
        author_name: "Samantha Miller",
        profile_photo_url: "https://placehold.co/100x100.png",
        rating: 5,
        relative_time_description: "a month ago",
        text: "Working with this team was a game-changer for our business. The custom software they developed has streamlined our processes and saved us countless hours. Their expertise in cloud solutions is top-notch.",
    },
    {
        author_name: "David Rodriguez",
        profile_photo_url: "https://placehold.co/100x100.png",
        rating: 4,
        relative_time_description: "3 weeks ago",
        text: "The mobile app is fantastic—intuitive, fast, and beautifully designed. They listened to our feedback and delivered a product our users love. There were a few minor delays, but the final result was worth it.",
    },
    {
        author_name: "Jessica Chen",
        profile_photo_url: "https://placehold.co/100x100.png",
        rating: 5,
        relative_time_description: "2 months ago",
        text: "From start to finish, the process was seamless. Their project management is excellent, and they kept us in the loop at every stage. We're thrilled with our new analytics dashboard. It's powerful and easy to use.",
    },
     {
        author_name: "Chris Williams",
        profile_photo_url: "https://placehold.co/100x100.png",
        rating: 5,
        relative_time_description: "a week ago",
        text: "Truly a team of experts. They tackled our complex cybersecurity needs with confidence and delivered a robust solution that gives us peace of mind. Their professionalism is unmatched. I would not hesitate to work with them again.",
    },
];
