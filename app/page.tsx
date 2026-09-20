import React from 'react';
import { LandingNav } from '@/components/landing/LandingNav';
import { HeroSection } from '@/components/landing/HeroSection';
import { IntegrationStrip } from '@/components/landing/IntegrationStrip';
import { ProblemSection } from '@/components/landing/ProblemSection';
import { SolutionFlowSection } from '@/components/landing/SolutionFlowSection';
import { FeatureGrid } from '@/components/landing/FeatureGrid';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { InteractiveProductPreview } from '@/components/landing/InteractiveProductPreview';
import { LandingFooter } from '@/components/landing/LandingFooter';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-sans">
      <LandingNav />
      <main className="flex-1">
        <HeroSection />
        <IntegrationStrip />
        <ProblemSection />
        <SolutionFlowSection />
        <FeatureGrid />
        <HowItWorks />
        <InteractiveProductPreview />
      </main>
      <LandingFooter />
    </div>
  );
}
