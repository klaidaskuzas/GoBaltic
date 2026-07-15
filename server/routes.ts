import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertQuoteSchema, insertShipmentSchema, shipmentUpdateSchema, insertExpenseSchema } from "@shared/schema";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import { setupAuth } from "./auth";
import sgMail from "@sendgrid/mail";

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

// Auth middleware to protect dashboard routes
const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ success: false, message: "Authentication required" });
};

// Admin-only middleware
const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated() && req.user && req.user.role === "admin") {
    return next();
  }
  return res.status(403).json({ success: false, message: "Admin access required" });
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes and middleware
  setupAuth(app);
  // API routes for quotes
  app.post("/api/quotes", async (req: Request, res: Response) => {
    try {
      const quoteData = insertQuoteSchema.parse(req.body);
      const quote = await storage.createQuote(quoteData);

      // Send email notification to info@gobaltic.lt
      if (process.env.SENDGRID_API_KEY) {
        const { fullName, email, phone, serviceType, pickupLocation, deliveryPlace, cargoDetails } = req.body;
        const emailBody = `
<h2>Nauja užklausa / New Quote Request — GoBaltic</h2>
<table style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif;">
  <tr><td style="padding:8px;background:#f1f5f9;font-weight:bold;width:180px;">Vardas / Name</td><td style="padding:8px;border-bottom:1px solid #e2e8f0;">${fullName || '—'}</td></tr>
  <tr><td style="padding:8px;background:#f1f5f9;font-weight:bold;">El. paštas / Email</td><td style="padding:8px;border-bottom:1px solid #e2e8f0;">${email || '—'}</td></tr>
  <tr><td style="padding:8px;background:#f1f5f9;font-weight:bold;">Telefonas / Phone</td><td style="padding:8px;border-bottom:1px solid #e2e8f0;">${phone || '—'}</td></tr>
  <tr><td style="padding:8px;background:#f1f5f9;font-weight:bold;">Paslaugos tipas / Service Type</td><td style="padding:8px;border-bottom:1px solid #e2e8f0;">${serviceType || '—'}</td></tr>
  <tr><td style="padding:8px;background:#f1f5f9;font-weight:bold;">Paėmimo vieta / Pickup</td><td style="padding:8px;border-bottom:1px solid #e2e8f0;">${pickupLocation || '—'}</td></tr>
  <tr><td style="padding:8px;background:#f1f5f9;font-weight:bold;">Pristatymo vieta / Delivery</td><td style="padding:8px;border-bottom:1px solid #e2e8f0;">${deliveryPlace || '—'}</td></tr>
  <tr><td style="padding:8px;background:#f1f5f9;font-weight:bold;">Informacija / Details</td><td style="padding:8px;">${cargoDetails || '—'}</td></tr>
</table>
<p style="margin-top:16px;color:#64748b;font-size:13px;">Ši žinutė buvo išsiųsta per GoBaltic svetainės kontaktų formą.</p>
        `.trim();

        await sgMail.send({
          to: "info@gobaltic.lt",
          from: "info@gobaltic.lt",
          replyTo: email || "info@gobaltic.lt",
          subject: `GoBaltic užklausa nuo ${fullName || 'nežinomo kliento'}`,
          html: emailBody,
        });
      }

      return res.status(201).json({ message: "Quote request submitted successfully", quote });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      console.error("Quote submission error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/quotes", requireAuth, async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : undefined;
      const quotes = await storage.getQuotes(limit, offset);
      return res.json(quotes);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/quotes/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }

      const quote = await storage.getQuote(id);
      if (!quote) {
        return res.status(404).json({ message: "Quote not found" });
      }

      return res.json(quote);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // API routes for shipments
  app.post("/api/shipments", requireAuth, async (req: Request, res: Response) => {
    try {
      const shipmentData = insertShipmentSchema.parse(req.body);
      const shipment = await storage.createShipment(shipmentData);
      return res.status(201).json({ message: "Shipment created successfully", shipment });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/shipments", requireAuth, async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : undefined;
      const shipments = await storage.getShipments(limit, offset);
      return res.json(shipments);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/shipments/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }

      const shipment = await storage.getShipment(id);
      if (!shipment) {
        return res.status(404).json({ message: "Shipment not found" });
      }

      return res.json(shipment);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/track/:trackingNumber", async (req: Request, res: Response) => {
    try {
      const { trackingNumber } = req.params;
      
      if (!trackingNumber || trackingNumber.trim() === '') {
        return res.status(400).json({ message: "Tracking number is required" });
      }

      const shipment = await storage.getShipmentByTrackingNumber(trackingNumber);
      if (!shipment) {
        return res.status(404).json({ 
          success: false, 
          message: "No shipment found with the provided tracking number" 
        });
      }

      return res.json({
        success: true,
        shipment
      });
    } catch (error) {
      return res.status(500).json({ 
        success: false, 
        message: "Internal server error" 
      });
    }
  });
  
  // Dashboard API endpoints
  app.get("/api/dashboard/financial-summary", requireAuth, async (req: Request, res: Response) => {
    try {
      // Parse date parameters if provided
      let startDate: Date | undefined;
      let endDate: Date | undefined;
      
      if (req.query.startDate) {
        startDate = new Date(req.query.startDate as string);
      }
      
      if (req.query.endDate) {
        endDate = new Date(req.query.endDate as string);
      }
      
      const financialSummary = await storage.getFinancialSummary(startDate, endDate);
      return res.json(financialSummary);
    } catch (error) {
      console.error("Error fetching financial summary:", error);
      return res.status(500).json({ message: "Failed to fetch financial summary" });
    }
  });
  
  app.get("/api/dashboard/shipment-stats", requireAuth, async (_req: Request, res: Response) => {
    try {
      const shipmentStats = await storage.getShipmentStats();
      return res.json(shipmentStats);
    } catch (error) {
      console.error("Error fetching shipment stats:", error);
      return res.status(500).json({ message: "Failed to fetch shipment stats" });
    }
  });
  
  app.get("/api/dashboard/customer-stats", requireAuth, async (_req: Request, res: Response) => {
    try {
      const customerStats = await storage.getCustomerStats();
      return res.json(customerStats);
    } catch (error) {
      console.error("Error fetching customer stats:", error);
      return res.status(500).json({ message: "Failed to fetch customer stats" });
    }
  });

  // Customer API endpoints
  app.get("/api/customers", requireAuth, async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : undefined;
      const customers = await storage.getAllCustomers(limit, offset);
      return res.json(customers);
    } catch (error) {
      console.error("Error fetching customers:", error);
      return res.status(500).json({ message: "Failed to fetch customers" });
    }
  });
  
  app.post("/api/customers", requireAuth, async (req: Request, res: Response) => {
    try {
      // Create the customer
      const newCustomer = await storage.createCustomer(req.body);
      return res.status(201).json(newCustomer);
    } catch (error) {
      console.error("Error creating customer:", error);
      return res.status(500).json({ message: "Failed to create customer" });
    }
  });

  app.get("/api/customers/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const customer = await storage.getCustomer(id);
      
      if (!customer) {
        return res.status(404).json({ message: "Customer not found" });
      }
      
      return res.json(customer);
    } catch (error) {
      console.error("Error fetching customer:", error);
      return res.status(500).json({ message: "Failed to fetch customer" });
    }
  });

  // Vehicle API endpoints
  app.get("/api/vehicles", requireAuth, async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : undefined;
      const vehicles = await storage.getAllVehicles(limit, offset);
      return res.json(vehicles);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      return res.status(500).json({ message: "Failed to fetch vehicles" });
    }
  });
  
  app.get("/api/vehicles/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const vehicle = await storage.getVehicle(id);
      
      if (!vehicle) {
        return res.status(404).json({ message: "Vehicle not found" });
      }
      
      return res.json(vehicle);
    } catch (error) {
      console.error("Error fetching vehicle:", error);
      return res.status(500).json({ message: "Failed to fetch vehicle" });
    }
  });
  
  // Finance API endpoints
  app.get("/api/expenses", requireAuth, async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : undefined;
      const category = req.query.category as string;
      
      let expenses;
      if (category) {
        expenses = await storage.getExpensesByCategory(category, limit, offset);
      } else {
        expenses = await storage.getAllExpenses(limit, offset);
      }
      
      return res.json(expenses);
    } catch (error) {
      console.error("Error fetching expenses:", error);
      return res.status(500).json({ message: "Failed to fetch expenses" });
    }
  });
  
  // Add expense endpoint
  app.post("/api/expenses", requireAuth, async (req: Request, res: Response) => {
    try {
      console.log("Received expense data:", JSON.stringify(req.body));
      
      // Convert amount from string to number if needed
      let processedData = { ...req.body };
      if (typeof processedData.amount === 'string') {
        processedData.amount = parseFloat(processedData.amount);
      }
      
      // Convert vehicleId from string to number if needed and not empty
      if (processedData.vehicleId && typeof processedData.vehicleId === 'string') {
        processedData.vehicleId = processedData.vehicleId.trim() === '' ? null : parseInt(processedData.vehicleId);
      }
      
      // Using the existing insertExpenseSchema from shared/schema.ts
      const expenseData = insertExpenseSchema.parse({
        ...processedData,
        amount: processedData.amount,
        date: processedData.date,
        description: processedData.description || '',
        category: processedData.category,
        paymentMethod: processedData.paymentMethod,
        currency: processedData.currency || 'EUR',
        vehicleId: processedData.vehicleId || null,
        approved: false,
        // Do not include fields if they are null or undefined
        ...(processedData.createdBy ? { createdBy: processedData.createdBy } : {}),
      });
      
      console.log("Parsed expense data:", JSON.stringify(expenseData));
      
      // Create the expense
      const newExpense = await storage.createExpense(expenseData);
      
      return res.status(201).json({
        message: "Expense added successfully",
        expense: newExpense
      });
    } catch (error) {
      console.error("Error adding expense:", error);
      
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ 
          message: "Validation error", 
          errors: validationError.details 
        });
      }
      
      return res.status(500).json({ 
        message: "Failed to add expense", 
        error: error instanceof Error ? error.message : String(error)
      });
    }
  });
  
  app.get("/api/revenue", requireAuth, async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : undefined;
      const source = req.query.source as string;
      
      let revenue;
      if (source) {
        revenue = await storage.getRevenueBySource(source, limit, offset);
      } else {
        revenue = await storage.getAllRevenue(limit, offset);
      }
      
      return res.json(revenue);
    } catch (error) {
      console.error("Error fetching revenue:", error);
      return res.status(500).json({ message: "Failed to fetch revenue" });
    }
  });

  app.patch("/api/shipments/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }

      const shipment = await storage.getShipment(id);
      if (!shipment) {
        return res.status(404).json({ message: "Shipment not found" });
      }

      const updateData = shipmentUpdateSchema.parse(req.body);
      const updatedShipment = await storage.updateShipment(id, updateData);

      return res.json({ 
        message: "Shipment updated successfully", 
        shipment: updatedShipment 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // API routes for notifications
  app.post("/api/notifications", requireAuth, async (req: Request, res: Response) => {
    try {
      // Create a notification schema
      const notificationSchema = z.object({
        userId: z.number(),
        type: z.string(),
        title: z.string(),
        message: z.string(),
        isRead: z.boolean().optional().default(false),
        relatedEntityType: z.string().nullable().optional(),
        relatedEntityId: z.number().nullable().optional(),
        priority: z.string().nullable().optional().default("normal"),
        action: z.string().nullable().optional()
      });
      
      const parsedData = notificationSchema.parse(req.body);
      
      // Process data to handle null/undefined correctly
      const notificationData = {
        userId: parsedData.userId,
        type: parsedData.type,
        title: parsedData.title,
        message: parsedData.message,
        isRead: parsedData.isRead ?? false,
        relatedEntityType: parsedData.relatedEntityType ?? null,
        relatedEntityId: parsedData.relatedEntityId ?? null,
        priority: parsedData.priority ?? null,
        action: parsedData.action ?? null
      };
      const notification = await storage.createNotification(notificationData);
      
      return res.status(201).json({ 
        message: "Notification created successfully", 
        notification 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Get notifications for the current user
  app.get("/api/notifications", requireAuth, async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.query.userId as string);
      
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
      
      const notifications = await storage.getNotificationsByUser(userId, limit, offset);
      const unreadCount = await storage.countUnreadNotifications(userId);
      
      return res.json({ 
        notifications,
        unreadCount
      });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Mark notification as read
  app.patch("/api/notifications/:id/read", requireAuth, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid notification ID" });
      }
      
      const notification = await storage.markNotificationAsRead(id);
      
      if (!notification) {
        return res.status(404).json({ message: "Notification not found" });
      }
      
      return res.json({ 
        message: "Notification marked as read",
        notification
      });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
