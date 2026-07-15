import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ServiceCard from "@/components/ServiceCard";
import { services } from "@/data/services";
import { useLanguage } from "@/contexts/LanguageContext";
import SEOHead from "@/components/SEOHead";
import cargoTransport from '@/assets/cargo-transport.jpg';
import luxuryVehicles from '@/assets/luxury-vehicles.jpg';
import individualTransport from '@/assets/individual-car-transport.jpg';
import crossBorder from '@/assets/cross-border.jpg';

const ServicesPage = () => {
  const { t, language } = useLanguage();

  const detailedServices = [
    {
      titleKey: "services.individual.title",
      title: t("services.individual.title"),
      descriptionKey: "services.individual.long",
      description: t("services.individual.long"),
      details: language === 'en' 
        ? [
            "Flexible pickup and delivery schedule",
            "Comprehensive insurance coverage during transport",
            "Suitable for all vehicle types - from compact to large SUVs or pickups"
          ]
        : language === 'fr'
        ? [
            "Horaires de prise en charge et de livraison flexibles",
            "Couverture d'assurance complète pendant le transport",
            "Convient à tous les types de véhicules - des compacts aux grands SUV ou pickups"
          ]
        : language === 'de'
        ? [
            "Flexibler Abholungs- und Lieferplan",
            "Umfassender Versicherungsschutz während des Transports",
            "Geeignet für alle Fahrzeugtypen - von kompakten bis zu großen SUVs oder Pickups"
          ]
        : language === 'pl'
        ? [
            "Elastyczny harmonogram odbioru i dostawy",
            "Kompleksowe ubezpieczenie podczas transportu",
            "Odpowiedni dla wszystkich typów pojazdów - od kompaktowych po duże SUV-y czy pickupy"
          ]
        : [
            "Lankstus paėmimo ir pristatymo grafikas",
            "Visapusiška draudimo apsauga transportavimo metu",
            "Tinkama visų tipų automobiliams – nuo kompaktiškų iki didelių SUV ar pikapų"
          ],
      imageUrl: individualTransport
    },
    {
      titleKey: "services.cargo.title",
      title: t("services.cargo.title"),
      descriptionKey: "services.cargo.long",
      description: t("services.cargo.long"),
      details: language === 'en'
        ? [
            "Individual securing solutions for non-standard cargo",
            "Specialized equipment for smooth loading and unloading"
          ]
        : language === 'fr'
        ? [
            "Solutions d'arrimage individuelles pour les cargaisons non standard",
            "Équipement spécialisé pour un chargement et déchargement en douceur"
          ]
        : language === 'de'
        ? [
            "Individuelle Sicherungslösungen für nicht standardisierte Fracht",
            "Spezialisierte Ausrüstung für reibungsloses Be- und Entladen"
          ]
        : language === 'pl'
        ? [
            "Indywidualne rozwiązania zabezpieczające dla niestandardowych ładunków",
            "Specjalistyczny sprzęt do płynnego załadunku i rozładunku"
          ]
        : [
            "Individualūs tvirtinimo sprendimai netipiškiems kroviniams",
            "Specializuota įranga sklandžiam pakrovimui ir iškrovimui"
          ],
      imageUrl: cargoTransport
    },
    {
      titleKey: "services.luxury.title",
      title: t("services.luxury.title"),
      descriptionKey: "services.luxury.long",
      description: t("services.luxury.long"),
      details: language === 'en'
        ? [
            "Premium door-to-door service with maximum attention to your vehicle",
            "Professional drivers with years of experience ensure safe and careful transport at every stage of the journey"
          ]
        : language === 'fr'
        ? [
            "Service premium porte-à-porte avec une attention maximale à votre véhicule",
            "Des chauffeurs professionnels avec des années d'expérience garantissent un transport sûr et soigné à chaque étape du trajet"
          ]
        : language === 'de'
        ? [
            "Premium-Tür-zu-Tür-Service mit maximaler Aufmerksamkeit für Ihr Fahrzeug",
            "Professionelle Fahrer mit langjähriger Erfahrung sorgen für einen sicheren und sorgfältigen Transport auf jeder Etappe der Reise"
          ]
        : language === 'pl'
        ? [
            "Usługa premium od drzwi do drzwi z maksymalną uwagą dla twojego pojazdu",
            "Profesjonalni kierowcy z wieloletnim doświadczeniem zapewniają bezpieczny i ostrożny transport na każdym etapie podróży"
          ]
        : [
            "Premium paslauga nuo durų iki durų – su maksimaliu dėmesiu jūsų automobiliui",
            "Profesionalūs vairuotojai su ilgamete patirtimi užtikrina saugų ir atsargų transportavimą kiekviename kelionės etape"
          ],
      imageUrl: luxuryVehicles
    },
    {
      titleKey: "services.international.title",
      title: t("services.international.title"),
      descriptionKey: "services.international.long",
      description: t("services.international.long"),
      details: language === 'en'
        ? [
            "Documentation handling",
            "Border crossing assistance",
            "Multi-lingual support team"
          ]
        : language === 'fr'
        ? [
            "Gestion de la documentation",
            "Assistance au passage des frontières",
            "Équipe de support multilingue"
          ]
        : language === 'de'
        ? [
            "Dokumentenabwicklung",
            "Unterstützung bei Grenzübergängen",
            "Mehrsprachiges Support-Team"
          ]
        : language === 'pl'
        ? [
            "Obsługa dokumentacji",
            "Pomoc przy przekraczaniu granic",
            "Wielojęzyczny zespół wsparcia"
          ]
        : [
            "Dokumentacijos tvarkymas",
            "Pagalba kertant sienas",
            "Daugiakalbė palaikymo komanda"
          ],
      imageUrl: crossBorder
    }
  ];

  return (
    <>
      <SEOHead 
        title="Vehicle Transportation Services | GoBaltic"
        titleLT="Automobilių transportavimo paslaugos | GoBaltic"
        description="Professional vehicle transport services including car shipping, luxury vehicle transport, specialized cargo and international transport. Expert logistics across Europe."
        descriptionLT="Profesionalios transporto priemonių gabenimo paslaugos, įskaitant automobilių vežimą, prabangių automobilių transportavimą, specializuotą krovinių ir tarptautinį transportą. Ekspertų logistika visoje Europoje."
        keywords="car shipping, luxury car transport, specialized cargo, international transport, Europe vehicle logistics, car transport Germany, auto transport Poland, Netherlands transport services"
        keywordsLT="automobilių transportavimas, prabangių automobilių gabenimas, specializuotas krovinys, tarptautinis transportas, transporto logistika Europoje, automobilių transportas Vokietija, auto transportas Lenkija, Nyderlandų transporto paslaugos"
        canonicalPath="/services"
      />
      <section className="pt-32 pb-16 bg-gradient-to-br from-primary/10 to-primary/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-gray-200/50 bg-[size:var(--grid-size)_var(--grid-size)] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-primary/10 rounded-full translate-y-1/2 -translate-x-1/3 blur-3xl"></div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <Badge variant="outline" className="mb-6 px-4 py-1 text-primary border-primary/30 bg-primary/5">
              {language === 'en' ? "GOBALTIC" : "GOBALTIC"}
            </Badge>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">{t('services.title')}</h1>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {detailedServices.map((service, index) => (
              <div key={index} className="flex flex-col">
                <div className="rounded-lg overflow-hidden mb-6">
                  <img 
                    src={service.imageUrl} 
                    alt={service.title} 
                    className="w-full h-64 object-cover"
                  />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">{service.title}</h2>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {t('services.features')}
                </h3>
                <ul className="list-disc list-inside space-y-1 text-gray-600 mb-6">
                  {service.details.map((detail, idx) => (
                    <li key={idx}>{detail}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">{t('cta.title')}</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            {t('cta.subtitle')}
          </p>
          <Link href="/contact">
            <Button className="bg-primary hover:bg-primary-700 text-white font-semibold px-8 py-3 text-lg">
              {t('nav.quote')}
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
};

export default ServicesPage;
