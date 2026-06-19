import Hero from '../components/home/Hero';
import BenefitsBar from '../components/home/BenefitsBar';
import FeaturedCollections from '../components/home/FeaturedCollections';
import BestSellers from '../components/home/BestSellers';
import PromoBanner from '../components/home/PromoBanner';
import Testimonials from '../components/home/Testimonials';
import Newsletter from '../components/home/Newsletter';

export default function Home() {
  return (
    <>
      <Hero />
      <BenefitsBar />
      <FeaturedCollections />
      <BestSellers />
      <PromoBanner />
      <Testimonials />
      <Newsletter />
    </>
  );
}
