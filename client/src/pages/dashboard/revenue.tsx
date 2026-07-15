import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Download, Filter, Loader2, Plus, Search } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";

// Sample data
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

const formatCurrency = (amount: number, currency: string = "EUR") => {
  return new Intl.NumberFormat("lt-LT", {
    style: "currency",
    currency: currency,
  }).format(amount);
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

export default function RevenuePage() {
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState<{
    start: Date | null;
    end: Date | null;
  }>({
    start: null,
    end: null,
  });

  // In a real implementation, this would be an API call
  const { data: revenue = demoRevenue, isLoading: isLoadingRevenue } = useQuery({
    queryKey: ["/api/revenue"],
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
      title: "Exporting revenue data",
      description: "Your export is being prepared and will download shortly.",
    });
    // In a real implementation, this would generate and download a file
  };

  const handleCreateRevenue = () => {
    toast({
      title: "Create revenue entry",
      description: "Opening revenue creation form.",
    });
    // In a real implementation, this would open a form to create a new revenue entry
  };

  const totalRevenue = filteredRevenue.reduce((total, item) => total + item.amount, 0);

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Revenue</h1>
          <p className="text-muted-foreground">
            Manage and track all company income
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleCreateRevenue}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Revenue
          </Button>
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

      <div className="grid gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Revenue</CardTitle>
            <CardDescription>
              Current period: {dateRange.start ? format(dateRange.start, "MMM dd, yyyy") : "All time"} 
              to {dateRange.end ? format(dateRange.end, "MMM dd, yyyy") : "Present"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {formatCurrency(totalRevenue)}
            </div>
            <div className="flex items-center mt-1 text-sm text-muted-foreground">
              <span>From {filteredRevenue.length} transactions</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle>Revenue Entries</CardTitle>
          <CardDescription>
            Track and manage all income sources
          </CardDescription>
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
              value={statusFilter || "all"}
              onValueChange={(value) => setStatusFilter(value === "all" ? null : value)}
            >
              <SelectTrigger className="md:w-[180px]">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <span>{statusFilter ? statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1) : "All Statuses"}</span>
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
              <Button onClick={handleCreateRevenue}>Add Revenue</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}