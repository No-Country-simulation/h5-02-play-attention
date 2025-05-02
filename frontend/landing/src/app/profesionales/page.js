import { HeroSection } from "@/features/audience-segmentation/professionals/hero/hero";
import { OperationSection } from "@/features/audience-segmentation/professionals/operation/operation";
import { BenefitsSection } from "@/features/audience-segmentation/professionals/benefits/benefits";
import { FaqSection } from "@/features/audience-segmentation/professionals/faq/faq";
import { TestimonialsSection } from "@/features/testimonials/testimonials";
import { ContactSection } from "@/features/contact/contact";

export default function IndividualsPage() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section id="hero">
        <HeroSection />
      </section>

      {/* Operation */}
      <section id="operation">
        <OperationSection />
      </section>

      {/* Benefits */}
      <section id="benefits">
        <BenefitsSection />
      </section>

      {/* Testimonials */}
      <section id="testimonials">
        <TestimonialsSection />
      </section>

      {/* FAQ */}
      <section id="faq">
        <FaqSection />
      </section>

      {/* Contact */}
      <section id="contact">
        <ContactSection />
      </section>
    </main>
  );
}
