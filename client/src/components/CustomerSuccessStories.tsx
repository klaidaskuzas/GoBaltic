import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Star, 
  Clock, 
  MapPin, 
  Car, 
  Truck, 
  Users, 
  Calendar,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Quote
} from "lucide-react";

interface MultiLang {
  en: string;
  lt: string;
  fr: string;
  de: string;
  pl: string;
}

interface SuccessStory {
  id: string;
  client: {
    name: string;
    type: "individual" | "dealer" | "corporate";
    location: string;
    avatar?: string;
  };
  challenge: MultiLang;
  solution: MultiLang;
  results: {
    timeframe: string;
    deliveryTime: string;
    satisfaction: number;
    repeat: boolean;
    specialRequirements?: string[];
  };
  quote: MultiLang;
  vehicleType: string;
  route: {
    from: string;
    to: string;
    distance: string;
  };
  tags: string[];
}

const successStories: SuccessStory[] = [
  {
    id: "1",
    client: {
      name: "Mildaras Laurinaitis",
      type: "individual",
      location: "Kaunas, Lithuania"
    },
    challenge: {
      en: "Mildaras had purchased an Audi A6 in Stolberg, Germany and needed it delivered safely to his home in Kaunas, Lithuania — without having to travel to pick it up himself.",
      lt: "Mildaras įsigijo Audi A6 Stolberge, Vokietijoje, ir reikėjo jį saugiai pristatyti į namus Kaune — nereikiant važiuoti jo pasiimti pačiam.",
      fr: "Mildaras avait acheté une Audi A6 à Stolberg, en Allemagne, et avait besoin qu'elle soit livrée en toute sécurité à son domicile à Kaunas, en Lituanie — sans avoir à se déplacer pour aller la récupérer lui-même.",
      de: "Mildaras hatte einen Audi A6 in Stolberg, Deutschland gekauft und benötigte eine sichere Lieferung nach Hause in Kaunas, Litauen — ohne selbst hinfahren zu müssen.",
      pl: "Mildaras kupił Audi A6 w Stolbergu w Niemczech i potrzebował, aby samochód został bezpiecznie dostarczony do jego domu w Kownie na Litwie — bez konieczności podróżowania po niego osobiście."
    },
    solution: {
      en: "We arranged a straightforward door-to-door transport, collecting the Audi A6 directly from Stolberg and delivering it to Kaunas. The process was smooth and hassle-free from start to finish.",
      lt: "Suorganizavome paprastą nuo durų iki durų transportavimą — paėmėme Audi A6 tiesiai iš Stolbergo ir pristatėme į Kauną. Visas procesas nuo pradžios iki pabaigos buvo sklandus ir be rūpesčių.",
      fr: "Nous avons organisé un transport simple de porte à porte, en récupérant l'Audi A6 directement à Stolberg et en la livrant à Kaunas. Le processus a été fluide et sans tracas du début à la fin.",
      de: "Wir organisierten einen unkomplizierten Tür-zu-Tür-Transport, holten den Audi A6 direkt in Stolberg ab und lieferten ihn nach Kaunas. Der gesamte Prozess verlief reibungslos und problemlos von Anfang bis Ende.",
      pl: "Zorganizowaliśmy prosty transport od drzwi do drzwi, odbierając Audi A6 bezpośrednio ze Stolbergu i dostarczając do Kowna. Cały proces przebiegał sprawnie i bezproblemowo od początku do końca."
    },
    results: {
      timeframe: "2 days",
      deliveryTime: "On schedule",
      satisfaction: 5,
      repeat: false,
      specialRequirements: ["Door-to-door delivery", "Full insurance coverage"]
    },
    quote: {
      en: "Everything went perfectly. The car arrived in great condition and right on time. Simple, reliable and professional — exactly what I needed.",
      lt: "Viskas pavyko puikiai. Automobilis atvyko puikios būklės ir tiksliai laiku. Paprasta, patikima ir profesionalu — būtent tai, ko man reikėjo.",
      fr: "Tout s'est parfaitement déroulé. La voiture est arrivée en parfait état et exactement à l'heure. Simple, fiable et professionnel — exactement ce dont j'avais besoin.",
      de: "Alles lief perfekt. Das Auto kam in einwandfreiem Zustand und pünktlich an. Einfach, zuverlässig und professionell — genau das, was ich brauchte.",
      pl: "Wszystko poszło idealnie. Samochód dotarł w świetnym stanie i dokładnie na czas. Proste, niezawodne i profesjonalne — dokładnie tego potrzebowałem."
    },
    vehicleType: "Audi A6",
    route: {
      from: "Stolberg, Germany",
      to: "Kaunas, Lithuania",
      distance: "~1,450 km"
    },
    tags: ["Private client", "Door-to-door"]
  },
  {
    id: "2",
    client: {
      name: "Thomas Müller",
      type: "individual",
      location: "Munich, Germany"
    },
    challenge: {
      en: "Had to transport a rare 1967 Porsche 911 from an auction in France to Germany with zero damage tolerance.",
      lt: "Reikėjo gabenti retą 1967 metų Porsche 911 iš Prancūzijos aukciono į Vokietiją be jokių pažeidimų.",
      fr: "Devait transporter une rare Porsche 911 de 1967 d'une vente aux enchères en France vers l'Allemagne avec une tolérance zéro aux dommages.",
      de: "Musste einen seltenen Porsche 911 von 1967 von einer Auktion in Frankreich nach Deutschland transportieren — mit null Toleranz für Beschädigungen.",
      pl: "Trzeba było przetransportować rzadkiego Porsche 911 z 1967 roku z aukcji we Francji do Niemiec z zerową tolerancją na uszkodzenia."
    },
    solution: {
      en: "Used our premium transport service with custom loading equipment and a dedicated driver, ensuring the vintage vehicle was carefully handled every step of the way.",
      lt: "Naudojome premium transportavimo paslaugą su specialia pakrovimo įranga ir atskiru vairuotoju, užtikrindami, kad vintage automobilis būtų atsargiai tvaromas kiekviename žingsnyje.",
      fr: "Avons utilisé notre service de transport premium avec un équipement de chargement personnalisé et un chauffeur dédié, garantissant que le véhicule vintage était soigneusement manipulé à chaque étape.",
      de: "Nutzten unseren Premium-Transportservice mit maßgeschneiderter Ladeausrüstung und einem dedizierten Fahrer, um sicherzustellen, dass das Oldtimer-Fahrzeug in jedem Schritt sorgfältig behandelt wurde.",
      pl: "Skorzystaliśmy z naszej usługi transportu premium z dedykowanym sprzętem załadunkowym i wyznaczonym kierowcą, zapewniając staranne obchodzenie się z zabytkowym pojazdem na każdym etapie."
    },
    results: {
      timeframe: "3 days",
      deliveryTime: "12 hours early",
      satisfaction: 5,
      repeat: true,
      specialRequirements: ["Soft tie-downs", "Dedicated driver", "Full insurance coverage"]
    },
    quote: {
      en: "My vintage Porsche was treated like a precious gem. The attention to detail and care was exceptional. I wouldn't trust anyone else with my classic cars.",
      lt: "Mano vintage Porsche buvo traktuojamas kaip brangus akmuo. Dėmesys detalėms ir rūpinimasis buvo išskirtinis.",
      fr: "Mon Porsche vintage a été traité comme une pierre précieuse. L'attention aux détails et le soin étaient exceptionnels. Je ne confierais mes voitures classiques à personne d'autre.",
      de: "Mein Vintage-Porsche wurde wie ein kostbares Schmuckstück behandelt. Die Liebe zum Detail und die Sorgfalt waren außergewöhnlich. Ich würde meine Oldtimer niemandem sonst anvertrauen.",
      pl: "Mój zabytkowy Porsche był traktowany jak cenny klejnot. Dbałość o szczegóły i troska były wyjątkowe. Nie powierzyłbym swoich klasycznych samochodów nikomu innemu."
    },
    vehicleType: "Classic Porsche 911 (1967)",
    route: {
      from: "Lyon, France",
      to: "Munich, Germany",
      distance: "850 km"
    },
    tags: ["Classic vehicle", "Premium service", "Individual client"]
  },
  {
    id: "3",
    client: {
      name: "EuroFleet Logistics",
      type: "corporate",
      location: "Warsaw, Poland",
      avatar: "https://randomuser.me/api/portraits/women/28.jpg"
    },
    challenge: {
      en: "Regular monthly shipments of 50+ commercial vehicles across Eastern Europe with strict schedule requirements.",
      lt: "Reguliarūs mėnesiniai 50+ komercinių automobilių gabenimas per Rytų Europą su griežtais grafiko reikalavimais.",
      fr: "Des expéditions mensuelles régulières de plus de 50 véhicules commerciaux à travers l'Europe de l'Est avec des exigences strictes en matière de calendrier.",
      de: "Regelmäßige monatliche Sendungen von 50+ Nutzfahrzeugen durch Osteuropa mit strengen Terminanforderungen.",
      pl: "Regularne miesięczne dostawy ponad 50 pojazdów użytkowych przez Europę Wschodnią z rygorystycznymi wymaganiami harmonogramu."
    },
    solution: {
      en: "Established a dedicated logistics partnership with scheduled routes and priority booking system for consistent service.",
      lt: "Sukūrėme atskirą logistikos partnerystę su suplanuotais maršrutais ir prioritetinės rezervacijos sistema.",
      fr: "Avons établi un partenariat logistique dédié avec des itinéraires planifiés et un système de réservation prioritaire pour un service cohérent.",
      de: "Etablierten eine dedizierte Logistikpartnerschaft mit geplanten Routen und einem vorrangigen Buchungssystem für einen beständigen Service.",
      pl: "Nawiązaliśmy dedykowane partnerstwo logistyczne z zaplanowanymi trasami i systemem priorytetowej rezerwacji dla spójnej obsługi."
    },
    results: {
      timeframe: "12 months ongoing",
      deliveryTime: "98% on-time rate",
      satisfaction: 4.8,
      repeat: true,
      specialRequirements: ["Fleet management", "Priority scheduling", "Volume discounts"]
    },
    quote: {
      en: "GoBaltic has transformed our logistics operations. Their reliability and scale capacity allows us to serve our customers better.",
      lt: "GoBaltic transformavo mūsų logistikos operacijas. Jų patikimumas ir masto pajėgumai leidžia mums geriau aptarnauti klientus.",
      fr: "GoBaltic a transformé nos opérations logistiques. Leur fiabilité et leur capacité d'échelle nous permettent de mieux servir nos clients.",
      de: "GoBaltic hat unsere Logistikoperationen transformiert. Ihre Zuverlässigkeit und Skalierungskapazität ermöglicht es uns, unsere Kunden besser zu bedienen.",
      pl: "GoBaltic przekształcił nasze operacje logistyczne. Ich niezawodność i zdolność skalowania pozwala nam lepiej obsługiwać naszych klientów."
    },
    vehicleType: "Commercial fleet vehicles",
    route: {
      from: "Various EU origins",
      to: "Poland & Baltic States",
      distance: "1,200 km average"
    },
    tags: ["Fleet transport", "Ongoing partnership", "Corporate volume"]
  }
];

const CustomerSuccessStories = () => {
  const { t, language } = useLanguage();
  const [currentStory, setCurrentStory] = useState(0);

  const nextStory = () => {
    setCurrentStory((prev) => (prev + 1) % successStories.length);
  };

  const prevStory = () => {
    setCurrentStory((prev) => (prev - 1 + successStories.length) % successStories.length);
  };

  const story = successStories[currentStory];

  const getClientTypeIcon = (type: string) => {
    switch (type) {
      case "dealer": return <Car className="w-5 h-5" />;
      case "corporate": return <Truck className="w-5 h-5" />;
      default: return <Users className="w-5 h-5" />;
    }
  };

  const tx = (en: string, fr: string, de: string, pl: string, lt: string) =>
    language === 'fr' ? fr : language === 'de' ? de : language === 'pl' ? pl : language === 'lt' ? lt : en;

  const storyText = (text: MultiLang) =>
    language === 'lt' ? text.lt
    : language === 'fr' ? text.fr
    : language === 'de' ? text.de
    : language === 'pl' ? text.pl
    : text.en;

  const getClientTypeLabel = (type: string) => {
    const labels = {
      individual: tx('Individual Client', 'Client particulier', 'Privatkunde', 'Klient prywatny', 'Privatusis klientas'),
      dealer: tx('Car Dealer', 'Concessionnaire', 'Autohändler', 'Dealer samochodowy', 'Automobilių prekybos centras'),
      corporate: tx('Corporate Fleet', 'Flotte d\'entreprise', 'Unternehmensflotte', 'Flota firmowa', 'Korporacijos parkas')
    };
    return labels[type as keyof typeof labels] || type;
  };

  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="w-20 h-1.5 bg-primary mb-4 mx-auto"></div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {tx('Customer Success Stories', 'Témoignages clients', 'Kundenerfolgsgeschichten', 'Historie sukcesu klientów', 'Klientų sėkmės istorijos')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {tx(
              'Real challenges, proven solutions, measurable results. See how we\'ve helped businesses and individuals achieve their transportation goals across Europe.',
              'De vrais défis, des solutions éprouvées, des résultats mesurables. Découvrez comment nous avons aidé des entreprises et des particuliers à atteindre leurs objectifs de transport en Europe.',
              'Echte Herausforderungen, bewährte Lösungen, messbare Ergebnisse. Erfahren Sie, wie wir Unternehmen und Einzelpersonen dabei geholfen haben, ihre Transportziele in Europa zu erreichen.',
              'Prawdziwe wyzwania, sprawdzone rozwiązania, mierzalne wyniki. Zobacz, jak pomagamy firmom i osobom prywatnym osiągać cele transportowe w całej Europie.',
              'Realūs iššūkiai, įrodyti sprendimai, išmatuojami rezultatai. Žiūrėkite, kaip padėjome verslams ir asmenims pasiekti transportavimo tikslus visoje Europoje.'
            )}
          </p>
        </div>

        {/* Story Navigation */}
        <div className="flex justify-between items-center mb-8">
          <Button variant="outline" onClick={prevStory} className="flex items-center gap-2">
            <ChevronLeft className="w-4 h-4" />
            {tx('Previous', 'Précédent', 'Zurück', 'Poprzedni', 'Ankstesnis')}
          </Button>
          
          <div className="flex space-x-2">
            {successStories.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentStory(idx)}
                className={`h-3 rounded-full transition-all ${
                  idx === currentStory ? "w-8 bg-primary" : "w-3 bg-gray-300 hover:bg-primary/50"
                }`}
              />
            ))}
          </div>
          
          <Button variant="outline" onClick={nextStory} className="flex items-center gap-2">
            {tx('Next', 'Suivant', 'Weiter', 'Następny', 'Kitas')}
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Main Story Card */}
        <Card className="max-w-6xl mx-auto overflow-hidden shadow-xl">
          <CardContent className="p-0">
            <div className="grid lg:grid-cols-2 gap-0">
              {/* Left Column - Client & Challenge */}
              <div className="p-8 lg:p-12 bg-white">
                {/* Client Info */}
                <div className="flex items-start gap-4 mb-8">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center text-white font-bold text-lg">
                    {story.client.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-xl font-bold text-gray-900">{story.client.name}</h3>
                      <Badge variant="secondary" className="flex items-center gap-1">
                        {getClientTypeIcon(story.client.type)}
                        {getClientTypeLabel(story.client.type)}
                      </Badge>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-4 h-4 mr-1" />
                      {story.client.location}
                    </div>
                  </div>
                </div>

                {/* Challenge */}
                <div className="mb-8">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                      <span className="text-red-600 font-bold text-sm">!</span>
                    </div>
                    {tx('Challenge', 'Défi', 'Herausforderung', 'Wyzwanie', 'Iššūkis')}
                  </h4>
                  <p className="text-gray-700 leading-relaxed">
                    {storyText(story.challenge)}
                  </p>
                </div>

                {/* Vehicle & Route Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Car className="w-4 h-4 text-primary" />
                      <span className="font-medium text-gray-900">
                        {tx('Vehicle Type', 'Type de véhicule', 'Fahrzeugtyp', 'Typ pojazdu', 'Automobilio tipas')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{story.vehicleType}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span className="font-medium text-gray-900">
                        {tx('Route', 'Itinéraire', 'Route', 'Trasa', 'Maršrutas')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {story.route.from} → {story.route.to}
                    </p>
                    <p className="text-xs text-gray-500">{story.route.distance}</p>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {story.tags.map((tag, idx) => (
                    <Badge key={idx} variant="outline">{tag}</Badge>
                  ))}
                </div>
              </div>

              {/* Right Column - Solution & Results */}
              <div className="p-8 lg:p-12 bg-gradient-to-br from-primary/5 to-primary/10">
                {/* Solution */}
                <div className="mb-8">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-blue-600" />
                    </div>
                    {tx('Our Solution', 'Notre solution', 'Unsere Lösung', 'Nasze rozwiązanie', 'Mūsų sprendimas')}
                  </h4>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    {storyText(story.solution)}
                  </p>
                  
                  {/* Special Requirements */}
                  {story.results.specialRequirements && (
                    <div className="mb-6">
                      <p className="font-medium text-gray-900 mb-2">
                        {tx('Special Requirements:', 'Exigences spéciales :', 'Besondere Anforderungen:', 'Wymagania specjalne:', 'Specialūs reikalavimai:')}
                      </p>
                      <ul className="space-y-1">
                        {story.results.specialRequirements.map((req, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                            <CheckCircle className="w-3 h-3 text-green-500" />
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Results */}
                <div className="mb-8">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                      <Star className="w-4 h-4 text-green-600" />
                    </div>
                    {tx('Results', 'Résultats', 'Ergebnisse', 'Wyniki', 'Rezultatai')}
                  </h4>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Clock className="w-4 h-4 text-primary" />
                        <span className="font-bold text-lg text-primary">{story.results.deliveryTime}</span>
                      </div>
                      <p className="text-xs text-gray-600">
                        {tx('Delivery', 'Livraison', 'Lieferung', 'Dostawa', 'Pristatymas')}
                      </p>
                    </div>
                    
                    <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span className="font-bold text-lg text-primary">{story.results.satisfaction}/5</span>
                      </div>
                      <p className="text-xs text-gray-600">
                        {tx('Satisfaction', 'Satisfaction', 'Zufriedenheit', 'Zadowolenie', 'Pasitenkinimas')}
                      </p>
                    </div>
                  </div>

                  {story.results.repeat && (
                    <div className="flex items-center gap-2 text-green-600 mb-4">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        {tx('Now a repeat customer', 'Client fidèle désormais', 'Jetzt Stammkunde', 'Teraz stały klient', 'Dabar nuolatinis klientas')}
                      </span>
                    </div>
                  )}
                </div>

                {/* Quote */}
                <div className="relative">
                  <Quote className="w-8 h-8 text-primary/20 absolute -top-2 -left-2" />
                  <blockquote className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-primary italic text-gray-700 relative z-10">
                    "{storyText(story.quote)}"
                  </blockquote>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bottom Stats */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-primary mb-2">500+</div>
            <p className="text-gray-600">
              {tx('Success Stories', 'Témoignages', 'Erfolgsgeschichten', 'Historie sukcesu', 'Sėkmės istorijos')}
            </p>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary mb-2">98%</div>
            <p className="text-gray-600">
              {tx('Customer Satisfaction', 'Satisfaction client', 'Kundenzufriedenheit', 'Zadowolenie klientów', 'Klientų pasitenkinimas')}
            </p>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary mb-2">12+</div>
            <p className="text-gray-600">
              {tx('Countries Served', 'Pays desservis', 'Bediente Länder', 'Obsługiwane kraje', 'Aptarnaujamos šalys')}
            </p>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary mb-2">24/7</div>
            <p className="text-gray-600">
              {tx('Customer Support', 'Support client', 'Kundendienst', 'Wsparcie klientów', 'Klientų palaikymas')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomerSuccessStories;