import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import heroImage from "@/assets/car-transport.jpg";

const HeroSection = () => {
  const { t } = useLanguage();

  return (
    <section id="home" className="relative pt-20 pb-24 md:pt-28 md:pb-28 bg-gray-900 text-white h-[60vh] flex items-center">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/40 z-10"></div>
        <img 
          src={heroImage} 
          alt="Car transporter truck on highway" 
          className="w-full h-full object-cover object-center"
          style={{ 
            height: '100%',
            objectPosition: '50% 60%',
            display: 'block'
          }}
        />
      </div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="max-w-3xl">
          <div className="inline-block bg-primary px-4 py-1 rounded mb-4">
            <span className="text-white font-medium">GoBaltic</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            {t('hero.title')}
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-2xl">
            {t('hero.subtitle')}
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
