import { pgTable, text, serial, integer, boolean, timestamp, pgEnum, varchar, numeric, date, jsonb, time } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Users
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email"),
  fullName: text("full_name"),
  role: text("role").default("user").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  lastLogin: timestamp("last_login"),
  isActive: boolean("is_active").default(true),
  profileImage: text("profile_image"),
});

export const usersRelations = relations(users, ({ many }) => ({
  shipments: many(shipments),
  expenses: many(expenses),
  notifications: many(notifications),
  drivers: many(drivers),
}));

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  fullName: true,
  role: true,
  lastLogin: true,
});

// Customers
export const customers = pgTable("customers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  emailForDebts: text("email_for_debts"),
  phone: text("phone"),
  address: text("address"),
  city: text("city"),
  country: text("country"),
  postalCode: text("postal_code"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  lastActivity: timestamp("last_activity"),
  totalOrders: integer("total_orders").default(0),
  totalSpent: numeric("total_spent").default("0"),
  isCompany: boolean("is_company").default(false),
  companyName: text("company_name"),
  companyVat: text("company_vat"),
  // Enhanced customer fields for companies
  customerType: text("customer_type"), // Klientas, Vežėjas, Tiekėjas, etc.
  creditLimit: numeric("credit_limit").default("0"),
  availableCredit: numeric("available_credit").default("0"),
  paymentTerms: text("payment_terms"),
  isBlocked: boolean("is_blocked").default(false),
  blockReason: text("block_reason"),
  // Enhanced customer fields for individuals
  firstName: text("first_name"),
  lastName: text("last_name"),
  personalId: text("personal_id"),
  priority: text("priority").default("medium"), // high, medium, low
  payForCar: boolean("pay_for_car").default(false),
  paymentAmount: numeric("payment_amount").default("0"),
});

export const customersRelations = relations(customers, ({ many }) => ({
  shipments: many(shipments),
  documents: many(documents),
  quotes: many(quotes),
  revenueItems: many(revenue),
}));

export const insertCustomerSchema = createInsertSchema(customers).pick({
  name: true,
  email: true,
  emailForDebts: true,
  phone: true,
  address: true,
  city: true,
  country: true,
  postalCode: true,
  notes: true,
  isCompany: true,
  companyName: true,
  companyVat: true,
  customerType: true,
  creditLimit: true,
  availableCredit: true,
  paymentTerms: true,
  isBlocked: true,
  blockReason: true,
  firstName: true,
  lastName: true,
  personalId: true,
  priority: true,
  payForCar: true,
  paymentAmount: true,
});

// Quotes
export const quotes = pgTable("quotes", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  serviceType: text("service_type"),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  status: text("status").default("pending").notNull(),
  customerId: integer("customer_id"),
  assignedToUserId: integer("assigned_to_user_id"),
  quotedAmount: numeric("quoted_amount"),
  expiresAt: timestamp("expires_at"),
  convertedToOrderId: integer("converted_to_order_id"),
});

export const quotesRelations = relations(quotes, ({ one }) => ({
  customer: one(customers, {
    fields: [quotes.customerId],
    references: [customers.id],
  }),
  assignedToUser: one(users, {
    fields: [quotes.assignedToUserId],
    references: [users.id],
  }),
}));

export const insertQuoteSchema = createInsertSchema(quotes).pick({
  fullName: true,
  email: true,
  phone: true,
  serviceType: true,
  message: true,
  status: true,
  customerId: true,
  assignedToUserId: true,
  quotedAmount: true,
  expiresAt: true,
});

// Drivers (for logistics)
export const drivers = pgTable("drivers", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  licenseNumber: text("license_number").notNull().unique(),
  licenseExpiry: date("license_expiry"),
  phoneNumber: text("phone_number").notNull(),
  email: text("email"),
  address: text("address"),
  city: text("city"),
  country: text("country"),
  emergencyContact: text("emergency_contact"),
  emergencyPhone: text("emergency_phone"),
  status: text("status").default("active").notNull(), // active, on_leave, terminated
  hireDate: date("hire_date"),
  terminationDate: date("termination_date"),
  notes: text("notes"),
  documents: jsonb("documents"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  rating: numeric("rating"), // Driver performance rating
  totalDistance: numeric("total_distance").default("0"), // Total distance driven
  totalShipments: integer("total_shipments").default(0), // Total shipments completed
});

export const driversRelations = relations(drivers, ({ one, many }) => ({
  user: one(users, {
    fields: [drivers.userId],
    references: [users.id],
  }),
  vehicles: many(vehicles),
  shipments: many(shipments),
  driverLogs: many(driverLogs),
}));

export const insertDriverSchema = createInsertSchema(drivers).pick({
  userId: true,
  firstName: true,
  lastName: true,
  licenseNumber: true,
  licenseExpiry: true,
  phoneNumber: true,
  email: true,
  address: true,
  city: true,
  country: true,
  emergencyContact: true,
  emergencyPhone: true,
  status: true,
  hireDate: true,
  notes: true,
  documents: true,
});

// Driver Logs (for compliance)
export const driverLogs = pgTable("driver_logs", {
  id: serial("id").primaryKey(),
  driverId: integer("driver_id").notNull(),
  date: date("date").notNull(),
  startTime: time("start_time"),
  endTime: time("end_time"),
  dutyStatus: text("duty_status").notNull(), // driving, on_duty, off_duty, sleeper_berth
  location: text("location"),
  locationLat: numeric("location_lat"),
  locationLng: numeric("location_lng"),
  odometer: numeric("odometer"),
  vehicleId: integer("vehicle_id"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const driverLogsRelations = relations(driverLogs, ({ one }) => ({
  driver: one(drivers, {
    fields: [driverLogs.driverId],
    references: [drivers.id],
  }),
  vehicle: one(vehicles, {
    fields: [driverLogs.vehicleId],
    references: [vehicles.id],
  }),
}));

export const insertDriverLogSchema = createInsertSchema(driverLogs).pick({
  driverId: true,
  date: true,
  startTime: true,
  endTime: true,
  dutyStatus: true,
  location: true,
  locationLat: true,
  locationLng: true,
  odometer: true,
  vehicleId: true,
  notes: true,
});

// Shipment Status Enum
export const shipmentStatusEnum = pgEnum('shipment_status', [
  'pending',
  'processing',
  'in_transit',
  'customs_clearance',
  'out_for_delivery',
  'delivered',
  'delayed',
  'cancelled',
  'returned'
]);

// Shipments
export const shipments = pgTable("shipments", {
  id: serial("id").primaryKey(),
  trackingNumber: text("tracking_number").notNull().unique(),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerId: integer("customer_id"),
  vehicleModel: text("vehicle_model").notNull(),
  origin: text("origin").notNull(),
  originLat: numeric("origin_lat"),
  originLng: numeric("origin_lng"),
  destination: text("destination").notNull(),
  destinationLat: numeric("destination_lat"),
  destinationLng: numeric("destination_lng"),
  status: text("status").notNull().default('pending'),
  estimatedDeliveryDate: timestamp("estimated_delivery_date"),
  actualDeliveryDate: timestamp("actual_delivery_date"),
  currentLocation: text("current_location"),
  currentLocationLat: numeric("current_location_lat"),
  currentLocationLng: numeric("current_location_lng"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  price: numeric("price"),
  currency: text("currency").default("EUR"),
  driverId: integer("driver_id"),
  vehicleId: integer("vehicle_id"), // Added to associate with a specific vehicle
  invoiceId: integer("invoice_id"),
  isInsured: boolean("is_insured").default(false),
  insuranceDetails: jsonb("insurance_details"),
  documentsUrl: text("documents_url"),
  routeData: jsonb("route_data"),
  cargoType: text("cargo_type"), // Type of cargo (e.g., vehicle, furniture, etc.)
  cargoWeight: numeric("cargo_weight"), // Weight in kg
  cargoDimensions: jsonb("cargo_dimensions"), // {length, width, height} in cm
  specialRequirements: text("special_requirements"),
  customsInfo: jsonb("customs_info"), // Required for international shipments
  signatureRequired: boolean("signature_required").default(true),
  createdBy: integer("created_by"), // User who created the shipment
});

export const shipmentsRelations = relations(shipments, ({ one, many }) => ({
  customer: one(customers, {
    fields: [shipments.customerId],
    references: [customers.id],
  }),
  driver: one(drivers, {
    fields: [shipments.driverId],
    references: [drivers.id],
  }),
  vehicle: one(vehicles, {
    fields: [shipments.vehicleId],
    references: [vehicles.id],
  }),
  creator: one(users, {
    fields: [shipments.createdBy],
    references: [users.id],
  }),
  logEntries: many(shipmentLogs),
  expenses: many(expenses),
  revenueItems: many(revenue),
  documents: many(documents),
}));

export const insertShipmentSchema = createInsertSchema(shipments).pick({
  trackingNumber: true,
  customerName: true,
  customerEmail: true,
  customerId: true,
  vehicleModel: true,
  origin: true,
  originLat: true,
  originLng: true,
  destination: true,
  destinationLat: true,
  destinationLng: true,
  status: true,
  estimatedDeliveryDate: true,
  currentLocation: true,
  currentLocationLat: true,
  currentLocationLng: true,
  notes: true,
  price: true,
  currency: true,
  driverId: true,
  vehicleId: true,
  isInsured: true,
  insuranceDetails: true,
  documentsUrl: true,
  cargoType: true,
  cargoWeight: true,
  cargoDimensions: true,
  specialRequirements: true,
  customsInfo: true,
  signatureRequired: true,
  createdBy: true,
});

export const shipmentUpdateSchema = createInsertSchema(shipments).pick({
  status: true,
  currentLocation: true,
  currentLocationLat: true,
  currentLocationLng: true,
  notes: true,
  actualDeliveryDate: true,
  routeData: true,
}).partial();

// Shipment Logs (for tracking status changes)
export const shipmentLogs = pgTable("shipment_logs", {
  id: serial("id").primaryKey(),
  shipmentId: integer("shipment_id").notNull(),
  status: text("status").notNull(),
  location: text("location"),
  locationLat: numeric("location_lat"),
  locationLng: numeric("location_lng"),
  notes: text("notes"),
  timestamp: timestamp("timestamp").defaultNow(),
  createdBy: integer("created_by"),
  details: jsonb("details"), // Additional details specific to this status change
});

export const shipmentLogsRelations = relations(shipmentLogs, ({ one }) => ({
  shipment: one(shipments, {
    fields: [shipmentLogs.shipmentId],
    references: [shipments.id],
  }),
  creator: one(users, {
    fields: [shipmentLogs.createdBy],
    references: [users.id],
  }),
}));

export const insertShipmentLogSchema = createInsertSchema(shipmentLogs).pick({
  shipmentId: true,
  status: true,
  location: true,
  locationLat: true,
  locationLng: true,
  notes: true,
  createdBy: true,
  details: true,
});

// Vehicles (for fleet management)
export const vehicles = pgTable("vehicles", {
  id: serial("id").primaryKey(),
  registrationNumber: text("registration_number").notNull().unique(),
  type: text("type").notNull(), // truck, transporter, etc.
  make: text("make").notNull(),
  model: text("model").notNull(),
  year: integer("year"),
  capacity: numeric("capacity"), // capacity in tons
  status: text("status").default("available").notNull(), // available, maintenance, in_use
  currentLocation: text("current_location"),
  currentLocationLat: numeric("current_location_lat"),
  currentLocationLng: numeric("current_location_lng"),
  lastMaintenance: timestamp("last_maintenance"),
  nextMaintenanceDue: timestamp("next_maintenance_due"),
  fuelType: text("fuel_type"),
  fuelConsumption: numeric("fuel_consumption"),
  notes: text("notes"),
  documents: jsonb("documents"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  assignedDriverId: integer("assigned_driver_id"),
  vin: text("vin"), // Vehicle Identification Number
  licensePlate: text("license_plate"),
  color: text("color"),
  odometer: numeric("odometer").default("0"),
  insuranceNumber: text("insurance_number"),
  insuranceExpiry: date("insurance_expiry"),
  purchaseDate: date("purchase_date"),
  purchasePrice: numeric("purchase_price"),
  operationalCost: numeric("operational_cost").default("0"), // Cost per km
  maintenanceSchedule: jsonb("maintenance_schedule"),
});

export const vehiclesRelations = relations(vehicles, ({ one, many }) => ({
  assignedDriver: one(drivers, {
    fields: [vehicles.assignedDriverId],
    references: [drivers.id],
  }),
  shipments: many(shipments),
  maintenanceLogs: many(maintenanceLogs),
  expenses: many(expenses),
  driverLogs: many(driverLogs),
}));

export const insertVehicleSchema = createInsertSchema(vehicles).pick({
  registrationNumber: true,
  type: true,
  make: true,
  model: true,
  year: true,
  capacity: true,
  status: true,
  currentLocation: true,
  currentLocationLat: true,
  currentLocationLng: true,
  lastMaintenance: true,
  nextMaintenanceDue: true,
  fuelType: true,
  fuelConsumption: true,
  notes: true,
  documents: true,
  assignedDriverId: true,
  vin: true,
  licensePlate: true,
  color: true,
  odometer: true,
  insuranceNumber: true,
  insuranceExpiry: true,
  purchaseDate: true,
  purchasePrice: true,
  operationalCost: true,
  maintenanceSchedule: true,
});

// Maintenance Logs
export const maintenanceLogs = pgTable("maintenance_logs", {
  id: serial("id").primaryKey(),
  vehicleId: integer("vehicle_id").notNull(),
  serviceType: text("service_type").notNull(), // oil_change, tire_replacement, etc.
  serviceDate: date("service_date").notNull(),
  odometerReading: numeric("odometer_reading"),
  cost: numeric("cost"),
  currency: text("currency").default("EUR"),
  description: text("description"),
  servicedBy: text("serviced_by"), // Service provider or mechanic
  nextServiceDate: date("next_service_date"),
  nextServiceOdometer: numeric("next_service_odometer"),
  invoiceNumber: text("invoice_number"),
  receiptUrl: text("receipt_url"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  createdBy: integer("created_by"),
});

export const maintenanceLogsRelations = relations(maintenanceLogs, ({ one }) => ({
  vehicle: one(vehicles, {
    fields: [maintenanceLogs.vehicleId],
    references: [vehicles.id],
  }),
  creator: one(users, {
    fields: [maintenanceLogs.createdBy],
    references: [users.id],
  }),
}));

export const insertMaintenanceLogSchema = createInsertSchema(maintenanceLogs).pick({
  vehicleId: true,
  serviceType: true,
  serviceDate: true,
  odometerReading: true,
  cost: true,
  currency: true,
  description: true,
  servicedBy: true,
  nextServiceDate: true,
  nextServiceOdometer: true,
  invoiceNumber: true,
  receiptUrl: true,
  notes: true,
  createdBy: true,
});

// Documents Management
export const documents = pgTable("documents", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // license, registration, insurance, invoice, etc.
  entityType: text("entity_type").notNull(), // customer, vehicle, driver, shipment
  entityId: integer("entity_id").notNull(),
  url: text("url").notNull(),
  fileSize: integer("file_size"),
  mimeType: text("mime_type"),
  uploadedAt: timestamp("uploaded_at").defaultNow(),
  uploadedBy: integer("uploaded_by"),
  expiresAt: timestamp("expires_at"),
  issuedAt: timestamp("issued_at"),
  issuedBy: text("issued_by"),
  description: text("description"),
  tags: text("tags").array(),
  metadata: jsonb("metadata"),
});

export const documentsRelations = relations(documents, ({ one }) => ({
  uploader: one(users, {
    fields: [documents.uploadedBy],
    references: [users.id],
  }),
}));

export const insertDocumentSchema = createInsertSchema(documents).pick({
  name: true,
  type: true,
  entityType: true,
  entityId: true,
  url: true,
  fileSize: true,
  mimeType: true,
  uploadedBy: true,
  expiresAt: true,
  issuedAt: true,
  issuedBy: true,
  description: true,
  tags: true,
  metadata: true,
});

// Expenses
export const expenseCategories = pgEnum('expense_category', [
  'fuel',
  'maintenance',
  'insurance',
  'tolls',
  'salaries',
  'office',
  'marketing',
  'utilities',
  'rent',
  'vehicles',
  'equipment',
  'taxes',
  'other'
]);

export const expenses = pgTable("expenses", {
  id: serial("id").primaryKey(),
  amount: numeric("amount").notNull(),
  currency: text("currency").default("EUR").notNull(),
  category: text("category").notNull(),
  description: text("description"),
  date: date("date").notNull(),
  receipt: text("receipt"),
  isRecurring: boolean("is_recurring").default(false),
  recurringFrequency: text("recurring_frequency"),
  vehicleId: integer("vehicle_id"),
  shipmentId: integer("shipment_id"),
  createdAt: timestamp("created_at").defaultNow(),
  createdBy: integer("created_by"),
  approved: boolean("approved").default(false),
  approvedBy: integer("approved_by"),
  approvedAt: timestamp("approved_at"),
  paymentMethod: text("payment_method"),
  notes: text("notes"),
  documentId: integer("document_id"), // Link to receipt/invoice document
  taxDeductible: boolean("tax_deductible").default(true),
  taxCategory: text("tax_category"),
  expenseAccount: text("expense_account"), // For accounting purposes
});

export const expensesRelations = relations(expenses, ({ one }) => ({
  vehicle: one(vehicles, {
    fields: [expenses.vehicleId],
    references: [vehicles.id],
  }),
  shipment: one(shipments, {
    fields: [expenses.shipmentId],
    references: [shipments.id],
  }),
  creator: one(users, {
    fields: [expenses.createdBy],
    references: [users.id],
  }),
  approver: one(users, {
    fields: [expenses.approvedBy],
    references: [users.id],
  }),
  document: one(documents, {
    fields: [expenses.documentId],
    references: [documents.id],
  }),
}));

export const insertExpenseSchema = createInsertSchema(expenses).pick({
  amount: true,
  currency: true,
  category: true,
  description: true,
  date: true,
  receipt: true,
  isRecurring: true,
  recurringFrequency: true,
  vehicleId: true,
  shipmentId: true,
  createdBy: true,
  paymentMethod: true,
  notes: true,
  documentId: true,
  taxDeductible: true,
  taxCategory: true,
  expenseAccount: true,
});

// Revenue
export const revenue = pgTable("revenue", {
  id: serial("id").primaryKey(),
  amount: numeric("amount").notNull(),
  currency: text("currency").default("EUR").notNull(),
  source: text("source").notNull(),
  date: date("date").notNull(),
  shipmentId: integer("shipment_id"),
  customerId: integer("customer_id"),
  description: text("description"),
  paymentMethod: text("payment_method"),
  paymentStatus: text("payment_status").default("paid").notNull(),
  invoiceNumber: text("invoice_number"),
  createdAt: timestamp("created_at").defaultNow(),
  notes: text("notes"),
  documentId: integer("document_id"), // Link to invoice document
  revenueAccount: text("revenue_account"), // For accounting purposes
  taxRate: numeric("tax_rate"),
  taxAmount: numeric("tax_amount"),
});

export const revenueRelations = relations(revenue, ({ one }) => ({
  shipment: one(shipments, {
    fields: [revenue.shipmentId],
    references: [shipments.id],
  }),
  customer: one(customers, {
    fields: [revenue.customerId],
    references: [customers.id],
  }),
  document: one(documents, {
    fields: [revenue.documentId],
    references: [documents.id],
  }),
}));

export const insertRevenueSchema = createInsertSchema(revenue).pick({
  amount: true,
  currency: true,
  source: true,
  date: true,
  shipmentId: true,
  customerId: true,
  description: true,
  paymentMethod: true,
  paymentStatus: true,
  invoiceNumber: true,
  notes: true,
  documentId: true,
  revenueAccount: true,
  taxRate: true,
  taxAmount: true,
});

// Routes (for Logistics Map)
export const routes = pgTable("routes", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  startLocation: text("start_location").notNull(),
  startLat: numeric("start_lat"),
  startLng: numeric("start_lng"),
  endLocation: text("end_location").notNull(),
  endLat: numeric("end_lat"),
  endLng: numeric("end_lng"),
  distance: numeric("distance"), // Distance in km
  estimatedDuration: integer("estimated_duration"), // Duration in minutes
  waypoints: jsonb("waypoints"), // Array of waypoint locations with coordinates
  routePath: jsonb("route_path"), // GeoJSON of the route path
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  createdBy: integer("created_by"),
  frequentlyUsed: boolean("frequently_used").default(false),
  optimizedFor: text("optimized_for").default("time"), // time, distance, cost
  tollCost: numeric("toll_cost").default("0"),
  fuelCost: numeric("fuel_cost").default("0"),
  customProperties: jsonb("custom_properties"),
});

export const routesRelations = relations(routes, ({ one, many }) => ({
  creator: one(users, {
    fields: [routes.createdBy],
    references: [users.id],
  }),
  routeAssignments: many(routeAssignments),
}));

export const insertRouteSchema = createInsertSchema(routes).pick({
  name: true,
  description: true,
  startLocation: true,
  startLat: true,
  startLng: true,
  endLocation: true,
  endLat: true,
  endLng: true,
  distance: true,
  estimatedDuration: true,
  waypoints: true,
  routePath: true,
  isActive: true,
  createdBy: true,
  frequentlyUsed: true,
  optimizedFor: true,
  tollCost: true,
  fuelCost: true,
  customProperties: true,
});

// Route Assignments
export const routeAssignments = pgTable("route_assignments", {
  id: serial("id").primaryKey(),
  routeId: integer("route_id").notNull(),
  shipmentId: integer("shipment_id"),
  vehicleId: integer("vehicle_id"),
  driverId: integer("driver_id"),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  status: text("status").default("scheduled").notNull(), // scheduled, in_progress, completed, cancelled
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  createdBy: integer("created_by"),
  priority: text("priority").default("medium"), // high, medium, low
  actualStartDate: timestamp("actual_start_date"),
  actualEndDate: timestamp("actual_end_date"),
  delays: jsonb("delays"), // Array of delay records with reasons
});

export const routeAssignmentsRelations = relations(routeAssignments, ({ one }) => ({
  route: one(routes, {
    fields: [routeAssignments.routeId],
    references: [routes.id],
  }),
  shipment: one(shipments, {
    fields: [routeAssignments.shipmentId],
    references: [shipments.id],
  }),
  vehicle: one(vehicles, {
    fields: [routeAssignments.vehicleId],
    references: [vehicles.id],
  }),
  driver: one(drivers, {
    fields: [routeAssignments.driverId],
    references: [drivers.id],
  }),
  creator: one(users, {
    fields: [routeAssignments.createdBy],
    references: [users.id],
  }),
}));

export const insertRouteAssignmentSchema = createInsertSchema(routeAssignments).pick({
  routeId: true,
  shipmentId: true,
  vehicleId: true,
  driverId: true,
  startDate: true,
  endDate: true,
  status: true,
  notes: true,
  createdBy: true,
  priority: true,
});

// Analytics Events
export const analyticsEvents = pgTable("analytics_events", {
  id: serial("id").primaryKey(),
  eventType: text("event_type").notNull(),
  source: text("source").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
  sessionId: text("session_id"),
  userId: integer("user_id"),
  customerId: integer("customer_id"),
  pageUrl: text("page_url"),
  referrer: text("referrer"),
  userAgent: text("user_agent"),
  ipAddress: text("ip_address"),
  eventData: jsonb("event_data"),
  deviceType: text("device_type"),
  browser: text("browser"),
  os: text("os"),
  country: text("country"),
  city: text("city"),
  duration: integer("duration"), // Duration of session/event in seconds
  conversion: boolean("conversion").default(false), // Whether the event led to a conversion
  conversionValue: numeric("conversion_value"), // Value of the conversion
});

export const analyticsEventsRelations = relations(analyticsEvents, ({ one }) => ({
  user: one(users, {
    fields: [analyticsEvents.userId],
    references: [users.id],
  }),
  customer: one(customers, {
    fields: [analyticsEvents.customerId],
    references: [customers.id],
  }),
}));

export const insertAnalyticsEventSchema = createInsertSchema(analyticsEvents).pick({
  eventType: true,
  source: true,
  timestamp: true,
  sessionId: true,
  userId: true,
  customerId: true,
  pageUrl: true,
  referrer: true,
  userAgent: true,
  ipAddress: true,
  eventData: true,
  deviceType: true,
  browser: true,
  os: true,
  country: true,
  city: true,
  duration: true,
  conversion: true,
  conversionValue: true,
});

// Analytics Reports
export const analyticsReports = pgTable("analytics_reports", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  reportType: text("report_type").notNull(), // traffic, conversion, revenue, user_behavior
  dateRange: jsonb("date_range").notNull(), // {start: Date, end: Date}
  filters: jsonb("filters"), // Query filters applied
  metrics: text("metrics").array().notNull(), // Array of metrics included
  dimensions: text("dimensions").array(), // Array of dimensions for grouping
  results: jsonb("results"), // Calculated report results
  createdAt: timestamp("created_at").defaultNow(),
  createdBy: integer("created_by"),
  updatedAt: timestamp("updated_at").defaultNow(),
  isScheduled: boolean("is_scheduled").default(false),
  schedule: jsonb("schedule"), // Schedule configuration
  format: text("format").default("json"), // json, csv, pdf
  isPublic: boolean("is_public").default(false),
  accessLink: text("access_link"),
});

export const analyticsReportsRelations = relations(analyticsReports, ({ one }) => ({
  creator: one(users, {
    fields: [analyticsReports.createdBy],
    references: [users.id],
  }),
}));

export const insertAnalyticsReportSchema = createInsertSchema(analyticsReports).pick({
  name: true,
  description: true,
  reportType: true,
  dateRange: true,
  filters: true,
  metrics: true,
  dimensions: true,
  createdBy: true,
  isScheduled: true,
  schedule: true,
  format: true,
  isPublic: true,
});

// AI Conversations
export const aiConversations = pgTable("ai_conversations", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  userId: integer("user_id"),
  startedAt: timestamp("started_at").defaultNow(),
  endedAt: timestamp("ended_at"),
  summary: text("summary"),
  feedback: text("feedback"),
  feedbackRating: integer("feedback_rating"),
  topic: text("topic"),
  context: jsonb("context"), // Additional context for the conversation
  intent: text("intent"), // Detected user intent
  relatedEntityType: text("related_entity_type"), // E.g., shipment, customer, vehicle
  relatedEntityId: integer("related_entity_id"), // ID of the related entity
  actionsTaken: jsonb("actions_taken"), // Actions performed by AI
  totalTokens: integer("total_tokens").default(0), // Total tokens used in conversation
});

export const aiConversationsRelations = relations(aiConversations, ({ one, many }) => ({
  user: one(users, {
    fields: [aiConversations.userId],
    references: [users.id],
  }),
  messages: many(aiMessages),
}));

export const aiMessages = pgTable("ai_messages", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversation_id").notNull(),
  role: text("role").notNull(), // user, assistant, system
  content: text("content").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
  tokens: integer("tokens"),
  feedback: text("feedback"),
  contentType: text("content_type").default("text"), // text, image, attachment
  attachmentUrl: text("attachment_url"),
  metadata: jsonb("metadata"), // Additional message metadata
});

export const aiMessagesRelations = relations(aiMessages, ({ one }) => ({
  conversation: one(aiConversations, {
    fields: [aiMessages.conversationId],
    references: [aiConversations.id],
  }),
}));

// AI Knowledge Base
export const aiKnowledgeBase = pgTable("ai_knowledge_base", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(),
  tags: text("tags").array(),
  author: integer("author"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  status: text("status").default("active").notNull(), // active, archived, draft
  embedding: text("embedding"), // Vector embedding for semantic search
  sourceUrl: text("source_url"),
  relevanceScore: numeric("relevance_score"),
  viewCount: integer("view_count").default(0),
  isPublic: boolean("is_public").default(true),
});

export const aiKnowledgeBaseRelations = relations(aiKnowledgeBase, ({ one }) => ({
  user: one(users, {
    fields: [aiKnowledgeBase.author],
    references: [users.id],
  }),
}));

export const insertAiKnowledgeBaseSchema = createInsertSchema(aiKnowledgeBase).pick({
  title: true,
  content: true,
  category: true,
  tags: true,
  author: true,
  status: true,
  sourceUrl: true,
  isPublic: true,
});

// Notifications
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  type: text("type").notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  relatedEntityType: text("related_entity_type"),
  relatedEntityId: integer("related_entity_id"),
  action: text("action"),
  priority: text("priority").default("normal"),
  icon: text("icon"),
  linkUrl: text("link_url"),
  expiresAt: timestamp("expires_at"),
  dismissedAt: timestamp("dismissed_at"),
  sendEmail: boolean("send_email").default(false),
  emailSent: boolean("email_sent").default(false),
  senderUser: integer("sender_user"), // If sent by another user
});

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
  sender: one(users, {
    fields: [notifications.senderUser],
    references: [users.id],
  }),
}));

export const insertNotificationSchema = createInsertSchema(notifications).pick({
  userId: true,
  type: true,
  title: true,
  message: true,
  relatedEntityType: true,
  relatedEntityId: true,
  action: true,
  priority: true,
  icon: true,
  linkUrl: true,
  expiresAt: true,
  sendEmail: true,
  senderUser: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertCustomer = z.infer<typeof insertCustomerSchema>;
export type Customer = typeof customers.$inferSelect;

export type InsertQuote = z.infer<typeof insertQuoteSchema>;
export type Quote = typeof quotes.$inferSelect;

export type InsertDriver = z.infer<typeof insertDriverSchema>;
export type Driver = typeof drivers.$inferSelect;

export type InsertDriverLog = z.infer<typeof insertDriverLogSchema>;
export type DriverLog = typeof driverLogs.$inferSelect;

export type InsertShipment = z.infer<typeof insertShipmentSchema>;
export type ShipmentUpdate = z.infer<typeof shipmentUpdateSchema>;
export type Shipment = typeof shipments.$inferSelect;

export type InsertShipmentLog = z.infer<typeof insertShipmentLogSchema>;
export type ShipmentLog = typeof shipmentLogs.$inferSelect;

export type InsertVehicle = z.infer<typeof insertVehicleSchema>;
export type Vehicle = typeof vehicles.$inferSelect;

export type InsertMaintenanceLog = z.infer<typeof insertMaintenanceLogSchema>;
export type MaintenanceLog = typeof maintenanceLogs.$inferSelect;

export type InsertDocument = z.infer<typeof insertDocumentSchema>;
export type Document = typeof documents.$inferSelect;

export type InsertExpense = z.infer<typeof insertExpenseSchema>;
export type Expense = typeof expenses.$inferSelect;

export type InsertRevenue = z.infer<typeof insertRevenueSchema>;
export type Revenue = typeof revenue.$inferSelect;

export type InsertRoute = z.infer<typeof insertRouteSchema>;
export type Route = typeof routes.$inferSelect;

export type InsertRouteAssignment = z.infer<typeof insertRouteAssignmentSchema>;
export type RouteAssignment = typeof routeAssignments.$inferSelect;

export type InsertAnalyticsEvent = z.infer<typeof insertAnalyticsEventSchema>;
export type AnalyticsEvent = typeof analyticsEvents.$inferSelect;

export type InsertAnalyticsReport = z.infer<typeof insertAnalyticsReportSchema>;
export type AnalyticsReport = typeof analyticsReports.$inferSelect;

export type InsertAiKnowledgeBase = z.infer<typeof insertAiKnowledgeBaseSchema>;
export type AiKnowledgeBase = typeof aiKnowledgeBase.$inferSelect;

export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type Notification = typeof notifications.$inferSelect;
