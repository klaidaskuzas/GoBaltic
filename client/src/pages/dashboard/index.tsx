import { useQuery } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress"; 
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { Clock, Package, Truck, Users } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

// Demo data for the dashboard
const revenueData = [
  { name: "Jan", revenue: 4000 },
  { name: "Feb", revenue: 3000 },
  { name: "Mar", revenue: 5000 },
  { name: "Apr", revenue: 4500 },
  { name: "May", revenue: 6000 },
  { name: "Jun", revenue: 5500 },
  { name: "Jul", revenue: 7000 },
];

const shipmentStatusData = [
  { name: "Pending", value: 15 },
  { name: "In Transit", value: 25 },
  { name: "Delivered", value: 60 },
];

const COLORS = ["#fbbf24", "#3b82f6", "#10b981"];

export default function Dashboard() {
  // Fetch summary data
  const { data: shipmentStats, isLoading: shipmentLoading } = useQuery({
    queryKey: ["/api/dashboard/shipment-stats"],
  });

  const { data: customerStats, isLoading: customerLoading } = useQuery({
    queryKey: ["/api/dashboard/customer-stats"],
  });

  const { data: financialSummary, isLoading: financialLoading } = useQuery({
    queryKey: ["/api/dashboard/financial-summary"],
  });
  
  // Format currency
  const formatCurrency = (value?: number) => {
    if (value === undefined) return "...";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-gray-500">Welcome to your logistics management center</p>
        </div>
        <div className="mt-4 md:mt-0 space-x-2">
          <Button variant="outline" asChild>
            <Link href="/dashboard/shipments">
              <Package className="mr-2 h-4 w-4" />
              View Shipments
            </Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard/ai-assistant">
              <span className="mr-2">🤖</span>
              AI Assistant
            </Link>
          </Button>
        </div>
      </div>

      {/* Key metrics */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Shipments</CardTitle>
            <Truck className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {shipmentLoading ? "..." : shipmentStats?.totalShipments || 0}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {shipmentLoading
                ? "Loading..."
                : `${shipmentStats?.inTransitShipments || 0} currently in transit`}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {customerLoading ? "..." : customerStats?.totalCustomers || 0}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {customerLoading
                ? "Loading..."
                : `+${customerStats?.newCustomersThisMonth || 0} this month`}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-gray-500"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {financialLoading
                ? "..."
                : formatCurrency(financialSummary?.totalRevenue)}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {financialLoading
                ? "Loading..."
                : `${formatCurrency(financialSummary?.netProfit)} net profit`}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Delivery Success</CardTitle>
            <Clock className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98.3%</div>
            <Progress value={98.3} className="h-2 mt-2" />
            <p className="text-xs text-gray-500 mt-1">+2.6% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="overview" className="mb-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
                <CardDescription>Monthly revenue over the last 7 months</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis 
                        tickFormatter={(value) => {
                          return new Intl.NumberFormat("en-US", {
                            notation: "compact",
                            compactDisplay: "short",
                            style: "currency",
                            currency: "EUR",
                          }).format(value);
                        }}
                      />
                      <Tooltip 
                        formatter={(value) => {
                          return [
                            new Intl.NumberFormat("en-US", {
                              style: "currency",
                              currency: "EUR",
                            }).format(value as number),
                            "Revenue",
                          ];
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Shipment Status</CardTitle>
                <CardDescription>Current status of all shipments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={shipmentStatusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {shipmentStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Legend />
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Analytics</CardTitle>
              <CardDescription>
                Visit the analytics page for more detailed reports and data visualization.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center p-6">
              <Button asChild>
                <Link href="/dashboard/analytics">
                  View Full Analytics
                </Link>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Recent activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest updates from across your logistics operations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            <div className="flex">
              <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                <Truck className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium">New shipment created</p>
                <p className="text-sm text-gray-500">
                  BMW X5 transport from Munich to Oslo
                </p>
                <p className="mt-1 text-xs text-gray-400">2 hours ago</p>
              </div>
            </div>
            <div className="flex">
              <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5 text-green-600"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium">Shipment delivered</p>
                <p className="text-sm text-gray-500">
                  Mercedes-Benz E-Class delivered to Frankfurt
                </p>
                <p className="mt-1 text-xs text-gray-400">5 hours ago</p>
              </div>
            </div>
            <div className="flex">
              <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
                <Users className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-medium">New customer registered</p>
                <p className="text-sm text-gray-500">
                  Auto Logistics GmbH joined as a business customer
                </p>
                <p className="mt-1 text-xs text-gray-400">Yesterday</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}