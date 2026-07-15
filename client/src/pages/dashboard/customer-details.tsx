import { useQuery } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Customer, Shipment } from "@shared/schema";
import { 
  ArrowLeft, 
  Banknote,
  BriefcaseBusiness,
  Building2, 
  Calendar, 
  CheckCircle2,
  ClipboardCheck,
  CreditCard,
  Euro,
  FileEdit, 
  FileText,
  Flag, 
  Globe, 
  IdCard,
  Info, 
  Loader2, 
  Mail, 
  MapPin, 
  Megaphone,
  Phone,
  PiggyBank,
  ShieldCheck, 
  Star,
  Truck, 
  User,
  UserCircle 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";

export default function CustomerDetails() {
  const params = useParams<{ id: string }>();
  const customerId = parseInt(params.id);
  const [, setLocation] = useLocation();

  // Demo types for the customer details
  type CustomerType = 'company' | 'personal';
  
  // Demo data for company customer details (Express Heroes)
  const demoCompanyData = {
    name: "Express Heroes, UAB",
    billCheckDate: "2025-04-08 17:01:10",
    notes: "Visada patikrinti mokėtoją.\nKorespondencijos adresas turi buti toks koks uzsakyme.\nbutina irasyti uzsakymo numeri.\nAr klientui būtini originalūs dokumentai bus parašyta kliento užsakyme",
    companyType: "UAB",
    customerType: "Vežėjas",
    priority: "Prioritetas",
    vatCode: "LT100012204014",
    createdDate: "2022-06-15",
    creditLimit: 10000,
    creditLimitUsed: 6250,
    workStatus: "Neblokuotas",
    registrationAddress: {
      country: "LT Lietuva",
      city: "Kaunas",
      postalCode: "51327",
      address: "Pramonės pr. 13",
      phone: "865801932"
    },
    correspondenceAddress: {
      companyName: "",
      country: "LT Lietuva",
      city: "Žemaitkiemis",
      postalCode: "LT-54310",
      address: "Pirklių g. 5, Domeikavos sen."
    },
    payment: {
      paymentTime: "",
      tePaymentTime: "",
      payEndOfMonth: true
    }
  };
  
  // Demo data for personal customer details (Arnas Transport)
  const demoPersonalCustomerData = {
    firstName: "Arnas",
    lastName: "Transport",
    fullName: "Arnas Transport",
    personalId: "",
    priority: "Prioritetas",
    notes: "Visada patikrinti mokėtoją.\nKorespondencijos adresas turi buti toks koks uzsakyme.\nbutina irasyti uzsakymo numeri.\nAr klientui būtini originalūs dokumentai bus parašyta kliento užsakyme",
    email: "",
    phone: "865801932",
    payForCar: true,
    paymentAmount: 0,
    registrationAddress: {
      country: "LT Lietuva",
      city: "Kaunas",
      postalCode: "51327",
      address: "Pramonės pr. 13",
      phone: "865801932"
    }
  };

  // State for credit management
  const [creditLimit, setCreditLimit] = useState(demoCompanyData.creditLimit);
  const [creditLimitUsed, setCreditLimitUsed] = useState(demoCompanyData.creditLimitUsed);
  
  // State for managing work status
  const [workStatus, setWorkStatus] = useState(demoCompanyData.workStatus);
  
  // State to track previous credit status to detect changes
  const [prevCreditStatus, setPrevCreditStatus] = useState<'available' | 'depleted'>('available');
  
  // Update work status based on credit availability and send notification on status change
  useEffect(() => {
    const availableCredit = creditLimit - creditLimitUsed;
    const currentCreditStatus = availableCredit <= 0 ? 'depleted' : 'available';
    
    // Update work status
    if (availableCredit <= 0) {
      setWorkStatus("Blokuotas");
    } else {
      setWorkStatus("Neblokuotas");
    }
    
    // Check if status changed from available to depleted (credit reached 0)
    if (prevCreditStatus === 'available' && currentCreditStatus === 'depleted') {
      sendCreditNotification(demoCompanyData.name, 'depleted');
    }
    
    // Check if status changed from depleted to available (credit became available again)
    if (prevCreditStatus === 'depleted' && currentCreditStatus === 'available') {
      sendCreditNotification(demoCompanyData.name, 'available');
    }
    
    // Update previous status for next comparison
    setPrevCreditStatus(currentCreditStatus);
  }, [creditLimit, creditLimitUsed, prevCreditStatus, demoCompanyData.name]);
  
  // Function to send notification about credit status change
  const sendCreditNotification = async (customerName: string, status: 'depleted' | 'available') => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 1, // Admin user ID
          type: 'credit_alert',
          title: status === 'depleted' ? 'Kredito limitas išnaudotas' : 'Kreditas prieinamas',
          message: status === 'depleted' 
            ? `Klientas ${customerName} išnaudojo visą kredito limitą. Darbo statusas pakeistas į "Blokuotas".`
            : `Klientas ${customerName} vėl turi prieinamą kreditą. Darbo statusas pakeistas į "Neblokuotas".`,
          isRead: false,
          relatedEntityType: 'customer',
          relatedEntityId: customerId,
          priority: status === 'depleted' ? 'high' : 'normal',
        }),
      });
      
      if (!response.ok) {
        console.error('Failed to send credit notification');
      }
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  };

  // Fetch customer details
  const { data: customer, isLoading: isLoadingCustomer, error: customerError } = useQuery<Customer>({
    queryKey: ["/api/customers", customerId],
    queryFn: async () => {
      const response = await fetch(`/api/customers/${customerId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch customer");
      }
      return response.json();
    },
    enabled: !isNaN(customerId)
  });

  // Fetch customer shipments
  const { data: shipments = [], isLoading: isLoadingShipments } = useQuery<Shipment[]>({
    queryKey: ["/api/shipments", { customerId }],
    queryFn: async () => {
      const response = await fetch(`/api/shipments?customerId=${customerId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch shipments");
      }
      return response.json();
    },
    enabled: !isNaN(customerId)
  });

  // If customer ID is invalid
  if (isNaN(customerId)) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="text-red-500 text-xl">Invalid customer ID</div>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => setLocation("/dashboard/customers")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Customers
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  // Loading state
  if (isLoadingCustomer) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <div className="mt-4 text-lg">Loading customer information...</div>
        </div>
      </DashboardLayout>
    );
  }

  // Error state
  if (customerError || !customer) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="text-red-500 text-xl">
            {customerError ? (customerError as Error).message : "Customer not found"}
          </div>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => setLocation("/dashboard/customers")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Customers
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  // Determine if this is a company or personal customer
  const customerType: CustomerType = customerId === 1 ? 'company' : 'personal';
  
  // For demo purposes, we'll show the merged data based on customer type
  const enhancedCustomer = {
    ...customer,
    // Show different data based on customer type
    ...(customerType === 'company' 
      ? {
          companyName: demoCompanyData.name,
          notes: demoCompanyData.notes,
          // Other company specific data
          companyType: demoCompanyData.companyType,
          customerType: demoCompanyData.customerType,
          vatCode: demoCompanyData.vatCode,
          creditLimit: demoCompanyData.creditLimit,
          creditLimitUsed: demoCompanyData.creditLimitUsed,
          registrationAddress: demoCompanyData.registrationAddress,
          correspondenceAddress: demoCompanyData.correspondenceAddress,
          payment: demoCompanyData.payment,
          priority: demoCompanyData.priority,
          createdDate: demoCompanyData.createdDate,
        }
      : {
          fullName: demoPersonalCustomerData.fullName,
          firstName: demoPersonalCustomerData.firstName,
          lastName: demoPersonalCustomerData.lastName,
          personalId: demoPersonalCustomerData.personalId,
          priority: demoPersonalCustomerData.priority,
          notes: demoPersonalCustomerData.notes,
          email: demoPersonalCustomerData.email || customer.email,
          phone: demoPersonalCustomerData.phone,
          payForCar: demoPersonalCustomerData.payForCar,
          paymentAmount: demoPersonalCustomerData.paymentAmount,
          registrationAddress: demoPersonalCustomerData.registrationAddress
        }
    )
  };

  return (
    <DashboardLayout>
      {/* Header with navigation */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Customer Details</h1>
          <p className="text-gray-500">View and manage customer information</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setLocation("/dashboard/customers")}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Customers
          </Button>
          <Button onClick={() => setLocation(`/dashboard/edit-customer/${customerId}`)}>
            <FileEdit className="mr-2 h-4 w-4" /> Edit Customer
          </Button>
        </div>
      </div>

      {/* Customer overview */}
      <Card className="mb-8">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              {customerType === 'company' ? (
                <>
                  <CardTitle className="text-2xl">{demoCompanyData.name}</CardTitle>
                  <CardDescription>
                    <div className="flex items-center mt-1">
                      <Building2 className="h-4 w-4 mr-1 text-gray-400" />
                      <span>
                        <Badge variant="outline" className="mr-2">
                          {demoCompanyData.companyType}
                        </Badge>
                        <Badge variant="secondary">
                          {demoCompanyData.customerType}
                        </Badge>
                      </span>
                    </div>
                  </CardDescription>
                </>
              ) : (
                <>
                  <CardTitle className="text-2xl">{demoPersonalCustomerData.fullName}</CardTitle>
                  <CardDescription>
                    <div className="flex items-center mt-1">
                      <User className="h-4 w-4 mr-1 text-gray-400" />
                      <span>
                        <Badge variant="outline" className="mr-2">
                          Privatus asmuo
                        </Badge>
                      </span>
                    </div>
                  </CardDescription>
                </>
              )}
            </div>
            <div className="flex gap-2">
              <Badge variant="outline" className="flex items-center">
                <Star className="h-3.5 w-3.5 mr-1 text-yellow-500" />
                {customerType === 'company' ? demoCompanyData.priority : demoPersonalCustomerData.priority}
              </Badge>
              <Badge variant="outline" className="flex items-center">
                <Flag className="h-3.5 w-3.5 mr-1" />
                {customerType === 'company' 
                  ? demoCompanyData.registrationAddress.country.split(' ')[0]
                  : demoPersonalCustomerData.registrationAddress.country.split(' ')[0]
                }
              </Badge>
            </div>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">
          {/* Customer Info Grid */}
          {customerType === 'company' ? (
            // Company customer information panels
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Company Information */}
              <div>
                <h3 className="font-medium text-sm text-gray-500 uppercase mb-3">Įmonės Informacija</h3>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <Building2 className="h-5 w-5 mr-2 text-gray-400 mt-0.5" />
                    <div>
                      <p className="font-medium">Firmos pavadinimas</p>
                      <p>{demoCompanyData.name}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <ShieldCheck className="h-5 w-5 mr-2 text-gray-400 mt-0.5" />
                    <div>
                      <p className="font-medium">PVM Kodas</p>
                      <p>{demoCompanyData.vatCode}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <BriefcaseBusiness className="h-5 w-5 mr-2 text-gray-400 mt-0.5" />
                    <div>
                      <p className="font-medium">Įmonės tipas</p>
                      <p>{demoCompanyData.companyType}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <ClipboardCheck className="h-5 w-5 mr-2 text-gray-400 mt-0.5" />
                    <div>
                      <p className="font-medium">Kliento tipas</p>
                      <p>{demoCompanyData.customerType}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Star className="h-5 w-5 mr-2 text-yellow-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Prioritetas</p>
                      <p>{demoCompanyData.priority}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Calendar className="h-5 w-5 mr-2 text-gray-400 mt-0.5" />
                    <div>
                      <p className="font-medium">Įmonės sukūrimo data</p>
                      <p>{demoCompanyData.createdDate}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Registration Address */}
              <div>
                <h3 className="font-medium text-sm text-gray-500 uppercase mb-3">Registracijos adresas</h3>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <Flag className="h-5 w-5 mr-2 text-gray-400 mt-0.5" />
                    <div>
                      <p className="font-medium">Šalis</p>
                      <p>{demoCompanyData.registrationAddress.country}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 mr-2 text-gray-400 mt-0.5" />
                    <div>
                      <p className="font-medium">Miestas</p>
                      <p>{demoCompanyData.registrationAddress.city}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <FileText className="h-5 w-5 mr-2 text-gray-400 mt-0.5" />
                    <div>
                      <p className="font-medium">Indeksas</p>
                      <p>{demoCompanyData.registrationAddress.postalCode}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 mr-2 text-gray-400 mt-0.5" />
                    <div>
                      <p className="font-medium">Adresas (Gatvė)</p>
                      <p>{demoCompanyData.registrationAddress.address}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Phone className="h-5 w-5 mr-2 text-gray-400 mt-0.5" />
                    <div>
                      <p className="font-medium">Telefonas</p>
                      <a 
                        href={`tel:${demoCompanyData.registrationAddress.phone}`} 
                        className="text-blue-600 hover:underline"
                      >
                        {demoCompanyData.registrationAddress.phone}
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Correspondence Address */}
              <div>
                <h3 className="font-medium text-sm text-gray-500 uppercase mb-3">Adresas korespondencijai</h3>
                <div className="space-y-3">
                  {demoCompanyData.correspondenceAddress.companyName && (
                    <div className="flex items-start">
                      <Building2 className="h-5 w-5 mr-2 text-gray-400 mt-0.5" />
                      <div>
                        <p className="font-medium">Įmonės pavadinimas</p>
                        <p>{demoCompanyData.correspondenceAddress.companyName || "-"}</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-start">
                    <Flag className="h-5 w-5 mr-2 text-gray-400 mt-0.5" />
                    <div>
                      <p className="font-medium">Šalis</p>
                      <p>{demoCompanyData.correspondenceAddress.country}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 mr-2 text-gray-400 mt-0.5" />
                    <div>
                      <p className="font-medium">Miestas</p>
                      <p>{demoCompanyData.correspondenceAddress.city}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <FileText className="h-5 w-5 mr-2 text-gray-400 mt-0.5" />
                    <div>
                      <p className="font-medium">Indeksas</p>
                      <p>{demoCompanyData.correspondenceAddress.postalCode}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 mr-2 text-gray-400 mt-0.5" />
                    <div>
                      <p className="font-medium">Adresas (Gatvė)</p>
                      <p>{demoCompanyData.correspondenceAddress.address}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Payment Information for Company */}
              <div>
                <h3 className="font-medium text-sm text-gray-500 uppercase mb-3">Mokėjimo informacija</h3>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <Calendar className="h-5 w-5 mr-2 text-gray-400 mt-0.5" />
                    <div>
                      <p className="font-medium">Apmokėjimų nuskaitymas</p>
                      <p>{demoCompanyData.billCheckDate}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <CreditCard className="h-5 w-5 mr-2 text-gray-400 mt-0.5" />
                    <div>
                      <p className="font-medium">Atsiskaitymo laikas</p>
                      <p>{demoCompanyData.payment.paymentTime || "-"}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 mr-2 text-gray-400 mt-0.5" />
                    <div>
                      <p className="font-medium">Vežėjui mokama mėnesio pabaigoje</p>
                      <p>{demoCompanyData.payment.payEndOfMonth ? "Taip" : "Ne"}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <PiggyBank className="h-5 w-5 mr-2 text-gray-400 mt-0.5" />
                    <div>
                      <p className="font-medium">Kredito limitas</p>
                      <p>{creditLimit.toLocaleString()} €</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <PiggyBank className="h-5 w-5 mr-2 text-gray-400 mt-0.5" />
                    <div>
                      <p className="font-medium">Laisvas kreditas</p>
                      <div className="flex items-center">
                        <span className="mr-2">{(creditLimit - creditLimitUsed).toLocaleString()} €</span>
                        <Badge variant={creditLimitUsed > creditLimit * 0.8 ? "destructive" : "secondary"}>
                          {Math.round(100 - (creditLimitUsed / creditLimit) * 100)}% laisva
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start mt-4 border p-3 rounded-md">
                    <div className="w-full">
                      <p className="font-medium mb-2">Kredito valdymas (testavimui)</p>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-xs mb-1 block">Kredito limitas</label>
                          <div className="flex">
                            <Input 
                              type="number" 
                              value={creditLimit} 
                              onChange={(e) => setCreditLimit(Number(e.target.value))} 
                              className="w-full" 
                            />
                            <span className="ml-1 flex items-center">€</span>
                          </div>
                        </div>
                        <div>
                          <label className="text-xs mb-1 block">Panaudotas kreditas</label>
                          <div className="flex">
                            <Input 
                              type="number" 
                              value={creditLimitUsed} 
                              onChange={(e) => setCreditLimitUsed(Number(e.target.value))} 
                              className="w-full" 
                            />
                            <span className="ml-1 flex items-center">€</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <ShieldCheck className="h-5 w-5 mr-2 text-gray-400 mt-0.5" />
                    <div>
                      <p className="font-medium">Darbo statusas</p>
                      <div className="flex items-center">
                        <Badge variant={workStatus === "Blokuotas" ? "destructive" : "secondary"}>
                          {workStatus}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Personal customer information panels
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Personal Information */}
              <div>
                <h3 className="font-medium text-sm text-gray-500 uppercase mb-3">ASMENS INFORMACIJA</h3>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <User className="h-5 w-5 mr-2 text-gray-400 mt-0.5" />
                    <div>
                      <p className="font-medium">Vardas</p>
                      <p>{demoPersonalCustomerData.firstName}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <UserCircle className="h-5 w-5 mr-2 text-gray-400 mt-0.5" />
                    <div>
                      <p className="font-medium">Pavardė</p>
                      <p>{demoPersonalCustomerData.lastName}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <IdCard className="h-5 w-5 mr-2 text-gray-400 mt-0.5" />
                    <div>
                      <p className="font-medium">Asmens kodas</p>
                      <p>{demoPersonalCustomerData.personalId || "Nenurodytas"}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Star className="h-5 w-5 mr-2 text-yellow-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Prioritetas</p>
                      <p>{demoPersonalCustomerData.priority || "Vidutinis"}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div>
                <h3 className="font-medium text-sm text-gray-500 uppercase mb-3">ADRESAS</h3>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <Flag className="h-5 w-5 mr-2 text-gray-400 mt-0.5" />
                    <div>
                      <p className="font-medium">Šalis</p>
                      <p>{demoPersonalCustomerData.registrationAddress.country}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 mr-2 text-gray-400 mt-0.5" />
                    <div>
                      <p className="font-medium">Miestas</p>
                      <p>{demoPersonalCustomerData.registrationAddress.city}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <FileText className="h-5 w-5 mr-2 text-gray-400 mt-0.5" />
                    <div>
                      <p className="font-medium">Indeksas</p>
                      <p>{demoPersonalCustomerData.registrationAddress.postalCode}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 mr-2 text-gray-400 mt-0.5" />
                    <div>
                      <p className="font-medium">Adresas (Gatvė)</p>
                      <p>{demoPersonalCustomerData.registrationAddress.address}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h3 className="font-medium text-sm text-gray-500 uppercase mb-3">KONTAKTINĖ INFORMACIJA</h3>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <Mail className="h-5 w-5 mr-2 text-gray-400 mt-0.5" />
                    <div>
                      <p className="font-medium">El. paštas</p>
                      <p>{demoPersonalCustomerData.email || customer.email || "Nera@pasto.lt"}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Phone className="h-5 w-5 mr-2 text-gray-400 mt-0.5" />
                    <div>
                      <p className="font-medium">Telefonas</p>
                      <p>{demoPersonalCustomerData.phone}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Banknote className="h-5 w-5 mr-2 text-gray-400 mt-0.5" />
                    <div>
                      <p className="font-medium">Esam apmokėja automobilį</p>
                      <p>{demoPersonalCustomerData.payForCar ? "Taip" : "Ne"}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Euro className="h-5 w-5 mr-2 text-gray-400 mt-0.5" />
                    <div>
                      <p className="font-medium">Suma</p>
                      <p>{demoPersonalCustomerData.paymentAmount} €</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {customerType === 'personal' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div>
                <h3 className="font-medium text-sm text-gray-500 uppercase mb-3">PAPILDOMA KONTAKTINĖ INFORMACIJA</h3>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <Mail className="h-5 w-5 mr-2 text-gray-400 mt-0.5" />
                    <div>
                      <p className="font-medium">Email</p>
                      <p>{demoPersonalCustomerData.email || customer.email || "Nera@pasto.lt"}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Mail className="h-5 w-5 mr-2 text-gray-400 mt-0.5" />
                    <div>
                      <p className="font-medium">El_paštas_skoloms</p>
                      <p>{customer.emailForDebts || "Nenurodytas"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Additional Notes */}
          <div className="mt-6">
            <h3 className="font-medium text-sm text-gray-500 uppercase mb-3">Pastabos</h3>
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="flex">
                <Info className="h-5 w-5 mr-2 text-gray-400 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700 whitespace-pre-line">
                  {customerType === 'company' ? demoCompanyData.notes : demoPersonalCustomerData.notes}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabbed Content */}
      <Tabs defaultValue="shipments" className="mt-6">
        <TabsList className="mb-4">
          <TabsTrigger value="shipments">Shipments</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>
        
        {/* Shipments Tab */}
        <TabsContent value="shipments">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Shipments</CardTitle>
              <CardDescription>All shipments associated with this customer</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingShipments ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : shipments.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tracking #</TableHead>
                        <TableHead>Vehicle</TableHead>
                        <TableHead>Origin</TableHead>
                        <TableHead>Destination</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {shipments.map((shipment) => (
                        <TableRow key={shipment.id}>
                          <TableCell className="font-medium">{shipment.trackingNumber}</TableCell>
                          <TableCell>{shipment.vehicleModel}</TableCell>
                          <TableCell>{shipment.origin}</TableCell>
                          <TableCell>{shipment.destination}</TableCell>
                          <TableCell>
                            <Badge 
                              variant={
                                shipment.status === 'delivered' ? 'success' :
                                shipment.status === 'in_transit' ? 'default' :
                                shipment.status === 'pending' ? 'secondary' :
                                shipment.status === 'cancelled' ? 'destructive' :
                                'outline'
                              }
                            >
                              {shipment.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {shipment.createdAt && format(new Date(shipment.createdAt), 'MMM dd, yyyy')}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              asChild
                            >
                              <a href={`/dashboard/shipments/${shipment.id}`}>
                                View
                              </a>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Truck className="h-10 w-10 mx-auto mb-3 text-gray-300" />
                  <p>No shipments found for this customer</p>
                  <Button className="mt-4">Create New Shipment</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Activity Tab */}
        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Activity History</CardTitle>
              <CardDescription>Recent customer activity and interactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <Globe className="h-10 w-10 mx-auto mb-3 text-gray-300" />
                <p>No recent activity recorded for this customer</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Documents Tab */}
        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Documents</CardTitle>
              <CardDescription>Contracts, invoices, and other documents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <Info className="h-10 w-10 mx-auto mb-3 text-gray-300" />
                <p>No documents available for this customer</p>
                <div className="mt-6">
                  <div className="max-w-md mx-auto">
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 text-left mb-2">
                          Dokumento tipas
                        </label>
                        <Select defaultValue="license">
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Pasirinkite dokumento tipą" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="license">Licencija</SelectItem>
                            <SelectItem value="tech_reg">Transporto tech. regs. liudijimas</SelectItem>
                            <SelectItem value="cmr_insurance">CMR draudimas</SelectItem>
                            <SelectItem value="vehicle_reg">Tr. priemonės registracija</SelectItem>
                            <SelectItem value="other">Kita</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 text-left mb-2">
                          Aprašymas
                        </label>
                        <Input 
                          type="text"
                          placeholder="Dokumento aprašymas"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 text-left mb-2">
                            Išdavimo data
                          </label>
                          <Input 
                            type="date"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 text-left mb-2">
                            Galioja iki
                          </label>
                          <Input 
                            type="date"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 text-left mb-2">
                          Pastabos
                        </label>
                        <Textarea 
                          placeholder="Papildomos pastabos apie dokumentą"
                          rows={3}
                        />
                      </div>
                      
                      <div className="flex items-center justify-center w-full">
                        <label
                          htmlFor="dropzone-file"
                          className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                        >
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <svg
                              className="w-8 h-8 mb-3 text-gray-400"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 20 16"
                            >
                              <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                              />
                            </svg>
                            <p className="mb-2 text-sm text-gray-500">
                              <span className="font-semibold">Paspauskite norėdami įkelti</span> arba vilkite failą
                            </p>
                            <p className="text-xs text-gray-500">PDF, DOC, DOCX, JPG or PNG (Maks. dydis: 10MB)</p>
                          </div>
                          <input id="dropzone-file" type="file" className="hidden" />
                        </label>
                      </div>
                      
                      <Button className="w-full">Įkelti dokumentą</Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}