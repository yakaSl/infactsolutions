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
                Your Trusted Global <span className="text-primary">IT Partner</span>
              </h2>
              <p className="text-lg text-muted-foreground">
                Founded on the principles of innovation and integrity, INFACT SOLUTIONS is a collective of passionate technologists, creative designers, and strategic thinkers dedicated to solving complex challenges for a global clientele. We believe in the transformative power of technology to simplify processes, connect people, and create new opportunities worldwide.
              </p>
              <p className="text-lg text-muted-foreground">
                Our mission is to be a trusted global IT outsourcing partner, delivering bespoke digital solutions that are not only technologically advanced but also deeply aligned with international business objectives. We strive for excellence in everything we do, from initial concept to final deployment and ongoing support.
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
                src="/aboutinfact.jpg"
                alt="Global IT outsourcing services team collaborating on a project - Infact Solutions"
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
        aria-label="Abstract background image of global network infrastructure representing worldwide IT solutions"
      ></motion.div>
    </>
  );
}
