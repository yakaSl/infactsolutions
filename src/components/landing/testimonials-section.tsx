"use client";

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getGoogleReviews, type GoogleReview } from '@/ai/flows/google-reviews-flow';
import { AnimatePresence, motion } from 'framer-motion';
import { Star } from 'lucide-react';

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-1">
    {[...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`h-5 w-5 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/50'}`}
      />
    ))}
  </div>
);

export function TestimonialsSection() {
  const [reviews, setReviews] = useState<GoogleReview[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const fetchedReviews = await getGoogleReviews();
        setReviews(fetchedReviews);
      } catch (error) {
        console.error("Failed to fetch Google reviews:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReviews();
  }, []);

  const nextReview = useCallback(() => {
    if (reviews.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  }, [reviews.length]);

  useEffect(() => {
    if (reviews.length > 1) {
      const timer = setInterval(nextReview, 7000);
      return () => clearInterval(timer);
    }
  }, [nextReview, reviews.length]);
  
  if (isLoading) {
    return (
      <section id="testimonials" className="bg-card">
        <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">What Our Clients Say</h2>
            <p className="text-lg text-muted-foreground mb-12">Loading authentic reviews...</p>
        </div>
      </section>
    );
  }

  if (reviews.length === 0) {
    return null;
  }
  
  const { author_name, text, rating, profile_photo_url, relative_time_description } = reviews[currentIndex];

  return (
    <section id="testimonials" className="bg-card">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="container mx-auto px-4 md:px-6"
      >
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Trusted by Businesses Like Yours</h2>
           <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Real feedback from our valued clients on Google.
          </p>
        </div>
        <Card className="max-w-4xl mx-auto bg-background p-8 md:p-12 relative overflow-hidden shadow-2xl min-h-[350px] flex items-center justify-center">
          <CardContent className="p-0 text-center w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
                className="flex flex-col items-center"
              >
                <Avatar className="w-20 h-20 mb-4 border-4 border-primary/50">
                  <AvatarImage src={profile_photo_url} alt={author_name} />
                  <AvatarFallback>{author_name.charAt(0)}</AvatarFallback>
                </Avatar>
                 <div className="text-center">
                    <p className="font-bold text-lg">{author_name}</p>
                    <p className="text-sm text-muted-foreground">{relative_time_description}</p>
                </div>
                <div className="my-4">
                  <StarRating rating={rating} />
                </div>
                <blockquote className="text-lg md:text-xl font-medium italic text-center max-w-2xl mx-auto">
                  “{text}”
                </blockquote>
              </motion.div>
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    </section>
  );
}
