import { 
  // User models
  users, type User, type InsertUser, 
  // Customer models
  customers, type Customer, type InsertCustomer,
  // Quote models
  quotes, type Quote, type InsertQuote,
  // Shipment models
  shipments, type Shipment, type InsertShipment, type ShipmentUpdate,
  // Vehicle models
  vehicles, type Vehicle, type InsertVehicle,
  // Expense models
  expenses, type Expense, type InsertExpense,
  // Revenue models
  revenue, type Revenue, type InsertRevenue,
  // Analytics models
  analyticsEvents, type AnalyticsEvent, type InsertAnalyticsEvent,
  // AI Conversation models
  aiConversations, aiMessages,
  // Notification models
  notifications, type Notification
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, like, sql, count } from "drizzle-orm";
import { hash, compare } from "bcrypt";

// Interface defining all CRUD operations the storage layer supports
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  
  // Customer operations
  getCustomer(id: number): Promise<Customer | undefined>;
  getCustomerByEmail(email: string): Promise<Customer | undefined>;
  createCustomer(customer: InsertCustomer): Promise<Customer>;
  updateCustomer(id: number, customer: Partial<InsertCustomer>): Promise<Customer | undefined>;
  getAllCustomers(limit?: number, offset?: number): Promise<Customer[]>;
  countCustomers(): Promise<number>;

  // Quote operations
  createQuote(quote: InsertQuote): Promise<Quote>;
  getQuotes(limit?: number, offset?: number): Promise<Quote[]>;
  getQuote(id: number): Promise<Quote | undefined>;
  updateQuote(id: number, quote: Partial<InsertQuote>): Promise<Quote | undefined>;
  countQuotes(): Promise<number>;
  
  // Shipment operations
  createShipment(shipment: InsertShipment): Promise<Shipment>;
  getShipments(limit?: number, offset?: number): Promise<Shipment[]>;
  getShipment(id: number): Promise<Shipment | undefined>;
  getShipmentByTrackingNumber(trackingNumber: string): Promise<Shipment | undefined>;
  updateShipment(id: number, update: ShipmentUpdate): Promise<Shipment | undefined>;
  countShipments(): Promise<number>;
  
  // Vehicle operations
  createVehicle(vehicle: InsertVehicle): Promise<Vehicle>;
  getVehicle(id: number): Promise<Vehicle | undefined>;
  getVehicleByRegistration(registrationNumber: string): Promise<Vehicle | undefined>;
  getAllVehicles(limit?: number, offset?: number): Promise<Vehicle[]>;
  updateVehicle(id: number, vehicle: Partial<InsertVehicle>): Promise<Vehicle | undefined>;
  countVehicles(): Promise<number>;
  
  // Finance operations
  createExpense(expense: InsertExpense): Promise<Expense>;
  getAllExpenses(limit?: number, offset?: number): Promise<Expense[]>;
  getExpensesByCategory(category: string, limit?: number, offset?: number): Promise<Expense[]>;
  updateExpense(id: number, expense: Partial<InsertExpense>): Promise<Expense | undefined>;
  
  createRevenue(revenueItem: InsertRevenue): Promise<Revenue>;
  getAllRevenue(limit?: number, offset?: number): Promise<Revenue[]>;
  getRevenueBySource(source: string, limit?: number, offset?: number): Promise<Revenue[]>;
  updateRevenue(id: number, revenueItem: Partial<InsertRevenue>): Promise<Revenue | undefined>;
  
  // Analytics operations
  createAnalyticsEvent(event: InsertAnalyticsEvent): Promise<AnalyticsEvent>;
  getAnalyticsEvents(limit?: number, offset?: number): Promise<AnalyticsEvent[]>;
  getAnalyticsEventsByType(eventType: string, limit?: number, offset?: number): Promise<AnalyticsEvent[]>;
  
  // Dashboard operations
  getFinancialSummary(startDate?: Date, endDate?: Date): Promise<{
    totalRevenue: number;
    totalExpenses: number;
    netProfit: number;
    revenueBySource: Record<string, number>;
    expensesByCategory: Record<string, number>;
  }>;
  
  getShipmentStats(): Promise<{
    totalShipments: number;
    pendingShipments: number;
    inTransitShipments: number;
    deliveredShipments: number;
    cancelledShipments: number;
  }>;
  
  getCustomerStats(): Promise<{
    totalCustomers: number;
    newCustomersThisMonth: number;
    topCustomers: Array<{id: number, name: string, total: number}>;
  }>;
  
  // Notification operations
  createNotification(notification: Omit<Notification, 'id' | 'createdAt'>): Promise<Notification>;
  getNotificationsByUser(userId: number, limit?: number, offset?: number): Promise<Notification[]>;
  markNotificationAsRead(id: number): Promise<Notification | undefined>;
  countUnreadNotifications(userId: number): Promise<number>;
}

// In-memory storage implementation (for development/testing)
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private quotes: Map<number, Quote>;
  private shipments: Map<number, Shipment>;
  private userCurrentId: number;
  private quoteCurrentId: number;
  private shipmentCurrentId: number;

  constructor() {
    this.users = new Map();
    this.quotes = new Map();
    this.shipments = new Map();
    this.notifications = new Map();
    this.userCurrentId = 1;
    this.quoteCurrentId = 1;
    this.shipmentCurrentId = 1;
    this.notificationCurrentId = 1;
    
    // Add some sample shipments for demo purposes
    this.initializeSampleShipments();
  }

  private initializeSampleShipments() {
    // Adding sample shipments directly with createShipment to avoid type issues
    this.createShipment({
      trackingNumber: "GOBAL-12345",
      customerName: "John Smith",
      customerEmail: "john@example.com",
      vehicleModel: "BMW X5 2022",
      origin: "Berlin, Germany",
      destination: "Vilnius, Lithuania",
      status: "in_transit",
      estimatedDeliveryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      currentLocation: "Warsaw, Poland",
      notes: "Vehicle is in good condition, currently at the Warsaw distribution center."
    });
    
    this.createShipment({
      trackingNumber: "GOBAL-67890",
      customerName: "Maria Garcia",
      customerEmail: "maria@example.com",
      vehicleModel: "Audi A4 2021",
      origin: "Paris, France",
      destination: "Riga, Latvia",
      status: "customs_clearance",
      estimatedDeliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      currentLocation: "Lithuania Border Customs",
      notes: "Vehicle is undergoing customs inspection at the Lithuanian border."
    });
    
    this.createShipment({
      trackingNumber: "GOBAL-24680",
      customerName: "Alex Johnson",
      customerEmail: "alex@example.com",
      vehicleModel: "Tesla Model 3 2023",
      origin: "Amsterdam, Netherlands",
      destination: "Tallinn, Estonia",
      status: "delivered",
      estimatedDeliveryDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      currentLocation: "Tallinn, Estonia",
      notes: "Vehicle has been successfully delivered to the destination."
    });
  }

  // Basic User Operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const now = new Date();
    // Create a complete user with all required fields
    const user: User = { 
      ...insertUser, 
      id,
      createdAt: now,
      lastLogin: null,
      isActive: true,
      profileImage: null,
      email: insertUser.email || null,
      fullName: insertUser.fullName || null,
      role: insertUser.role || "user"
    };
    this.users.set(id, user);
    return user;
  }
  
  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  
  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  // Basic Quote Operations
  async createQuote(insertQuote: InsertQuote): Promise<Quote> {
    const id = this.quoteCurrentId++;
    const quote: Quote = { 
      ...insertQuote, 
      id, 
      createdAt: new Date(),
      // Ensure fields are not undefined
      phone: insertQuote.phone || null,
      serviceType: insertQuote.serviceType || null
    };
    this.quotes.set(id, quote);
    return quote;
  }

  async getQuotes(limit?: number, offset?: number): Promise<Quote[]> {
    const quotes = Array.from(this.quotes.values());
    
    if (limit !== undefined && offset !== undefined) {
      return quotes.slice(offset, offset + limit);
    }
    
    return quotes;
  }

  async getQuote(id: number): Promise<Quote | undefined> {
    return this.quotes.get(id);
  }
  
  async updateQuote(id: number, quoteData: Partial<InsertQuote>): Promise<Quote | undefined> {
    const quote = this.quotes.get(id);
    if (!quote) return undefined;
    
    const updatedQuote = { ...quote, ...quoteData };
    this.quotes.set(id, updatedQuote);
    return updatedQuote;
  }
  
  async countQuotes(): Promise<number> {
    return this.quotes.size;
  }

  // Basic Shipment Operations
  async createShipment(insertShipment: InsertShipment): Promise<Shipment> {
    const id = this.shipmentCurrentId++;
    const now = new Date();
    const shipment: Shipment = {
      ...insertShipment,
      id,
      createdAt: now,
      updatedAt: now,
      // Ensure fields are not undefined
      status: insertShipment.status || 'pending',
      estimatedDeliveryDate: insertShipment.estimatedDeliveryDate || null,
      currentLocation: insertShipment.currentLocation || null,
      notes: insertShipment.notes || null
    };
    this.shipments.set(id, shipment);
    return shipment;
  }

  async getShipments(limit?: number, offset?: number): Promise<Shipment[]> {
    const shipments = Array.from(this.shipments.values());
    
    if (limit !== undefined && offset !== undefined) {
      return shipments.slice(offset, offset + limit);
    }
    
    return shipments;
  }

  async getShipment(id: number): Promise<Shipment | undefined> {
    return this.shipments.get(id);
  }

  async getShipmentByTrackingNumber(trackingNumber: string): Promise<Shipment | undefined> {
    return Array.from(this.shipments.values()).find(
      (shipment) => shipment.trackingNumber.toLowerCase() === trackingNumber.toLowerCase(),
    );
  }

  async updateShipment(id: number, update: ShipmentUpdate): Promise<Shipment | undefined> {
    const shipment = this.shipments.get(id);
    if (!shipment) {
      return undefined;
    }

    const updatedShipment: Shipment = {
      ...shipment,
      ...update,
      updatedAt: new Date()
    };

    this.shipments.set(id, updatedShipment);
    return updatedShipment;
  }
  
  async countShipments(): Promise<number> {
    return this.shipments.size;
  }
  
  // Customer Operations (mocks for interface compliance)
  async getCustomer(id: number): Promise<Customer | undefined> {
    return undefined;
  }
  
  async getCustomerByEmail(email: string): Promise<Customer | undefined> {
    return undefined;
  }
  
  async createCustomer(customer: InsertCustomer): Promise<Customer> {
    return {} as Customer;
  }
  
  async updateCustomer(id: number, customer: Partial<InsertCustomer>): Promise<Customer | undefined> {
    return undefined;
  }
  
  async getAllCustomers(limit?: number, offset?: number): Promise<Customer[]> {
    return [];
  }
  
  async countCustomers(): Promise<number> {
    return 0;
  }
  
  // Vehicle Operations (mocks for interface compliance)
  async createVehicle(vehicle: InsertVehicle): Promise<Vehicle> {
    return {} as Vehicle;
  }
  
  async getVehicle(id: number): Promise<Vehicle | undefined> {
    return undefined;
  }
  
  async getVehicleByRegistration(registrationNumber: string): Promise<Vehicle | undefined> {
    return undefined;
  }
  
  async getAllVehicles(limit?: number, offset?: number): Promise<Vehicle[]> {
    return [];
  }
  
  async updateVehicle(id: number, vehicle: Partial<InsertVehicle>): Promise<Vehicle | undefined> {
    return undefined;
  }
  
  async countVehicles(): Promise<number> {
    return 0;
  }
  
  // Finance Operations (mocks for interface compliance)
  async createExpense(expense: InsertExpense): Promise<Expense> {
    return {} as Expense;
  }
  
  async getAllExpenses(limit?: number, offset?: number): Promise<Expense[]> {
    return [];
  }
  
  async getExpensesByCategory(category: string, limit?: number, offset?: number): Promise<Expense[]> {
    return [];
  }
  
  async updateExpense(id: number, expense: Partial<InsertExpense>): Promise<Expense | undefined> {
    return undefined;
  }
  
  async createRevenue(revenueItem: InsertRevenue): Promise<Revenue> {
    return {} as Revenue;
  }
  
  async getAllRevenue(limit?: number, offset?: number): Promise<Revenue[]> {
    return [];
  }
  
  async getRevenueBySource(source: string, limit?: number, offset?: number): Promise<Revenue[]> {
    return [];
  }
  
  async updateRevenue(id: number, revenueItem: Partial<InsertRevenue>): Promise<Revenue | undefined> {
    return undefined;
  }
  
  // Analytics Operations (mocks for interface compliance)
  async createAnalyticsEvent(event: InsertAnalyticsEvent): Promise<AnalyticsEvent> {
    return {} as AnalyticsEvent;
  }
  
  async getAnalyticsEvents(limit?: number, offset?: number): Promise<AnalyticsEvent[]> {
    return [];
  }
  
  async getAnalyticsEventsByType(eventType: string, limit?: number, offset?: number): Promise<AnalyticsEvent[]> {
    return [];
  }
  
  // Dashboard Operations (mocks for interface compliance)
  async getFinancialSummary(startDate?: Date, endDate?: Date): Promise<{
    totalRevenue: number;
    totalExpenses: number;
    netProfit: number;
    revenueBySource: Record<string, number>;
    expensesByCategory: Record<string, number>;
  }> {
    return {
      totalRevenue: 0,
      totalExpenses: 0,
      netProfit: 0,
      revenueBySource: {},
      expensesByCategory: {}
    };
  }
  
  async getShipmentStats(): Promise<{
    totalShipments: number;
    pendingShipments: number;
    inTransitShipments: number;
    deliveredShipments: number;
    cancelledShipments: number;
  }> {
    return {
      totalShipments: this.shipments.size,
      pendingShipments: Array.from(this.shipments.values()).filter(s => s.status === 'pending').length,
      inTransitShipments: Array.from(this.shipments.values()).filter(s => s.status === 'in_transit').length,
      deliveredShipments: Array.from(this.shipments.values()).filter(s => s.status === 'delivered').length,
      cancelledShipments: 0
    };
  }
  
  async getCustomerStats(): Promise<{
    totalCustomers: number;
    newCustomersThisMonth: number;
    topCustomers: Array<{id: number, name: string, total: number}>;
  }> {
    return {
      totalCustomers: 0,
      newCustomersThisMonth: 0,
      topCustomers: []
    };
  }
  
  // Notification Operations (mocks for interface compliance)
  async createNotification(notification: Omit<Notification, 'id' | 'createdAt'>): Promise<Notification> {
    // Create a new notification with generated ID and timestamp
    const id = this.notificationCurrentId++;
    const createdAt = new Date();
    
    // Create the full notification
    const newNotification: Notification = {
      id,
      createdAt,
      ...notification
    };
    
    // Store the notification in our map
    this.notifications.set(id, newNotification);
    
    return newNotification;
  }
  
  // Use an in-memory store for notifications
  private notifications: Map<number, Notification> = new Map();
  private notificationCurrentId: number = 1;
  
  async getNotificationsByUser(userId: number, limit: number = 20, offset: number = 0): Promise<Notification[]> {
    // Get all notifications for the user
    const userNotifications = Array.from(this.notifications.values())
      .filter(notification => notification.userId === userId)
      .sort((a, b) => {
        // Sort by creation date (newest first)
        const dateA = a.createdAt instanceof Date ? a.createdAt : new Date();
        const dateB = b.createdAt instanceof Date ? b.createdAt : new Date();
        return dateB.getTime() - dateA.getTime();
      });
    
    // Apply pagination
    const paginatedNotifications = userNotifications.slice(offset, offset + limit);
    
    return paginatedNotifications;
  }
  
  async markNotificationAsRead(id: number): Promise<Notification | undefined> {
    const notification = this.notifications.get(id);
    
    if (!notification) {
      return undefined;
    }
    
    // Update the notification to be read
    const updatedNotification = {
      ...notification,
      isRead: true
    };
    
    // Store the updated notification
    this.notifications.set(id, updatedNotification);
    
    return updatedNotification;
  }
  
  async countUnreadNotifications(userId: number): Promise<number> {
    // Count unread notifications for the user
    const unreadCount = Array.from(this.notifications.values())
      .filter(notification => notification.userId === userId && !notification.isRead)
      .length;
    
    return unreadCount;
  }
}

// Database storage implementation
export class DatabaseStorage implements IStorage {
  // User Operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    // For security, hash the password before storing
    const hashedPassword = typeof insertUser.password === 'string' 
      ? await hash(insertUser.password, 10) 
      : insertUser.password;
      
    const userData = {
      ...insertUser,
      password: hashedPassword,
    };
    
    const [user] = await db.insert(users).values(userData).returning();
    return user;
  }
  
  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined> {
    // If updating password, hash it first
    if (userData.password) {
      userData.password = await hash(userData.password, 10);
    }
    
    const [updatedUser] = await db
      .update(users)
      .set({ ...userData, })
      .where(eq(users.id, id))
      .returning();
    
    return updatedUser;
  }
  
  async getAllUsers(): Promise<User[]> {
    return db.select().from(users);
  }
  
  // Customer Operations
  async getCustomer(id: number): Promise<Customer | undefined> {
    const [customer] = await db.select().from(customers).where(eq(customers.id, id));
    return customer;
  }
  
  async getCustomerByEmail(email: string): Promise<Customer | undefined> {
    const [customer] = await db.select().from(customers).where(eq(customers.email, email));
    return customer;
  }
  
  async createCustomer(customer: InsertCustomer): Promise<Customer> {
    const [newCustomer] = await db.insert(customers).values(customer).returning();
    return newCustomer;
  }
  
  async updateCustomer(id: number, customerData: Partial<InsertCustomer>): Promise<Customer | undefined> {
    const [updatedCustomer] = await db
      .update(customers)
      .set(customerData)
      .where(eq(customers.id, id))
      .returning();
    
    return updatedCustomer;
  }
  
  async getAllCustomers(limit = 100, offset = 0): Promise<Customer[]> {
    return db.select()
      .from(customers)
      .limit(limit)
      .offset(offset)
      .orderBy(desc(customers.createdAt));
  }
  
  async countCustomers(): Promise<number> {
    const [result] = await db
      .select({ count: count() })
      .from(customers);
    
    return result?.count || 0;
  }

  // Quote Operations
  async createQuote(insertQuote: InsertQuote): Promise<Quote> {
    const [quote] = await db.insert(quotes).values({
      ...insertQuote,
      status: insertQuote.status || 'pending',
    }).returning();
    
    return quote;
  }

  async getQuotes(limit = 100, offset = 0): Promise<Quote[]> {
    return db.select()
      .from(quotes)
      .limit(limit)
      .offset(offset)
      .orderBy(desc(quotes.createdAt));
  }

  async getQuote(id: number): Promise<Quote | undefined> {
    const [quote] = await db.select().from(quotes).where(eq(quotes.id, id));
    return quote;
  }
  
  async updateQuote(id: number, quoteData: Partial<InsertQuote>): Promise<Quote | undefined> {
    const [updatedQuote] = await db
      .update(quotes)
      .set(quoteData)
      .where(eq(quotes.id, id))
      .returning();
    
    return updatedQuote;
  }
  
  async countQuotes(): Promise<number> {
    const [result] = await db
      .select({ count: count() })
      .from(quotes);
    
    return result?.count || 0;
  }

  // Shipment Operations
  async createShipment(insertShipment: InsertShipment): Promise<Shipment> {
    const now = new Date();
    
    const [shipment] = await db.insert(shipments).values({
      ...insertShipment,
      status: insertShipment.status || 'pending',
      createdAt: now,
      updatedAt: now,
    }).returning();
    
    return shipment;
  }

  async getShipments(limit = 100, offset = 0): Promise<Shipment[]> {
    return db.select()
      .from(shipments)
      .limit(limit)
      .offset(offset)
      .orderBy(desc(shipments.updatedAt));
  }

  async getShipment(id: number): Promise<Shipment | undefined> {
    const [shipment] = await db.select().from(shipments).where(eq(shipments.id, id));
    return shipment;
  }

  async getShipmentByTrackingNumber(trackingNumber: string): Promise<Shipment | undefined> {
    const [shipment] = await db
      .select()
      .from(shipments)
      .where(eq(shipments.trackingNumber, trackingNumber));
    
    return shipment;
  }

  async updateShipment(id: number, update: ShipmentUpdate): Promise<Shipment | undefined> {
    const [updatedShipment] = await db
      .update(shipments)
      .set({
        ...update,
        updatedAt: new Date(),
      })
      .where(eq(shipments.id, id))
      .returning();
    
    return updatedShipment;
  }
  
  async countShipments(): Promise<number> {
    const [result] = await db
      .select({ count: count() })
      .from(shipments);
    
    return result?.count || 0;
  }
  
  // Vehicle Operations
  async createVehicle(vehicle: InsertVehicle): Promise<Vehicle> {
    const [newVehicle] = await db.insert(vehicles).values(vehicle).returning();
    return newVehicle;
  }
  
  async getVehicle(id: number): Promise<Vehicle | undefined> {
    const [vehicle] = await db.select().from(vehicles).where(eq(vehicles.id, id));
    return vehicle;
  }
  
  async getVehicleByRegistration(registrationNumber: string): Promise<Vehicle | undefined> {
    const [vehicle] = await db
      .select()
      .from(vehicles)
      .where(eq(vehicles.registrationNumber, registrationNumber));
    
    return vehicle;
  }
  
  async getAllVehicles(limit = 100, offset = 0): Promise<Vehicle[]> {
    return db.select()
      .from(vehicles)
      .limit(limit)
      .offset(offset)
      .orderBy(vehicles.make, vehicles.model);
  }
  
  async updateVehicle(id: number, vehicleData: Partial<InsertVehicle>): Promise<Vehicle | undefined> {
    const [updatedVehicle] = await db
      .update(vehicles)
      .set({
        ...vehicleData,
        updatedAt: new Date(),
      })
      .where(eq(vehicles.id, id))
      .returning();
    
    return updatedVehicle;
  }
  
  async countVehicles(): Promise<number> {
    const [result] = await db
      .select({ count: count() })
      .from(vehicles);
    
    return result?.count || 0;
  }
  
  // Finance Operations
  async createExpense(expense: InsertExpense): Promise<Expense> {
    const [newExpense] = await db.insert(expenses).values(expense).returning();
    return newExpense;
  }
  
  async getAllExpenses(limit = 100, offset = 0): Promise<Expense[]> {
    return db.select()
      .from(expenses)
      .limit(limit)
      .offset(offset)
      .orderBy(desc(expenses.date));
  }
  
  async getExpensesByCategory(category: string, limit = 100, offset = 0): Promise<Expense[]> {
    return db.select()
      .from(expenses)
      .where(eq(expenses.category, category))
      .limit(limit)
      .offset(offset)
      .orderBy(desc(expenses.date));
  }
  
  async updateExpense(id: number, expenseData: Partial<InsertExpense>): Promise<Expense | undefined> {
    const [updatedExpense] = await db
      .update(expenses)
      .set(expenseData)
      .where(eq(expenses.id, id))
      .returning();
    
    return updatedExpense;
  }
  
  async createRevenue(revenueItem: InsertRevenue): Promise<Revenue> {
    const [newRevenue] = await db.insert(revenue).values(revenueItem).returning();
    return newRevenue;
  }
  
  async getAllRevenue(limit = 100, offset = 0): Promise<Revenue[]> {
    return db.select()
      .from(revenue)
      .limit(limit)
      .offset(offset)
      .orderBy(desc(revenue.date));
  }
  
  async getRevenueBySource(source: string, limit = 100, offset = 0): Promise<Revenue[]> {
    return db.select()
      .from(revenue)
      .where(eq(revenue.source, source))
      .limit(limit)
      .offset(offset)
      .orderBy(desc(revenue.date));
  }
  
  async updateRevenue(id: number, revenueData: Partial<InsertRevenue>): Promise<Revenue | undefined> {
    const [updatedRevenue] = await db
      .update(revenue)
      .set(revenueData)
      .where(eq(revenue.id, id))
      .returning();
    
    return updatedRevenue;
  }
  
  // Analytics Operations
  async createAnalyticsEvent(event: InsertAnalyticsEvent): Promise<AnalyticsEvent> {
    const [newEvent] = await db.insert(analyticsEvents).values(event).returning();
    return newEvent;
  }
  
  async getAnalyticsEvents(limit = 100, offset = 0): Promise<AnalyticsEvent[]> {
    return db.select()
      .from(analyticsEvents)
      .limit(limit)
      .offset(offset)
      .orderBy(desc(analyticsEvents.timestamp));
  }
  
  async getAnalyticsEventsByType(eventType: string, limit = 100, offset = 0): Promise<AnalyticsEvent[]> {
    return db.select()
      .from(analyticsEvents)
      .where(eq(analyticsEvents.eventType, eventType))
      .limit(limit)
      .offset(offset)
      .orderBy(desc(analyticsEvents.timestamp));
  }
  
  // Dashboard Operations
  async getFinancialSummary(startDate = new Date(0), endDate = new Date()): Promise<{
    totalRevenue: number;
    totalExpenses: number;
    netProfit: number;
    revenueBySource: Record<string, number>;
    expensesByCategory: Record<string, number>;
  }> {
    // Convert dates to ISO string format for SQL
    const startDateStr = startDate.toISOString();
    const endDateStr = endDate.toISOString();
    
    // Get total revenue
    const revenueItems = await db.select({
      amount: revenue.amount,
      source: revenue.source
    })
    .from(revenue)
    .where(
      and(
        sql`${revenue.date} >= ${startDateStr}`,
        sql`${revenue.date} <= ${endDateStr}`
      )
    );
    
    // Calculate total revenue and breakdown by source
    const totalRevenue = revenueItems.reduce((sum, item) => sum + Number(item.amount), 0);
    const revenueBySource: Record<string, number> = {};
    
    revenueItems.forEach(item => {
      const source = item.source || 'Other';
      if (!revenueBySource[source]) {
        revenueBySource[source] = 0;
      }
      revenueBySource[source] += Number(item.amount);
    });
    
    // Get total expenses
    const expenseItems = await db.select({
      amount: expenses.amount,
      category: expenses.category
    })
    .from(expenses)
    .where(
      and(
        sql`${expenses.date} >= ${startDateStr}`,
        sql`${expenses.date} <= ${endDateStr}`
      )
    );
    
    // Calculate total expenses and breakdown by category
    const totalExpenses = expenseItems.reduce((sum, item) => sum + Number(item.amount), 0);
    const expensesByCategory: Record<string, number> = {};
    
    expenseItems.forEach(item => {
      const category = item.category || 'Other';
      if (!expensesByCategory[category]) {
        expensesByCategory[category] = 0;
      }
      expensesByCategory[category] += Number(item.amount);
    });
    
    return {
      totalRevenue,
      totalExpenses,
      netProfit: totalRevenue - totalExpenses,
      revenueBySource,
      expensesByCategory
    };
  }
  
  async getShipmentStats(): Promise<{
    totalShipments: number;
    pendingShipments: number;
    inTransitShipments: number;
    deliveredShipments: number;
    cancelledShipments: number;
  }> {
    // Count all shipments
    const [totalResult] = await db
      .select({ count: count() })
      .from(shipments);
    
    // Count pending shipments
    const [pendingResult] = await db
      .select({ count: count() })
      .from(shipments)
      .where(eq(shipments.status, 'pending'));
    
    // Count in transit shipments (including processing, customs_clearance, out_for_delivery)
    const [inTransitResult] = await db
      .select({ count: count() })
      .from(shipments)
      .where(
        sql`${shipments.status} IN ('in_transit', 'processing', 'customs_clearance', 'out_for_delivery')`
      );
    
    // Count delivered shipments
    const [deliveredResult] = await db
      .select({ count: count() })
      .from(shipments)
      .where(eq(shipments.status, 'delivered'));
    
    // Count cancelled shipments
    const [cancelledResult] = await db
      .select({ count: count() })
      .from(shipments)
      .where(
        sql`${shipments.status} IN ('cancelled', 'returned')`
      );
    
    return {
      totalShipments: totalResult?.count || 0,
      pendingShipments: pendingResult?.count || 0,
      inTransitShipments: inTransitResult?.count || 0,
      deliveredShipments: deliveredResult?.count || 0,
      cancelledShipments: cancelledResult?.count || 0
    };
  }
  
  async getCustomerStats(): Promise<{
    totalCustomers: number;
    newCustomersThisMonth: number;
    topCustomers: Array<{id: number, name: string, total: number}>;
  }> {
    // Count all customers
    const [totalResult] = await db
      .select({ count: count() })
      .from(customers);
    
    // Get current date
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const firstDayOfMonthStr = firstDayOfMonth.toISOString();
    
    // Count new customers this month
    const [newCustomersResult] = await db
      .select({ count: count() })
      .from(customers)
      .where(sql`${customers.createdAt} >= ${firstDayOfMonthStr}`);
    
    // Get top customers by total spent
    const topCustomers = await db
      .select({
        id: customers.id,
        name: customers.name,
        total: customers.totalSpent
      })
      .from(customers)
      .orderBy(desc(customers.totalSpent))
      .limit(5);
    
    return {
      totalCustomers: totalResult?.count || 0,
      newCustomersThisMonth: newCustomersResult?.count || 0,
      topCustomers: topCustomers.map(c => ({ 
        id: c.id, 
        name: c.name, 
        total: Number(c.total) 
      }))
    };
  }
  
  // Notification Operations
  async createNotification(notification: Omit<Notification, 'id' | 'createdAt'>): Promise<Notification> {
    const [newNotification] = await db.insert(notifications).values(notification).returning();
    return newNotification;
  }
  
  async getNotificationsByUser(userId: number, limit = 50, offset = 0): Promise<Notification[]> {
    return db.select()
      .from(notifications)
      .where(eq(notifications.userId, userId))
      .limit(limit)
      .offset(offset)
      .orderBy(desc(notifications.createdAt));
  }
  
  async markNotificationAsRead(id: number): Promise<Notification | undefined> {
    const [updatedNotification] = await db
      .update(notifications)
      .set({ isRead: true })
      .where(eq(notifications.id, id))
      .returning();
    
    return updatedNotification;
  }
  
  async countUnreadNotifications(userId: number): Promise<number> {
    const [result] = await db
      .select({ count: count() })
      .from(notifications)
      .where(
        and(
          eq(notifications.userId, userId),
          eq(notifications.isRead, false)
        )
      );
    
    return result?.count || 0;
  }
}

// Use in-memory storage when no database URL is configured, which makes local development work out of the box.
const useDatabase = Boolean(process.env.DATABASE_URL && process.env.DATABASE_URL.trim());
export const storage = useDatabase ? new DatabaseStorage() : new MemStorage();
