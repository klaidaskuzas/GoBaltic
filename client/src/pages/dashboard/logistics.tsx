import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  ChevronsUpDown,
  Filter,
  MapPin,
  Package,
  RefreshCw,
  Search,
  Truck,
  User,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";

// Define placeholder data for logistics
const demoShipments = [
  {
    id: 1,
    trackingNumber: "TRK-12345",
    customerName: "Jonas Valančiūnas",
    origin: "Vilnius, Lithuania",
    destination: "Hamburg, Germany",
    status: "in_transit",
    currentLocation: "Berlin, Germany",
    estimatedDelivery: "2025-04-18T14:00:00",
    vehicleId: 3,
    vehicleModel: "Mercedes Actros 1845",
    driverName: "Marius Kazlauskas",
  },
  {
    id: 2,
    trackingNumber: "TRK-12346",
    customerName: "Žygimantas Logistics",
    origin: "Warsaw, Poland",
    destination: "Riga, Latvia",
    status: "pending",
    currentLocation: "Warsaw, Poland",
    estimatedDelivery: "2025-04-19T10:00:00",
    vehicleId: 1,
    vehicleModel: "Volvo FH16",
    driverName: "Tomas Petrauskas",
  },
  {
    id: 3,
    trackingNumber: "TRK-12347",
    customerName: "Baltic Freight Ltd",
    origin: "Kaunas, Lithuania",
    destination: "Prague, Czech Republic",
    status: "delivered",
    currentLocation: "Prague, Czech Republic",
    estimatedDelivery: "2025-04-15T12:00:00",
    vehicleId: 2,
    vehicleModel: "Scania R450",
    driverName: "Lukas Simonaitis",
  },
  {
    id: 4,
    trackingNumber: "TRK-12348",
    customerName: "Estonian Motors",
    origin: "Tallinn, Estonia",
    destination: "Munich, Germany",
    status: "customs_clearance",
    currentLocation: "Dresden, Germany",
    estimatedDelivery: "2025-04-20T16:00:00",
    vehicleId: 4,
    vehicleModel: "DAF XF",
    driverName: "Andrius Valinskas",
  },
  {
    id: 5,
    trackingNumber: "TRK-12349",
    customerName: "Mindaugas Transport",
    origin: "Klaipėda, Lithuania",
    destination: "Stockholm, Sweden",
    status: "delayed",
    currentLocation: "Gdansk, Poland",
    estimatedDelivery: "2025-04-22T09:00:00",
    vehicleId: 5,
    vehicleModel: "Mercedes Actros 1845",
    driverName: "Gediminas Palionis",
  },
];

const demoVehicles = [
  {
    id: 1,
    registrationNumber: "LTU-123",
    make: "Volvo",
    model: "FH16",
    year: 2023,
    status: "active",
    currentLocation: "Warsaw, Poland",
    driverName: "Tomas Petrauskas",
    lastMaintenance: "2025-03-10",
    fuelLevel: 75,
  },
  {
    id: 2,
    registrationNumber: "LTU-456",
    make: "Scania",
    model: "R450",
    year: 2022,
    status: "maintenance",
    currentLocation: "Vilnius, Lithuania",
    driverName: "Lukas Simonaitis",
    lastMaintenance: "2025-04-05",
    fuelLevel: 45,
  },
  {
    id: 3,
    registrationNumber: "LTU-789",
    make: "Mercedes",
    model: "Actros 1845",
    year: 2024,
    status: "active",
    currentLocation: "Berlin, Germany",
    driverName: "Marius Kazlauskas",
    lastMaintenance: "2025-02-28",
    fuelLevel: 90,
  },
  {
    id: 4,
    registrationNumber: "LTU-012",
    make: "DAF",
    model: "XF",
    year: 2021,
    status: "active",
    currentLocation: "Dresden, Germany",
    driverName: "Andrius Valinskas",
    lastMaintenance: "2025-03-20",
    fuelLevel: 60,
  },
  {
    id: 5,
    registrationNumber: "LTU-345",
    make: "Mercedes",
    model: "Actros 1845",
    year: 2023,
    status: "active",
    currentLocation: "Gdansk, Poland",
    driverName: "Gediminas Palionis",
    lastMaintenance: "2025-04-01",
    fuelLevel: 30,
  },
];

const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case "delivered":
      return "success";
    case "in_transit":
      return "default";
    case "pending":
      return "secondary";
    case "customs_clearance":
      return "warning";
    case "delayed":
      return "destructive";
    case "cancelled":
      return "outline";
    default:
      return "default";
  }
};

const getFormattedStatus = (status: string) => {
  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export default function LogisticsPage() {
  const [activeTab, setActiveTab] = useState("shipments");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // In a real implementation, these would be API calls
  const { data: shipments = demoShipments, isLoading: isLoadingShipments } = useQuery({
    queryKey: ["/api/shipments"],
    enabled: activeTab === "shipments",
  });

  const { data: vehicles = demoVehicles, isLoading: isLoadingVehicles } = useQuery({
    queryKey: ["/api/vehicles"],
    enabled: activeTab === "vehicles",
  });

  const filteredShipments = shipments.filter((shipment) => {
    // Apply status filter if set
    if (statusFilter && shipment.status !== statusFilter) {
      return false;
    }

    // Apply search query if set
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        shipment.trackingNumber.toLowerCase().includes(query) ||
        shipment.customerName.toLowerCase().includes(query) ||
        shipment.origin.toLowerCase().includes(query) ||
        shipment.destination.toLowerCase().includes(query) ||
        shipment.currentLocation.toLowerCase().includes(query)
      );
    }

    return true;
  });

  const filteredVehicles = vehicles.filter((vehicle) => {
    // Apply search query if set
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        vehicle.registrationNumber.toLowerCase().includes(query) ||
        vehicle.make.toLowerCase().includes(query) ||
        vehicle.model.toLowerCase().includes(query) ||
        vehicle.driverName.toLowerCase().includes(query) ||
        vehicle.currentLocation.toLowerCase().includes(query)
      );
    }

    return true;
  });

  const handleRefresh = () => {
    toast({
      title: "Refreshing data",
      description: "Fetching the latest logistics information...",
    });
    // In a real implementation, you would invalidate the queries
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Logistics</h1>
          <p className="text-muted-foreground">
            Track shipments and manage your fleet
          </p>
        </div>
        <Button onClick={handleRefresh} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      <div className="bg-muted p-4 rounded-lg mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="relative flex-1 w-full md:max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search shipments, vehicles, locations..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {activeTab === "shipments" && (
            <Select
              value={statusFilter || ""}
              onValueChange={(value) => setStatusFilter(value || null)}
            >
              <SelectTrigger className="md:w-[180px]">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <span>{statusFilter ? getFormattedStatus(statusFilter) : "Filter by Status"}</span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in_transit">In Transit</SelectItem>
                <SelectItem value="customs_clearance">Customs Clearance</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="delayed">Delayed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      <Tabs defaultValue="shipments" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="shipments" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            <span>Shipments</span>
          </TabsTrigger>
          <TabsTrigger value="vehicles" className="flex items-center gap-2">
            <Truck className="h-4 w-4" />
            <span>Vehicles</span>
          </TabsTrigger>
          <TabsTrigger value="map" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>Map View</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="shipments">
          <Card>
            <CardHeader>
              <CardTitle>Active Shipments</CardTitle>
              <CardDescription>
                Track and manage all your shipments across Europe
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingShipments ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : filteredShipments.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tracking #</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Origin</TableHead>
                        <TableHead>Destination</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Current Location</TableHead>
                        <TableHead>Est. Delivery</TableHead>
                        <TableHead>Vehicle</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredShipments.map((shipment) => (
                        <TableRow key={shipment.id}>
                          <TableCell className="font-medium">
                            {shipment.trackingNumber}
                          </TableCell>
                          <TableCell>{shipment.customerName}</TableCell>
                          <TableCell>{shipment.origin}</TableCell>
                          <TableCell>{shipment.destination}</TableCell>
                          <TableCell>
                            <Badge variant={getStatusBadgeVariant(shipment.status)}>
                              {getFormattedStatus(shipment.status)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                              {shipment.currentLocation}
                            </div>
                          </TableCell>
                          <TableCell>
                            {format(new Date(shipment.estimatedDelivery), "MMM dd, yyyy")}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Truck className="h-4 w-4 mr-1 text-muted-foreground" />
                              {shipment.vehicleModel}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8"
                              asChild
                            >
                              <a href={`/dashboard/shipments/${shipment.id}`}>
                                View Details
                              </a>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Package className="h-10 w-10 mx-auto mb-3 text-muted" />
                  <p>No shipments found</p>
                  <p className="text-sm mb-4">
                    {statusFilter
                      ? `No shipments with status "${getFormattedStatus(statusFilter)}"`
                      : searchQuery
                      ? `No shipments matching "${searchQuery}"`
                      : "Create your first shipment to get started"}
                  </p>
                  <Button>Create New Shipment</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vehicles">
          <Card>
            <CardHeader>
              <CardTitle>Fleet Management</CardTitle>
              <CardDescription>
                Track and manage your vehicle fleet
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingVehicles ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : filteredVehicles.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Registration</TableHead>
                        <TableHead>Vehicle</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Current Location</TableHead>
                        <TableHead>Driver</TableHead>
                        <TableHead>Last Maintenance</TableHead>
                        <TableHead>Fuel Level</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredVehicles.map((vehicle) => (
                        <TableRow key={vehicle.id}>
                          <TableCell className="font-medium">
                            {vehicle.registrationNumber}
                          </TableCell>
                          <TableCell>
                            {vehicle.make} {vehicle.model} ({vehicle.year})
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                vehicle.status === "active"
                                  ? "success"
                                  : vehicle.status === "maintenance"
                                  ? "warning"
                                  : "outline"
                              }
                            >
                              {vehicle.status.charAt(0).toUpperCase() +
                                vehicle.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                              {vehicle.currentLocation}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <User className="h-4 w-4 mr-1 text-muted-foreground" />
                              {vehicle.driverName}
                            </div>
                          </TableCell>
                          <TableCell>
                            {format(new Date(vehicle.lastMaintenance), "MMM dd, yyyy")}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                                <div
                                  className={`h-2.5 rounded-full ${
                                    vehicle.fuelLevel > 70
                                      ? "bg-green-500"
                                      : vehicle.fuelLevel > 30
                                      ? "bg-yellow-500"
                                      : "bg-red-500"
                                  }`}
                                  style={{ width: `${vehicle.fuelLevel}%` }}
                                ></div>
                              </div>
                              <span className="text-xs">{vehicle.fuelLevel}%</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8"
                              asChild
                            >
                              <a href={`/dashboard/vehicles/${vehicle.id}`}>
                                View Details
                              </a>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Truck className="h-10 w-10 mx-auto mb-3 text-muted" />
                  <p>No vehicles found</p>
                  <p className="text-sm mb-4">
                    {searchQuery
                      ? `No vehicles matching "${searchQuery}"`
                      : "Add your first vehicle to get started"}
                  </p>
                  <Button>Add New Vehicle</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="map">
          <Card>
            <CardHeader>
              <CardTitle>Logistics Map</CardTitle>
              <CardDescription>
                View the real-time location of your shipments and vehicles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center min-h-[500px] bg-gray-100 rounded-md border border-dashed border-gray-300">
                <div className="p-8 max-w-md text-center">
                  <MapPin className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium mb-2">Map View</h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Interactive map visualization is available when a Mapbox access token is provided.
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    In the meantime, you can track your logistics through the Shipments and Vehicles tabs.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {(activeTab === "shipments" || activeTab === "vehicles") && (
        <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Alerts and Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeTab === "shipments" && (
                  <>
                    <div className="flex items-start p-3 rounded-md bg-orange-50 border border-orange-200">
                      <AlertTriangle className="h-5 w-5 text-orange-500 mr-3 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-orange-700">Delayed Shipment</h4>
                        <p className="text-sm text-orange-600">
                          Shipment TRK-12349 (Mindaugas Transport) is delayed at Gdansk. Estimated arrival revised to April 22, 2025.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start p-3 rounded-md bg-blue-50 border border-blue-200">
                      <AlertTriangle className="h-5 w-5 text-blue-500 mr-3 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-700">Customs Clearance Required</h4>
                        <p className="text-sm text-blue-600">
                          Shipment TRK-12348 (Estonian Motors) requires customs documentation at German border.
                        </p>
                      </div>
                    </div>
                  </>
                )}
                {activeTab === "vehicles" && (
                  <>
                    <div className="flex items-start p-3 rounded-md bg-yellow-50 border border-yellow-200">
                      <AlertTriangle className="h-5 w-5 text-yellow-500 mr-3 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-yellow-700">Maintenance Required</h4>
                        <p className="text-sm text-yellow-600">
                          Vehicle LTU-456 (Scania R450) is scheduled for maintenance today. Currently at Vilnius facility.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start p-3 rounded-md bg-red-50 border border-red-200">
                      <AlertTriangle className="h-5 w-5 text-red-500 mr-3 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-red-700">Low Fuel Warning</h4>
                        <p className="text-sm text-red-600">
                          Vehicle LTU-345 (Mercedes Actros 1845) has 30% fuel remaining. Nearest fueling station: 5km ahead in Gdansk.
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </DashboardLayout>
  );
}