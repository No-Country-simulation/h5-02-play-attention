import { AudienceSegmentationSection } from "@/features/audience-segmentation/audience-segmentation";
import { ContactSection } from "@/features/contact/contact";
import { DemoVideosSection } from "@/features/demo-videos/demo-videos";
import { HeroSection } from "@/features/hero/hero";
import { PricingPlansSection } from "@/features/pricing-plans/pricing-plans";
import { TestimonialsSection } from "@/features/testimonials/testimonials";
import { Footer } from "@/shared/components/footer";
import { Navbar } from "@/shared/components/navbar";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section id="hero" className="min-h-screen">
        <HeroSection />
      </section>

      {/* Demo Videos */}
      <section id="demo-videos" className="min-h-screen">
        <DemoVideosSection />
      </section>

      {/* Audience Segmentation */}
      <section id="audience-segmentation" className="min-h-screen">
        <AudienceSegmentationSection />
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

      <Footer />
    </main>
  );
}
