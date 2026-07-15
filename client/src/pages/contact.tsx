import ContactSection from "@/components/ContactSection";
import SEOHead from "@/components/SEOHead";
import { useLanguage } from "@/contexts/LanguageContext";

const ContactPage = () => {
  const { t, language } = useLanguage();
  
  return (
    <>
      <SEOHead 
        title="Contact GoBaltic | Vehicle Transport Quote & Support"
        titleLT="Susisiekite su GoBaltic | Automobilių Gabenimo Kaina ir Pagalba"
        description="Contact GoBaltic for professional vehicle transport services across Europe. Request a quote, get assistance or find our office location in Lithuania."
        descriptionLT="Susisiekite su GoBaltic dėl profesionalių transporto priemonių gabenimo paslaugų visoje Europoje. Prašykite kainos, gaukite pagalbą arba raskite mūsų biurą Lietuvoje."
        keywords="contact GoBaltic, vehicle transport quote, car shipping assistance, Europe transport contact, Lithuania logistics company, Poland transport inquiry, German car shipping contact"
        keywordsLT="susisiekite su GoBaltic, transporto priemonių gabenimo kaina, automobilių gabenimo pagalba, Europos transporto kontaktas, Lietuvos logistikos įmonė, Lenkijos transporto užklausa, Vokietijos automobilių gabenimo kontaktas"
        canonicalPath="/contact"
      />
      <section className="pt-24 pb-12 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {language === 'en' ? 'Contact Us' 
              : language === 'fr' ? 'Contactez-nous'
              : language === 'de' ? 'Kontaktieren Sie uns'
              : language === 'pl' ? 'Kontakt'
              : 'Susisiekite'}
            </h1>
            <p className="text-lg text-gray-600">
              {language === 'en' 
                ? 'Have questions or ready to book your transport? Get in touch with our team for a personalized quote.'
                : language === 'fr'
                ? 'Vous avez des questions ou êtes prêt à réserver votre transport? Contactez notre équipe pour un devis personnalisé.'
                : language === 'de'
                ? 'Haben Sie Fragen oder sind Sie bereit, Ihren Transport zu buchen? Kontaktieren Sie unser Team für ein persönliches Angebot.'
                : language === 'pl'
                ? 'Masz pytania lub jesteś gotowy zarezerwować transport? Skontaktuj się z naszym zespołem, aby otrzymać spersonalizowaną wycenę.'
                : 'Turite klausimų arba norite užsakyti transportą? Susisiekite su mūsų komanda dėl individualaus pasiūlymo.'}
            </p>
          </div>
        </div>
      </section>

      <ContactSection />
    </>
  );
};

export default ContactPage;
