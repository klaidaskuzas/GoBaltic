import { useState, useEffect } from "react";
import TestimonialCard from "./TestimonialCard";
import { testimonials } from "@/data/testimonials";
import { useLanguage } from "@/contexts/LanguageContext";
import { QuoteIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const Testimonials = () => {
  const { t, language } = useLanguage();
  const [currentPage, setCurrentPage] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState('next'); // 'next' or 'prev'
  
  // Number of testimonials to show per page
  const testimonialsPerPage = 3;
  const totalPages = Math.ceil(testimonials.length / testimonialsPerPage);
  
  // Get testimonials for current page
  const currentTestimonials = testimonials.slice(
    currentPage * testimonialsPerPage,
    (currentPage + 1) * testimonialsPerPage
  );

  // Auto-rotation effect
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isAnimating) {
        nextPage();
      }
    }, 8000); // Auto rotate every 8 seconds
    
    return () => clearInterval(interval);
  }, [isAnimating]);

  // Navigation functions
  const nextPage = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setDirection('next');
    
    // Short delay to allow animation to complete
    setTimeout(() => {
      setCurrentPage((prev) => (prev + 1) % totalPages);
      setIsAnimating(false);
    }, 300);
  };

  const prevPage = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setDirection('prev');
    
    // Short delay to allow animation to complete
    setTimeout(() => {
      setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
      setIsAnimating(false);
    }, 300);
  };
  
  const goToPage = (page: number) => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setDirection(page > currentPage ? 'next' : 'prev');
    
    setTimeout(() => {
      setCurrentPage(page);
      setIsAnimating(false);
    }, 300);
  };
  
  return (
    <section id="testimonials" className="py-24 bg-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-72 h-72 bg-primary/10 rounded-full -mr-24 -mt-24"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/10 rounded-full -ml-40 -mb-40"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-12">
          <div className="w-20 h-1.5 bg-primary mb-4 mx-auto"></div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">{t('testimonials.title')}</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto text-center">
            {t('testimonials.subtitle')}
          </p>
          <p className="text-sm text-gray-500 mt-3 text-center">
            {language === 'fr'
              ? `Expériences clients de toute l'Europe - Page ${currentPage + 1} sur ${totalPages}`
              : language === 'de'
              ? `Kundenerfahrungen aus ganz Europa - Seite ${currentPage + 1} von ${totalPages}`
              : language === 'pl'
              ? `Doświadczenia klientów z całej Europy - Strona ${currentPage + 1} z ${totalPages}`
              : language === 'lt'
              ? `Klientų patirtys iš visos Europos - Puslapis ${currentPage + 1} iš ${totalPages}`
              : `Client experiences from across Europe - Page ${currentPage + 1} of ${totalPages}`}
          </p>
        </div>
        
        <div className="relative">
          <div className="hidden lg:block absolute -left-10 top-1/2 transform -translate-y-1/2 text-primary/20">
            <QuoteIcon size={120} />
          </div>
          
          <div 
            className={`grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 relative z-10 min-h-[400px] transition-all duration-300 ${
              isAnimating 
                ? direction === 'next'
                  ? 'opacity-0 translate-x-4'
                  : 'opacity-0 -translate-x-4'
                : 'opacity-100 translate-x-0'
            }`}
          >
            {currentTestimonials.map((testimonial, index) => (
              <div 
                key={`${currentPage}-${index}`}
                className="transition-all duration-300 transform hover:scale-105"
              >
                <TestimonialCard
                  content={testimonial.content}
                  author={testimonial.author}
                  rating={testimonial.rating}
                />
              </div>
            ))}
          </div>
          
          <div className="hidden lg:block absolute -right-10 top-1/2 transform -translate-y-1/2 rotate-180 text-primary/20">
            <QuoteIcon size={120} />
          </div>
        </div>
        
        {/* Navigation buttons */}
        <div className="flex flex-col items-center mt-12">
          <p className="text-center text-sm text-gray-600 mb-3">
            {language === 'fr'
              ? 'Faites défiler pour voir plus d\'avis clients'
              : language === 'de'
              ? 'Wischen Sie, um weitere Kundenbewertungen zu sehen'
              : language === 'pl'
              ? 'Przesuń, aby zobaczyć więcej opinii klientów'
              : language === 'lt'
              ? 'Slankiokite, kad pamatytumėte daugiau klientų atsiliepimų'
              : 'Slide to see more customer reviews'}
          </p>
          
          <div className="flex justify-center items-center space-x-6">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={prevPage}
              className="rounded-full h-12 w-12 border-2 border-primary/30 hover:bg-primary/10 hover:border-primary hover:scale-110 transition-all shadow-sm"
            >
              <ChevronLeft className="h-6 w-6 text-primary" />
            </Button>
            
            <div className="flex space-x-2">
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => goToPage(idx)}
                  className={`h-3 rounded-full transition-all ${
                    idx === currentPage ? "w-8 bg-primary" : "w-3 bg-gray-300 hover:bg-primary/50"
                  }`}
                  aria-label={`Go to page ${idx + 1}`}
                />
              ))}
            </div>
            
            <Button 
              variant="outline" 
              size="icon" 
              onClick={nextPage}
              className="rounded-full h-12 w-12 border-2 border-primary/30 hover:bg-primary/10 hover:border-primary hover:scale-110 transition-all shadow-sm"
            >
              <ChevronRight className="h-6 w-6 text-primary" />
            </Button>
          </div>
          
          <p className="text-xs text-primary mt-3 font-medium">
            {language === 'en' 
              ? `${currentPage + 1}/${totalPages}` 
              : `${currentPage + 1}/${totalPages}`}
          </p>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
