import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Download, Filter, Loader2, Plus, Search, Calendar, Euro } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";

// Sample data
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

// Define schema for new expense entry
const expenseSchema = z.object({
  date: z.string().min(1, "Date is required"),
  description: z.string().min(3, "Description must be at least 3 characters"),
  amount: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
    message: "Amount must be a positive number",
  }),
  category: z.string().min(1, "Category is required"),
  paymentMethod: z.string().min(1, "Payment method is required"),
  vehicleId: z.string().optional(),
});

type ExpenseFormData = z.infer<typeof expenseSchema>;

export default function ExpensesPage() {
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [yearFilter, setYearFilter] = useState<string>(new Date().getFullYear().toString());
  const [monthFilter, setMonthFilter] = useState<string>("all"); // "all" or 1-12
  const [formData, setFormData] = useState<ExpenseFormData>({
    date: new Date().toISOString().split('T')[0],
    description: "",
    amount: "",
    category: "",
    paymentMethod: "company_card",
    vehicleId: ""
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [dateRange, setDateRange] = useState<{
    start: Date | null;
    end: Date | null;
  }>({
    start: null,
    end: null,
  });

  // In a real implementation, this would be an API call
  const { data: expenses = demoExpenses, isLoading: isLoadingExpenses } = useQuery({
    queryKey: ["/api/expenses"],
  });

  // Mutation for adding a new expense
  const addExpenseMutation = useMutation({
    mutationFn: async (expenseData: ExpenseFormData) => {
      const response = await apiRequest("POST", "/api/expenses", {
        ...expenseData,
        amount: parseFloat(expenseData.amount),
        currency: "EUR",
        vehicleId: expenseData.vehicleId ? parseInt(expenseData.vehicleId) : null,
      });
      return response.json();
    },
    onSuccess: () => {
      // Invalidate expense queries to refresh the list
      queryClient.invalidateQueries({ queryKey: ["/api/expenses"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/financial-summary"] });
      
      toast({
        title: "Expense added",
        description: "New expense has been successfully added",
        variant: "success",
      });
      
      // Close the modal and reset form
      setIsFormOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast({
        title: "Error adding expense",
        description: error.message || "Failed to add expense. Please try again.",
        variant: "destructive",
      });
    }
  });

  const filteredExpenses = expenses.filter((expense) => {
    // Apply date filters (year and month)
    if (expense.date) {
      const expenseDate = new Date(expense.date);
      const expenseYear = expenseDate.getFullYear().toString();
      const expenseMonth = (expenseDate.getMonth() + 1).toString(); // 1-12
      
      // Filter by year
      if (yearFilter && expenseYear !== yearFilter) {
        return false;
      }
      
      // Filter by month if not set to "all"
      if (monthFilter !== "all" && expenseMonth !== monthFilter) {
        return false;
      }
    }
    
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

  const handleExportData = () => {
    toast({
      title: "Exporting expense data",
      description: "Your export is being prepared and will download shortly.",
    });
    // In a real implementation, this would generate and download a file
  };

  const handleCreateExpense = () => {
    setIsFormOpen(true);
  };
  
  const resetForm = () => {
    setFormData({
      date: new Date().toISOString().split('T')[0],
      description: "",
      amount: "",
      category: "",
      paymentMethod: "company_card",
      vehicleId: ""
    });
    setFormErrors({});
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear error for this field when user edits it
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: '',
      });
    }
  };
  
  const validateForm = (): boolean => {
    try {
      expenseSchema.parse(formData);
      setFormErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0].toString()] = err.message;
          }
        });
        setFormErrors(newErrors);
      }
      return false;
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      addExpenseMutation.mutate(formData);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Expenses</h1>
          <p className="text-muted-foreground">
            Manage and track all company expenses
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleCreateExpense}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Expense
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
      
      {/* Add Expense Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Expense</DialogTitle>
            <DialogDescription>
              Add expense details below. All fields are required unless marked optional.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="date">Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="date" 
                    name="date" 
                    type="date"
                    className="pl-8" 
                    value={formData.date}
                    onChange={handleInputChange}
                  />
                </div>
                {formErrors.date && <p className="text-sm text-destructive">{formErrors.date}</p>}
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  name="description"
                  placeholder="Enter expense description" 
                  value={formData.description}
                  onChange={handleInputChange}
                />
                {formErrors.description && <p className="text-sm text-destructive">{formErrors.description}</p>}
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="amount">Amount (EUR)</Label>
                <div className="relative">
                  <Euro className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="amount" 
                    name="amount"
                    type="number"
                    min="0.01"
                    step="0.01"
                    placeholder="0.00" 
                    className="pl-8"
                    value={formData.amount}
                    onChange={handleInputChange}
                  />
                </div>
                {formErrors.amount && <p className="text-sm text-destructive">{formErrors.amount}</p>}
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select 
                  name="category" 
                  value={formData.category}
                  onValueChange={(value) => {
                    setFormData({
                      ...formData,
                      category: value,
                    });
                    if (formErrors.category) {
                      setFormErrors({
                        ...formErrors,
                        category: '',
                      });
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
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
                {formErrors.category && <p className="text-sm text-destructive">{formErrors.category}</p>}
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="paymentMethod">Payment Method</Label>
                <Select 
                  name="paymentMethod" 
                  value={formData.paymentMethod}
                  onValueChange={(value) => {
                    setFormData({
                      ...formData,
                      paymentMethod: value,
                    });
                    if (formErrors.paymentMethod) {
                      setFormErrors({
                        ...formErrors,
                        paymentMethod: '',
                      });
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="company_card">Company Card</SelectItem>
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="credit_card">Credit Card</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {formErrors.paymentMethod && <p className="text-sm text-destructive">{formErrors.paymentMethod}</p>}
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="vehicleId">Vehicle (Optional)</Label>
                <Input 
                  id="vehicleId" 
                  name="vehicleId"
                  placeholder="Vehicle ID if applicable" 
                  value={formData.vehicleId}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsFormOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={addExpenseMutation.isPending}
              >
                {addExpenseMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Expense"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle>Expenses</CardTitle>
          <CardDescription>
            Track and manage all expense entries
          </CardDescription>
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
            
            <div className="flex flex-wrap gap-2">
              {/* Year filter */}
              <Select
                value={yearFilter}
                onValueChange={(value) => setYearFilter(value)}
              >
                <SelectTrigger className="md:w-[120px]">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{yearFilter}</span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {/* Month filter */}
              <Select
                value={monthFilter}
                onValueChange={(value) => setMonthFilter(value)}
              >
                <SelectTrigger className="md:w-[130px]">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {monthFilter === "all" 
                        ? "All Months" 
                        : new Date(0, parseInt(monthFilter) - 1).toLocaleString('default', { month: 'long' })
                      }
                    </span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Months</SelectItem>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                    <SelectItem key={month} value={month.toString()}>
                      {new Date(0, month - 1).toLocaleString('default', { month: 'long' })}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {/* Category filter */}
              <Select
                value={categoryFilter || "all"}
                onValueChange={(value) => setCategoryFilter(value === "all" ? null : value)}
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
                        <Badge variant={getCategoryBadge(expense.category) as any}>
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
                  : yearFilter !== new Date().getFullYear().toString() || monthFilter !== "all"
                  ? `No expenses found for the selected time period`
                  : "Add your first expense to start tracking"}
              </p>
              <Button onClick={handleCreateExpense}>Add Expense</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}