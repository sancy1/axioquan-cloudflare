
// /src/app/about/page.tsx

import { Metadata } from 'next';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import AboutHero from '@/components/about/about-hero';
import MissionVision from '@/components/about/mission-vision';
import StatsSection from '@/components/about/stats-section';
import ValuesSection from '@/components/about/values-section';
import TeamSection from '@/components/about/team-section';
import FeaturesShowcase from '@/components/about/features-showcase';
import CTASection from '@/components/about/cta-section';

export const metadata: Metadata = {
  title: 'About AxioQuan - Revolutionizing Online Learning',
  description: 'Discover how AxioQuan is transforming education through innovative technology, expert-led courses, and a community-driven learning platform.',
  keywords: 'online learning, education platform, courses, elearning, AxioQuan about',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-green-500/5 rounded-full blur-3xl"></div>
        </div>

        {/* Page Content */}
        <div className="space-y-24 lg:space-y-32 pb-24">
          <AboutHero />
          <MissionVision />
          {/* <StatsSection /> */}
          <ValuesSection />
          {/* <TeamSection /> */}
          {/* <FeaturesShowcase /> */}
          <CTASection />
        </div>
      </main>

      <Footer />
    </div>
  );
}