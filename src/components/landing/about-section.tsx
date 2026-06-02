'use client';

import Image from 'next/image';

export function AboutSection() {
  return (
    <>
      <section id="about" className="bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div
              className="space-y-6"
            >
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                Your Trusted Global <span className="text-primary">IT Partner</span>
              </h2>
              <div className="space-y-4 text-lg text-muted-foreground">
                <p>
                  Founded on innovation and integrity, INFACT SOLUTIONS is a premier IT and cybersecurity firm headquartered in Colombo, Sri Lanka. We are a collective of passionate technologists, creative designers, and strategic thinkers dedicated to solving complex challenges for a global clientele. Our mission is to be your trusted global outsourcing partner, delivering bespoke digital solutions that are technologically advanced and strategically aligned with your business objectives.
                </p>
                <p>
                  Our expertise spans critical domains including enterprise networking, robust cybersecurity defenses, and scalable software development. But we go beyond designing screens or publishing websites: we build complete digital ecosystems where the website, mobile app, admin dashboard, cloud backend, payments, and business operations work together. Our strongest value is understanding the business model behind each project and turning it into a practical, scalable digital product — for clients across tourism, healthcare, real estate, gems, education, e-commerce, mobility, and SaaS.
                </p>
            </div>
            </div>
            <div
              className="relative h-96 w-full rounded-lg overflow-hidden shadow-2xl"
            >
              <Image 
                src="/aboutinfact.jpg"
                alt="Global IT outsourcing services team collaborating on a project - Infact Solutions"
                fill
                className="object-cover"
                data-ai-hint="team collaboration"
              />
            </div>
          </div>
        </div>
      </section>
      <div 
        className="h-[400px] w-full relative"
        aria-label="Abstract background image of global network infrastructure representing worldwide IT solutions"
      >
        <Image
            src="/parallaxbk.jpg"
            alt="Abstract global network infrastructure"
            fill
            className="object-cover parallax"
          />
      </div>
    </>
  );
}
