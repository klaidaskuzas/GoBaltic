import { useState, useEffect } from "react";

interface GoogleMapProps {
  address: string;
  height?: string;
  className?: string;
}

const GoogleMap = ({ address, height = "100%", className = "" }: GoogleMapProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  // This is a fallback image to use when we can't load Google Maps
  // In a real application, you'd use an actual Google Maps API integration
  return (
    <div 
      className={`rounded-lg overflow-hidden shadow-md ${className}`}
      style={{ height }}
    >
      <img 
        src="https://images.unsplash.com/photo-1549890762-0a3f8933bc76?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80" 
        alt="Map of Baltic region" 
        className="w-full h-full object-cover"
      />
    </div>
  );
};

export default GoogleMap;
