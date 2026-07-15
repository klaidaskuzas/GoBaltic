import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import FeatureItem from "./FeatureItem";
import { useLanguage } from "@/contexts/LanguageContext";
import europeMapImage from "@assets/MapChart_Map_1778851671650.png";

const WhyChooseUs = () => {
  const { t } = useLanguage();
  
  const features = [
    {
      titleKey: 'why.fast.title',
      descriptionKey: 'why.fast.description'
    },
    {
      titleKey: 'why.europe.title',
      descriptionKey: 'why.europe.description'
    },
    {
      titleKey: 'why.competitive.title',
      descriptionKey: 'why.competitive.description'
    },
    {
      titleKey: 'why.insurance.title',
      descriptionKey: 'why.insurance.description'
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="w-full md:w-1/2">
            <div className="relative">
              <img 
                src={europeMapImage} 
                alt="GoBaltic service areas in Europe" 
                className="rounded-lg shadow-xl w-full h-auto object-contain bg-white"
                style={{ height: '450px' }}
              />
              <div className="absolute -bottom-6 -right-6 bg-primary text-white py-4 px-6 rounded-lg shadow-lg">
                <p className="text-sm font-medium uppercase">12+ {t('why.europe.title')}</p>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/2">
            <div className="w-20 h-1.5 bg-primary mb-4"></div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">{t('why.title')}</h2>
            <div className="space-y-6 mt-8">
              {features.map((feature, index) => (
                <FeatureItem 
                  key={index}
                  index={index + 1}
                  title={t(feature.titleKey)}
                  description={t(feature.descriptionKey)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
