import { AudienceSegmentationSection } from "@/features/audience-segmentation/audience-segmentation";
import { ContactSection } from "@/features/contact/contact";
import { DemoVideosSection } from "@/features/demo-videos/demo-videos";
import { HeroSection } from "@/features/hero/hero";
import { PricingPlansSection } from "@/features/pricing-plans/pricing-plans";
import { TestimonialsSection } from "@/features/testimonials/testimonials";
import { AboutUsSection } from "@/shared/components/about-us/about-us";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section id="hero" className="min-h-screen">
        <HeroSection />
      </section>

      {/* Demo Videos */}
      <section id="demo-videos" className="min-h-screen">
        <DemoVideosSection />
      </section>
     
      {/* Contact */}
      <section id="contact" className="min-h-screen">
        <ContactSection />
      </section>

      {/* Pricing-plans */}
      <section id="pricing-plans" className="min-h-screen">
        <PricingPlansSection />
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="min-h-screen">
        <TestimonialsSection />
      </section>

      {/* About Us */}
      <section id="about-us" className="min-h-screen">
        <AboutUsSection />
      </section>
    </main>
  );
}
