import CTASection from "@/components/CTASection";
import SEOHead from "@/components/SEOHead";
import { 
  ShieldCheck, 
  ClipboardCheck, 
  Award, 
  LockKeyhole, 
  Briefcase, 
  Target, 
  HeartHandshake, 
  PackageCheck
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

const AboutPage = () => {
  const { t, language } = useLanguage();

  const values = [
    {
      title: language === 'en' ? "Reliability" 
           : language === 'fr' ? "Fiabilité"
           : language === 'de' ? "Zuverlässigkeit"
           : language === 'pl' ? "Niezawodność"
           : "Patikimumas",
      description: language === 'en' 
        ? "We deliver on our promises with consistent, dependable service you can count on at every step of the transportation process."
        : language === 'fr'
        ? "Nous tenons nos promesses avec un service cohérent et fiable sur lequel vous pouvez compter à chaque étape du processus de transport."
        : language === 'de'
        ? "Wir halten unsere Versprechen mit einem zuverlässigen, beständigen Service, auf den Sie bei jedem Schritt des Transportprozesses zählen können."
        : language === 'pl'
        ? "Dotrzymujemy obietnic, oferując spójną, niezawodną usługę, na której możesz polegać na każdym etapie procesu transportu."
        : "Mes tesime savo pažadus su nuoseklia, patikima paslauga, kuria galite pasitikėti kiekviename transportavimo proceso etape.",
      icon: <ShieldCheck className="h-10 w-10 text-primary" />
    },
    {
      title: language === 'en' ? "Transparency" 
           : language === 'fr' ? "Transparence"
           : language === 'de' ? "Transparenz"
           : language === 'pl' ? "Przejrzystość"
           : "Skaidrumas",
      description: language === 'en'
        ? "Clear communication and no hidden fees or surprise charges in our service. We maintain open and honest dialogue with all clients."
        : language === 'fr'
        ? "Communication claire et pas de frais cachés ou de charges surprises dans notre service. Nous maintenons un dialogue ouvert et honnête avec tous les clients."
        : language === 'de'
        ? "Klare Kommunikation und keine versteckten Gebühren oder überraschenden Kosten in unserem Service. Wir pflegen einen offenen und ehrlichen Dialog mit allen Kunden."
        : language === 'pl'
        ? "Jasna komunikacja i brak ukrytych opłat lub niespodziewanych kosztów w naszej usłudze. Utrzymujemy otwarty i uczciwy dialog ze wszystkimi klientami."
        : "Aiškus bendravimas ir jokių paslėptų ar netikėtų mokesčių mūsų paslaugose. Mes palaikome atvirą ir sąžiningą dialogą su visais klientais.",
      icon: <ClipboardCheck className="h-10 w-10 text-primary" />
    },
    {
      title: language === 'en' ? "Excellence" 
           : language === 'fr' ? "Excellence"
           : language === 'de' ? "Exzellenz"
           : language === 'pl' ? "Doskonałość"
           : "Tobulumas",
      description: language === 'en'
        ? "We continually strive to exceed expectations in every aspect of our operation, from customer service to vehicle handling and delivery."
        : language === 'fr'
        ? "Nous nous efforçons continuellement de dépasser les attentes dans tous les aspects de notre fonctionnement, du service client à la manipulation et à la livraison des véhicules."
        : language === 'de'
        ? "Wir bemühen uns ständig, die Erwartungen in jedem Aspekt unserer Tätigkeit zu übertreffen, vom Kundenservice bis zur Fahrzeughandhabung und -lieferung."
        : language === 'pl'
        ? "Nieustannie staramy się przekraczać oczekiwania w każdym aspekcie naszej działalności, od obsługi klienta po obsługę pojazdów i dostawę."
        : "Mes nuolat stengiamės viršyti lūkesčius kiekviename mūsų veiklos aspekte, nuo klientų aptarnavimo iki transporto priemonių tvarkymo ir pristatymo.",
      icon: <Award className="h-10 w-10 text-primary" />
    },
    {
      title: language === 'en' ? "Safety" 
           : language === 'fr' ? "Sécurité"
           : language === 'de' ? "Sicherheit"
           : language === 'pl' ? "Bezpieczeństwo"
           : "Saugumas",
      description: language === 'en'
        ? "The security of your vehicle is our top priority during every transport. We use advanced equipment and follow strict safety protocols."
        : language === 'fr'
        ? "La sécurité de votre véhicule est notre priorité absolue lors de chaque transport. Nous utilisons des équipements avancés et suivons des protocoles de sécurité stricts."
        : language === 'de'
        ? "Die Sicherheit Ihres Fahrzeugs hat bei jedem Transport oberste Priorität. Wir verwenden modernste Ausrüstung und befolgen strenge Sicherheitsprotokolle."
        : language === 'pl'
        ? "Bezpieczeństwo Twojego pojazdu jest naszym najwyższym priorytetem podczas każdego transportu. Używamy zaawansowanego sprzętu i przestrzegamy surowych protokołów bezpieczeństwa."
        : "Jūsų transporto priemonės saugumas yra mūsų prioritetas kiekvieno transportavimo metu. Naudojame pažangią įrangą ir laikomės griežtų saugumo protokolų.",
      icon: <LockKeyhole className="h-10 w-10 text-primary" />
    }
  ];

  const additionalValues = [
    {
      title: language === 'en' ? "Professionalism" 
           : language === 'fr' ? "Professionnalisme"
           : language === 'de' ? "Professionalität"
           : language === 'pl' ? "Profesjonalizm"
           : "Profesionalumas",
      icon: <Briefcase />
    },
    {
      title: language === 'en' ? "Precision" 
           : language === 'fr' ? "Précision"
           : language === 'de' ? "Präzision"
           : language === 'pl' ? "Precyzja"
           : "Tikslumas",
      icon: <Target />
    },
    {
      title: language === 'en' ? "Customer Focus" 
           : language === 'fr' ? "Orientation client"
           : language === 'de' ? "Kundenorientierung"
           : language === 'pl' ? "Koncentracja na kliencie"
           : "Orientacija į klientą",
      icon: <HeartHandshake />
    },
    {
      title: language === 'en' ? "Quality Service" 
           : language === 'fr' ? "Service de qualité"
           : language === 'de' ? "Qualitätsservice"
           : language === 'pl' ? "Jakość usług"
           : "Kokybė",
      icon: <PackageCheck />
    }
  ];

  return (
    <>
      <SEOHead 
        title="About GoBaltic | European Vehicle Transport Experts"
        titleLT="Apie GoBaltic | Europos Automobilių Transportavimo Ekspertai"
        description="GoBaltic is a trusted European vehicle transport company with expertise in car logistics across Lithuania, Poland, Germany and the Netherlands. Learn about our values, certifications and commitment to excellence."
        descriptionLT="GoBaltic yra patikima Europos transporto priemonių transportavimo įmonė, turinti automobilių logistikos patirties Lietuvoje, Lenkijoje, Vokietijoje ir Nyderlanduose. Sužinokite apie mūsų vertybes, sertifikatus ir įsipareigojimą siekti tobulumo."
        keywords="GoBaltic company, European transport experts, vehicle logistics Lithuania, car transport company Poland, Germany auto transport, Netherlands car shipping services, ISO certified transport"
        keywordsLT="GoBaltic įmonė, Europos transporto ekspertai, transporto priemonių logistika Lietuvoje, automobilių transporto įmonė Lenkijoje, Vokietijos automobilių transportas, Nyderlandų automobilių gabenimo paslaugos, ISO sertifikuotas transportas"
        canonicalPath="/about"
      />
      {/* Hero section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-primary/10 to-primary/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-gray-200/50 bg-[size:var(--grid-size)_var(--grid-size)] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-primary/10 rounded-full translate-y-1/2 -translate-x-1/3 blur-3xl"></div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <Badge variant="outline" className="mb-6 px-4 py-1 text-primary border-primary/30 bg-primary/5">
              {language === 'fr' ? 'NOS PRINCIPES'
               : language === 'de' ? 'UNSERE GRUNDSÄTZE'
               : language === 'pl' ? 'NASZE ZASADY'
               : language === 'en' ? 'OUR PRINCIPLES'
               : 'MŪSŲ PRINCIPAI'}
            </Badge>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">{t('about.values.title')}</h1>
            <p className="text-xl text-gray-700">
              {t('about.values.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Values section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center mb-12">
            <div className="flex flex-wrap gap-4 justify-center">
              {additionalValues.map((value, index) => (
                <div key={index} className="flex items-center bg-white rounded-full px-4 py-2 shadow-sm border border-gray-100">
                  <div className="text-primary mr-2">
                    {value.icon}
                  </div>
                  <span className="font-medium">{value.title}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {values.map((value, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="mb-6">{value.icon}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{value.title}</h3>
                <Separator className="mb-4 bg-primary/20 w-16 h-1 rounded-full" />
                <p className="text-gray-700 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <Badge variant="outline" className="mb-4 px-4 py-1 text-primary border-primary/30">
                {language === 'en' ? "TRUST & RELIABILITY" 
                : language === 'fr' ? "CONFIANCE & FIABILITÉ" 
                : language === 'de' ? "VERTRAUEN & ZUVERLÄSSIGKEIT" 
                : language === 'pl' ? "ZAUFANIE & NIEZAWODNOŚĆ" 
                : "PASITIKĖJIMAS IR PATIKIMUMAS"}
              </Badge>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {language === 'en' ? "Licensed & Certified Transport Experts" 
                : language === 'fr' ? "Experts en transport licenciés et certifiés" 
                : language === 'de' ? "Lizenzierte & zertifizierte Transportexperten" 
                : language === 'pl' ? "Licencjonowani i certyfikowani eksperci transportowi" 
                : "Licencijuoti ir sertifikuoti transporto ekspertai"}
              </h2>
              <p className="text-lg text-gray-700">
                {language === 'en' 
                  ? "We maintain all required certifications and licenses for international vehicle transport in Europe" 
                : language === 'fr'
                  ? "Nous maintenons toutes les certifications et licences requises pour le transport international de véhicules en Europe"
                : language === 'de'
                  ? "Wir verfügen über alle erforderlichen Zertifizierungen und Lizenzen für den internationalen Fahrzeugtransport in Europa"
                : language === 'pl'
                  ? "Posiadamy wszystkie wymagane certyfikaty i licencje na międzynarodowy transport pojazdów w Europie"
                  : "Mes turime visus reikalingus sertifikatus ir licencijas tarptautiniam automobilių transportui Europoje"}
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10 items-center justify-items-center">
                <div className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <Award className="h-10 w-10 text-primary" />
                  </div>
                  <p className="font-medium">ISO 9001:2015</p>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <ShieldCheck className="h-10 w-10 text-primary" />
                  </div>
                  <p className="font-medium">
                    {language === 'en' ? "CMR Insurance" 
                    : language === 'fr' ? "Assurance CMR" 
                    : language === 'de' ? "CMR-Versicherung" 
                    : language === 'pl' ? "Ubezpieczenie CMR" 
                    : "CMR draudimas"}
                  </p>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <Briefcase className="h-10 w-10 text-primary" />
                  </div>
                  <p className="font-medium">
                    {language === 'en' ? "EU Transport License" 
                    : language === 'fr' ? "Licence de transport UE" 
                    : language === 'de' ? "EU-Transportlizenz" 
                    : language === 'pl' ? "Licencja transportowa UE" 
                    : "ES transporto licencija"}
                  </p>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <PackageCheck className="h-10 w-10 text-primary" />
                  </div>
                  <p className="font-medium">
                    {language === 'en' ? "Cargo Safety Certificate" 
                    : language === 'fr' ? "Certificat de sécurité du fret" 
                    : language === 'de' ? "Frachtsicherheitszertifikat" 
                    : language === 'pl' ? "Certyfikat bezpieczeństwa ładunku" 
                    : "Krovinių saugos sertifikatas"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
};

export default AboutPage;
