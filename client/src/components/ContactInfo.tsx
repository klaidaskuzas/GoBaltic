import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Mail, Clock, Phone } from "lucide-react";

interface ContactInfoItemProps {
  icon: React.ReactNode;
  title: string;
  lines: string[];
}

const ContactInfoItem = ({ icon, title, lines }: ContactInfoItemProps) => {
  // Helper to make email or phone clickable
  const renderLine = (line: string, index: number) => {
    if (title === "Email") {
      return (
        <a 
          key={index} 
          href={`mailto:${line}`} 
          className="text-gray-600 hover:text-primary transition-colors"
        >
          {line}
        </a>
      );
    } else if (title === "Phone") {
      return (
        <a 
          key={index} 
          href={`tel:${line.replace(/\s/g, '')}`} 
          className="text-gray-600 hover:text-primary transition-colors"
        >
          {line}
        </a>
      );
    } else {
      return <p key={index} className="text-gray-600">{line}</p>;
    }
  };

  return (
    <Card className="bg-gray-50">
      <CardContent className="p-6">
        <div className="flex items-start">
          <div className="bg-primary rounded-full p-3 text-white mr-4">
            {icon}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
            {lines.map((line, index) => renderLine(line, index))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const ContactInfo = () => {
  const contactItems = [
    {
      icon: <Mail className="h-5 w-5" />,
      title: "Email",
      lines: ["info@gobaltic.lt"]
    },
    {
      icon: <Phone className="h-5 w-5" />,
      title: "Phone",
      lines: ["+37060766682"]
    },
    {
      icon: <MapPin className="h-5 w-5" />,
      title: "Office",
      lines: ["Kauno g. 99", "LT-55179 Jonava, Lithuania"]
    },
    {
      icon: <Clock className="h-5 w-5" />,
      title: "Hours",
      lines: ["Monday-Friday: 8am-6pm", "Weekend: Closed"]
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {contactItems.map((item, index) => (
        <ContactInfoItem 
          key={index}
          icon={item.icon}
          title={item.title}
          lines={item.lines}
        />
      ))}
    </div>
  );
};

export default ContactInfo;
