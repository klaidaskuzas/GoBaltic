import { Card, CardContent } from "@/components/ui/card";
import { Star, StarHalf, Quote } from "lucide-react";

export interface TestimonialProps {
  content: string;
  author: {
    name: string;
    location: string;
    avatar: string;
  };
  rating: number;
}

const TestimonialCard = ({ content, author, rating }: TestimonialProps) => {
  // Create array of stars based on rating
  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`star-${i}`} className="h-4 w-4 text-yellow-500 fill-current" />);
    }
    
    // Add half star if needed
    if (hasHalfStar) {
      stars.push(<StarHalf key="half-star" className="h-4 w-4 text-yellow-500 fill-current" />);
    }
    
    return stars;
  };

  return (
    <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 h-full">
      <CardContent className="p-8 relative h-full flex flex-col">
        <div className="absolute -top-4 -left-4 bg-primary text-white p-2 rounded-full">
          <Quote className="h-5 w-5" />
        </div>
        
        <div className="flex items-center mb-4 mt-2">
          <div className="text-yellow-500 flex">
            {renderStars()}
          </div>
        </div>
        
        <blockquote className="text-gray-600 mb-6 flex-grow">
          "{content}"
        </blockquote>
        
        <div className="flex items-center pt-4 border-t border-gray-100">
          <div>
            <p className="font-bold text-gray-900">{author.name}</p>
            <p className="text-sm text-gray-500">{author.location}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TestimonialCard;
