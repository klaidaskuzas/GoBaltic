import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

const FORMSPREE_ENDPOINT = "https://formspree.io/f/maqrnrnr";

const formSchema = z.object({
  fullName: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().optional(),
  pickupLocation: z.string().optional(),
  deliveryPlace: z.string().optional(),

  serviceType: z.string().optional(),
  cargoDetails: z.string().min(5, { message: "Cargo details must be at least 5 characters" }),
});

type FormValues = z.infer<typeof formSchema>;

const ContactForm = () => {
  const { toast } = useToast();
  const { language } = useLanguage();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      pickupLocation: "",
      deliveryPlace: "",

      serviceType: "",
      cargoDetails: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: FormValues) => {
      const payload = new URLSearchParams({
        fullName: data.fullName || "",
        email: data.email || "",
        phone: data.phone || "",
        pickupLocation: data.pickupLocation || "",
        deliveryPlace: data.deliveryPlace || "",
        serviceType: data.serviceType || "",
        cargoDetails: data.cargoDetails || "",
        source: "GoBalticTransport website",
        submittedAt: new Date().toISOString(),
      });

      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: payload.toString(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || "Failed to send message");
      }

      return response;
    },
    onSuccess: () => {
      toast({
        title: language === 'en' ? "Message sent" 
          : language === 'fr' ? "Message envoyé"
          : language === 'de' ? "Nachricht gesendet"
          : language === 'pl' ? "Wiadomość wysłana"
          : "Žinutė išsiųsta",
        description: language === 'en' 
          ? "We've received your message and will get back to you shortly."
          : language === 'fr'
          ? "Nous avons reçu votre message et nous vous répondrons dans les plus brefs délais."
          : language === 'de'
          ? "Wir haben Ihre Nachricht erhalten und werden uns in Kürze bei Ihnen melden."
          : language === 'pl'
          ? "Otrzymaliśmy Twoją wiadomość i wkrótce się z Tobą skontaktujemy."
          : "Gavome jūsų užklausą ir netrukus su jumis susisieksime.",
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: ['/api/quotes'] });
    },
    onError: (error: Error) => {
      toast({
        title: language === 'en' ? "Error" 
          : language === 'fr' ? "Erreur"
          : language === 'de' ? "Fehler"
          : language === 'pl' ? "Błąd"
          : "Klaida",
        description: error.message || (language === 'en' 
          ? "There was a problem sending your message. Please try again."
          : language === 'fr'
          ? "Un problème est survenu lors de l'envoi de votre message. Veuillez réessayer."
          : language === 'de'
          ? "Beim Senden Ihrer Nachricht ist ein Problem aufgetreten. Bitte versuchen Sie es erneut."
          : language === 'pl'
          ? "Wystąpił problem podczas wysyłania wiadomości. Spróbuj ponownie."
          : "Įvyko klaida siunčiant žinutę. Prašome bandyti dar kartą."),
        variant: "destructive",
      });
    },
  });

  function onSubmit(data: FormValues) {
    mutation.mutate(data);
  }

  return (
    <Card className="bg-gray-50">
      <CardContent className="p-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {language === 'en' ? 'Full Name' 
                      : language === 'fr' ? 'Nom Complet'
                      : language === 'de' ? 'Vollständiger Name'
                      : language === 'pl' ? 'Imię i Nazwisko'
                      : 'Vardas Pavardė'}
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder={language === 'en' ? 'Your name' 
                        : language === 'fr' ? 'Votre nom'
                        : language === 'de' ? 'Ihr Name'
                        : language === 'pl' ? 'Twoje imię i nazwisko'
                        : 'Jūsų vardas ir pavardė'} 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {language === 'en' ? 'Email' 
                      : language === 'fr' ? 'E-mail'
                      : language === 'de' ? 'E-Mail'
                      : language === 'pl' ? 'E-mail'
                      : 'El. paštas'}
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder={language === 'en' ? 'Your email' 
                        : language === 'fr' ? 'Votre e-mail'
                        : language === 'de' ? 'Ihre E-Mail'
                        : language === 'pl' ? 'Twój e-mail'
                        : 'Jūsų el. paštas'} 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {language === 'en' ? 'Phone' 
                      : language === 'fr' ? 'Téléphone'
                      : language === 'de' ? 'Telefon'
                      : language === 'pl' ? 'Telefon'
                      : 'Telefonas'}
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder={language === 'en' ? 'Your phone number' 
                        : language === 'fr' ? 'Votre numéro de téléphone'
                        : language === 'de' ? 'Ihre Telefonnummer'
                        : language === 'pl' ? 'Twój numer telefonu'
                        : 'Jūsų telefono numeris'} 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="serviceType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {language === 'en' ? 'Service Type' 
                      : language === 'fr' ? 'Type de service'
                      : language === 'de' ? 'Servicetyp'
                      : language === 'pl' ? 'Rodzaj usługi'
                      : 'Paslaugos tipas'}
                    </FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={language === 'en' ? 'Select a service' 
                          : language === 'fr' ? 'Sélectionner un service'
                          : language === 'de' ? 'Wählen Sie einen Service'
                          : language === 'pl' ? 'Wybierz usługę'
                          : 'Pasirinkite paslaugą'} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="individual">
                          {language === 'en' ? 'Car Transportation' 
                          : language === 'fr' ? 'Transport de voitures'
                          : language === 'de' ? 'Autotransport'
                          : language === 'pl' ? 'Transport samochodów'
                          : 'Automobilių transportavimas'}
                        </SelectItem>
                        <SelectItem value="cargo">
                          {language === 'en' ? 'Cargo Transportation' 
                          : language === 'fr' ? 'Transport de fret'
                          : language === 'de' ? 'Frachttransport'
                          : language === 'pl' ? 'Transport ładunków'
                          : 'Krovinių gabenimas'}
                        </SelectItem>
                        <SelectItem value="luxury">
                          {language === 'en' ? 'Luxury Vehicles' 
                          : language === 'fr' ? 'Véhicules de luxe'
                          : language === 'de' ? 'Luxusfahrzeuge'
                          : language === 'pl' ? 'Pojazdy luksusowe'
                          : 'Prabangūs automobiliai'}
                        </SelectItem>
                        <SelectItem value="other">
                          {language === 'en' ? 'Other' 
                          : language === 'fr' ? 'Autre'
                          : language === 'de' ? 'Andere'
                          : language === 'pl' ? 'Inne'
                          : 'Kita'}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="pickupLocation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {language === 'en' ? 'Pick up location' 
                      : language === 'fr' ? 'Lieu de prise en charge'
                      : language === 'de' ? 'Abholort'
                      : language === 'pl' ? 'Miejsce odbioru'
                      : 'Paėmimo vieta'}
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder={language === 'en' ? 'Origin city/address' 
                        : language === 'fr' ? 'Ville/adresse d\'origine'
                        : language === 'de' ? 'Ursprungsstadt/Adresse'
                        : language === 'pl' ? 'Miasto/adres pochodzenia'
                        : 'Išvykimo miestas/adresas'} 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="deliveryPlace"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {language === 'en' ? 'Delivery place' 
                      : language === 'fr' ? 'Lieu de livraison'
                      : language === 'de' ? 'Lieferort'
                      : language === 'pl' ? 'Miejsce dostawy'
                      : 'Pristatymo vieta'}
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder={language === 'en' ? 'Destination city/address' 
                        : language === 'fr' ? 'Ville/adresse de destination'
                        : language === 'de' ? 'Zielstadt/Adresse'
                        : language === 'pl' ? 'Miasto/adres docelowy'
                        : 'Pristatymo miestas/adresas'} 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="cargoDetails"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {language === 'en' ? 'Cargo details' 
                    : language === 'fr' ? 'Détails du fret'
                    : language === 'de' ? 'Frachtdetails'
                    : language === 'pl' ? 'Szczegóły ładunku'
                    : 'Krovinio detalės'}
                  </FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder={language === 'en' 
                        ? 'Please provide details about your cargo...' 
                        : language === 'fr'
                        ? 'Veuillez fournir des détails sur votre fret...'
                        : language === 'de'
                        ? 'Bitte geben Sie Details zu Ihrer Fracht an...'
                        : language === 'pl'
                        ? 'Prosimy o podanie szczegółów dotyczących ładunku...'
                        : 'Prašome pateikti išsamią informaciją apie jūsų krovinį...'} 
                      className="min-h-[120px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary-700"
              disabled={mutation.isPending}
            >
              {mutation.isPending 
                ? (language === 'en' ? "Sending..." 
                   : language === 'fr' ? "Envoi en cours..."
                   : language === 'de' ? "Wird gesendet..."
                   : language === 'pl' ? "Wysyłanie..."
                   : "Siunčiama...") 
                : (language === 'en' ? "Send Message" 
                   : language === 'fr' ? "Envoyer le message"
                   : language === 'de' ? "Nachricht senden"
                   : language === 'pl' ? "Wyślij wiadomość"
                   : "Siųsti")}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ContactForm;
