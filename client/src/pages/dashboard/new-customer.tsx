import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { ArrowLeft, Save, Building2, User } from "lucide-react";

export default function NewCustomer() {
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [customerType, setCustomerType] = useState<"company" | "individual" | null>(null);
  
  const [formData, setFormData] = useState({
    // Company details
    companyName: "",
    companyType: "UAB",
    customerType: "Klientas",
    priority: "Prioritetas",
    companyVat: "",
    
    // Registration address
    regCountry: "LT Lietuva",
    regCity: "",
    regPostalCode: "",
    regAddress: "",
    phone: "",
    
    // Correspondence address
    corrCompanyName: "",
    corrCountry: "LT Lietuva",
    corrCity: "",
    corrPostalCode: "",
    corrAddress: "",
    
    // Payment details
    paymentTime: "",
    payAtEndOfMonth: false,
    
    // Notes
    notes: "Visada patikrinti mokėtoją.\nKorespondencijos adresas turi buti toks koks uzsakyme.\nbutina irasyti uzsakymo numeri.\nAr klientui būtini originalūs dokumentai bus parašyta kliento užsakyme",
    
    // Additional info
    contactPerson: "",
    email: "",
    emailForDebts: "", // Only for company clients
    paymentBillingDate: new Date().toISOString().slice(0, 16),
    
    // Individual details (for private person)
    firstName: "",
    lastName: "",
    personalId: "",
    loansMoney: false, // New field for loan money toggle
    loanAmount: 0, // New field for loan amount
    isCompany: true
  });
  
  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  // Handle checkbox changes
  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData({
      ...formData,
      [name]: checked,
    });
  };
  
  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // If no customer type is selected, show a message and return
    if (customerType === null) {
      toast({
        title: "Klaida",
        description: "Pasirinkite kliento tipą: Įmonė arba Privatus asmuo",
        variant: "destructive",
      });
      return;
    }
    
    // Validate required fields based on customer type
    if (customerType === "individual") {
      // For private person, validate lastname and email
      if (!formData.lastName) {
        toast({
          title: "Klaida",
          description: "Pavardė yra privalomas laukas",
          variant: "destructive",
        });
        return;
      }
      
      if (!formData.email) {
        toast({
          title: "Klaida",
          description: "El. paštas yra privalomas laukas",
          variant: "destructive",
        });
        return;
      }
    } else if (customerType === "company") {
      // For company, validate company name and email
      if (!formData.companyName) {
        toast({
          title: "Klaida",
          description: "Įmonės pavadinimas yra privalomas laukas",
          variant: "destructive",
        });
        return;
      }
      
      if (!formData.email) {
        toast({
          title: "Klaida",
          description: "El. paštas yra privalomas laukas",
          variant: "destructive",
        });
        return;
      }
    }
    
    // Validate email format if provided
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast({
        title: "Klaida",
        description: "Neteisingas el. pašto formatas",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Prepare data for API based on customer type
      let customerData;
      
      if (customerType === "company") {
        customerData = {
          name: formData.contactPerson || "Unnamed Contact",
          email: formData.email || "",
          emailForDebts: formData.emailForDebts || "",
          phone: formData.phone || "",
          companyName: formData.companyName,
          companyVat: formData.companyVat,
          country: formData.regCountry,
          city: formData.regCity,
          address: formData.regAddress,
          postalCode: formData.regPostalCode,
          notes: formData.notes,
          customerType: formData.customerType,
          priority: formData.priority,
          paymentTerms: formData.paymentTime,
          correspondenceAddress: formData.corrAddress !== "" ? {
            companyName: formData.corrCompanyName,
            country: formData.corrCountry,
            city: formData.corrCity,
            address: formData.corrAddress,
            postalCode: formData.corrPostalCode
          } : null,
          payAtEndOfMonth: formData.payAtEndOfMonth,
          billingDate: formData.paymentBillingDate,
          workStatus: "Neblokuotas", // Default work status is "Neblokuotas"
          isCompany: true
        };
      } else {
        // For individual type
        customerData = {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email || "",
          phone: formData.phone || "",
          loansMoney: formData.loansMoney,
          loanAmount: formData.loanAmount,
          companyName: "", // Empty for individual
          companyVat: formData.personalId || "", // Store personal ID in the VAT field
          country: formData.regCountry,
          city: formData.regCity,
          address: formData.regAddress,
          postalCode: formData.regPostalCode,
          notes: formData.notes,
          customerType: "Privatus asmuo",
          priority: formData.priority,
          paymentTerms: formData.paymentTime,
          correspondenceAddress: formData.corrAddress !== "" ? {
            companyName: "",
            country: formData.corrCountry,
            city: formData.corrCity,
            address: formData.corrAddress,
            postalCode: formData.corrPostalCode
          } : null,
          payAtEndOfMonth: formData.payAtEndOfMonth,
          billingDate: formData.paymentBillingDate,
          workStatus: "Neblokuotas", // Default work status is "Neblokuotas"
          isCompany: false,
          firstName: formData.firstName,
          lastName: formData.lastName,
          personalId: formData.personalId
        };
      }
      
      // Send to API
      await apiRequest("POST", "/api/customers", customerData);
      
      // Show success message
      toast({
        title: "Klientas sukurtas",
        description: "Naujas klientas sėkmingai sukurtas",
      });
      
      // Invalidate customers query
      queryClient.invalidateQueries({ queryKey: ["/api/customers"] });
      
      // Navigate back to customers list
      setLocation("/dashboard/customers");
    } catch (error) {
      // Show error message
      toast({
        title: "Klaida",
        description: "Nepavyko sukurti naujo kliento",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Naujas klientas</h1>
          <p className="text-gray-500">Sukurti naują kliento įrašą</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setLocation("/dashboard/customers")}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Grįžti
          </Button>
          <Button 
            disabled={isSubmitting}
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Save className="mr-2 h-4 w-4" />
            Išsaugoti
          </Button>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Customer Type Selection */}
        {customerType === null && (
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-6">Pasirinkite kliento tipą</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Button 
                type="button"
                size="lg"
                className="h-32 text-xl"
                onClick={() => {
                  setCustomerType("company");
                  setFormData(prev => ({...prev, isCompany: true}));
                }}
              >
                <div className="flex flex-col items-center">
                  <Building2 className="h-12 w-12 mb-2" />
                  Įmonė
                </div>
              </Button>
              
              <Button
                type="button"
                size="lg"
                variant="outline"
                className="h-32 text-xl"
                onClick={() => {
                  setCustomerType("individual");
                  setFormData(prev => ({...prev, isCompany: false}));
                }}
              >
                <div className="flex flex-col items-center">
                  <User className="h-12 w-12 mb-2" />
                  Privatus asmuo
                </div>
              </Button>
            </div>
          </Card>
        )}
        
        {customerType !== null && (
          <>
            {/* Customer Type Badge and Change Option */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <Badge className="mr-2">
                  {customerType === "company" ? "Įmonė" : "Privatus asmuo"}
                </Badge>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setCustomerType(null)}
                >
                  Pakeisti
                </Button>
              </div>
            </div>
          </>
        )}
        
        {/* Private Individual Information - Only show if individual type is selected */}
        {customerType === "individual" && (
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Pagrindinė informacija</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Vardas <span className="text-red-500">*</span></Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="lastName">Pavardė <span className="text-red-500">*</span></Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="personalId">Asmens kodas</Label>
                <Input
                  id="personalId"
                  name="personalId"
                  value={formData.personalId}
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="priority">Prioritetas</Label>
                <Select 
                  value={formData.priority} 
                  onValueChange={(value) => handleSelectChange("priority", value)}
                >
                  <SelectTrigger id="priority">
                    <SelectValue placeholder="Pasirinkite prioritetą" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Prioritetas">Prioritetas</SelectItem>
                    <SelectItem value="Aukštas">Aukštas</SelectItem>
                    <SelectItem value="Vidutinis">Vidutinis</SelectItem>
                    <SelectItem value="Žemas">Žemas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">El. paštas <span className="text-red-500">*</span></Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Telefonas</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="865801932"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="loansMoney">Esam apmokėja automobilį</Label>
                  <div className="flex items-center">
                    <Checkbox 
                      id="loansMoney" 
                      checked={formData.loansMoney}
                      onCheckedChange={(checked) => 
                        handleCheckboxChange("loansMoney", checked === true)
                      }
                    />
                  </div>
                </div>
              </div>
              
              {formData.loansMoney && (
                <div className="space-y-2">
                  <Label htmlFor="loanAmount">Suma (€)</Label>
                  <Input
                    id="loanAmount"
                    name="loanAmount"
                    type="number"
                    value={formData.loanAmount}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value) || 0;
                      setFormData(prev => ({
                        ...prev,
                        loanAmount: value
                      }));
                    }}
                  />
                </div>
              )}
            </div>
          </Card>
        )}
        
        {/* Company Information - Only show if company type is selected */}
        {customerType === "company" && (
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Pagrindinė informacija</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Firmos pavadinimas <span className="text-red-500">*</span></Label>
                <Input
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="companyType">Įmonės tipas</Label>
                <Select 
                  value={formData.companyType} 
                  onValueChange={(value) => handleSelectChange("companyType", value)}
                >
                  <SelectTrigger id="companyType">
                    <SelectValue placeholder="Pasirinkite įmonės tipą" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UAB">UAB</SelectItem>
                    <SelectItem value="MB">MB</SelectItem>
                    <SelectItem value="IĮ">IĮ</SelectItem>
                    <SelectItem value="AB">AB</SelectItem>
                    <SelectItem value="VšĮ">VšĮ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="customerType">Kliento tipas</Label>
                <Select 
                  value={formData.customerType} 
                  onValueChange={(value) => handleSelectChange("customerType", value)}
                >
                  <SelectTrigger id="customerType">
                    <SelectValue placeholder="Pasirinkite kliento tipą" />
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
              
              <div className="space-y-2">
                <Label htmlFor="priority">Prioritetas</Label>
                <Select 
                  value={formData.priority} 
                  onValueChange={(value) => handleSelectChange("priority", value)}
                >
                  <SelectTrigger id="priority">
                    <SelectValue placeholder="Pasirinkite prioritetą" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Prioritetas">Prioritetas</SelectItem>
                    <SelectItem value="Aukštas">Aukštas</SelectItem>
                    <SelectItem value="Vidutinis">Vidutinis</SelectItem>
                    <SelectItem value="Žemas">Žemas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="companyVat">PVM kodas</Label>
                <Input
                  id="companyVat"
                  name="companyVat"
                  value={formData.companyVat}
                  onChange={handleChange}
                />
              </div>
            </div>
          </Card>
        )}
        
        {/* Only show the rest of the form if a customer type is selected */}
        {customerType !== null && (
          <>
            {/* Notes */}
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Pastabos</h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="notes">Pastabos</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={4}
                  />
                </div>
              </div>
            </Card>
            
            {/* Registration Address */}
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Adresas</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="regCountry">Šalis</Label>
                  <Select 
                    value={formData.regCountry} 
                    onValueChange={(value) => handleSelectChange("regCountry", value)}
                  >
                    <SelectTrigger id="regCountry">
                      <SelectValue placeholder="Pasirinkite šalį" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LT Lietuva">LT Lietuva</SelectItem>
                      <SelectItem value="PL Lenkija">PL Lenkija</SelectItem>
                      <SelectItem value="DE Vokietija">DE Vokietija</SelectItem>
                      <SelectItem value="LV Latvija">LV Latvija</SelectItem>
                      <SelectItem value="EE Estija">EE Estija</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="regCity">Miestas</Label>
                  <Input
                    id="regCity"
                    name="regCity"
                    value={formData.regCity}
                    onChange={handleChange}
                    placeholder="Kaunas"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="regPostalCode">Indeksas</Label>
                  <Input
                    id="regPostalCode"
                    name="regPostalCode"
                    value={formData.regPostalCode}
                    onChange={handleChange}
                    placeholder="51327"
                  />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="regAddress">Adresas (Gatvė)</Label>
                  <Input
                    id="regAddress"
                    name="regAddress"
                    value={formData.regAddress}
                    onChange={handleChange}
                    placeholder="Pramonės pr. 13"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefonas</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="865801932"
                  />
                </div>
              </div>
            </Card>
            
            {/* Correspondence Address - Only show for companies */}
            {customerType === "company" && (
              <Card className="p-6">
                <h3 className="text-lg font-medium mb-4">Adresas korespondencijai (jei skiriasi nuo registracijos)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="corrCompanyName">Įmonės pavadinimas</Label>
                    <Input
                      id="corrCompanyName"
                      name="corrCompanyName"
                      value={formData.corrCompanyName}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="corrCountry">Šalis</Label>
                    <Select 
                      value={formData.corrCountry} 
                      onValueChange={(value) => handleSelectChange("corrCountry", value)}
                    >
                      <SelectTrigger id="corrCountry">
                        <SelectValue placeholder="Pasirinkite šalį" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="LT Lietuva">LT Lietuva</SelectItem>
                        <SelectItem value="PL Lenkija">PL Lenkija</SelectItem>
                        <SelectItem value="DE Vokietija">DE Vokietija</SelectItem>
                        <SelectItem value="LV Latvija">LV Latvija</SelectItem>
                        <SelectItem value="EE Estija">EE Estija</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="corrCity">Miestas</Label>
                    <Input
                      id="corrCity"
                      name="corrCity"
                      value={formData.corrCity}
                      onChange={handleChange}
                      placeholder="Žemaitkiemis"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="corrPostalCode">Indeksas</Label>
                    <Input
                      id="corrPostalCode"
                      name="corrPostalCode"
                      value={formData.corrPostalCode}
                      onChange={handleChange}
                      placeholder="LT-54310"
                    />
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="corrAddress">Adresas (Gatvė)</Label>
                    <Input
                      id="corrAddress"
                      name="corrAddress"
                      value={formData.corrAddress}
                      onChange={handleChange}
                      placeholder="Pirklių g. 5, Domeikavos sen."
                    />
                  </div>
                </div>
              </Card>
            )}
            
            {/* Payment Information - Only show for companies */}
            {customerType === "company" && (
              <Card className="p-6">
                <h3 className="text-lg font-medium mb-4">Kaip atsiskaito</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="paymentTime">Atsiskaitymo laikas</Label>
                    <Select 
                      value={formData.paymentTime} 
                      onValueChange={(value) => handleSelectChange("paymentTime", value)}
                    >
                      <SelectTrigger id="paymentTime">
                        <SelectValue placeholder="Pasirinkite" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Karta per mėnesi">Karta per mėnesi</SelectItem>
                        <SelectItem value="Mėnesio dieną">Mėnesio dieną</SelectItem>
                        <SelectItem value="Einamas mėnuo +">Einamas mėnuo +</SelectItem>
                        <SelectItem value="Terminas +">Terminas +</SelectItem>
                        <SelectItem value="Atidėjimas d.d.">Atidėjimas d.d.</SelectItem>
                        <SelectItem value="Savaitės dienomis">Savaitės dienomis</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2 flex items-center">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="payAtEndOfMonth" 
                        checked={formData.payAtEndOfMonth}
                        onCheckedChange={(checked) => 
                          handleCheckboxChange("payAtEndOfMonth", checked as boolean)
                        } 
                      />
                      <Label htmlFor="payAtEndOfMonth" className="font-normal">
                        Vežėjui mokama mėnesio pabaigoje
                      </Label>
                    </div>
                  </div>
                </div>
              </Card>
            )}
            
            {/* Contact Information (additional) - Only shown for companies */}
            {customerType === "company" && (
              <Card className="p-6">
                <h3 className="text-lg font-medium mb-4">Kontaktinė informacija</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contactPerson">Kontaktinis asmuo</Label>
                    <Input
                      id="contactPerson"
                      name="contactPerson"
                      value={formData.contactPerson}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">El. paštas <span className="text-red-500">*</span></Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="emailForDebts">El_paštas_skoloms</Label>
                    <Input
                      id="emailForDebts"
                      name="emailForDebts"
                      type="email"
                      value={formData.emailForDebts}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </Card>
            )}
          </>
        )}
        
        {/* Form Controls */}
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => setLocation("/dashboard/customers")} type="button">
            Atšaukti
          </Button>
          <Button 
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isSubmitting ? "Išsaugoma..." : "Išsaugoti"}
          </Button>
        </div>
      </form>
    </DashboardLayout>
  );
}