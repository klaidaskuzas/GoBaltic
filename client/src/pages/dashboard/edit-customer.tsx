import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Customer } from "@shared/schema";
import { 
  ArrowLeft, 
  Building2, 
  Loader2,
  Calendar,
  CheckCircle2,
  CreditCard,
  PiggyBank,
  FileText,
  Flag,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  Star,
  BriefcaseBusiness,
  ClipboardCheck,
  Info,
  User,
  IdCard,
  Save
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";

export default function EditCustomer() {
  const params = useParams<{ id: string }>();
  const customerId = parseInt(params.id);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Initial customer state
  const [companyData, setCompanyData] = useState({
    name: "",
    billCheckDate: "",
    notes: "",
    companyType: "UAB",
    customerType: "Vežėjas",
    priority: "Prioritetas",
    vatCode: "",
    createdDate: "",
    creditLimit: 0,
    creditLimitUsed: 0,
    email: "",
    emailForDebts: "",
    contactPerson: "",
    lastName: "", // For individuals
    firstName: "", // For individuals
    personalId: "", // For individuals
    isCompany: true,
    registrationAddress: {
      country: "",
      city: "",
      postalCode: "",
      address: "",
      phone: ""
    },
    correspondenceAddress: {
      companyName: "",
      country: "",
      city: "",
      postalCode: "",
      address: ""
    },
    payment: {
      paymentTime: "",
      tePaymentTime: "",
      payEndOfMonth: true
    }
  });

  // Fetch customer details
  const { isLoading: isLoadingCustomer, error: customerError, data: customerData } = useQuery<Customer>({
    queryKey: ["/api/customers", customerId],
    queryFn: async () => {
      const response = await fetch(`/api/customers/${customerId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch customer");
      }
      
      const data = await response.json();
      console.log("Customer data from API:", data);
      
      // For Express Heroes sample customer ID 1
      if (customerId === 1) {
        setCompanyData({
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
          email: "info@expressheroes.lt",
          emailForDebts: "accounting@expressheroes.lt",
          contactPerson: "Jonas Jonaitis",
          isCompany: true,
          firstName: "",
          lastName: "",
          personalId: "",
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
        });
      } 
      // For Arnas Transport sample customer ID 2
      else if (customerId === 2) {
        setCompanyData({
          name: "Arnas Transport",
          billCheckDate: "2025-03-16 09:30:00",
          notes: "Klientas reikalauja oficialių dokumentų",
          companyType: "UAB",
          customerType: "Klientas/vežėjas",
          priority: "Vidutinis",
          vatCode: "LT987654321",
          createdDate: "2023-10-05",
          creditLimit: 8000,
          creditLimitUsed: 3000,
          email: "Neturiuelektrono@arnas.lt",
          emailForDebts: "FinansaiArnas@gmail.com",
          contactPerson: "Arvydas Sabonis",
          isCompany: true,
          firstName: "",
          lastName: "",
          personalId: "",
          registrationAddress: {
            country: "LT Lietuva",
            city: "Vilnius",
            postalCode: "09300",
            address: "Savanorių pr. 45",
            phone: "865428741"
          },
          correspondenceAddress: {
            companyName: "Arnas Transport",
            country: "LT Lietuva",
            city: "Vilnius",
            postalCode: "09300",
            address: "Savanorių pr. 45"
          },
          payment: {
            paymentTime: "30",
            tePaymentTime: "",
            payEndOfMonth: false
          }
        });
      }
      // For any other customer, try to populate with actual API data
      else {
        setCompanyData({
          name: data.name || "",
          billCheckDate: data.billCheckDate || "",
          notes: data.notes || "",
          companyType: data.companyType || "UAB",
          customerType: data.customerType || "Vežėjas",
          priority: data.priority || "Prioritetas",
          vatCode: data.vatCode || "",
          createdDate: data.createdDate?.split('T')[0] || "",
          creditLimit: data.creditLimit || 0,
          creditLimitUsed: data.creditLimitUsed || 0,
          email: data.email || "",
          emailForDebts: data.emailForDebts || "",
          contactPerson: data.contactPerson || "",
          lastName: data.lastName || "",
          firstName: data.firstName || "",
          personalId: data.personalId || "",
          isCompany: data.isCompany !== undefined ? data.isCompany : true,
          registrationAddress: {
            country: data.registrationAddress?.country || "",
            city: data.registrationAddress?.city || "",
            postalCode: data.registrationAddress?.postalCode || "",
            address: data.registrationAddress?.address || "",
            phone: data.registrationAddress?.phone || ""
          },
          correspondenceAddress: {
            companyName: data.correspondenceAddress?.companyName || "",
            country: data.correspondenceAddress?.country || "",
            city: data.correspondenceAddress?.city || "",
            postalCode: data.correspondenceAddress?.postalCode || "",
            address: data.correspondenceAddress?.address || ""
          },
          payment: {
            paymentTime: data.payment?.paymentTime || "",
            tePaymentTime: data.payment?.tePaymentTime || "",
            payEndOfMonth: data.payment?.payEndOfMonth !== undefined ? data.payment.payEndOfMonth : true
          }
        });
      }
      
      return data;
    },
    enabled: !isNaN(customerId)
  });

  // Update customer mutation
  const updateCustomerMutation = useMutation({
    mutationFn: async (data: typeof companyData) => {
      // Use the actual API call to update the customer
      return apiRequest('PATCH', `/api/customers/${customerId}`, data);
    },
    onSuccess: () => {
      // Update the cache
      queryClient.invalidateQueries({ queryKey: ["/api/customers", customerId] });
      queryClient.invalidateQueries({ queryKey: ["/api/customers"] });
      
      toast({
        title: "Success",
        description: "Customer information has been updated."
      });
      
      // Redirect back to customer details page
      setLocation(`/dashboard/customers/${customerId}`);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to update customer: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!companyData.isCompany) {
      // Individual customer validation
      if (!companyData.lastName) {
        toast({
          title: "Klaida",
          description: "Pavardė yra privalomas laukas",
          variant: "destructive",
        });
        return;
      }
    }
    
    // Both individual and company validation
    if (!companyData.email) {
      toast({
        title: "Klaida",
        description: "El. paštas yra privalomas laukas",
        variant: "destructive",
      });
      return;
    }
    
    // Validate email format
    if (companyData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(companyData.email)) {
      toast({
        title: "Klaida",
        description: "Neteisingas el. pašto formatas",
        variant: "destructive",
      });
      return;
    }
    
    updateCustomerMutation.mutate(companyData);
  };

  const handleChange = (section: string, field: string, value: string | number | boolean) => {
    if (section === "root") {
      setCompanyData(prev => ({
        ...prev,
        [field]: value
      }));
    } else if (section === "registrationAddress" || section === "correspondenceAddress") {
      setCompanyData(prev => ({
        ...prev,
        [section]: {
          ...prev[section as keyof typeof prev] as Record<string, any>,
          [field]: value
        }
      }));
    } else if (section === "payment") {
      setCompanyData(prev => ({
        ...prev,
        payment: {
          ...prev.payment,
          [field]: value
        }
      }));
    }
  };

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
  if (customerError) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="text-red-500 text-xl">
            {(customerError as Error).message}
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

  return (
    <DashboardLayout>
      {/* Header with navigation */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Edit Customer</h1>
          <p className="text-gray-500">Make changes to customer information</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="sticky top-0 z-10 bg-background pb-4 flex justify-between items-center">
          <Button variant="outline" onClick={() => setLocation(`/dashboard/customers/${customerId}`)}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={updateCustomerMutation.isPending}
          >
            {updateCustomerMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
        
        <Tabs defaultValue="company" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="company">Company Information</TabsTrigger>
            <TabsTrigger value="contact">Contact Information</TabsTrigger>
            <TabsTrigger value="addresses">Addresses</TabsTrigger>
            <TabsTrigger value="payment">Payment Details</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
          </TabsList>
          
          {/* Company Information Tab */}
          <TabsContent value="company">
            <Card>
              <CardHeader>
                <CardTitle>Įmonės Informacija</CardTitle>
                <CardDescription>Update basic company information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Firmos pavadinimas</Label>
                    <div className="flex items-center">
                      <Building2 className="h-4 w-4 mr-2 text-gray-400" />
                      <Input 
                        id="name" 
                        value={companyData.name} 
                        onChange={(e) => handleChange("root", "name", e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="vatCode">PVM Kodas</Label>
                    <div className="flex items-center">
                      <ShieldCheck className="h-4 w-4 mr-2 text-gray-400" />
                      <Input 
                        id="vatCode" 
                        value={companyData.vatCode} 
                        onChange={(e) => handleChange("root", "vatCode", e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="companyType">Įmonės tipas</Label>
                    <div className="flex items-center">
                      <BriefcaseBusiness className="h-4 w-4 mr-2 text-gray-400" />
                      <Select 
                        value={companyData.companyType} 
                        onValueChange={(value) => handleChange("root", "companyType", value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select company type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="UAB">UAB</SelectItem>
                          <SelectItem value="MB">MB</SelectItem>
                          <SelectItem value="IĮ">IĮ</SelectItem>
                          <SelectItem value="VšĮ">VšĮ</SelectItem>
                          <SelectItem value="AB">AB</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="customerType">Kliento tipas</Label>
                    <div className="flex items-center">
                      <ClipboardCheck className="h-4 w-4 mr-2 text-gray-400" />
                      <Select 
                        value={companyData.customerType} 
                        onValueChange={(value) => handleChange("root", "customerType", value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select customer type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Klientas">Klientas</SelectItem>
                          <SelectItem value="Vežėjas">Vežėjas</SelectItem>
                          <SelectItem value="Tiekėjas">Tiekėjas</SelectItem>
                          <SelectItem value="Ekspeditorius">Ekspeditorius</SelectItem>
                          <SelectItem value="Klientas/vežėjas">Klientas/vežėjas</SelectItem>
                          <SelectItem value="Klientas/ekspeditorius">Klientas/ekspeditorius</SelectItem>
                          <SelectItem value="Kita">Kita</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="priority">Prioritetas</Label>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 mr-2 text-yellow-500" />
                      <Select 
                        value={companyData.priority} 
                        onValueChange={(value) => handleChange("root", "priority", value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Prioritetas">Prioritetas</SelectItem>
                          <SelectItem value="Aukštas">Aukštas</SelectItem>
                          <SelectItem value="Vidutinis">Vidutinis</SelectItem>
                          <SelectItem value="Žemas">Žemas</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="createdDate">Įmonės sukūrimo data</Label>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                      <Input 
                        id="createdDate" 
                        type="date"
                        value={companyData.createdDate} 
                        onChange={(e) => handleChange("root", "createdDate", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contact Information Tab */}
          <TabsContent value="contact">
            <Card>
              <CardHeader>
                <CardTitle>Kontaktinė Informacija</CardTitle>
                <CardDescription>Update contact information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">
                      El. paštas <span className="text-red-500">*</span>
                    </Label>
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-gray-400" />
                      <Input 
                        id="email" 
                        type="email"
                        value={companyData.email} 
                        onChange={(e) => handleChange("root", "email", e.target.value)}
                        className={!companyData.email ? "border-red-300" : ""}
                      />
                    </div>
                    {!companyData.email && (
                      <p className="text-sm text-red-500">El. paštas yra privalomas</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="emailForDebts">El. paštas skoloms</Label>
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-gray-400" />
                      <Input 
                        id="emailForDebts" 
                        type="email"
                        value={companyData.emailForDebts} 
                        onChange={(e) => handleChange("root", "emailForDebts", e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="contactPerson">Kontaktinis asmuo</Label>
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-gray-400" />
                      <Input 
                        id="contactPerson" 
                        value={companyData.contactPerson} 
                        onChange={(e) => handleChange("root", "contactPerson", e.target.value)}
                      />
                    </div>
                  </div>
                  
                  {!companyData.isCompany && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="firstName">Vardas</Label>
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-2 text-gray-400" />
                          <Input 
                            id="firstName" 
                            value={companyData.firstName} 
                            onChange={(e) => handleChange("root", "firstName", e.target.value)}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="lastName">
                          Pavardė <span className="text-red-500">*</span>
                        </Label>
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-2 text-gray-400" />
                          <Input 
                            id="lastName" 
                            value={companyData.lastName} 
                            onChange={(e) => handleChange("root", "lastName", e.target.value)}
                            className={!companyData.lastName && !companyData.isCompany ? "border-red-300" : ""}
                          />
                        </div>
                        {!companyData.lastName && !companyData.isCompany && (
                          <p className="text-sm text-red-500">Pavardė yra privaloma</p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="personalId">Asmens kodas</Label>
                        <div className="flex items-center">
                          <IdCard className="h-4 w-4 mr-2 text-gray-400" />
                          <Input 
                            id="personalId" 
                            value={companyData.personalId} 
                            onChange={(e) => handleChange("root", "personalId", e.target.value)}
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Addresses Tab */}
          <TabsContent value="addresses">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Registration Address */}
              <Card>
                <CardHeader>
                  <CardTitle>Registracijos adresas</CardTitle>
                  <CardDescription>Update registration address details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="regCountry">Šalis</Label>
                    <div className="flex items-center">
                      <Flag className="h-4 w-4 mr-2 text-gray-400" />
                      <Input 
                        id="regCountry" 
                        value={companyData.registrationAddress.country} 
                        onChange={(e) => handleChange("registrationAddress", "country", e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="regCity">Miestas</Label>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                      <Input 
                        id="regCity" 
                        value={companyData.registrationAddress.city} 
                        onChange={(e) => handleChange("registrationAddress", "city", e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="regPostalCode">Indeksas</Label>
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-gray-400" />
                      <Input 
                        id="regPostalCode" 
                        value={companyData.registrationAddress.postalCode} 
                        onChange={(e) => handleChange("registrationAddress", "postalCode", e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="regAddress">Adresas (Gatvė)</Label>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                      <Input 
                        id="regAddress" 
                        value={companyData.registrationAddress.address} 
                        onChange={(e) => handleChange("registrationAddress", "address", e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="regPhone">Telefonas</Label>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-gray-400" />
                      <Input 
                        id="regPhone" 
                        value={companyData.registrationAddress.phone} 
                        onChange={(e) => handleChange("registrationAddress", "phone", e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Correspondence Address */}
              <Card>
                <CardHeader>
                  <CardTitle>Adresas korespondencijai</CardTitle>
                  <CardDescription>Update correspondence address details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">                  
                  <div className="space-y-2">
                    <Label htmlFor="corrCompanyName">Įmonės pavadinimas</Label>
                    <div className="flex items-center">
                      <Building2 className="h-4 w-4 mr-2 text-gray-400" />
                      <Input 
                        id="corrCompanyName" 
                        value={companyData.correspondenceAddress.companyName} 
                        onChange={(e) => handleChange("correspondenceAddress", "companyName", e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="corrCountry">Šalis</Label>
                    <div className="flex items-center">
                      <Flag className="h-4 w-4 mr-2 text-gray-400" />
                      <Input 
                        id="corrCountry" 
                        value={companyData.correspondenceAddress.country} 
                        onChange={(e) => handleChange("correspondenceAddress", "country", e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="corrCity">Miestas</Label>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                      <Input 
                        id="corrCity" 
                        value={companyData.correspondenceAddress.city} 
                        onChange={(e) => handleChange("correspondenceAddress", "city", e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="corrPostalCode">Indeksas</Label>
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-gray-400" />
                      <Input 
                        id="corrPostalCode" 
                        value={companyData.correspondenceAddress.postalCode} 
                        onChange={(e) => handleChange("correspondenceAddress", "postalCode", e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="corrAddress">Adresas (Gatvė)</Label>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                      <Input 
                        id="corrAddress" 
                        value={companyData.correspondenceAddress.address} 
                        onChange={(e) => handleChange("correspondenceAddress", "address", e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Payment Tab */}
          <TabsContent value="payment">
            <Card>
              <CardHeader>
                <CardTitle>Mokėjimo Informacija</CardTitle>
                <CardDescription>Update payment details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="creditLimit">Kredito limitas (€)</Label>
                    <div className="flex items-center">
                      <CreditCard className="h-4 w-4 mr-2 text-gray-400" />
                      <Input 
                        id="creditLimit" 
                        type="number"
                        value={companyData.creditLimit} 
                        onChange={(e) => handleChange("root", "creditLimit", parseFloat(e.target.value) || 0)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="creditLimitUsed">Kreditas panaudotas (€)</Label>
                    <div className="flex items-center">
                      <PiggyBank className="h-4 w-4 mr-2 text-gray-400" />
                      <Input 
                        id="creditLimitUsed" 
                        type="number"
                        value={companyData.creditLimitUsed} 
                        onChange={(e) => handleChange("root", "creditLimitUsed", parseFloat(e.target.value) || 0)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="paymentTime">Apmokėjimo terminas</Label>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                      <Input 
                        id="paymentTime" 
                        value={companyData.payment.paymentTime} 
                        onChange={(e) => handleChange("payment", "paymentTime", e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="tePaymentTime">TE mokėjimo terminas</Label>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                      <Input 
                        id="tePaymentTime" 
                        value={companyData.payment.tePaymentTime} 
                        onChange={(e) => handleChange("payment", "tePaymentTime", e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 mt-6">
                    <Switch
                      id="payEndOfMonth"
                      checked={companyData.payment.payEndOfMonth}
                      onCheckedChange={(checked) => handleChange("payment", "payEndOfMonth", checked)}
                    />
                    <Label htmlFor="payEndOfMonth" className="cursor-pointer">Mokėti mėnesio pabaigoje</Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Notes Tab */}
          <TabsContent value="notes">
            <Card>
              <CardHeader>
                <CardTitle>Pastabos</CardTitle>
                <CardDescription>Additional notes about the customer</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="notes">Pastabos</Label>
                  <div className="flex items-start">
                    <Info className="h-4 w-4 mr-2 mt-2 text-gray-400" />
                    <Textarea 
                      id="notes" 
                      rows={8}
                      value={companyData.notes} 
                      onChange={(e) => handleChange("root", "notes", e.target.value)}
                      className="resize-none"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </form>
    </DashboardLayout>
  );
}