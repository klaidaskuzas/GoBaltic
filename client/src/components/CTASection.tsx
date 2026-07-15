import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const CTASection = () => {
  const { t } = useLanguage();
  
  return (
    <section className="relative py-20 bg-gray-900 text-white overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70 z-10"></div>
        <img 
          src="https://images.unsplash.com/photo-1630135395576-05830795379f?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80" 
          alt="Car transporter truck" 
          className="w-full h-full object-cover opacity-30"
        />
      </div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-20">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">{t('cta.title')}</h2>
          <p className="text-lg md:text-xl mb-10 text-white/90">
            {t('cta.subtitle')}
          </p>
          <div className="flex justify-center mt-10">
            <Link href="/contact" className="w-full max-w-sm">
              <div className="bg-white text-primary hover:bg-gray-100 transition-colors duration-300 p-6 rounded-lg shadow-lg flex items-center justify-center space-x-4">
                <Mail className="w-6 h-6" />
                <span className="font-bold">{t('nav.quote')}</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
