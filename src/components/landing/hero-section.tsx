import { Button } from '@/components/ui/button';

export function HeroSection() {
    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };
    
    return (
        <section id="hero" className="relative h-screen w-full parallax" style={{ backgroundImage: "url('https://placehold.co/1920x1080.png')" }} data-ai-hint="abstract technology">
            <div className="absolute inset-0 bg-black/60" />
            <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white px-4">
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter animate-fade-in-down">
                    <span className="text-primary">INFACT</span> Solutions
                </h1>
                <p className="mt-4 max-w-2xl text-lg md:text-xl text-foreground/80 animate-fade-in-up">
                    We engineer cutting-edge digital products and provide innovative services that empower businesses to thrive in a connected world.
                </p>
                <Button size="lg" className="mt-8 text-lg" onClick={() => scrollToSection('contact')}>
                    Get in Touch
                </Button>
            </div>
        </section>
    );
}
