import { Link } from "wouter";
import { 
  FacebookIcon, 
  TwitterIcon, 
  InstagramIcon, 
  LinkedinIcon, 
  MapPinIcon, 
  PhoneIcon, 
  MailIcon, 
  ClockIcon 
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();
  
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold mb-4">GoBaltic</h3>
            <p className="text-gray-400 mb-4">
              {t('footer.description')}
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition">
                <FacebookIcon size={18} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition">
                <TwitterIcon size={18} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition">
                <InstagramIcon size={18} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition">
                <LinkedinIcon size={18} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('footer.links')}</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-400 hover:text-white transition">{t('nav.home')}</Link></li>
              <li><Link href="/services" className="text-gray-400 hover:text-white transition">{t('nav.services')}</Link></li>
              <li><Link href="/about" className="text-gray-400 hover:text-white transition">{t('nav.about')}</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-white transition">{t('nav.contact')}</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('footer.services')}</h3>
            <ul className="space-y-2">
              <li><Link href="/services" className="text-gray-400 hover:text-white transition">{t('services.individual.title')}</Link></li>
              <li><Link href="/services" className="text-gray-400 hover:text-white transition">{t('services.cargo.title')}</Link></li>
              <li><Link href="/services" className="text-gray-400 hover:text-white transition">{t('services.luxury.title')}</Link></li>
              <li><Link href="/services" className="text-gray-400 hover:text-white transition">{t('services.international.title')}</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('contact.info.title')}</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPinIcon className="h-5 w-5 mr-3 text-gray-400 mt-0.5" />
                <span className="text-gray-400">Kauno g. 99, LT-55179 Jonava, Lithuania</span>
              </li>

              <li className="flex items-start">
                <MailIcon className="h-5 w-5 mr-3 text-gray-400 mt-0.5" />
                <a href="mailto:info@gobaltic.lt" className="text-gray-400 hover:text-white transition">info@gobaltic.lt</a>
              </li>
              <li className="flex items-start">
                <ClockIcon className="h-5 w-5 mr-3 text-gray-400 mt-0.5" />
                <span className="text-gray-400">Mon-Fri: 8:00 - 19:00</span>
              </li>
              <li className="flex items-start">
                <PhoneIcon className="h-5 w-5 mr-3 text-gray-400 mt-0.5" />
                <a href="tel:+37060766682" className="text-gray-400 hover:text-white transition">+37060766682</a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">{t('footer.copyright')}</p>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-white text-sm transition">{t('footer.legal.privacy')}</a>
            <a href="#" className="text-gray-400 hover:text-white text-sm transition">{t('footer.legal.terms')}</a>
            <a href="#" className="text-gray-400 hover:text-white text-sm transition">{t('footer.legal.cookies')}</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
