import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export interface ServiceProps {
  title: string;
  description: string;
  imageUrl: string;
  link: string;
  titleKey?: string;
  descriptionKey?: string;
}

const ServiceCard = ({ title, description, imageUrl, link }: ServiceProps) => {
  const { t } = useLanguage();
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden group transition-all duration-300 hover:shadow-xl">
      <div className="relative overflow-hidden h-52">
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
        <p className="text-gray-600 mb-5 line-clamp-3">{description}</p>
        <Link href={link} className="inline-flex items-center text-primary font-medium hover:text-primary-700 transition-colors group-hover:translate-x-1">
          <span className="mr-2">{t('services.features')}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

export default ServiceCard;
