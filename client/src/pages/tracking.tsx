import { useState } from "react";
import { useLocation, useParams, useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Package, Truck, Map, Clock, Calendar, Info, AlertCircle, PackageCheck, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Form schema for tracking number
const trackingFormSchema = z.object({
  trackingNumber: z.string().min(6, {
    message: "Tracking number must be at least 6 characters",
  }),
});

type TrackingFormValues = z.infer<typeof trackingFormSchema>;

// Helper function to format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};

// Helper function to get the status icon and color
const getStatusInfo = (status: string) => {
  switch (status) {
    case "pending":
      return { 
        icon: <Clock className="h-6 w-6" />, 
        color: "text-yellow-500",
        bgColor: "bg-yellow-100" 
      };
    case "in_transit":
      return { 
        icon: <Truck className="h-6 w-6" />, 
        color: "text-blue-500",
        bgColor: "bg-blue-100" 
      };
    case "customs_clearance":
      return { 
        icon: <Package className="h-6 w-6" />, 
        color: "text-orange-500",
        bgColor: "bg-orange-100" 
      };
    case "out_for_delivery":
      return { 
        icon: <Map className="h-6 w-6" />, 
        color: "text-indigo-500",
        bgColor: "bg-indigo-100" 
      };
    case "delivered":
      return { 
        icon: <CheckCircle2 className="h-6 w-6" />, 
        color: "text-green-500",
        bgColor: "bg-green-100" 
      };
    default:
      return { 
        icon: <AlertCircle className="h-6 w-6" />, 
        color: "text-gray-500",
        bgColor: "bg-gray-100" 
      };
  }
};

// Helper function to get human-readable status
const getStatusText = (status: string) => {
  switch (status) {
    case "pending":
      return "Pending";
    case "in_transit":
      return "In Transit";
    case "customs_clearance":
      return "Customs Clearance";
    case "out_for_delivery":
      return "Out for Delivery";
    case "delivered":
      return "Delivered";
    default:
      return "Unknown";
  }
};

const TrackingDetails = ({ trackingNumber }: { trackingNumber: string }) => {
  const { t } = useLanguage();
  
  const { data, isLoading, isError } = useQuery({
    queryKey: ['/api/track', trackingNumber],
    queryFn: () => apiRequest("GET", `/api/track/${trackingNumber}`),
    enabled: !!trackingNumber,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center my-12">
        <div className="flex flex-col items-center">
          <Package className="h-12 w-12 text-primary animate-pulse mb-4" />
          <p className="text-lg font-medium">{t('tracking.loading')}</p>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <Alert variant="destructive" className="my-8">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>{t('tracking.error.title')}</AlertTitle>
        <AlertDescription>
          {t('tracking.error.description')}
        </AlertDescription>
      </Alert>
    );
  }

  const shipment = data;
  const statusInfo = getStatusInfo(shipment.status);

  return (
    <div className="mt-8">
      <Alert variant="default" className="bg-primary/10 border-primary/30 mb-8">
        <PackageCheck className="h-4 w-4 text-primary" />
        <AlertTitle className="text-primary">{t('tracking.found.title')}</AlertTitle>
        <AlertDescription>
          {t('tracking.found.description')}
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-6">
        {/* Status Card */}
        <Card className="p-6 shadow-md">
          <div className="flex items-center space-x-4 mb-4">
            <div className={`p-3 rounded-full ${statusInfo.bgColor}`}>
              {statusInfo.icon}
            </div>
            <div>
              <h3 className="text-lg font-semibold">{t('tracking.status')}</h3>
              <p className={`${statusInfo.color} font-bold`}>
                {getStatusText(shipment.status)}
              </p>
            </div>
          </div>
          {shipment.currentLocation && (
            <div className="mt-2">
              <p className="text-sm text-gray-600">{t('tracking.currentLocation')}</p>
              <p className="font-medium">{shipment.currentLocation}</p>
            </div>
          )}
        </Card>
        
        {/* Estimated Delivery */}
        <Card className="p-6 shadow-md">
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 rounded-full bg-primary/10">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">{t('tracking.estimatedDelivery')}</h3>
              <p className="font-bold">
                {shipment.estimatedDeliveryDate 
                  ? formatDate(shipment.estimatedDeliveryDate) 
                  : t('tracking.notAvailable')}
              </p>
            </div>
          </div>
        </Card>
        
        {/* Route Info */}
        <Card className="p-6 shadow-md">
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 rounded-full bg-primary/10">
              <Map className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">{t('tracking.route')}</h3>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div>
              <p className="text-gray-600">{t('tracking.origin')}</p>
              <p className="font-medium">{shipment.origin}</p>
            </div>
            <Truck className="h-5 w-5 text-gray-400 mx-2" />
            <div className="text-right">
              <p className="text-gray-600">{t('tracking.destination')}</p>
              <p className="font-medium">{shipment.destination}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Shipment Details */}
      <div className="grid grid-cols-1 gap-8 mt-8">
        <Card className="p-6 shadow-md">
          <h3 className="text-xl font-bold mb-4 flex items-center">
            <Info className="h-5 w-5 mr-2 text-primary" />
            {t('tracking.details')}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-700">{t('tracking.shipmentInfo')}</h4>
              <Separator className="my-2" />
              <div className="space-y-3 mt-4">
                <div>
                  <p className="text-sm text-gray-600">{t('tracking.trackingNumber')}</p>
                  <p className="font-medium">{shipment.trackingNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">{t('tracking.vehicleModel')}</p>
                  <p className="font-medium">{shipment.vehicleModel}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">{t('tracking.createdDate')}</p>
                  <p className="font-medium">{formatDate(shipment.createdAt)}</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-700">{t('tracking.customerInfo')}</h4>
              <Separator className="my-2" />
              <div className="space-y-3 mt-4">
                <div>
                  <p className="text-sm text-gray-600">{t('tracking.customerName')}</p>
                  <p className="font-medium">{shipment.customerName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">{t('tracking.customerEmail')}</p>
                  <p className="font-medium">{shipment.customerEmail}</p>
                </div>
              </div>
            </div>
          </div>

          {shipment.notes && (
            <div className="mt-6">
              <h4 className="font-semibold text-gray-700">{t('tracking.notes')}</h4>
              <Separator className="my-2" />
              <p className="text-gray-800 mt-2">{shipment.notes}</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

const TrackingForm = () => {
  const { t } = useLanguage();
  const [, setLocation] = useLocation();
  
  const form = useForm<TrackingFormValues>({
    resolver: zodResolver(trackingFormSchema),
    defaultValues: {
      trackingNumber: "",
    },
  });

  function onSubmit(data: TrackingFormValues) {
    setLocation(`/tracking/${data.trackingNumber}`);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-md mx-auto">
        <div className="flex flex-col sm:flex-row w-full gap-2">
          <FormField
            control={form.control}
            name="trackingNumber"
            render={({ field }) => (
              <FormItem className="flex-grow">
                <FormControl>
                  <Input 
                    placeholder={t('tracking.form.placeholder')} 
                    {...field} 
                    className="h-12"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button 
            type="submit" 
            className="h-12 px-6 bg-primary hover:bg-primary-700"
          >
            {t('tracking.form.submit')}
          </Button>
        </div>
      </form>
    </Form>
  );
};

const TrackingHeader = () => {
  const { t } = useLanguage();
  
  return (
    <div className="text-center mb-10">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
        {t('tracking.title')}
      </h1>
      <p className="text-gray-600 max-w-2xl mx-auto">
        {t('tracking.subtitle')}
      </p>
    </div>
  );
};

const Tracking = () => {
  const { trackingNumber } = useParams();
  const [match] = useRoute("/tracking/:trackingNumber");
  
  return (
    <div className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <TrackingHeader />
      
      {!match && <TrackingForm />}
      
      {match && trackingNumber && <TrackingDetails trackingNumber={trackingNumber} />}
    </div>
  );
};

export default Tracking;