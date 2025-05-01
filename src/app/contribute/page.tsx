import ContributionBenefits from "./components/contribution-benifit";
import ContributionCTA from "./components/contribution-cta";
import ContributionFAQ from "./components/contribution-faq";
import ContributionHero from "./components/contribution-hero";
import ContributionProcess from "./components/contribution-process";
import ContributionRewards from "./components/contribution-reward";


export default function ContributePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <ContributionHero />
        <ContributionBenefits />
        <ContributionProcess />
        <ContributionRewards />
        <ContributionFAQ />
        <ContributionCTA />
      </div>
    </div>
  )
}
