import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  BarChart3,
  CalendarIcon,
  CreditCard,
  DollarSign,
  Download,
  FileText,
  Filter,
  PieChart,
  Plus,
  Search,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { format, subDays, subMonths } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Financial Summary
const financialSummary = {
  totalRevenue: 19900,
  totalExpenses: 10650,
  netProfit: 9250,
  profitMargin: 46.5, // percentage
  revenueBySource: {
    shipment: 19900,
    other: 0,
  },
  expensesByCategory: {
    fuel: 2500,
    maintenance: 1200,
    tolls: 350,
    salaries: 4800,
    insurance: 1800,
  },
  monthlyFinancials: [
    { month: "Jan", revenue: 15500, expenses: 8200, profit: 7300 },
    { month: "Feb", revenue: 16800, expenses: 9100, profit: 7700 },
    { month: "Mar", revenue: 18200, expenses: 9800, profit: 8400 },
    { month: "Apr", revenue: 19900, expenses: 10650, profit: 9250 },
  ],
};

// Default empty summary structure for API responses that might be missing data
const defaultSummary = {
  totalRevenue: 0,
  totalExpenses: 0,
  netProfit: 0,
  profitMargin: 0,
  revenueBySource: {},
  expensesByCategory: {},
  monthlyFinancials: [],
};

const formatCurrency = (amount: number, currency: string = "EUR") => {
  return new Intl.NumberFormat("lt-LT", {
    style: "currency",
    currency: currency,
  }).format(amount);
};

const getCategoryLabel = (category: string) => {
  const labels: Record<string, string> = {
    fuel: "Fuel",
    maintenance: "Maintenance",
    tolls: "Tolls",
    salaries: "Salaries",
    insurance: "Insurance",
    office: "Office",
    marketing: "Marketing",
    other: "Other",
  };
  return labels[category] || category.charAt(0).toUpperCase() + category.slice(1);
};

const getCategoryBadge = (category: string) => {
  const variants: Record<string, string> = {
    fuel: "default",
    maintenance: "warning",
    tolls: "secondary",
    salaries: "success",
    insurance: "primary",
    office: "outline",
    marketing: "destructive",
    other: "muted",
  };
  return variants[category] || "default";
};

const timeRanges = [
  { id: "7d", name: "Last 7 days", getDates: () => ({ start: subDays(new Date(), 7), end: new Date() }) },
  { id: "30d", name: "Last 30 days", getDates: () => ({ start: subDays(new Date(), 30), end: new Date() }) },
  { id: "3m", name: "Last 3 months", getDates: () => ({ start: subMonths(new Date(), 3), end: new Date() }) },
  { id: "6m", name: "Last 6 months", getDates: () => ({ start: subMonths(new Date(), 6), end: new Date() }) },
  { id: "1y", name: "Last year", getDates: () => ({ start: subMonths(new Date(), 12), end: new Date() }) },
  { id: "ytd", name: "Year to date", getDates: () => ({ start: new Date(new Date().getFullYear(), 0, 1), end: new Date() }) },
];

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState("financial");
  const [timeRange, setTimeRange] = useState("30d");
  const [dateRange, setDateRange] = useState<{
    start: Date | null;
    end: Date | null;
  }>(timeRanges.find(r => r.id === timeRange)?.getDates() || { start: null, end: null });

  // In a real implementation, these would be API calls with date range parameters
  const { data: summary = financialSummary, isLoading: isLoadingSummary } = useQuery({
    queryKey: ["/api/dashboard/financial-summary", dateRange.start, dateRange.end],
    enabled: activeTab === "financial",
  });

  const handleExportData = () => {
    toast({
      title: "Exporting report data",
      description: "Your export is being prepared and will download shortly.",
    });
    // In a real implementation, this would generate and download a file
  };

  const handleTimeRangeChange = (value: string) => {
    setTimeRange(value);
    const newRange = timeRanges.find(r => r.id === value);
    if (newRange) {
      setDateRange(newRange.getDates());
    }
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground">
            Financial, operational, and performance reports
          </p>
        </div>
        <div className="flex gap-2 items-center">
          <Select
            value={timeRange}
            onValueChange={handleTimeRangeChange}
          >
            <SelectTrigger className="md:w-[180px]">
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                <span>{timeRanges.find(r => r.id === timeRange)?.name || "Custom"}</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              {timeRanges.map(range => (
                <SelectItem key={range.id} value={range.id}>{range.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            onClick={handleExportData}
            variant="outline"
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <Tabs defaultValue="financial" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="financial">Financial Reports</TabsTrigger>
          <TabsTrigger value="operational">Operational Reports</TabsTrigger>
          <TabsTrigger value="performance">Performance Reports</TabsTrigger>
          <TabsTrigger value="custom">Custom Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="financial">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Revenue
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(summary.totalRevenue)}
                </div>
                <p className="text-xs text-muted-foreground">
                  +12% from previous period
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Expenses
                </CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(summary.totalExpenses)}
                </div>
                <p className="text-xs text-muted-foreground">
                  +8% from previous period
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Net Profit
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(summary.netProfit)}
                </div>
                <div className="flex items-center pt-1">
                  <ArrowUpIcon className="h-3 w-3 text-emerald-500" />
                  <p className="text-xs text-muted-foreground">
                    +10% from previous period
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Profit Margin
                </CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{summary.profitMargin}%</div>
                <div className="flex items-center pt-1">
                  <ArrowUpIcon className="h-3 w-3 text-emerald-500" />
                  <p className="text-xs text-muted-foreground">
                    +2% from previous period
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-4">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Financial Overview</CardTitle>
                <CardDescription>
                  {dateRange.start ? format(dateRange.start, "MMM dd, yyyy") : ""} to {dateRange.end ? format(dateRange.end, "MMM dd, yyyy") : ""}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  {/* Monthly trends visualization */}
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-4">Monthly Performance</h4>
                    <div className="flex items-end justify-between h-40">
                      {summary.monthlyFinancials && summary.monthlyFinancials.length > 0 ? (
                        summary.monthlyFinancials.map((month, index) => (
                          <div key={index} className="flex flex-col items-center space-y-2">
                            <div className="text-xs text-muted-foreground">{formatCurrency(month.profit)}</div>
                            <div className="flex space-x-1">
                              <div
                                className="w-3 bg-primary rounded-t"
                                style={{
                                  height: `${(month.revenue / 20000) * 100}px`,
                                }}
                              ></div>
                              <div
                                className="w-3 bg-red-500 rounded-t"
                                style={{
                                  height: `${(month.expenses / 20000) * 100}px`,
                                }}
                              ></div>
                              <div
                                className="w-3 bg-green-500 rounded-t"
                                style={{
                                  height: `${(month.profit / 20000) * 100}px`,
                                }}
                              ></div>
                            </div>
                            <div className="text-xs font-medium">{month.month}</div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center w-full text-sm text-muted-foreground">No monthly data available</div>
                      )}
                    </div>
                    <div className="flex justify-center mt-4 text-xs">
                      <div className="flex items-center mr-4">
                        <div className="h-3 w-3 rounded bg-primary mr-1"></div>
                        <span>Revenue</span>
                      </div>
                      <div className="flex items-center mr-4">
                        <div className="h-3 w-3 rounded bg-red-500 mr-1"></div>
                        <span>Expenses</span>
                      </div>
                      <div className="flex items-center">
                        <div className="h-3 w-3 rounded bg-green-500 mr-1"></div>
                        <span>Profit</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Expense Breakdown</CardTitle>
                <CardDescription>
                  Expenses by category for selected period
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {summary.expensesByCategory && Object.keys(summary.expensesByCategory).length > 0 ? (
                    Object.entries(summary.expensesByCategory).map(([category, amount]) => (
                      <div key={category} className="flex items-center">
                        <div className="flex items-center gap-2 w-40">
                          <Badge variant={getCategoryBadge(category) as any}>
                            {getCategoryLabel(category)}
                          </Badge>
                        </div>
                        <div className="ml-auto font-medium">{formatCurrency(amount as number)}</div>
                        <div className="ml-4 w-24 text-right text-muted-foreground text-xs">
                          {Math.round(((amount as number) / summary.totalExpenses) * 100)}%
                        </div>
                        <div className="ml-2 w-24">
                          <div className="h-2 w-full rounded-full bg-primary-50">
                            <div
                              className="h-full rounded-full bg-primary"
                              style={{
                                width: `${((amount as number) / summary.totalExpenses) * 100}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-sm text-muted-foreground">No expense data available</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Financial Analysis</CardTitle>
                <CardDescription>
                  Key financial metrics and trends
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <BarChart3 className="h-12 w-12 mx-auto mb-3 text-muted" />
                  <p className="text-lg font-medium">Advanced Financial Analysis</p>
                  <p className="text-sm text-muted-foreground mb-4 max-w-lg mx-auto">
                    Generate detailed financial reports with advanced metrics like cash flow, 
                    ROI, breakeven analysis, and forecasting.
                  </p>
                  <Button>Generate Financial Analysis</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="operational">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Vehicle Utilization</CardTitle>
                <CardDescription>Fleet performance and efficiency</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <BarChart3 className="h-12 w-12 mx-auto mb-3 text-muted" />
                  <p>Vehicle utilization reports not available yet</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Generate reports to track vehicle utilization, idle time, and efficiency metrics
                  </p>
                  <Button>Generate Report</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Route Analysis</CardTitle>
                <CardDescription>Delivery routes and optimization</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <PieChart className="h-12 w-12 mx-auto mb-3 text-muted" />
                  <p>Route analysis reports not available yet</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Generate reports on route efficiency, fuel consumption, and delivery times
                  </p>
                  <Button>Generate Report</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Delivery Performance</CardTitle>
                <CardDescription>On-time delivery and customer satisfaction</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <BarChart3 className="h-12 w-12 mx-auto mb-3 text-muted" />
                  <p>Delivery performance reports not available yet</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Generate reports on delivery times, success rates, and customer feedback
                  </p>
                  <Button>Generate Report</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Driver Performance</CardTitle>
                <CardDescription>Efficiency and safety metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <BarChart3 className="h-12 w-12 mx-auto mb-3 text-muted" />
                  <p>Driver performance reports not available yet</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Generate reports on driver efficiency, safety records, and performance metrics
                  </p>
                  <Button>Generate Report</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Customer Satisfaction</CardTitle>
                <CardDescription>Service quality and feedback analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <PieChart className="h-12 w-12 mx-auto mb-3 text-muted" />
                  <p>Customer satisfaction reports not available yet</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Generate reports on customer feedback, satisfaction scores, and service quality
                  </p>
                  <Button>Generate Report</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Business Growth</CardTitle>
                <CardDescription>Revenue growth and customer acquisition</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <TrendingUp className="h-12 w-12 mx-auto mb-3 text-muted" />
                  <p>Business growth reports not available yet</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Generate reports on revenue growth, customer acquisition, and market expansion
                  </p>
                  <Button>Generate Report</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="custom">
          <Card>
            <CardHeader>
              <CardTitle>Custom Reports</CardTitle>
              <CardDescription>
                Create and save custom reports with your preferred metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <FileText className="h-12 w-12 mx-auto mb-3 text-muted" />
                <p className="text-lg font-medium">Create Custom Reports</p>
                <p className="text-sm text-muted-foreground mb-4 max-w-lg mx-auto">
                  Build your own reports by selecting the metrics, time periods, and visualizations
                  that matter most to your business.
                </p>
                <Button>Create New Report</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}