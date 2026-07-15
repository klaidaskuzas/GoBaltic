import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { 
  Search, AlertTriangle, FileText, Truck, Users, Database,
  BarChart4, Calendar, MapPin, Clock, Tag, ExternalLink, FileUp
} from "lucide-react";

// Types for search results
interface SearchResult {
  id: string;
  title: string;
  content: string;
  type: 'shipment' | 'customer' | 'vehicle' | 'document' | 'report' | 'invoice';
  date: string;
  url?: string;
  tags?: string[];
  metadata?: Record<string, string>;
}

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [selectedTab, setSelectedTab] = useState("all");
  const { toast } = useToast();

  // Mock search function - would connect to backend in production
  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      // Mock results
      const results: SearchResult[] = [
        {
          id: "ship-1",
          title: "Shipment #LT-34567",
          content: "BMW X5 transport from Berlin to Vilnius",
          type: "shipment",
          date: "2023-04-01",
          tags: ["luxury", "expedited"],
          metadata: {
            status: "in_transit",
            customer: "Jurgen Klaussen",
            origin: "Berlin, Germany",
            destination: "Vilnius, Lithuania"
          }
        },
        {
          id: "cust-1",
          title: "Autovežių Lyga UAB",
          content: "Corporate client specializing in luxury vehicle transport",
          type: "customer",
          date: "2022-11-15",
          metadata: {
            contactPerson: "Marius Petrauskas",
            email: "marius@autoveziulyga.lt",
            phone: "+370 612 34567"
          }
        },
        {
          id: "veh-1",
          title: "Vehicle LT-5678-CD",
          content: "Mercedes Actros with double-deck car transporter trailer",
          type: "vehicle",
          date: "2023-03-15",
          metadata: {
            driver: "Jonas Jonaitis",
            location: "Warsaw, Poland",
            status: "in_transit"
          }
        },
        {
          id: "doc-1",
          title: "Vehicle Transport Agreement - Standard Template",
          content: "Legal document for vehicle transportation services",
          type: "document",
          date: "2023-01-10",
          url: "#",
          metadata: {
            format: "PDF",
            size: "245 KB",
            department: "Legal"
          }
        },
        {
          id: "rep-1",
          title: "Q1 2023 Transport Volume Report",
          content: "Quarterly report on transport volumes by region and vehicle type",
          type: "report",
          date: "2023-04-03",
          url: "#",
          metadata: {
            author: "Darius Kazlauskas",
            department: "Analytics",
            pages: "24"
          }
        },
        {
          id: "inv-1",
          title: "Invoice #INV-2023-0456",
          content: "Invoice for premium vehicle transport services",
          type: "invoice",
          date: "2023-03-28",
          metadata: {
            amount: "€2,450.00",
            customer: "Premium Auto GmbH",
            status: "paid"
          }
        }
      ];
      
      setSearchResults(results);
      setIsSearching(false);
      
      if (results.length === 0) {
        toast({
          title: "No results found",
          description: "Try adjusting your search terms or filters.",
          variant: "destructive",
        });
      }
    }, 1000);
  };
  
  // Filter handlers
  const toggleFilter = (filter: string) => {
    setActiveFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter) 
        : [...prev, filter]
    );
  };
  
  // Get icon based on result type
  const getResultIcon = (type: string) => {
    switch(type) {
      case 'shipment': return <Truck className="h-4 w-4" />;
      case 'customer': return <Users className="h-4 w-4" />;
      case 'vehicle': return <Truck className="h-4 w-4" />;
      case 'document': return <FileText className="h-4 w-4" />;
      case 'report': return <BarChart4 className="h-4 w-4" />;
      case 'invoice': return <FileText className="h-4 w-4" />;
      default: return <Database className="h-4 w-4" />;
    }
  };
  
  // Filter results based on active tab and filters
  const filteredResults = searchResults.filter(result => {
    // Filter by type if not on "all" tab
    if (selectedTab !== "all" && result.type !== selectedTab) {
      return false;
    }
    
    // Apply active filters (simplified - would be more complex in production)
    if (activeFilters.length > 0) {
      // This is a placeholder implementation - in reality would check against actual properties
      return true;
    }
    
    return true;
  });
  
  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Search System</h1>
          <p className="text-gray-500">Find information across all your data sources</p>
        </div>
      </div>
      
      <div className="rounded-md bg-amber-50 p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertTriangle className="h-5 w-5 text-amber-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-amber-800">API Key Required</h3>
            <div className="mt-2 text-sm text-amber-700">
              <p>
                The advanced search capabilities require an OpenAI API key for semantic search functionality.
                Basic text search is available without an API key.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search for anything: documents, shipments, customers..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSearch();
                }}
              />
            </div>
            <div className="flex space-x-2">
              <Button 
                onClick={handleSearch} 
                disabled={isSearching || !searchQuery.trim()}
              >
                {isSearching ? (
                  <>Searching...</>
                ) : (
                  <>Search</>
                )}
              </Button>
              <Button variant="outline" onClick={() => {
                toast({
                  title: "Upload a file to search",
                  description: "This feature requires the file upload component to be implemented.",
                })
              }}>
                <FileUp className="h-4 w-4 mr-2" />
                Upload
              </Button>
            </div>
          </div>
          
          <div className="mt-4 flex flex-wrap gap-2">
            {["Recent", "Documents", "German", "Luxury", "Invoices"].map((filter) => (
              <Badge 
                key={filter} 
                variant={activeFilters.includes(filter) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => toggleFilter(filter)}
              >
                {filter}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {searchResults.length > 0 && (
        <Tabs defaultValue={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Results</TabsTrigger>
            <TabsTrigger value="shipment">Shipments</TabsTrigger>
            <TabsTrigger value="customer">Customers</TabsTrigger>
            <TabsTrigger value="document">Documents</TabsTrigger>
            <TabsTrigger value="report">Reports</TabsTrigger>
            <TabsTrigger value="invoice">Invoices</TabsTrigger>
          </TabsList>
          
          <TabsContent value={selectedTab}>
            <div className="bg-white p-4 rounded-lg border">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-lg font-medium">Results</h2>
                  <p className="text-sm text-gray-500">Found {filteredResults.length} results</p>
                </div>
                
                <div className="flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="advanced-search" />
                    <Label htmlFor="advanced-search" className="text-sm">Use AI for semantic search</Label>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                {filteredResults.map((result) => (
                  <Card key={result.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <div className="flex">
                      <div className={`w-2 ${
                        result.type === 'shipment' ? 'bg-blue-500' :
                        result.type === 'customer' ? 'bg-green-500' :
                        result.type === 'vehicle' ? 'bg-purple-500' :
                        result.type === 'document' ? 'bg-amber-500' :
                        result.type === 'report' ? 'bg-cyan-500' :
                        'bg-red-500'
                      }`}></div>
                      <div className="flex-grow">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between">
                            <div>
                              <CardTitle className="text-md font-medium flex items-center">
                                <span className="mr-2 text-gray-500">
                                  {getResultIcon(result.type)}
                                </span>
                                {result.title}
                              </CardTitle>
                              <CardDescription>
                                {result.content}
                              </CardDescription>
                            </div>
                            {result.url && (
                              <Button variant="ghost" size="sm" asChild>
                                <a href={result.url} target="_blank" rel="noreferrer">
                                  <ExternalLink className="h-4 w-4" />
                                </a>
                              </Button>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-2 mb-2">
                            {result.tags?.map(tag => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                <Tag className="h-3 w-3 mr-1" /> {tag}
                              </Badge>
                            ))}
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div className="flex items-center text-gray-500">
                              <Calendar className="h-3 w-3 mr-1" />
                              <span>{new Date(result.date).toLocaleDateString()}</span>
                            </div>
                            
                            {result.metadata && Object.entries(result.metadata).map(([key, value]) => (
                              <div key={key} className="flex items-center text-gray-500">
                                {key === 'location' && <MapPin className="h-3 w-3 mr-1" />}
                                {key === 'status' && <Clock className="h-3 w-3 mr-1" />}
                                <span className="font-medium mr-1">{key}:</span> {value}
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      )}
      
      {searchResults.length === 0 && !isSearching && searchQuery && (
        <div className="bg-slate-50 p-10 rounded-lg border border-slate-100 text-center">
          <Search className="h-10 w-10 mx-auto text-slate-300 mb-4" />
          <h3 className="text-lg font-medium text-slate-700 mb-2">No results found</h3>
          <p className="text-slate-500 max-w-md mx-auto">
            Try using different keywords or filters to find what you're looking for.
          </p>
        </div>
      )}
      
      {!searchQuery && searchResults.length === 0 && (
        <div className="bg-slate-50 p-10 rounded-lg border border-slate-100 text-center">
          <Search className="h-10 w-10 mx-auto text-slate-300 mb-4" />
          <h3 className="text-lg font-medium text-slate-700 mb-2">Search across all your data</h3>
          <p className="text-slate-500 max-w-md mx-auto">
            Enter keywords to search for shipments, customers, vehicles, documents, and more.
          </p>
        </div>
      )}
    </DashboardLayout>
  );
}