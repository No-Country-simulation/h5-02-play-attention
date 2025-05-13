import { AudienceSegmentationSection } from "@/features/audience-segmentation/audience-segmentation";
import { ContactSection } from "@/features/contact/contact";
import { HeroSection } from "@/features/hero/hero";
import { TestimonialsSection } from "@/features/testimonials/testimonials";
import { DemoVideosSection } from "@/features/demo-videos/demo-videos";
/* import { AboutUsSection } from "@/shared/components/about-us/about-us"; */
import { LogosSupportedBy } from "@/features/testimonials/supported-by/supported-by";
/* import { PricingPlansSection } from "@/features/pricing-plans/pricing-plans"; */

export default function Home() {
  return (
    <main>
      {/* Hero */}
      <section id="hero">
        <HeroSection />
      </section>

      {/* Demo Videos */}
      <section id="demo-videos">
        <DemoVideosSection />
      </section>

      {/* Benefits and pricing plans */}
      <section id="pricing-plans">
        <AudienceSegmentationSection />
        {/* <PricingPlansSection /> */}
      </section>

      {/* About Us */}
     {/*  <section id="about-us">
        <AboutUsSection />
      </section> */}

      {/* Testimonials */}
      <section id="testimonials">
        <LogosSupportedBy />
        <TestimonialsSection />
      </section>

      {/* Contact */}
      <section id="contact">
        <ContactSection />
      </section>
    </main>
  );
}
