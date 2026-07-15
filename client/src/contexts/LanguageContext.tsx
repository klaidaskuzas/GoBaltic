import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define available languages
export type Language = 'en' | 'lt' | 'fr' | 'de' | 'pl';

// Define the context shape
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

// Create context with default values
const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string) => key,
});

// English translations
const en = {
  // Navigation
  'nav.home': 'Home',
  'nav.services': 'Services',
  'nav.pricing': 'Pricing',
  'nav.about': 'About Us',
  'nav.contact': 'Contact',
  'nav.quote': 'Get a Quote',
  
  // Hero section
  'hero.title': 'Professional Car Transportation Across Europe',
  'hero.subtitle': 'Safe, reliable, and efficient transport for your vehicle',
  'hero.cta': 'Request a Quote',
  'hero.learn': 'Learn More',
  'hero.quote': 'Get a Quote',
  'hero.learn.more': 'Learn More',
  
  // Service highlights
  'services.title': 'Our Services',
  'services.features': 'Key Features:',
  'services.subtitle': '',
  'services.individual.title': 'Car Transportation',
  'services.individual.description': 'Door-to-door delivery service for your personal vehicle',
  'services.individual.long': 'Professional car transportation across Europe. We offer customized vehicle transport service from door to door - fast, safe, and reliable. We transport all types of vehicles: new, used, SUVs, pickups, minibuses, damaged vehicles, or those with various technical defects. We work with both private clients and car dealerships. Our goal is to ensure smooth, professional, and carefully planned transportation from pickup to delivery location.',
  'services.cargo.title': 'Specialized Non-Standard Cargo Transportation',
  'services.cargo.description': 'Specialized transport for non-standard cargo',
  'services.cargo.long': 'We provide transportation services for standard and non-standard cargo across Europe. We transport objects such as mobile saunas, hot tubs, and other non-standard cargo. We use platform transports and professional securing solutions to ensure your cargo is delivered safely and on time.',
  'services.luxury.title': 'Luxury Vehicle Transportation',
  'services.luxury.description': 'Premium service for high-value luxury and classic cars',
  'services.luxury.long': 'We offer the highest level of transportation services for owners of expensive vehicles who care about every detail. We understand that such vehicles require special attention, so we ensure maximum safety, confidentiality, and professionalism throughout the entire transportation process.',
  'services.international.title': 'Cross-Border Delivery',
  'services.international.description': 'Seamless international car transport throughout Europe',
  'services.international.long': 'Seamless international car transport across European borders. We handle all the necessary documentation and customs requirements to make cross-border transport hassle-free.',
  
  // Why choose us
  'why.title': 'Why Choose GoBaltic',
  'why.fast.title': 'Fast & Secure Transport',
  'why.fast.description': 'Quick delivery times without compromising on safety',
  'why.competitive.title': 'Reliability & Professionalism',
  'why.competitive.description': 'Years of experience in car transportation allows us to ensure the highest level of service and impeccable customer care',
  'why.europe.title': 'Europe-Wide Delivery',
  'why.europe.description': 'We transport vehicles to/from any European country - reliably and punctually',
  'why.insurance.title': 'Full Insurance Coverage',
  'why.insurance.description': 'Every transportation is insured - your vehicle is fully protected throughout the entire process',
  
  // Testimonials
  'testimonials.title': 'What Our Clients Say',
  'testimonials.subtitle': 'Hear from our satisfied customers about their experience with GoBaltic',
  
  // CTA section
  'cta.title': 'Ready to Ship Your Vehicle?',
  'cta.subtitle': 'Contact us today for a personalized quote',
  'cta.button': 'Get Started',
  
  // About page
  'about.title': 'About GoBaltic',
  'about.subtitle': 'Your trusted partner for car transportation services across the Baltic region and Europe',
  'about.history.title': 'Our History',
  'about.history.text': 'Founded in 2020, GoBaltic has grown from a small local car transport company to one of the leading vehicle transportation services in the Baltic region. With our experience, we have built a reputation for reliability, professionalism, and customer satisfaction.',
  'about.mission.title': 'Our Mission',
  'about.mission.text': 'To provide the most reliable, efficient, and secure car transportation services across Europe, ensuring complete peace of mind for our clients.',
  'about.values.title': 'Our Values',
  'about.values.subtitle': 'These core principles guide everything we do at GoBaltic, from daily operations to long-term strategy',
  'about.team.title': 'Our Leadership Team',
  'about.team.subtitle': 'Meet the experienced professionals who lead GoBaltic and ensure the highest quality of service',
  
  // Contact page
  'contact.title': 'Contact Us',
  'contact.subtitle': 'Have questions or ready to book your car transport? Get in touch with our team for fast and friendly assistance',
  'contact.form.name': 'Your Name',
  'contact.form.email': 'Email Address',
  'contact.form.phone': 'Phone Number',
  'contact.form.service': 'Service Type',
  'contact.form.message': 'Message',
  'contact.form.submit': 'Submit Request',
  'contact.info.title': 'Contact Information',
  'contact.info.address.title': 'Office Address',
  'contact.info.hours.title': 'Business Hours',
  'contact.info.phone.title': 'Phone',
  
  // Footer
  'footer.description': 'Professional car transportation services across Europe. Safe, reliable, and efficient.',
  'footer.links': 'Quick Links',
  'footer.services': 'Services',
  'footer.legal': 'Legal',
  'footer.legal.terms': 'Terms of Service',
  'footer.legal.privacy': 'Privacy Policy',
  'footer.legal.cookies': 'Cookie Policy',
  'footer.copyright': '© 2025 GoBaltic. All rights reserved.',
  
  // Not found page
  'notfound.title': 'Page Not Found',
  'notfound.message': 'The page you are looking for might have been removed or is temporarily unavailable',
  'notfound.button': 'Back to Homepage',
  
  // Pricing page
  'pricing.title': 'Our Pricing',
  'pricing.subtitle': 'Customized pricing options for all your car transportation needs',
  'pricing.faq.title': 'Frequently Asked Questions',
  'pricing.custom.title': 'Custom Quote Pricing',
  'pricing.custom.description': 'Every vehicle transportation is unique. We calculate rates based on distance, vehicle weight, and urgency. Contact us for a detailed quote tailored to your specific needs.',
  'pricing.factors.title': 'Pricing Factors',
  'pricing.factors.description': 'Our prices are calculated based on several key factors:',
  'pricing.factors.distance': 'Transport distance and route',
  'pricing.factors.weight': 'Vehicle size, weight and specifications',
  'pricing.factors.urgency': 'Delivery timeframe and urgency',
  'pricing.factors.services': 'Insurance options and additional services',
  'pricing.quote.title': 'Request Your Custom Quote',
  'pricing.quote.description': 'For an accurate price quote, please contact us with details about your transport needs.',
  'pricing.quote.info': 'Our team will respond promptly with a detailed quote based on your specific requirements.',
  'pricing.quote.button': 'Get Your Custom Quote',
  'button.get.quote': 'Get a Quote',
  'button.learn.more': 'Learn More',
  
  // Form validation
  'form.required': 'This field is required',
  'form.email': 'Please enter a valid email address',
  'form.success': 'Your message has been sent successfully!',
  'form.error': 'There was an error submitting your message. Please try again.',
  
  // Navigation - additional items
  'nav.tracking': 'Track Shipment',
  
  // Tracking page
  'tracking.title': 'Track Your Shipment',
  'tracking.subtitle': 'Enter your tracking number to get real-time updates on your vehicle transport status',
  'tracking.form.placeholder': 'Enter tracking number',
  'tracking.form.submit': 'Track',
  'tracking.loading': 'Loading shipment information...',
  'tracking.error.title': 'Shipment Not Found',
  'tracking.error.description': 'We couldn\'t find a shipment with that tracking number. Please check the number and try again.',
  'tracking.found.title': 'Shipment Found',
  'tracking.found.description': 'Here are the details of your shipment:',
  'tracking.status': 'Shipment Status',
  'tracking.currentLocation': 'Current Location',
  'tracking.estimatedDelivery': 'Estimated Delivery',
  'tracking.route': 'Transport Route',
  'tracking.origin': 'Origin',
  'tracking.destination': 'Destination',
  'tracking.details': 'Shipment Details',
  'tracking.shipmentInfo': 'Shipment Information',
  'tracking.trackingNumber': 'Tracking Number',
  'tracking.vehicleModel': 'Vehicle Model',
  'tracking.createdDate': 'Order Date',
  'tracking.customerInfo': 'Customer Information',
  'tracking.customerName': 'Name',
  'tracking.customerEmail': 'Email',
  'tracking.notes': 'Additional Notes',
  'tracking.notAvailable': 'Information not available',
};

// Lithuanian translations
const lt = {
  // Navigation
  'nav.home': 'Pagrindinis',
  'nav.services': 'Paslaugos',
  'nav.pricing': 'Kainos',
  'nav.about': 'Apie Mus',
  'nav.contact': 'Kontaktai',
  'nav.quote': 'Gauti kainą',
  
  // Hero section
  'hero.title': 'Profesionalus automobilių transportavimas visoje Europoje',
  'hero.subtitle': 'Saugus, patikimas ir efektyvus jūsų transporto priemonės gabenimas',
  'hero.cta': 'Sužinoti kainą',
  'hero.learn': 'Sužinoti daugiau',
  'hero.quote': 'Sužinoti kainą',
  'hero.learn.more': 'Sužinoti daugiau',
  
  // Service highlights
  'services.title': 'Mūsų paslaugos',
  'services.features': 'Pagrindinės savybės:',
  'services.subtitle': '',
  'services.individual.title': 'Automobilių transportavimas',
  'services.individual.description': 'Nuo durų iki durų automobilio pristatymo paslauga',
  'services.individual.long': 'Profesionalus automobilių transportavimas visoje Europoje, Siūlome individualizuotą automobilių pervežimo paslaugą nuo durų iki durų – greitai, saugiai ir patikimai. Gabename visų tipų automobilius: naujus, naudotus, SUV, pikapus, mikroautobusus, apgadintus ar su įvairiais techniniais defektais. Dirbame tiek su privačiais klientais, tiek su automobilių salonais ar pardavėjais. Mūsų tikslas – užtikrinti sklandų, profesionalų ir kruopščiai suplanuotą transportavimą nuo paėmimo iki pristatymo vietos.',
  'services.cargo.title': 'Specializuotas nestandartinių krovinių gabenimas',
  'services.cargo.description': 'Specializuotas nestandartinių krovinių transportavimas',
  'services.cargo.long': 'Teikiame iprastų ir nestandartinių krovinių pervežimo paslaugas visoje Europoje. Gabename tokius objektus kaip mobilios pirtys, kubilai ir kiti nestandartiniai kroviniai.',
  'services.luxury.title': 'Prabangių automobilių transportavimas',
  'services.luxury.description': 'Premium paslauga vertingiems prabangos ir klasikiniams automobiliams',
  'services.luxury.long': 'Siūlome aukščiausio lygio transportavimo paslaugas brangių automobilių savininkams, kuriems svarbi kiekviena detalė. Suprantame, kad tokio tipo automobiliai reikalauja ypatingo dėmesio, todėl užtikriname maksimalų saugumą, konfidencialumą ir profesionalumą viso pervežimo metu.',
  'services.international.title': 'Tarptautinis pristatymas',
  'services.international.description': 'Sklandus tarptautinis automobilių transportavimas visoje Europoje',
  'services.international.long': 'Sklandus tarptautinis automobilių transportavimas per Europos sienas. Mes tvarkome visą reikiamą dokumentaciją ir muitinės reikalavimus, kad tarpvalstybinis transportavimas būtų be rūpesčių.',
  
  // Why choose us
  'why.title': 'Kodėl rinktis GoBaltic',
  'why.fast.title': 'Greitas ir saugus transportavimas',
  'why.fast.description': 'Greitas pristatymas neprarandant saugumo',
  'why.competitive.title': 'Patikimumas ir profesionalumas',
  'why.competitive.description': 'Ilgametė patirtis automobilių transportavimo srityje leidžia mums užtikrinti aukščiausio lygio paslaugas ir nepriekaištingą aptarnavimą',
  'why.europe.title': 'Pristatymas visoje Europoje',
  'why.europe.description': 'Gabename transporto priemones į/iš bet kurios Europos šalies – patikimai ir punktualiai',
  'why.insurance.title': 'Visiška draudimo apsauga',
  'why.insurance.description': 'Kiekvienas pervežimas apdraustas – jūsų automobilis viso proceso metu visiškai apsaugotas',
  
  // Testimonials
  'testimonials.title': 'Ką sako mūsų klientai',
  'testimonials.subtitle': 'Sužinokite apie patenkintų klientų patirtį su GoBaltic',
  
  // CTA section
  'cta.title': 'Pasiruošę gabenti savo automobilį?',
  'cta.subtitle': 'Susisiekite su mumis šiandien dėl individualaus pasiūlymo',
  'cta.button': 'Pradėti',
  
  // About page
  'about.title': 'Apie GoBaltic',
  'about.subtitle': 'Jūsų patikimas partneris automobilių transportavimo paslaugoms Baltijos regione ir Europoje',
  'about.history.title': 'Mūsų istorija',
  'about.history.text': 'Įkurta 2020 m., GoBaltic išaugo iš mažos vietinės automobilių transportavimo įmonės į vieną iš pagrindinių transporto priemonių gabenimo paslaugų teikėjų Baltijos regione. Per savo veiklos laikotarpį sukūrėme patikimumo, profesionalumo ir klientų pasitenkinimo reputaciją.',
  'about.mission.title': 'Mūsų misija',
  'about.mission.text': 'Teikti patikimiausias, efektyviausias ir saugiausias automobilių transportavimo paslaugas visoje Europoje, užtikrinant visišką mūsų klientų ramybę.',
  'about.values.title': 'Mūsų vertybės',
  'about.values.subtitle': 'Šie pagrindiniai principai kreipia viską, ką darome GoBaltic, nuo kasdienės veiklos iki ilgalaikės strategijos',
  'about.team.title': 'Mūsų vadovų komanda',
  'about.team.subtitle': 'Susipažinkite su patyrusiais profesionalais, kurie vadovauja GoBaltic ir užtikrina aukščiausią paslaugų kokybę',
  
  // Contact page
  'contact.title': 'Susisiekite su mumis',
  'contact.subtitle': 'Turite klausimų ar norite užsakyti automobilių transportavimą? Susisiekite su mūsų komanda dėl greitos ir draugiškos pagalbos',
  'contact.form.name': 'Jūsų vardas',
  'contact.form.email': 'El. pašto adresas',
  'contact.form.phone': 'Telefono numeris',
  'contact.form.service': 'Paslaugos tipas',
  'contact.form.message': 'Žinutė',
  'contact.form.submit': 'Pateikti užklausą',
  'contact.info.title': 'Kontaktinė informacija',
  'contact.info.address.title': 'Biuro adresas',
  'contact.info.hours.title': 'Darbo valandos',
  'contact.info.phone.title': 'Telefonas',
  
  // Footer
  'footer.description': 'Profesionalios automobilių transportavimo paslaugos visoje Europoje. Saugiai, patikimai ir efektyviai.',
  'footer.links': 'Greitos nuorodos',
  'footer.services': 'Paslaugos',
  'footer.legal': 'Teisinė informacija',
  'footer.legal.terms': 'Paslaugų teikimo sąlygos',
  'footer.legal.privacy': 'Privatumo politika',
  'footer.legal.cookies': 'Slapukų politika',
  'footer.copyright': '© 2025 GoBaltic. Visos teisės saugomos.',
  
  // Not found page
  'notfound.title': 'Puslapis nerastas',
  'notfound.message': 'Puslapis, kurio ieškote, galėjo būti pašalintas arba laikinai nepasiekiamas',
  'notfound.button': 'Grįžti į pradinį puslapį',
  
  // Pricing page
  'pricing.title': 'Mūsų kainos',
  'pricing.subtitle': 'Individualizuoti kainų variantai visiems jūsų automobilių transportavimo poreikiams',
  'pricing.faq.title': 'Dažnai užduodami klausimai',
  'pricing.custom.title': 'Individualių kainų sudarymas',
  'pricing.custom.description': 'Kiekvienas automobilio gabenimas yra unikalus. Mes apskaičiuojame kainas pagal atstumą, transporto priemonės svorį ir skubumą. Susisiekite su mumis dėl išsamaus pasiūlymo, pritaikyto jūsų konkretiems poreikiams.',
  'pricing.factors.title': 'Kainų veiksniai',
  'pricing.factors.description': 'Mūsų kainos apskaičiuojamos pagal kelis pagrindinius veiksnius:',
  'pricing.factors.distance': 'Transportavimo atstumas ir maršrutas',
  'pricing.factors.weight': 'Automobilio dydis, svoris ir specifika',
  'pricing.factors.urgency': 'Pristatymo laikas ir skubumas',
  'pricing.factors.services': 'Draudimo galimybės ir papildomos paslaugos',
  'pricing.quote.title': 'Prašyti individualaus pasiūlymo',
  'pricing.quote.description': 'Norėdami gauti tikslų kainų pasiūlymą, susisiekite su mumis ir pateikite informaciją apie jūsų transportavimo poreikius.',
  'pricing.quote.info': 'Mūsų komanda operatyviai pateiks išsamų pasiūlymą, pagrįstą jūsų konkrečiais reikalavimais.',
  'pricing.quote.button': 'Gauti individualų pasiūlymą',
  
  // Form validation
  'form.required': 'Šis laukas yra privalomas',
  'form.email': 'Įveskite galiojantį el. pašto adresą',
  'form.success': 'Jūsų žinutė buvo sėkmingai išsiųsta!',
  'form.error': 'Siunčiant jūsų žinutę įvyko klaida. Bandykite dar kartą.',
  'button.get.quote': 'Sužinoti kainą',
  'button.learn.more': 'Sužinoti daugiau',
  
  // Navigation - additional items
  'nav.tracking': 'Sekti Krovinį',
  
  // Tracking page
  'tracking.title': 'Sekite Savo Krovinį',
  'tracking.subtitle': 'Įveskite sekimo numerį, kad gautumėte informaciją apie jūsų transporto priemonės būseną',
  'tracking.form.placeholder': 'Įveskite sekimo numerį',
  'tracking.form.submit': 'Sekti',
  'tracking.loading': 'Kraunama siuntos informacija...',
  'tracking.error.title': 'Siunta Nerasta',
  'tracking.error.description': 'Nepavyko rasti siuntos su šiuo sekimo numeriu. Patikrinkite numerį ir bandykite dar kartą.',
  'tracking.found.title': 'Siunta Rasta',
  'tracking.found.description': 'Čia pateikti jūsų siuntos duomenys:',
  'tracking.status': 'Siuntos Būsena',
  'tracking.currentLocation': 'Dabartinė Vieta',
  'tracking.estimatedDelivery': 'Numatomas Pristatymas',
  'tracking.route': 'Transportavimo Maršrutas',
  'tracking.origin': 'Kilmės Vieta',
  'tracking.destination': 'Paskirties Vieta',
  'tracking.details': 'Siuntos Detalės',
  'tracking.shipmentInfo': 'Siuntos Informacija',
  'tracking.trackingNumber': 'Sekimo Numeris',
  'tracking.vehicleModel': 'Automobilio Modelis',
  'tracking.createdDate': 'Užsakymo Data',
  'tracking.customerInfo': 'Kliento Informacija',
  'tracking.customerName': 'Vardas',
  'tracking.customerEmail': 'El. paštas',
  'tracking.notes': 'Papildoma Informacija',
  'tracking.notAvailable': 'Informacija negalima',
};

// French translations
const fr = {
  // Navigation
  'nav.home': 'Accueil',
  'nav.services': 'Services',
  'nav.pricing': 'Tarifs',
  'nav.about': 'À Propos',
  'nav.contact': 'Contact',
  'nav.quote': 'Obtenir un Devis',
  'nav.tracking': 'Suivi d\'Expédition',
  
  // Hero section
  'hero.title': 'Transport Professionnel de Véhicules à travers l\'Europe',
  'hero.subtitle': 'Transport sûr, fiable et efficace pour votre véhicule',
  'hero.cta': 'Demander un Devis',
  'hero.learn': 'En Savoir Plus',
  'hero.quote': 'Obtenir un Devis',
  'hero.learn.more': 'En Savoir Plus',
  
  // Service highlights
  'services.title': 'Nos Services',
  'services.features': 'Caractéristiques Principales:',
  'services.subtitle': '',
  'services.individual.title': 'Transport de Voitures',
  'services.individual.description': 'Service de livraison porte-à-porte pour votre véhicule personnel',
  'services.individual.long': 'Transport professionnel de voitures à travers l\'Europe. Nous offrons un service de transport de véhicules personnalisé de porte à porte - rapide, sûr et fiable. Nous transportons tous types de véhicules: neufs, d\'occasion, SUV, pick-ups, minibus, véhicules endommagés ou présentant divers défauts techniques. Nous travaillons aussi bien avec des clients privés qu\'avec des concessionnaires automobiles. Notre objectif est d\'assurer un transport fluide, professionnel et soigneusement planifié du lieu d\'enlèvement au lieu de livraison.',
  'services.cargo.title': 'Transport Spécialisé de Cargaisons Non Standard',
  'services.cargo.description': 'Transport spécialisé pour cargaisons non standard',
  'services.cargo.long': 'Nous fournissons des services de transport pour les cargaisons standard et non standard à travers l\'Europe. Nous transportons des objets tels que des saunas mobiles, des bains à remous et d\'autres cargaisons non standard. Nous utilisons des plates-formes de transport et des solutions d\'arrimage professionnelles pour garantir que votre cargaison soit livrée en toute sécurité et à temps.',
  'services.luxury.title': 'Transport de Véhicules de Luxe',
  'services.luxury.description': 'Service premium pour voitures de luxe et de collection de grande valeur',
  'services.luxury.long': 'Nous offrons le plus haut niveau de services de transport pour les propriétaires de véhicules coûteux qui se soucient de chaque détail. Nous comprenons que de tels véhicules nécessitent une attention particulière, nous assurons donc une sécurité, une confidentialité et un professionnalisme maximaux tout au long du processus de transport.',
  'services.international.title': 'Livraison Transfrontalière',
  'services.international.description': 'Transport automobile international sans faille dans toute l\'Europe',
  'services.international.long': 'Transport international de voitures sans faille à travers les frontières européennes. Nous gérons toute la documentation nécessaire et les exigences douanières pour rendre le transport transfrontalier sans tracas.',
  
  // Why choose us
  'why.title': 'Pourquoi Choisir GoBaltic',
  'why.fast.title': 'Transport Rapide et Sécurisé',
  'why.fast.description': 'Délais de livraison rapides sans compromettre la sécurité',
  'why.competitive.title': 'Fiabilité et Professionnalisme',
  'why.competitive.description': 'Des années d\'expérience dans le transport automobile nous permettent d\'assurer le plus haut niveau de service et un service client impeccable',
  'why.europe.title': 'Livraison à l\'échelle européenne',
  'why.europe.description': 'Nous transportons des véhicules vers/depuis n\'importe quel pays européen - de manière fiable et ponctuelle',
  'why.insurance.title': 'Couverture d\'Assurance Complète',
  'why.insurance.description': 'Chaque transport est assuré - votre véhicule est entièrement protégé tout au long du processus',
  
  // Testimonials
  'testimonials.title': 'Ce Que Disent Nos Clients',
  'testimonials.subtitle': 'Découvrez l\'expérience de nos clients satisfaits avec GoBaltic',
  
  // CTA section
  'cta.title': 'Prêt à Expédier Votre Véhicule?',
  'cta.subtitle': 'Contactez-nous aujourd\'hui pour un devis personnalisé',
  'cta.button': 'Commencer',
  
  // About page
  'about.title': 'À Propos de GoBaltic',
  'about.subtitle': 'Votre partenaire de confiance pour les services de transport automobile dans la région baltique et en Europe',
  'about.history.title': 'Notre Histoire',
  'about.history.text': 'Fondée en 2020, GoBaltic est passée d\'une petite entreprise locale de transport automobile à l\'un des principaux services de transport de véhicules dans la région baltique. Grâce à notre expérience, nous avons bâti une réputation de fiabilité, de professionnalisme et de satisfaction client.',
  'about.mission.title': 'Notre Mission',
  'about.mission.text': 'Fournir les services de transport automobile les plus fiables, efficaces et sécurisés à travers l\'Europe, assurant une tranquillité d\'esprit complète à nos clients.',
  'about.values.title': 'Nos Valeurs',
  'about.values.subtitle': 'Ces principes fondamentaux guident tout ce que nous faisons chez GoBaltic, des opérations quotidiennes à la stratégie à long terme',
  'about.team.title': 'Notre Équipe de Direction',
  'about.team.subtitle': 'Rencontrez les professionnels expérimentés qui dirigent GoBaltic et assurent la plus haute qualité de service',
  
  // Contact page
  'contact.title': 'Contactez-Nous',
  'contact.subtitle': 'Vous avez des questions ou êtes prêt à réserver votre transport de voiture? Contactez notre équipe pour une assistance rapide et amicale',
  'contact.form.name': 'Votre Nom',
  'contact.form.email': 'Adresse Email',
  'contact.form.phone': 'Numéro de Téléphone',
  'contact.form.service': 'Type de Service',
  'contact.form.message': 'Message',
  'contact.form.submit': 'Soumettre la Demande',
  'contact.info.title': 'Informations de Contact',
  'contact.info.address.title': 'Adresse du Bureau',
  'contact.info.hours.title': 'Heures d\'Ouverture',
  'contact.info.phone.title': 'Téléphone',
  
  // Footer
  'footer.description': 'Services professionnels de transport automobile à travers l\'Europe. Sûr, fiable et efficace.',
  'footer.links': 'Liens Rapides',
  'footer.services': 'Services',
  'footer.legal': 'Mentions Légales',
  'footer.legal.terms': 'Conditions d\'Utilisation',
  'footer.legal.privacy': 'Politique de Confidentialité',
  'footer.legal.cookies': 'Politique des Cookies',
  'footer.copyright': '© 2025 GoBaltic. Tous droits réservés.',
  
  // Not found page
  'notfound.title': 'Page Non Trouvée',
  'notfound.message': 'La page que vous recherchez a peut-être été supprimée ou est temporairement indisponible',
  'notfound.button': 'Retour à la Page d\'Accueil',
  
  // Form validation
  'form.required': 'Ce champ est obligatoire',
  'form.email': 'Veuillez entrer une adresse email valide',
  'form.success': 'Votre message a été envoyé avec succès!',
  'form.error': 'Une erreur s\'est produite lors de l\'envoi de votre message. Veuillez réessayer.',
  
  // Pricing page
  'pricing.title': 'Nos Tarifs',
  'pricing.subtitle': 'Options tarifaires personnalisées pour tous vos besoins de transport automobile',
  'pricing.faq.title': 'Questions Fréquemment Posées',
  'pricing.custom.title': 'Devis Personnalisé',
  'pricing.custom.description': 'Chaque transport de véhicule est unique. Nous calculons les tarifs en fonction de la distance, du poids du véhicule et de l\'urgence. Contactez-nous pour un devis détaillé adapté à vos besoins spécifiques.',
  'pricing.factors.title': 'Facteurs de Tarification',
  'pricing.factors.description': 'Nos prix sont calculés en fonction de plusieurs facteurs clés:',
  'pricing.factors.distance': 'Distance de transport et itinéraire',
  'pricing.factors.weight': 'Taille, poids et spécifications du véhicule',
  'pricing.factors.urgency': 'Délai de livraison et urgence',
  'pricing.factors.services': 'Options d\'assurance et services supplémentaires',
  'pricing.quote.title': 'Demandez Votre Devis Personnalisé',
  'pricing.quote.description': 'Pour un devis précis, veuillez nous contacter avec les détails de vos besoins de transport.',
  'pricing.quote.info': 'Notre équipe répondra rapidement avec un devis détaillé basé sur vos exigences spécifiques.',
  'pricing.quote.button': 'Obtenir Votre Devis Personnalisé',
  'button.get.quote': 'Obtenir un Devis',
  'button.learn.more': 'En Savoir Plus',

  // Tracking page
  'tracking.title': 'Suivre Votre Expédition',
  'tracking.subtitle': 'Entrez votre numéro de suivi pour obtenir des mises à jour en temps réel sur l\'état de votre transport de véhicule',
  'tracking.form.placeholder': 'Entrez le numéro de suivi',
  'tracking.form.submit': 'Suivre',
  'tracking.loading': 'Chargement des informations d\'expédition...',
  'tracking.error.title': 'Expédition Non Trouvée',
  'tracking.error.description': 'Nous n\'avons pas pu trouver une expédition avec ce numéro de suivi. Veuillez vérifier le numéro et réessayer.',
  'tracking.found.title': 'Expédition Trouvée',
  'tracking.found.description': 'Voici les détails de votre expédition:',
  'tracking.status': 'Statut de l\'Expédition',
  'tracking.currentLocation': 'Emplacement Actuel',
  'tracking.estimatedDelivery': 'Livraison Estimée',
  'tracking.route': 'Itinéraire de Transport',
  'tracking.origin': 'Origine',
  'tracking.destination': 'Destination',
  'tracking.details': 'Détails de l\'Expédition',
  'tracking.shipmentInfo': 'Informations d\'Expédition',
  'tracking.trackingNumber': 'Numéro de Suivi',
  'tracking.vehicleModel': 'Modèle du Véhicule',
  'tracking.createdDate': 'Date de Commande',
  'tracking.customerInfo': 'Informations Client',
  'tracking.customerName': 'Nom',
  'tracking.customerEmail': 'Email',
  'tracking.notes': 'Notes Supplémentaires',
  'tracking.notAvailable': 'Information non disponible',
};

// German translations
const de = {
  // Navigation
  'nav.home': 'Startseite',
  'nav.services': 'Dienstleistungen',
  'nav.pricing': 'Preise',
  'nav.about': 'Über Uns',
  'nav.contact': 'Kontakt',
  'nav.quote': 'Angebot Einholen',
  'nav.tracking': 'Sendungsverfolgung',
  
  // Hero section
  'hero.title': 'Professioneller Fahrzeugtransport durch Europa',
  'hero.subtitle': 'Sicherer, zuverlässiger und effizienter Transport für Ihr Fahrzeug',
  'hero.cta': 'Angebot Anfordern',
  'hero.learn': 'Mehr Erfahren',
  'hero.quote': 'Angebot Einholen',
  'hero.learn.more': 'Mehr Erfahren',
  
  // Service highlights
  'services.title': 'Unsere Dienstleistungen',
  'services.features': 'Hauptmerkmale:',
  'services.subtitle': '',
  'services.individual.title': 'Fahrzeugtransport',
  'services.individual.description': 'Tür-zu-Tür-Lieferservice für Ihr persönliches Fahrzeug',
  'services.individual.long': 'Professioneller Fahrzeugtransport durch Europa. Wir bieten maßgeschneiderten Fahrzeugtransportservice von Tür zu Tür - schnell, sicher und zuverlässig. Wir transportieren alle Arten von Fahrzeugen: neue, gebrauchte, SUVs, Pickups, Kleinbusse, beschädigte Fahrzeuge oder solche mit verschiedenen technischen Defekten. Wir arbeiten sowohl mit privaten Kunden als auch mit Autohändlern. Unser Ziel ist es, einen reibungslosen, professionellen und sorgfältig geplanten Transport vom Abholort bis zum Lieferort zu gewährleisten.',
  'services.cargo.title': 'Spezialisierter Transport von Nicht-Standardfracht',
  'services.cargo.description': 'Spezialisierter Transport für Nicht-Standardfracht',
  'services.cargo.long': 'Wir bieten Transportdienstleistungen für Standard- und Nicht-Standardfracht durch Europa an. Wir transportieren Objekte wie mobile Saunen, Whirlpools und andere Nicht-Standardfracht. Wir verwenden Plattformtransporte und professionelle Sicherungslösungen, um sicherzustellen, dass Ihre Fracht sicher und pünktlich geliefert wird.',
  'services.luxury.title': 'Luxusfahrzeugtransport',
  'services.luxury.description': 'Premium-Service für hochwertige Luxus- und Klassikfahrzeuge',
  'services.luxury.long': 'Wir bieten das höchste Niveau an Transportdienstleistungen für Besitzer teurer Fahrzeuge, denen jedes Detail wichtig ist. Wir verstehen, dass solche Fahrzeuge besondere Aufmerksamkeit erfordern, daher sorgen wir für maximale Sicherheit, Vertraulichkeit und Professionalität während des gesamten Transportprozesses.',
  'services.international.title': 'Grenzüberschreitende Lieferung',
  'services.international.description': 'Nahtloser internationaler Fahrzeugtransport durch Europa',
  'services.international.long': 'Nahtloser internationaler Fahrzeugtransport über europäische Grenzen hinweg. Wir kümmern uns um alle erforderlichen Unterlagen und Zollanforderungen, um den grenzüberschreitenden Transport problemlos zu gestalten.',
  
  // Why choose us
  'why.title': 'Warum GoBaltic Wählen',
  'why.fast.title': 'Schneller & Sicherer Transport',
  'why.fast.description': 'Schnelle Lieferzeiten ohne Kompromisse bei der Sicherheit',
  'why.competitive.title': 'Zuverlässigkeit & Professionalität',
  'why.competitive.description': 'Jahrelange Erfahrung im Fahrzeugtransport ermöglicht es uns, das höchste Serviceniveau und tadellose Kundenbetreuung zu gewährleisten',
  'why.europe.title': 'Europaweite Lieferung',
  'why.europe.description': 'Wir transportieren Fahrzeuge zu/von jedem europäischen Land - zuverlässig und pünktlich',
  'why.insurance.title': 'Vollständiger Versicherungsschutz',
  'why.insurance.description': 'Jeder Transport ist versichert - Ihr Fahrzeug ist während des gesamten Prozesses vollständig geschützt',
  
  // Testimonials
  'testimonials.title': 'Was Unsere Kunden Sagen',
  'testimonials.subtitle': 'Erfahren Sie mehr über die Erfahrungen unserer zufriedenen Kunden mit GoBaltic',
  
  // CTA section
  'cta.title': 'Bereit, Ihr Fahrzeug zu Versenden?',
  'cta.subtitle': 'Kontaktieren Sie uns noch heute für ein personalisiertes Angebot',
  'cta.button': 'Loslegen',
  
  // About page
  'about.title': 'Über GoBaltic',
  'about.subtitle': 'Ihr vertrauenswürdiger Partner für Fahrzeugtransportdienste in der baltischen Region und Europa',
  'about.history.title': 'Unsere Geschichte',
  'about.history.text': 'Gegründet im Jahr 2020, hat sich GoBaltic von einem kleinen lokalen Fahrzeugtransportunternehmen zu einem der führenden Fahrzeugtransportdienste in der baltischen Region entwickelt. Mit unserer Erfahrung haben wir einen Ruf für Zuverlässigkeit, Professionalität und Kundenzufriedenheit aufgebaut.',
  'about.mission.title': 'Unsere Mission',
  'about.mission.text': 'Die zuverlässigsten, effizientesten und sichersten Fahrzeugtransportdienste in Europa zu bieten und unseren Kunden vollständige Sorglosigkeit zu garantieren.',
  'about.values.title': 'Unsere Werte',
  'about.values.subtitle': 'Diese Grundprinzipien leiten alles, was wir bei GoBaltic tun, vom täglichen Betrieb bis zur langfristigen Strategie',
  'about.team.title': 'Unser Führungsteam',
  'about.team.subtitle': 'Lernen Sie die erfahrenen Fachleute kennen, die GoBaltic leiten und die höchste Servicequalität sicherstellen',
  
  // Contact page
  'contact.title': 'Kontaktieren Sie Uns',
  'contact.subtitle': 'Haben Sie Fragen oder sind Sie bereit, Ihren Fahrzeugtransport zu buchen? Kontaktieren Sie unser Team für schnelle und freundliche Unterstützung',
  'contact.form.name': 'Ihr Name',
  'contact.form.email': 'E-Mail-Adresse',
  'contact.form.phone': 'Telefonnummer',
  'contact.form.service': 'Servicetyp',
  'contact.form.message': 'Nachricht',
  'contact.form.submit': 'Anfrage Senden',
  'contact.info.title': 'Kontaktinformationen',
  'contact.info.address.title': 'Büroadresse',
  'contact.info.hours.title': 'Geschäftszeiten',
  'contact.info.phone.title': 'Telefon',
  
  // Footer
  'footer.description': 'Professionelle Fahrzeugtransportdienste durch Europa. Sicher, zuverlässig und effizient.',
  'footer.links': 'Schnelllinks',
  'footer.services': 'Dienstleistungen',
  'footer.legal': 'Rechtliches',
  'footer.legal.terms': 'Nutzungsbedingungen',
  'footer.legal.privacy': 'Datenschutzrichtlinie',
  'footer.legal.cookies': 'Cookie-Richtlinie',
  'footer.copyright': '© 2025 GoBaltic. Alle Rechte vorbehalten.',
  
  // Not found page
  'notfound.title': 'Seite Nicht Gefunden',
  'notfound.message': 'Die von Ihnen gesuchte Seite wurde möglicherweise entfernt oder ist vorübergehend nicht verfügbar',
  'notfound.button': 'Zurück zur Startseite',
  
  // Form validation
  'form.required': 'Dieses Feld ist erforderlich',
  'form.email': 'Bitte geben Sie eine gültige E-Mail-Adresse ein',
  'form.success': 'Ihre Nachricht wurde erfolgreich gesendet!',
  'form.error': 'Beim Senden Ihrer Nachricht ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.',
  
  // Pricing page
  'pricing.title': 'Unsere Preise',
  'pricing.subtitle': 'Individuelle Preisoptionen für alle Ihre Fahrzeugtransportbedürfnisse',
  'pricing.faq.title': 'Häufig Gestellte Fragen',
  'pricing.custom.title': 'Individuelle Preisgestaltung',
  'pricing.custom.description': 'Jeder Fahrzeugtransport ist einzigartig. Wir berechnen die Preise basierend auf Entfernung, Fahrzeuggewicht und Dringlichkeit. Kontaktieren Sie uns für ein detailliertes Angebot, das auf Ihre spezifischen Bedürfnisse zugeschnitten ist.',
  'pricing.factors.title': 'Preisfaktoren',
  'pricing.factors.description': 'Unsere Preise werden anhand mehrerer wichtiger Faktoren berechnet:',
  'pricing.factors.distance': 'Transportentfernung und -route',
  'pricing.factors.weight': 'Fahrzeuggröße, -gewicht und -spezifikationen',
  'pricing.factors.urgency': 'Lieferzeitraum und Dringlichkeit',
  'pricing.factors.services': 'Versicherungsoptionen und zusätzliche Dienstleistungen',
  'pricing.quote.title': 'Fordern Sie Ihr Individuelles Angebot An',
  'pricing.quote.description': 'Für ein genaues Preisangebot kontaktieren Sie uns bitte mit Details zu Ihren Transportbedürfnissen.',
  'pricing.quote.info': 'Unser Team wird umgehend mit einem detaillierten Angebot basierend auf Ihren spezifischen Anforderungen antworten.',
  'pricing.quote.button': 'Ihr Individuelles Angebot Einholen',
  'button.get.quote': 'Angebot Einholen',
  'button.learn.more': 'Mehr Erfahren',

  // Tracking page
  'tracking.title': 'Verfolgen Sie Ihre Sendung',
  'tracking.subtitle': 'Geben Sie Ihre Sendungsnummer ein, um Echtzeitaktualisierungen zum Status Ihres Fahrzeugtransports zu erhalten',
  'tracking.form.placeholder': 'Sendungsnummer eingeben',
  'tracking.form.submit': 'Verfolgen',
  'tracking.loading': 'Sendungsinformationen werden geladen...',
  'tracking.error.title': 'Sendung Nicht Gefunden',
  'tracking.error.description': 'Wir konnten keine Sendung mit dieser Sendungsnummer finden. Bitte überprüfen Sie die Nummer und versuchen Sie es erneut.',
  'tracking.found.title': 'Sendung Gefunden',
  'tracking.found.description': 'Hier sind die Details Ihrer Sendung:',
  'tracking.status': 'Sendungsstatus',
  'tracking.currentLocation': 'Aktueller Standort',
  'tracking.estimatedDelivery': 'Voraussichtliche Lieferung',
  'tracking.route': 'Transportroute',
  'tracking.origin': 'Ursprung',
  'tracking.destination': 'Ziel',
  'tracking.details': 'Sendungsdetails',
  'tracking.shipmentInfo': 'Sendungsinformationen',
  'tracking.trackingNumber': 'Sendungsnummer',
  'tracking.vehicleModel': 'Fahrzeugmodell',
  'tracking.createdDate': 'Bestelldatum',
  'tracking.customerInfo': 'Kundeninformationen',
  'tracking.customerName': 'Name',
  'tracking.customerEmail': 'E-Mail',
  'tracking.notes': 'Zusätzliche Hinweise',
  'tracking.notAvailable': 'Information nicht verfügbar',
};

// Polish translations
const pl = {
  // Navigation
  'nav.home': 'Strona Główna',
  'nav.services': 'Usługi',
  'nav.pricing': 'Cennik',
  'nav.about': 'O Nas',
  'nav.contact': 'Kontakt',
  'nav.quote': 'Wycena',
  'nav.tracking': 'Śledzenie Przesyłki',
  
  // Hero section
  'hero.title': 'Profesjonalny Transport Samochodów Przez Całą Europę',
  'hero.subtitle': 'Bezpieczny, niezawodny i wydajny transport twojego pojazdu',
  'hero.cta': 'Poproś o Wycenę',
  'hero.learn': 'Dowiedz Się Więcej',
  'hero.quote': 'Uzyskaj Wycenę',
  'hero.learn.more': 'Dowiedz Się Więcej',
  
  // Service highlights
  'services.title': 'Nasze Usługi',
  'services.features': 'Kluczowe Cechy:',
  'services.subtitle': '',
  'services.individual.title': 'Transport Samochodów',
  'services.individual.description': 'Usługa dostawy od drzwi do drzwi dla twojego osobistego pojazdu',
  'services.individual.long': 'Profesjonalny transport samochodów przez całą Europę. Oferujemy spersonalizowaną usługę transportu pojazdów od drzwi do drzwi - szybko, bezpiecznie i niezawodnie. Transportujemy wszystkie rodzaje pojazdów: nowe, używane, SUV-y, pickupy, minibusy, uszkodzone pojazdy lub te z różnymi wadami technicznymi. Współpracujemy zarówno z klientami prywatnymi, jak i dealerami samochodowymi. Naszym celem jest zapewnienie płynnego, profesjonalnego i starannie zaplanowanego transportu od miejsca odbioru do miejsca dostawy.',
  'services.cargo.title': 'Specjalistyczny Transport Ładunków Niestandardowych',
  'services.cargo.description': 'Specjalistyczny transport dla ładunków niestandardowych',
  'services.cargo.long': 'Świadczymy usługi transportowe dla standardowych i niestandardowych ładunków w całej Europie. Transportujemy obiekty takie jak mobilne sauny, balie i inne niestandardowe ładunki. Używamy transportów platformowych i profesjonalnych rozwiązań zabezpieczających, aby zapewnić, że Twój ładunek zostanie dostarczony bezpiecznie i na czas.',
  'services.luxury.title': 'Transport Pojazdów Luksusowych',
  'services.luxury.description': 'Usługa premium dla luksusowych i klasycznych samochodów o wysokiej wartości',
  'services.luxury.long': 'Oferujemy najwyższy poziom usług transportowych dla właścicieli drogich pojazdów, którym zależy na każdym szczególe. Rozumiemy, że takie pojazdy wymagają szczególnej uwagi, dlatego zapewniamy maksymalne bezpieczeństwo, poufność i profesjonalizm przez cały proces transportu.',
  'services.international.title': 'Dostawa Transgraniczna',
  'services.international.description': 'Bezproblemowy międzynarodowy transport samochodów w całej Europie',
  'services.international.long': 'Bezproblemowy międzynarodowy transport samochodów przez granice europejskie. Zajmujemy się całą niezbędną dokumentacją i wymogami celnymi, aby transport transgraniczny był bezproblemowy.',
  
  // Why choose us
  'why.title': 'Dlaczego Wybrać GoBaltic',
  'why.fast.title': 'Szybki i Bezpieczny Transport',
  'why.fast.description': 'Szybkie czasy dostawy bez kompromisów w kwestii bezpieczeństwa',
  'why.competitive.title': 'Niezawodność i Profesjonalizm',
  'why.competitive.description': 'Wieloletnie doświadczenie w transporcie samochodów pozwala nam zapewnić najwyższy poziom usług i nienaganną obsługę klienta',
  'why.europe.title': 'Dostawa w Całej Europie',
  'why.europe.description': 'Transportujemy pojazdy do/z każdego kraju europejskiego - niezawodnie i punktualnie',
  'why.insurance.title': 'Pełne Ubezpieczenie',
  'why.insurance.description': 'Każdy transport jest ubezpieczony - twój pojazd jest w pełni chroniony przez cały proces',
  
  // Testimonials
  'testimonials.title': 'Co Mówią Nasi Klienci',
  'testimonials.subtitle': 'Poznaj doświadczenia naszych zadowolonych klientów z GoBaltic',
  
  // CTA section
  'cta.title': 'Gotowy na Wysyłkę Swojego Pojazdu?',
  'cta.subtitle': 'Skontaktuj się z nami już dziś, aby uzyskać spersonalizowaną wycenę',
  'cta.button': 'Rozpocznij',
  
  // About page
  'about.title': 'O GoBaltic',
  'about.subtitle': 'Twój zaufany partner w usługach transportu samochodów w regionie bałtyckim i Europie',
  'about.history.title': 'Nasza Historia',
  'about.history.text': 'Założona w 2020 roku, GoBaltic rozwinęła się z małej lokalnej firmy transportu samochodowego w jedną z wiodących usług transportu pojazdów w regionie bałtyckim. Dzięki naszemu doświadczeniu zbudowaliśmy reputację niezawodności, profesjonalizmu i zadowolenia klientów.',
  'about.mission.title': 'Nasza Misja',
  'about.mission.text': 'Zapewnianie najbardziej niezawodnych, wydajnych i bezpiecznych usług transportu samochodów w całej Europie, gwarantując naszym klientom pełen spokój ducha.',
  'about.values.title': 'Nasze Wartości',
  'about.values.subtitle': 'Te podstawowe zasady kierują wszystkim, co robimy w GoBaltic, od codziennych operacji po długoterminową strategię',
  'about.team.title': 'Nasz Zespół Zarządzający',
  'about.team.subtitle': 'Poznaj doświadczonych profesjonalistów, którzy kierują GoBaltic i zapewniają najwyższą jakość usług',
  
  // Contact page
  'contact.title': 'Kontakt',
  'contact.subtitle': 'Masz pytania lub jesteś gotowy zarezerwować transport samochodu? Skontaktuj się z naszym zespołem, aby uzyskać szybką i przyjazną pomoc',
  'contact.form.name': 'Twoje Imię',
  'contact.form.email': 'Adres Email',
  'contact.form.phone': 'Numer Telefonu',
  'contact.form.service': 'Rodzaj Usługi',
  'contact.form.message': 'Wiadomość',
  'contact.form.submit': 'Wyślij Zapytanie',
  'contact.info.title': 'Informacje Kontaktowe',
  'contact.info.address.title': 'Adres Biura',
  'contact.info.hours.title': 'Godziny Pracy',
  'contact.info.phone.title': 'Telefon',
  
  // Footer
  'footer.description': 'Profesjonalne usługi transportu samochodów w całej Europie. Bezpiecznie, niezawodnie i efektywnie.',
  'footer.links': 'Szybkie Linki',
  'footer.services': 'Usługi',
  'footer.legal': 'Informacje Prawne',
  'footer.legal.terms': 'Warunki Korzystania',
  'footer.legal.privacy': 'Polityka Prywatności',
  'footer.legal.cookies': 'Polityka Cookies',
  'footer.copyright': '© 2025 GoBaltic. Wszelkie prawa zastrzeżone.',
  
  // Not found page
  'notfound.title': 'Strona Nie Znaleziona',
  'notfound.message': 'Strona, której szukasz, mogła zostać usunięta lub jest tymczasowo niedostępna',
  'notfound.button': 'Powrót do Strony Głównej',
  
  // Form validation
  'form.required': 'To pole jest wymagane',
  'form.email': 'Proszę wprowadzić poprawny adres email',
  'form.success': 'Twoja wiadomość została wysłana pomyślnie!',
  'form.error': 'Wystąpił błąd podczas wysyłania wiadomości. Proszę spróbować ponownie.',
  
  // Pricing page
  'pricing.title': 'Nasze Ceny',
  'pricing.subtitle': 'Spersonalizowane opcje cenowe dla wszystkich Twoich potrzeb transportu samochodów',
  'pricing.faq.title': 'Często Zadawane Pytania',
  'pricing.custom.title': 'Indywidualna Wycena',
  'pricing.custom.description': 'Każdy transport pojazdu jest unikalny. Obliczamy stawki na podstawie odległości, wagi pojazdu i pilności. Skontaktuj się z nami, aby uzyskać szczegółową wycenę dostosowaną do Twoich konkretnych potrzeb.',
  'pricing.factors.title': 'Czynniki Cenowe',
  'pricing.factors.description': 'Nasze ceny są obliczane na podstawie kilku kluczowych czynników:',
  'pricing.factors.distance': 'Odległość transportu i trasa',
  'pricing.factors.weight': 'Rozmiar, waga i specyfikacje pojazdu',
  'pricing.factors.urgency': 'Czas dostawy i pilność',
  'pricing.factors.services': 'Opcje ubezpieczenia i dodatkowe usługi',
  'pricing.quote.title': 'Poproś o Indywidualną Wycenę',
  'pricing.quote.description': 'Aby uzyskać dokładną wycenę, prosimy o kontakt z informacjami o Twoich potrzebach transportowych.',
  'pricing.quote.info': 'Nasz zespół odpowie niezwłocznie ze szczegółową wyceną opartą na Twoich konkretnych wymaganiach.',
  'pricing.quote.button': 'Uzyskaj Indywidualną Wycenę',
  'button.get.quote': 'Uzyskaj Wycenę',
  'button.learn.more': 'Dowiedz Się Więcej',

  // Tracking page
  'tracking.title': 'Śledź Swoją Przesyłkę',
  'tracking.subtitle': 'Wprowadź numer śledzenia, aby uzyskać aktualne informacje o statusie transportu twojego pojazdu',
  'tracking.form.placeholder': 'Wprowadź numer śledzenia',
  'tracking.form.submit': 'Śledź',
  'tracking.loading': 'Ładowanie informacji o przesyłce...',
  'tracking.error.title': 'Przesyłka Nie Znaleziona',
  'tracking.error.description': 'Nie mogliśmy znaleźć przesyłki o tym numerze śledzenia. Sprawdź numer i spróbuj ponownie.',
  'tracking.found.title': 'Przesyłka Znaleziona',
  'tracking.found.description': 'Oto szczegóły twojej przesyłki:',
  'tracking.status': 'Status Przesyłki',
  'tracking.currentLocation': 'Aktualna Lokalizacja',
  'tracking.estimatedDelivery': 'Szacowana Dostawa',
  'tracking.route': 'Trasa Transportu',
  'tracking.origin': 'Miejsce Nadania',
  'tracking.destination': 'Miejsce Docelowe',
  'tracking.details': 'Szczegóły Przesyłki',
  'tracking.shipmentInfo': 'Informacje o Przesyłce',
  'tracking.trackingNumber': 'Numer Śledzenia',
  'tracking.vehicleModel': 'Model Pojazdu',
  'tracking.createdDate': 'Data Zamówienia',
  'tracking.customerInfo': 'Informacje o Kliencie',
  'tracking.customerName': 'Imię i Nazwisko',
  'tracking.customerEmail': 'Email',
  'tracking.notes': 'Dodatkowe Uwagi',
  'tracking.notAvailable': 'Informacja niedostępna',
};

// Define record type for translations
type TranslationRecord = Record<string, string>;

// All translations
const translations: Record<Language, TranslationRecord> = {
  en,
  lt,
  fr,
  de,
  pl
};

// Provider component
interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  // Load saved language preference or use default
  const [language, setLanguage] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem('language');
    return (savedLanguage as Language) || 'en';
  });

  // Save language preference when it changes
  useEffect(() => {
    localStorage.setItem('language', language);
    // Update document language attribute
    document.documentElement.lang = language;
  }, [language]);

  // Translation function
  const t = (key: string): string => {
    const currentTranslations = translations[language];
    return currentTranslations[key] || key;
  };

  const value = {
    language,
    setLanguage,
    t,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use the language context
export const useLanguage = () => useContext(LanguageContext);