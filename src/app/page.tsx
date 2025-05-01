'use client'
// import HomePage from "@/app/home";
import ContributeSection from "@/components/home/contribution-section";
import CtaSection from "@/components/home/cta-section";
import FaqSection from "@/components/home/faq-section";
import FeaturesSection from "@/components/home/features-section";
import HeroSection from "@/components/home/hero-section";
import PracticeSection from "@/components/home/practice-section";
import StatisticsSection from "@/components/home/statistics-section";
import TestsSection from "@/components/home/test-section";
import TestimonialsSection from "@/components/home/testimonial-section";
import ReduxProvider from "@/redux/redux-provider";

export default function Home() {
  return (
    <ReduxProvider>
      <main className="m-auto dark min-h-screen bg-black text-white">
        {/* <main className="flex justify-center"> */}
          {/* <HomePage/> */}
          <HeroSection />
          <FeaturesSection />
          <TestsSection />
          <PracticeSection />
          <ContributeSection />
          <StatisticsSection />
          <TestimonialsSection />
          <FaqSection />
          <CtaSection />
        {/* </main> */}
      </main>
    </ReduxProvider>
  );
}
