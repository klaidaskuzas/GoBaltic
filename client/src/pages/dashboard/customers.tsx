import { useQuery } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Customer } from "@shared/schema";
import { ChevronDown, ChevronUp, FileEdit, Plus, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Link } from "wouter";
import { Label } from "@/components/ui/label";

// Search criteria types
type SearchCriterion = {
  field: string;
  label: {
    en: string;
    lt: string;
  };
  placeholder: {
    en: string;
    lt: string;
  };
};

export default function DashboardCustomers() {
  const [searchTerms, setSearchTerms] = useState({
    companyName: "",  // Firmos pavadinimas
    name: "",         // Vardas Pavardė
    country: "",      // Registracijos šalis 
    companyCode: "",  // Įmonės kodas
    vatCode: ""       // PVM kodas
  });
  
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);

  const { data: customers, isLoading } = useQuery<Customer[]>({
    queryKey: ["/api/customers"],
  });

  // Search criteria definitions
  const searchCriteria: SearchCriterion[] = [
    {
      field: "companyName",
      label: { en: "Company Name", lt: "Firmos pavadinimas" },
      placeholder: { en: "Enter company name", lt: "Įveskite įmonės pavadinimą" }
    },
    {
      field: "name",
      label: { en: "Full Name", lt: "Vardas Pavardė" },
      placeholder: { en: "Enter full name", lt: "Įveskite vardą ir pavardę" }
    },
    {
      field: "country",
      label: { en: "Registration Country", lt: "Registracijos šalis" },
      placeholder: { en: "Enter country", lt: "Įveskite šalį" }
    },
    {
      field: "companyCode",
      label: { en: "Company Code", lt: "Įmonės kodas" },
      placeholder: { en: "Enter company code", lt: "Įveskite įmonės kodą" }
    },
    {
      field: "vatCode",
      label: { en: "VAT Code", lt: "PVM kodas" },
      placeholder: { en: "Enter VAT code", lt: "Įveskite PVM kodą" }
    }
  ];

  // Reset all search terms
  const resetSearch = () => {
    setSearchTerms({
      companyName: "",
      name: "",
      country: "",
      companyCode: "",
      vatCode: ""
    });
  };

  // Handle input change for any field
  const handleSearchChange = (field: string, value: string) => {
    setSearchTerms(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Helper function to match companyVat field from the database with companyCode and vatCode
  // This assumes companyVat might contain both company code and VAT numbers in various formats
  const matchVatOrCompanyCode = (customer: Customer, field: string, value: string) => {
    if (!value) return true;
    if (!customer.companyVat) return false;
    
    const lowercasedValue = value.toLowerCase();
    const lowercasedVat = customer.companyVat.toLowerCase();
    
    return lowercasedVat.includes(lowercasedValue);
  };

  // Filter customers based on multiple criteria
  const filteredCustomers = customers?.filter(customer => {
    // Check if any of the terms are filled
    const hasSearchTerms = Object.values(searchTerms).some(term => term.trim() !== "");
    
    // If no search terms, return all customers
    if (!hasSearchTerms) return true;
    
    // Company name filter
    const companyNameMatch = !searchTerms.companyName || 
      (customer.companyName?.toLowerCase() || "").includes(searchTerms.companyName.toLowerCase());
    
    // Name filter
    const nameMatch = !searchTerms.name || 
      customer.name.toLowerCase().includes(searchTerms.name.toLowerCase());
    
    // Country filter
    const countryMatch = !searchTerms.country || 
      (customer.country?.toLowerCase() || "").includes(searchTerms.country.toLowerCase());
    
    // Company code filter (using companyVat field since we don't have a dedicated companyCode field)
    const companyCodeMatch = !searchTerms.companyCode || 
      matchVatOrCompanyCode(customer, 'companyCode', searchTerms.companyCode);
    
    // VAT code filter
    const vatCodeMatch = !searchTerms.vatCode || 
      matchVatOrCompanyCode(customer, 'vatCode', searchTerms.vatCode);
    
    // All conditions must be true
    return companyNameMatch && nameMatch && countryMatch && companyCodeMatch && vatCodeMatch;
  });

  // Calculate search summary for display
  const hasActiveFilters = Object.values(searchTerms).some(term => term.trim() !== "");
  const activeFilterCount = Object.values(searchTerms).filter(term => term.trim() !== "").length;

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Customers</h1>
          <p className="text-gray-500">
            Manage your customer relationships
            {hasActiveFilters && (
              <span className="ml-2 text-blue-600">
                ({activeFilterCount} {activeFilterCount === 1 ? 'filter' : 'filters'} active)
              </span>
            )}
          </p>
        </div>
        <Button asChild>
          <Link to="/dashboard/customers/new">
            <Plus className="mr-2 h-4 w-4" /> Naujas Klientas
          </Link>
        </Button>
      </div>

      <Card className="mb-6">
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Customer Search</h3>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
            >
              {showAdvancedSearch ? (
                <>
                  <ChevronUp className="h-4 w-4 mr-2" />
                  Simple Search
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4 mr-2" />
                  Advanced Search
                </>
              )}
            </Button>
          </div>
          
          {!showAdvancedSearch ? (
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Simple search by name, email, company..."
                className="pl-8"
                value={searchTerms.name}
                onChange={(e) => handleSearchChange("name", e.target.value)}
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Company Name (Firmos pavadinimas) */}
                <div className="space-y-2">
                  <Label htmlFor="companyName">Firmos pavadinimas</Label>
                  <Input
                    id="companyName"
                    placeholder="Įveskite įmonės pavadinimą"
                    value={searchTerms.companyName}
                    onChange={(e) => handleSearchChange("companyName", e.target.value)}
                  />
                </div>
                
                {/* Full Name (Vardas Pavardė) */}
                <div className="space-y-2">
                  <Label htmlFor="name">Vardas Pavardė</Label>
                  <Input
                    id="name"
                    placeholder="Įveskite vardą ir pavardę"
                    value={searchTerms.name}
                    onChange={(e) => handleSearchChange("name", e.target.value)}
                  />
                </div>
                
                {/* Registration Country (Registracijos šalis) */}
                <div className="space-y-2">
                  <Label htmlFor="country">Registracijos šalis</Label>
                  <Input
                    id="country"
                    placeholder="Įveskite šalį"
                    value={searchTerms.country}
                    onChange={(e) => handleSearchChange("country", e.target.value)}
                  />
                </div>
                
                {/* Company Code (Įmonės kodas) */}
                <div className="space-y-2">
                  <Label htmlFor="companyCode">Įmonės kodas</Label>
                  <Input
                    id="companyCode"
                    placeholder="Įveskite įmonės kodą"
                    value={searchTerms.companyCode}
                    onChange={(e) => handleSearchChange("companyCode", e.target.value)}
                  />
                </div>
                
                {/* VAT Code (PVM kodas) */}
                <div className="space-y-2">
                  <Label htmlFor="vatCode">PVM kodas</Label>
                  <Input
                    id="vatCode"
                    placeholder="Įveskite PVM kodą"
                    value={searchTerms.vatCode}
                    onChange={(e) => handleSearchChange("vatCode", e.target.value)}
                  />
                </div>
              </div>
              
              {/* Active filters display */}
              {hasActiveFilters && (
                <div className="mb-4 mt-2">
                  <Label className="mb-2 block">Active filters</Label>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(searchTerms).map(([field, value]) => 
                      value.trim() !== "" ? (
                        <div 
                          key={field}
                          className="bg-blue-50 border border-blue-200 rounded-full px-3 py-1 flex items-center text-sm"
                        >
                          <span className="font-medium mr-1">
                            {searchCriteria.find(c => c.field === field)?.label.lt}:
                          </span>
                          <span className="truncate max-w-[150px]">{value}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-5 w-5 p-0 ml-2"
                            onClick={() => handleSearchChange(field, "")}
                          >
                            <X className="h-3 w-3" />
                            <span className="sr-only">Remove filter</span>
                          </Button>
                        </div>
                      ) : null
                    )}
                  </div>
                </div>
              )}

              
              {/* Search control buttons */}
              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={resetSearch}
                >
                  <X className="h-4 w-4 mr-2" />
                  Reset
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>

      <Card>
        <div className="px-4 py-2 border-b">
          <p className="text-sm text-gray-500">
            {isLoading ? (
              "Loading customers..."
            ) : (
              <>
                {filteredCustomers ? (
                  filteredCustomers.length === 0 ? (
                    "No customers found"
                  ) : (
                    <>
                      Showing <span className="font-medium">{filteredCustomers.length}</span> {" "}
                      {filteredCustomers.length === 1 ? "customer" : "customers"}
                      {hasActiveFilters && " based on your search criteria"}
                    </>
                  )
                ) : "No customers available"}
              </>
            )}
          </p>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Firmos pavadinimas</TableHead>
                <TableHead>Įmonės sukūrimo data</TableHead>
                <TableHead>Šalis</TableHead>
                <TableHead>PVM kodas</TableHead>
                <TableHead>Telefonas</TableHead>
                <TableHead>Darbo statusas</TableHead>
                <TableHead>E-mail</TableHead>
                <TableHead>El_paštas_skoloms</TableHead>
                <TableHead>ID</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-10">
                    Loading customers...
                  </TableCell>
                </TableRow>
              ) : filteredCustomers && filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium">
                      <Link 
                        to={`/dashboard/customers/${customer.id}`}
                        className="text-blue-600 hover:underline cursor-pointer"
                      >
                        {(customer.isCompany && customer.companyName) ? customer.companyName : customer.name}
                      </Link>
                    </TableCell>
                    <TableCell>{customer.createdAt ? new Date(customer.createdAt).toLocaleDateString() : "N/A"}</TableCell>
                    <TableCell>{customer.country || "N/A"}</TableCell>
                    <TableCell>{customer.companyVat || "N/A"}</TableCell>
                    <TableCell>{customer.phone || "N/A"}</TableCell>
                    <TableCell>
                      {/* Check if credit is available - demo data for now */}
                      <Badge variant={customer.id % 3 === 0 ? "destructive" : "secondary"}>
                        {customer.id % 3 === 0 ? "Blokuotas" : "Neblokuotas"}
                      </Badge>
                    </TableCell>
                    <TableCell>{customer.email || "N/A"}</TableCell>
                    <TableCell>{customer.emailForDebts || "N/A"}</TableCell>
                    <TableCell>{customer.id}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-10">
                    No customers found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </DashboardLayout>
  );
}