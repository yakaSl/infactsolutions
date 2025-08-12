'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

export function AboutSection() {
  return (
    <>
      <section id="about" className="bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="space-y-6"
            >
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                About <span className="text-primary">INFACT</span>
              </h2>
              <p className="text-lg text-muted-foreground">
                Founded on the principles of innovation and integrity, INFACT SOLUTIONS is a collective of passionate technologists, creative designers, and strategic thinkers dedicated to solving complex challenges. We believe in the transformative power of technology and its ability to simplify processes, connect people, and create new opportunities.
              </p>
              <p className="text-lg text-muted-foreground">
                Our mission is to be a trusted partner for our clients, delivering bespoke digital solutions that are not only technologically advanced but also deeply aligned with their business objectives. We strive for excellence in everything we do, from initial concept to final deployment and beyond.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="relative h-96 w-full rounded-lg overflow-hidden shadow-2xl"
            >
              <Image 
                src="https://placehold.co/600x400.png"
                alt="Our team collaborating"
                fill
                className="object-cover"
                data-ai-hint="team collaboration"
              />
            </motion.div>
          </div>
        </div>
      </section>
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1 }}
        className="h-[400px] w-full parallax" 
        style={{ backgroundImage: "url('/parallaxbk.jpg')" }}
      ></motion.div>
    </>
  );
}
