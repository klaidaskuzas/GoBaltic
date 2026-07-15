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
  ArrowDownIcon,
  ArrowUpIcon,
  CalendarIcon,
  CreditCard,
  DollarSign,
  Download,
  FileText,
  Filter,
  Plus,
  Search,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { format, subMonths } from "date-fns";
import { Loader2 } from "lucide-react";

// Sample data for financial information
const demoExpenses = [
  {
    id: 1,
    amount: 2500,
    currency: "EUR",
    category: "fuel",
    description: "Fuel expenses for April fleet operations",
    date: "2025-04-10",
    vehicleId: 3,
    vehicleName: "Mercedes Actros 1845",
    paymentMethod: "company_card",
    approved: true,
    approvedBy: "Admin",
    approvedAt: "2025-04-11T10:00:00",
  },
  {
    id: 2,
    amount: 1200,
    currency: "EUR",
    category: "maintenance",
    description: "Scheduled maintenance for Scania R450",
    date: "2025-04-05",
    vehicleId: 2,
    vehicleName: "Scania R450",
    paymentMethod: "bank_transfer",
    approved: true,
    approvedBy: "Admin",
    approvedAt: "2025-04-06T14:30:00",
  },
  {
    id: 3,
    amount: 350,
    currency: "EUR",
    category: "tolls",
    description: "Highway tolls for German routes",
    date: "2025-04-12",
    vehicleId: null,
    vehicleName: null,
    paymentMethod: "company_card",
    approved: true,
    approvedBy: "Admin",
    approvedAt: "2025-04-13T09:15:00",
  },
  {
    id: 4,
    amount: 4800,
    currency: "EUR",
    category: "salaries",
    description: "Driver salaries for March",
    date: "2025-04-01",
    vehicleId: null,
    vehicleName: null,
    paymentMethod: "bank_transfer",
    approved: true,
    approvedBy: "Admin",
    approvedAt: "2025-04-01T11:20:00",
  },
  {
    id: 5,
    amount: 1800,
    currency: "EUR",
    category: "insurance",
    description: "Quarterly insurance premium for fleet",
    date: "2025-03-30",
    vehicleId: null,
    vehicleName: null,
    paymentMethod: "bank_transfer",
    approved: false,
    approvedBy: null,
    approvedAt: null,
  },
];

const demoRevenue = [
  {
    id: 1,
    amount: 3500,
    currency: "EUR",
    source: "shipment",
    description: "Vehicle transport to Hamburg",
    date: "2025-04-15",
    shipmentId: 1,
    trackingNumber: "TRK-12345",
    customerName: "Jonas Valančiūnas",
    paymentMethod: "bank_transfer",
    paymentStatus: "paid",
    invoiceNumber: "INV-2025-001",
  },
  {
    id: 2,
    amount: 2800,
    currency: "EUR",
    source: "shipment",
    description: "Vehicle transport to Riga",
    date: "2025-04-19",
    shipmentId: 2,
    trackingNumber: "TRK-12346",
    customerName: "Žygimantas Logistics",
    paymentMethod: "credit_card",
    paymentStatus: "pending",
    invoiceNumber: "INV-2025-002",
  },
  {
    id: 3,
    amount: 4200,
    currency: "EUR",
    source: "shipment",
    description: "Vehicle transport to Prague",
    date: "2025-04-14",
    shipmentId: 3,
    trackingNumber: "TRK-12347",
    customerName: "Baltic Freight Ltd",
    paymentMethod: "bank_transfer",
    paymentStatus: "paid",
    invoiceNumber: "INV-2025-003",
  },
  {
    id: 4,
    amount: 5500,
    currency: "EUR",
    source: "shipment",
    description: "Vehicle transport to Munich",
    date: "2025-04-20",
    shipmentId: 4,
    trackingNumber: "TRK-12348",
    customerName: "Estonian Motors",
    paymentMethod: "bank_transfer",
    paymentStatus: "pending",
    invoiceNumber: "INV-2025-004",
  },
  {
    id: 5,
    amount: 3900,
    currency: "EUR",
    source: "shipment",
    description: "Vehicle transport to Stockholm",
    date: "2025-04-22",
    shipmentId: 5,
    trackingNumber: "TRK-12349",
    customerName: "Mindaugas Transport",
    paymentMethod: "credit_card",
    paymentStatus: "paid",
    invoiceNumber: "INV-2025-005",
  },
];

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

const getPaymentMethodLabel = (method: string) => {
  const labels: Record<string, string> = {
    company_card: "Company Card",
    bank_transfer: "Bank Transfer",
    cash: "Cash",
    credit_card: "Credit Card",
    other: "Other",
  };
  return labels[method] || method.replace(/_/g, " ");
};

const getPaymentStatusBadge = (status: string) => {
  switch (status) {
    case "paid":
      return "success";
    case "pending":
      return "warning";
    case "overdue":
      return "destructive";
    default:
      return "outline";
  }
};

export default function FinanceDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState<{
    start: Date | null;
    end: Date | null;
  }>({
    start: subMonths(new Date(), 1),
    end: new Date(),
  });

  // In a real implementation, these would be API calls
  const { data: expenses = demoExpenses, isLoading: isLoadingExpenses } = useQuery({
    queryKey: ["/api/expenses"],
    enabled: activeTab === "expenses",
  });

  const { data: revenue = demoRevenue, isLoading: isLoadingRevenue } = useQuery({
    queryKey: ["/api/revenue"],
    enabled: activeTab === "revenue",
  });

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

  const { data: summary = financialSummary, isLoading: isLoadingSummary } = useQuery({
    queryKey: ["/api/dashboard/financial-summary"],
    enabled: activeTab === "overview",
  });

  const filteredExpenses = expenses.filter((expense) => {
    // Apply category filter if set
    if (categoryFilter && expense.category !== categoryFilter) {
      return false;
    }

    // Apply search query if set
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        expense.description.toLowerCase().includes(query) ||
        expense.category.toLowerCase().includes(query) ||
        (expense.vehicleName && expense.vehicleName.toLowerCase().includes(query))
      );
    }

    return true;
  });

  const filteredRevenue = revenue.filter((item) => {
    // Apply status filter if set
    if (statusFilter && item.paymentStatus !== statusFilter) {
      return false;
    }

    // Apply search query if set
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        item.description.toLowerCase().includes(query) ||
        item.customerName.toLowerCase().includes(query) ||
        item.invoiceNumber.toLowerCase().includes(query) ||
        item.trackingNumber.toLowerCase().includes(query)
      );
    }

    return true;
  });

  const handleExportData = () => {
    toast({
      title: "Exporting financial data",
      description: "Your export is being prepared and will download shortly.",
    });
    // In a real implementation, this would generate and download a file
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Finance</h1>
          <p className="text-muted-foreground">
            Manage expenses, revenue, and financial reports
          </p>
        </div>
        <Button
          onClick={handleExportData}
          variant="outline"
          className="gap-2"
        >
          <Download className="h-4 w-4" />
          Export
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
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
                  +12% from last month
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
                  +8% from last month
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
                    +10% from last month
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
                    +2% from last month
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-4">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Financial Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  {/* In a real implementation, this would be a chart */}
                  <div className="flex flex-col space-y-8">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="h-4 w-4 rounded-full bg-primary" />
                          <span className="text-sm font-medium">Revenue</span>
                        </div>
                        <span className="text-sm text-muted-foreground">{formatCurrency(summary.totalRevenue)}</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-primary-50">
                        <div className="h-full rounded-full bg-primary" style={{ width: "100%" }} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="h-4 w-4 rounded-full bg-red-500" />
                          <span className="text-sm font-medium">Expenses</span>
                        </div>
                        <span className="text-sm text-muted-foreground">{formatCurrency(summary.totalExpenses)}</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-red-50">
                        <div className="h-full rounded-full bg-red-500" style={{ width: `${(summary.totalExpenses / summary.totalRevenue) * 100}%` }} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="h-4 w-4 rounded-full bg-green-500" />
                          <span className="text-sm font-medium">Net Profit</span>
                        </div>
                        <span className="text-sm text-muted-foreground">{formatCurrency(summary.netProfit)}</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-green-50">
                        <div className="h-full rounded-full bg-green-500" style={{ width: `${(summary.netProfit / summary.totalRevenue) * 100}%` }} />
                      </div>
                    </div>
                  </div>

                  {/* Monthly trends visualization */}
                  <div className="mt-8">
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
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Expense Breakdown</CardTitle>
                <CardDescription>
                  Expenses by category for current period
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {summary.expensesByCategory && Object.keys(summary.expensesByCategory).length > 0 ? (
                    Object.entries(summary.expensesByCategory).map(([category, amount]) => (
                      <div key={category} className="flex items-center">
                        <div className="flex items-center gap-2 w-40">
                          <Badge variant={getCategoryBadge(category)}>
                            {getCategoryLabel(category)}
                          </Badge>
                        </div>
                        <div className="ml-auto font-medium">{formatCurrency(amount)}</div>
                        <div className="ml-4 w-24 text-right text-muted-foreground text-xs">
                          {Math.round((amount / summary.totalExpenses) * 100)}%
                        </div>
                        <div className="ml-2 w-24">
                          <div className="h-2 w-full rounded-full bg-primary-50">
                            <div
                              className="h-full rounded-full bg-primary"
                              style={{
                                width: `${(amount / summary.totalExpenses) * 100}%`,
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

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Expenses</CardTitle>
                <CardDescription>
                  Last 5 expenses recorded in the system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {demoExpenses.slice(0, 5).map((expense) => (
                    <div
                      key={expense.id}
                      className="flex items-center p-2 rounded-lg hover:bg-muted"
                    >
                      <div className="mr-2">
                        <Badge variant={getCategoryBadge(expense.category)}>
                          {getCategoryLabel(expense.category)}
                        </Badge>
                      </div>
                      <div className="flex-1 ml-2">
                        <div className="text-sm font-medium">
                          {expense.description}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {format(new Date(expense.date), "MMM dd, yyyy")}
                        </div>
                      </div>
                      <div className="font-medium">
                        {formatCurrency(expense.amount)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Recent Revenue</CardTitle>
                <CardDescription>
                  Last 5 revenue entries recorded in the system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {demoRevenue.slice(0, 5).map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center p-2 rounded-lg hover:bg-muted"
                    >
                      <div className="mr-2">
                        <Badge
                          variant={
                            item.paymentStatus === "paid"
                              ? "success"
                              : "warning"
                          }
                        >
                          {item.paymentStatus}
                        </Badge>
                      </div>
                      <div className="flex-1 ml-2">
                        <div className="text-sm font-medium">
                          {item.description}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {item.customerName} - {item.invoiceNumber}
                        </div>
                      </div>
                      <div className="font-medium text-green-600">
                        {formatCurrency(item.amount)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="expenses">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Expenses</CardTitle>
                <CardDescription>Manage and track all company expenses</CardDescription>
              </div>
              <Button className="gap-2">
                <Plus className="h-4 w-4" /> Add Expense
              </Button>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-6">
                <div className="relative flex-1 w-full md:max-w-sm">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search expenses..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <Select
                  value={categoryFilter || ""}
                  onValueChange={(value) => setCategoryFilter(value || null)}
                >
                  <SelectTrigger className="md:w-[180px]">
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      <span>{categoryFilter ? getCategoryLabel(categoryFilter) : "All Categories"}</span>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="fuel">Fuel</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="tolls">Tolls</SelectItem>
                    <SelectItem value="salaries">Salaries</SelectItem>
                    <SelectItem value="insurance">Insurance</SelectItem>
                    <SelectItem value="office">Office</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {isLoadingExpenses ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : filteredExpenses.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Description</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Vehicle</TableHead>
                        <TableHead>Payment Method</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredExpenses.map((expense) => (
                        <TableRow key={expense.id}>
                          <TableCell className="font-medium">
                            {expense.description}
                          </TableCell>
                          <TableCell>
                            <Badge variant={getCategoryBadge(expense.category)}>
                              {getCategoryLabel(expense.category)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {formatCurrency(expense.amount, expense.currency)}
                          </TableCell>
                          <TableCell>
                            {format(new Date(expense.date), "MMM dd, yyyy")}
                          </TableCell>
                          <TableCell>
                            {expense.vehicleName || "N/A"}
                          </TableCell>
                          <TableCell>
                            {getPaymentMethodLabel(expense.paymentMethod)}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={expense.approved ? "success" : "outline"}
                            >
                              {expense.approved ? "Approved" : "Pending"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8"
                              asChild
                            >
                              <a href={`/dashboard/expenses/${expense.id}`}>
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
                <div className="text-center py-8 text-muted-foreground">
                  <CreditCard className="h-10 w-10 mx-auto mb-3 text-muted" />
                  <p>No expenses found</p>
                  <p className="text-sm mb-4">
                    {categoryFilter
                      ? `No expenses in the "${getCategoryLabel(categoryFilter)}" category`
                      : searchQuery
                      ? `No expenses matching "${searchQuery}"`
                      : "Add your first expense to start tracking"}
                  </p>
                  <Button>Add Expense</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Revenue</CardTitle>
                <CardDescription>Track and manage all income sources</CardDescription>
              </div>
              <Button className="gap-2">
                <Plus className="h-4 w-4" /> Add Revenue
              </Button>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-6">
                <div className="relative flex-1 w-full md:max-w-sm">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search revenue..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <Select
                  value={statusFilter || ""}
                  onValueChange={(value) => setStatusFilter(value || null)}
                >
                  <SelectTrigger className="md:w-[180px]">
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      <span>{statusFilter || "All Statuses"}</span>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {isLoadingRevenue ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : filteredRevenue.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Description</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Invoice</TableHead>
                        <TableHead>Payment Method</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRevenue.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">
                            {item.description}
                          </TableCell>
                          <TableCell>{item.customerName}</TableCell>
                          <TableCell className="text-green-600">
                            {formatCurrency(item.amount, item.currency)}
                          </TableCell>
                          <TableCell>
                            {format(new Date(item.date), "MMM dd, yyyy")}
                          </TableCell>
                          <TableCell>{item.invoiceNumber}</TableCell>
                          <TableCell>
                            {getPaymentMethodLabel(item.paymentMethod)}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={getPaymentStatusBadge(item.paymentStatus)}
                            >
                              {item.paymentStatus}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8"
                              asChild
                            >
                              <a href={`/dashboard/revenue/${item.id}`}>
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
                <div className="text-center py-8 text-muted-foreground">
                  <DollarSign className="h-10 w-10 mx-auto mb-3 text-muted" />
                  <p>No revenue entries found</p>
                  <p className="text-sm mb-4">
                    {statusFilter
                      ? `No revenue with status "${statusFilter}"`
                      : searchQuery
                      ? `No revenue matching "${searchQuery}"`
                      : "Add your first revenue entry to start tracking"}
                  </p>
                  <Button>Add Revenue</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Financial Reports</CardTitle>
              <CardDescription>
                Generate and view financial reports
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-medium mb-2">Income Statement</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Summary of your financial performance over time
                  </p>
                  <Button className="gap-2">
                    <FileText className="h-4 w-4" />
                    Generate Report
                  </Button>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-medium mb-2">Balance Sheet</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Overview of assets, liabilities, and equity
                  </p>
                  <Button className="gap-2">
                    <FileText className="h-4 w-4" />
                    Generate Report
                  </Button>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-medium mb-2">Cash Flow</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Track sources and uses of cash over time
                  </p>
                  <Button className="gap-2">
                    <FileText className="h-4 w-4" />
                    Generate Report
                  </Button>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h3 className="text-lg font-medium mb-4">Custom Reports</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Report Type
                    </label>
                    <Select defaultValue="profit_loss">
                      <SelectTrigger>
                        <SelectValue placeholder="Select report type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="profit_loss">Profit & Loss</SelectItem>
                        <SelectItem value="expenses_by_category">Expenses by Category</SelectItem>
                        <SelectItem value="revenue_by_customer">Revenue by Customer</SelectItem>
                        <SelectItem value="tax_summary">Tax Summary</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Date Range
                    </label>
                    <Select defaultValue="last_month">
                      <SelectTrigger>
                        <SelectValue placeholder="Select date range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="this_month">This Month</SelectItem>
                        <SelectItem value="last_month">Last Month</SelectItem>
                        <SelectItem value="this_quarter">This Quarter</SelectItem>
                        <SelectItem value="last_quarter">Last Quarter</SelectItem>
                        <SelectItem value="this_year">This Year</SelectItem>
                        <SelectItem value="last_year">Last Year</SelectItem>
                        <SelectItem value="custom">Custom Range</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button>Generate Custom Report</Button>
              </div>

              <div className="pt-4 border-t">
                <h3 className="text-lg font-medium mb-4">Saved Reports</h3>
                <div className="space-y-2">
                  <div className="flex items-center p-2 rounded-lg hover:bg-muted">
                    <FileText className="h-5 w-5 mr-3 text-muted-foreground" />
                    <div className="flex-1">
                      <div className="text-sm font-medium">
                        Q1 2025 Financial Summary
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Generated on April 5, 2025
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 gap-1">
                      <Download className="h-4 w-4" />
                      <span>Download</span>
                    </Button>
                  </div>
                  <div className="flex items-center p-2 rounded-lg hover:bg-muted">
                    <FileText className="h-5 w-5 mr-3 text-muted-foreground" />
                    <div className="flex-1">
                      <div className="text-sm font-medium">
                        March 2025 Expense Report
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Generated on April 2, 2025
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 gap-1">
                      <Download className="h-4 w-4" />
                      <span>Download</span>
                    </Button>
                  </div>
                  <div className="flex items-center p-2 rounded-lg hover:bg-muted">
                    <FileText className="h-5 w-5 mr-3 text-muted-foreground" />
                    <div className="flex-1">
                      <div className="text-sm font-medium">
                        2024 Annual Financial Statement
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Generated on January 15, 2025
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 gap-1">
                      <Download className="h-4 w-4" />
                      <span>Download</span>
                    </Button>
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