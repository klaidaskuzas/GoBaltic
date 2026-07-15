import cargoTransport from '@/assets/cargo-transport.jpg';
import luxuryVehicles from '@/assets/luxury-vehicles.jpg';
import individualTransport from '@/assets/individual-car-transport.jpg';

export const services = [
  {
    title: "Car Transportation",
    description: "Door-to-door delivery of your vehicle with full tracking and insurance coverage throughout the journey.",
    titleKey: "services.individual.title",
    descriptionKey: "services.individual.description",
    imageUrl: individualTransport,
    link: "/services"
  },
  {
    title: "Cargo Transportation",
    description: "Secured platform transport for special cargo like mobile bathtubs, saunas, and other oversized items.",
    titleKey: "services.cargo.title",
    descriptionKey: "services.cargo.description",
    imageUrl: cargoTransport,
    link: "/services"
  },
  {
    title: "Luxury Vehicles",
    description: "Premium handling and transportation services for high-value and luxury vehicles with extra care and security.",
    titleKey: "services.luxury.title",
    descriptionKey: "services.luxury.description",
    imageUrl: luxuryVehicles,
    link: "/services"
  }
];
