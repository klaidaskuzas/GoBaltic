import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const { t, language } = useLanguage();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6 pb-8">
          <div className="flex mb-4 gap-2">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <h1 className="text-2xl font-bold text-gray-900">
              {language === 'en' ? '404 Page Not Found' : '404 Puslapis Nerastas'}
            </h1>
          </div>

          <p className="mt-4 mb-6 text-gray-600">
            {language === 'en' 
              ? 'The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.'
              : 'Puslapis, kurio ieškote, galėjo būti pašalintas, pakeistas jo pavadinimas arba laikinai nepasiekiamas.'}
          </p>
          
          <div className="flex justify-center">
            <Link href="/">
              <Button className="bg-primary hover:bg-primary-700 text-white">
                {language === 'en' ? 'Return to Home' : 'Grįžti į pradžią'}
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
