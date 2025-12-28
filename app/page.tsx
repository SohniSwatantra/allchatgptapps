import { genPageMetadata } from '@/app/seo';
import { GridBackground } from '@/components/dashboard/GridBackground';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { HeroSection } from '@/components/dashboard/HeroSection';
import { LeftSidebar } from '@/components/dashboard/LeftSidebar';
import { CenterContent } from '@/components/dashboard/CenterContent';
import { RightSidebar } from '@/components/dashboard/RightSidebar';
import { FloatingChatButton } from '@/components/dashboard/FloatingChatButton';

export const metadata = genPageMetadata({
  title: 'allchatGPTapps - Discover & Share ChatGPT Apps',
  description:
    'Discover and share the best ChatGPT apps. Launch your AI-powered applications and grow with our community of makers.',
});

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      <GridBackground>
        {/* Header */}
        <DashboardHeader />

        {/* Hero Section */}
        <HeroSection />

        {/* Main Content Area */}
        <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
            {/* Left Sidebar - Hidden on mobile, shown on lg+ */}
            <div className="hidden lg:col-span-3 lg:block">
              <LeftSidebar />
            </div>

            {/* Center Content */}
            <div className="lg:col-span-6">
              <CenterContent />
            </div>

            {/* Right Sidebar */}
            <div className="lg:col-span-3">
              <RightSidebar />
            </div>

            {/* Left Sidebar - Shown on mobile at bottom */}
            <div className="lg:hidden">
              <LeftSidebar />
            </div>
          </div>
        </div>

        {/* Floating Chat Button */}
        <FloatingChatButton />
      </GridBackground>
    </div>
  );
}
