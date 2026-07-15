import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Calculator, MapPin, TruckIcon, Clock, Shield } from "lucide-react";

const PricingSection = () => {
  const { t } = useLanguage();
  
  return (
    <section id="pricing" className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('pricing.custom.title')}</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {t('pricing.custom.description')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          <div className="bg-gray-50 p-8 rounded-lg shadow-sm">
            <div className="flex items-start mb-4">
              <div className="bg-primary rounded-full p-3 mr-4">
                <Calculator className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">{t('pricing.factors.title')}</h3>
                <p className="text-gray-600">{t('pricing.factors.description')}</p>
              </div>
            </div>
            <ul className="space-y-3 pl-14 text-gray-600">
              <li className="flex items-center">
                <MapPin className="h-5 w-5 text-primary mr-2" />
                {t('pricing.factors.distance')}
              </li>
              <li className="flex items-center">
                <TruckIcon className="h-5 w-5 text-primary mr-2" />
                {t('pricing.factors.weight')}
              </li>
              <li className="flex items-center">
                <Clock className="h-5 w-5 text-primary mr-2" />
                {t('pricing.factors.urgency')}
              </li>
              <li className="flex items-center">
                <Shield className="h-5 w-5 text-primary mr-2" />
                {t('pricing.factors.services')}
              </li>
            </ul>
          </div>
          
          <div className="bg-gray-50 p-8 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-4">{t('pricing.quote.title')}</h3>
            <p className="mb-6 text-gray-600">
              {t('pricing.quote.description')}
            </p>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                {t('pricing.quote.info')}
              </p>
              <Link href="/contact">
                <Button className="w-full bg-primary hover:bg-primary-700">
                  {t('pricing.quote.button')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
