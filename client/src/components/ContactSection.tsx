import ContactForm from "./ContactForm";
import ContactInfo from "./ContactInfo";
import GoogleMap from "./ui/google-map";

const ContactSection = () => {
  return (
    <section id="contact" className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title moved to main page */}
        
        <div className="flex flex-col lg:flex-row gap-10">
          <div className="w-full lg:w-1/2">
            <ContactForm />
          </div>
          
          <div className="w-full lg:w-1/2">
            <div className="h-64 md:h-80 lg:h-[350px] mb-8">
              <GoogleMap address="Kauno g. 99, LT-55179 Jonava, Lithuania" className="w-full h-full" />
            </div>
            
            <ContactInfo />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
