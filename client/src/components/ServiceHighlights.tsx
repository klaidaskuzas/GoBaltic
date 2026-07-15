import ServiceCard from "./ServiceCard";
import { services } from "@/data/services";
import { useLanguage } from "@/contexts/LanguageContext";

const ServiceHighlights = () => {
  const { t } = useLanguage();
  
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16">
          <div className="w-20 h-1.5 bg-primary mb-4"></div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('services.title')}</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              title={t(service.titleKey)}
              description={t(service.descriptionKey)}
              imageUrl={service.imageUrl}
              link={service.link}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceHighlights;
