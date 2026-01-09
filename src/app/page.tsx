import ContributeSection from "@/components/home/contribution-section";
import CtaSection from "@/components/home/cta-section";
import FaqSection from "@/components/home/faq-section";
import FeaturesSection from "@/components/home/features-section";
import HeroSection from "@/components/home/hero-section";
import PracticeSection from "@/components/home/practice-section";
import StatisticsSection from "@/components/home/statistics-section";
import TestsOverviewSection from "@/components/home/tests-overview-section";
import TestimonialsSection from "@/components/home/testimonials-section";

export default function Home() {
  return (
    <main className="m-auto dark min-h-screen bg-black text-white">
      <HeroSection />
      <FeaturesSection />
      <TestsOverviewSection />
      <PracticeSection />
      <ContributeSection />
      <StatisticsSection />
      <TestimonialsSection />
      <FaqSection />
      <CtaSection />
    </main>
  );
}
