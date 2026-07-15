import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Truck, MapPin, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Mock data for vehicles that would normally come from API
const mockVehicles = [
  {
    id: 1,
    registrationNumber: "LT-1234-AB",
    status: "in_transit",
    location: { lat: 54.687157, lng: 25.279652 }, // Vilnius
    destination: "Berlin, Germany",
    lastUpdate: "2023-04-05T10:15:00Z",
    driver: "Jonas Petrauskas",
    cargoDetails: "BMW X5, Mercedes C-Class, Audi A4",
    eta: "2023-04-07T18:00:00Z",
  },
  {
    id: 2,
    registrationNumber: "LT-5678-CD",
    status: "loading",
    location: { lat: 52.520008, lng: 13.404954 }, // Berlin
    destination: "Paris, France",
    lastUpdate: "2023-04-05T09:30:00Z",
    driver: "Laura Kazlauskienė",
    cargoDetails: "Porsche 911, Ferrari F8",
    eta: "2023-04-08T12:00:00Z",
  },
  {
    id: 3,
    registrationNumber: "LT-9012-EF",
    status: "unloading",
    location: { lat: 48.856614, lng: 2.352222 }, // Paris
    destination: "Madrid, Spain",
    lastUpdate: "2023-04-05T11:45:00Z",
    driver: "Tomas Jankauskas",
    cargoDetails: "Range Rover, Jaguar F-Type",
    eta: null,
  },
  {
    id: 4,
    registrationNumber: "LT-3456-GH",
    status: "maintenance",
    location: { lat: 50.075538, lng: 14.437800 }, // Prague
    destination: null,
    lastUpdate: "2023-04-04T16:20:00Z",
    driver: "Audrius Kazlauskas",
    cargoDetails: null,
    eta: null,
  },
  {
    id: 5,
    registrationNumber: "LT-7890-IJ",
    status: "idle",
    location: { lat: 59.329323, lng: 18.068581 }, // Stockholm
    destination: "Oslo, Norway",
    lastUpdate: "2023-04-05T08:10:00Z",
    driver: "Gintarė Butkutė",
    cargoDetails: null,
    eta: "2023-04-06T14:00:00Z",
  },
];

interface VehicleCardProps {
  vehicle: typeof mockVehicles[0];
}

const VehicleCard = ({ vehicle }: VehicleCardProps) => {
  // Calculate formatted time since last update
  const lastUpdateDate = new Date(vehicle.lastUpdate);
  const now = new Date();
  const diffMs = now.getTime() - lastUpdateDate.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  
  let updateText = '';
  if (diffMins < 60) {
    updateText = `${diffMins} minutes ago`;
  } else if (diffHours < 24) {
    updateText = `${diffHours} hours ago`;
  } else {
    updateText = lastUpdateDate.toLocaleDateString();
  }
  
  // Format ETA if available
  const etaText = vehicle.eta 
    ? new Date(vehicle.eta).toLocaleString(undefined, {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    : 'Not available';
  
  // Status color mapping
  const statusColors = {
    in_transit: "bg-green-100 text-green-800 border-green-200",
    loading: "bg-blue-100 text-blue-800 border-blue-200",
    unloading: "bg-purple-100 text-purple-800 border-purple-200",
    maintenance: "bg-amber-100 text-amber-800 border-amber-200",
    idle: "bg-slate-100 text-slate-800 border-slate-200",
  };
  
  const statusColor = statusColors[vehicle.status as keyof typeof statusColors];
  
  return (
    <Card className="mb-4 hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{vehicle.registrationNumber}</CardTitle>
            <CardDescription>Driver: {vehicle.driver}</CardDescription>
          </div>
          <div className={`px-2 py-1 rounded text-xs font-medium border ${statusColor}`}>
            {vehicle.status.replace('_', ' ')}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500 mb-1">Current Location</p>
            <p className="font-medium flex items-center">
              <MapPin className="h-3 w-3 mr-1" />
              {vehicle.location.lat.toFixed(6)}, {vehicle.location.lng.toFixed(6)}
            </p>
          </div>
          <div>
            <p className="text-gray-500 mb-1">Last Update</p>
            <p className="font-medium">{updateText}</p>
          </div>
          <div>
            <p className="text-gray-500 mb-1">Destination</p>
            <p className="font-medium">{vehicle.destination || 'Not assigned'}</p>
          </div>
          <div>
            <p className="text-gray-500 mb-1">ETA</p>
            <p className="font-medium">{etaText}</p>
          </div>
        </div>
        
        {vehicle.cargoDetails && (
          <div className="mt-4">
            <p className="text-gray-500 mb-1">Cargo</p>
            <p className="p-2 bg-gray-50 rounded text-sm">{vehicle.cargoDetails}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const MapPlaceholder = () => (
  <div className="relative w-full h-[600px] bg-slate-100 rounded-lg flex flex-col items-center justify-center">
    <div className="flex flex-col items-center justify-center">
      <div className="text-slate-400 mb-4">
        <MapPin className="h-12 w-12" />
      </div>
      <h3 className="text-lg font-medium text-slate-700 mb-2">Map Integration Required</h3>
      <p className="text-sm text-slate-500 text-center max-w-md mb-4">
        This component requires a Mapbox API key to display the interactive map with real-time vehicle locations.
      </p>
      <div className="flex space-x-2">
        <Button variant="outline" size="sm">
          <Info className="h-4 w-4 mr-2" /> Learn More
        </Button>
      </div>
    </div>
    
    <div className="absolute inset-0 border-4 border-dashed border-slate-200 rounded-lg opacity-70 pointer-events-none"></div>
  </div>
);

export default function LogisticsMap() {
  const [selectedView, setSelectedView] = useState("map");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const { toast } = useToast();
  
  const filteredVehicles = selectedFilter === "all" 
    ? mockVehicles 
    : mockVehicles.filter(v => v.status === selectedFilter);
  
  const requestMapboxKey = () => {
    toast({
      title: "API Key Required",
      description: "Please set up a Mapbox API key to enable the interactive map feature.",
      variant: "destructive",
    });
  };
  
  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Logistics Map</h1>
          <p className="text-gray-500">Monitor your fleet in real-time</p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={selectedFilter} onValueChange={setSelectedFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Vehicles</SelectItem>
              <SelectItem value="in_transit">In Transit</SelectItem>
              <SelectItem value="loading">Loading</SelectItem>
              <SelectItem value="unloading">Unloading</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
              <SelectItem value="idle">Idle</SelectItem>
            </SelectContent>
          </Select>
          <Button size="sm" onClick={requestMapboxKey}>
            <Truck className="h-4 w-4 mr-2" /> Live Traffic
          </Button>
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
                The map feature requires a Mapbox API key to function. Please set the MAPBOX_ACCESS_TOKEN environment variable to enable the interactive map.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <Tabs defaultValue={selectedView} onValueChange={setSelectedView}>
        <TabsList className="mb-4">
          <TabsTrigger value="map">Map View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
        </TabsList>
        
        <TabsContent value="map">
          <Card>
            <CardContent className="p-6">
              <MapPlaceholder />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="list">
          <div className="grid gap-4 md:grid-cols-2">
            {filteredVehicles.map(vehicle => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
            
            {filteredVehicles.length === 0 && (
              <div className="col-span-2 p-8 text-center bg-slate-50 rounded-lg">
                <p className="text-slate-500">No vehicles found with the selected status.</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}