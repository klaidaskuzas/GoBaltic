import HeroSection from "@/components/HeroSection";
import ServiceHighlights from "@/components/ServiceHighlights";
import WhyChooseUs from "@/components/WhyChooseUs";
import CustomerSuccessStories from "@/components/CustomerSuccessStories";
import Testimonials from "@/components/Testimonials";
import CTASection from "@/components/CTASection";
import SEOHead from "@/components/SEOHead";
import { useLanguage } from "@/contexts/LanguageContext";

const Home = () => {
  return (
    <>
      <SEOHead 
        title="GoBaltic - Car Transportation Services Across Europe"
        titleLT="GoBaltic - Automobilių transportavimo paslaugos visoje Europoje"
        description="Professional car transportation services across Europe. Safe, reliable and fast vehicle logistics for individuals and businesses. Get a quote today!"
        descriptionLT="Profesionalios automobilių transportavimo paslaugos visoje Europoje. Saugus, patikimas ir greitas transporto logistikos sprendimas privatiems asmenims ir verslui. Gaukite kainą jau šiandien!"
        keywords="car transport, auto transport, vehicle shipping, Europe car transportation, car logistics, GoBaltic, vehicle delivery, international car shipping"
        keywordsLT="automobilių transportavimas, auto transportas, transporto gabenimas, automobilio gabenimas Europoje, automobilių logistika, GoBaltic, automobilių pristatymas, tarptautinis automobilių transportavimas"
        canonicalPath="/"
      />
      <HeroSection />
      <ServiceHighlights />
      <WhyChooseUs />
      <CustomerSuccessStories />
      <Testimonials />
      <CTASection />
    </>
  );
};

export default Home;
