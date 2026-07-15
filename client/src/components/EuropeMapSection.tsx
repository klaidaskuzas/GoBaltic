import { useLanguage } from "@/contexts/LanguageContext";
import transportTruckImage from "@/assets/cheap-car-shipping-open-carrier.jpg";
import europeMapImage from "@/assets/MapChart_Map.png";

const EuropeMapSection = () => {
  const { language } = useLanguage();

  const getText = (en: string, fr: string, de: string, pl: string, lt: string) =>
    language === 'en' ? en
    : language === 'fr' ? fr
    : language === 'de' ? de
    : language === 'pl' ? pl
    : lt;

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {getText(
              'Our Transportation Network',
              'Notre Réseau de Transport',
              'Unser Transportnetzwerk',
              'Nasza Sieć Transportowa',
              'Mūsų transportavimo tinklas'
            )}
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {getText(
              'We provide professional vehicle transportation services across Europe with a modern fleet and experienced drivers.',
              'Nous fournissons des services professionnels de transport de véhicules à travers l\'Europe avec une flotte moderne et des conducteurs expérimentés.',
              'Wir bieten professionelle Fahrzeugtransportdienste in ganz Europa mit einer modernen Flotte und erfahrenen Fahrern.',
              'Świadczymy profesjonalne usługi transportu pojazdów w całej Europie z nowoczesną flotą i doświadczonymi kierowcami.',
              'Teikiame profesionalias transporto priemonių gabenimo paslaugas visoje Europoje su moderniu automobilių parku ir patyrusiais vairuotojais.'
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="rounded-lg overflow-hidden shadow-lg h-full">
            <img
              src={transportTruckImage}
              alt={getText(
                'Car transport truck on road',
                'Camion de transport de voiture sur route',
                'Autotransporter auf der Straße',
                'Samochód transportowy na drodze',
                'Automobilių gabenimo sunkvežimis kelyje'
              )}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-6">
            <div className="rounded-lg overflow-hidden shadow-lg">
              <img
                src={europeMapImage}
                alt={getText(
                  'Europe map showing our service areas',
                  'Carte d\'Europe montrant nos zones de service',
                  'Europakarte mit unseren Servicegebieten',
                  'Mapa Europy pokazująca nasze obszary usług',
                  'Europos žemėlapis, rodantis mūsų paslaugų teikimo teritorijas'
                )}
                className="w-full"
              />
            </div>

            <div className="p-6 bg-blue-50 rounded-lg border border-blue-100">
              <h3 className="text-xl font-semibold text-primary mb-2">
                {getText(
                  'Pan-European Coverage',
                  'Couverture paneuropéenne',
                  'Gesamteuropäische Abdeckung',
                  'Ogólnoeuropejskie pokrycie',
                  'Visos Europos aprėptis'
                )}
              </h3>
              <p className="text-gray-700">
                {getText(
                  'Our services cover the highlighted countries in the map, ensuring seamless transportation across Western, Central, and Northern Europe.',
                  'Nos services couvrent les pays mis en évidence sur la carte, assurant un transport fluide à travers l\'Europe occidentale, centrale et septentrionale.',
                  'Unsere Dienstleistungen decken die auf der Karte hervorgehobenen Länder ab und gewährleisten einen reibungslosen Transport in West-, Mittel- und Nordeuropa.',
                  'Nasze usługi obejmują wyróżnione kraje na mapie, zapewniając płynny transport w Europie Zachodniej, Środkowej i Północnej.',
                  'Mūsų paslaugos apima pažymėtas šalis žemėlapyje, užtikrinant sklandų transportavimą Vakarų, Vidurio ir Šiaurės Europoje.'
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EuropeMapSection;
