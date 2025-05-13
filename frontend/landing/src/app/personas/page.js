import { BenefitsSection } from '@/features/audience-segmentation/individuals/benefits/benefits';
import { FaqSection } from '@/features/audience-segmentation/individuals/faq/faq';
import { HeroSection } from '@/features/audience-segmentation/individuals/hero/hero';
import { OperationSection } from '@/features/audience-segmentation/individuals/operation/operation';
import { TestimonialsSection } from '@/features/testimonials/testimonials';
import { ContactSection } from '@/features/contact/contact';
import { CognitivePlansSection } from '@/features/cognitive-plans/cognitive-plans';

export default function IndividualsPage() {
  return (
    <main className='min-h-screen'>
      {/* Hero */}
      <section id='hero'>
        <HeroSection />
      </section>

      {/* Operation */}
      <section id='operation'>
        <OperationSection />
      </section>

      {/* Benefits */}
      <section id='benefits'>
        <BenefitsSection />
      </section>

      {/* Testimonials */}
      <section id='testimonials'>
        <TestimonialsSection />
      </section>

      {/* Cognitive Plans */}
      <section id='cognitive-plans'>
        <CognitivePlansSection />
      </section>

      {/* FAQ */}
      <section id='faq'>
        <FaqSection />
      </section>

      {/* Contact */}
      <section id='contact'>
        <ContactSection />
      </section>
    </main>
  );
}
