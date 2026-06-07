import HeroSection from '@/components/home/HeroSection';
import TrustBadges from '@/components/home/TrustBadges';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import HowItWorks from '@/components/home/HowItWorks';
import BenefitsSection from '@/components/home/BenefitsSection';
import ReviewsCarousel from '@/components/home/ReviewsCarousel';
import EmailSignup from '@/components/home/EmailSignup';

export default function Home() {
  return (
    <>
      <HeroSection />
      <TrustBadges />
      <FeaturedProducts />
      <HowItWorks />
      <BenefitsSection />
      <ReviewsCarousel />
      <EmailSignup />
    </>
  );
}
