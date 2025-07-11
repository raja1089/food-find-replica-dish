import { pgTable, text, serial, integer, boolean, timestamp, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Admin users table
export const admins = pgTable("admins", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Cities table
export const cities = pgTable("cities", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  image: text("image").notNull(),
  restaurantCount: integer("restaurant_count").default(0),
  isPopular: boolean("is_popular").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Restaurants table
export const restaurants = pgTable("restaurants", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  cuisine: text("cuisine").notNull(),
  rating: decimal("rating", { precision: 2, scale: 1 }).default("4.0"),
  deliveryTime: text("delivery_time").notNull(),
  image: text("image").notNull(),
  cityId: integer("city_id").references(() => cities.id),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Features table
export const features = pgTable("features", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  isActive: boolean("is_active").default(true),
  order: integer("order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Stats table
export const stats = pgTable("stats", {
  id: serial("id").primaryKey(),
  restaurants: integer("restaurants").default(0),
  cities: integer("cities").default(0),
  users: integer("users").default(0),
  orders: integer("orders").default(0),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const footerPages = pgTable("footer_pages", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content").notNull(),
  category: text("category").notNull(),
  isPublished: boolean("is_published").default(true),
  order: integer("order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const heroSection = pgTable("hero_section", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  subtitle: text("subtitle").notNull(),
  backgroundImage: text("background_image").notNull(),
  ctaText: text("cta_text").notNull(),
  ctaLink: text("cta_link").notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const cookRegistrations = pgTable("cook_registrations", {
  id: serial("id").primaryKey(),
  // Personal Information
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone").notNull(),
  
  // Kitchen Information
  kitchenName: text("kitchen_name").notNull(),
  kitchenType: text("kitchen_type").notNull(), // home_kitchen, restaurant, cloud_kitchen
  cuisineTypes: text("cuisine_types").array().notNull(), // Array of cuisine types
  
  // Address Information
  address: text("address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  pincode: text("pincode").notNull(),
  
  // Business Information
  fssaiLicense: text("fssai_license"),
  gstNumber: text("gst_number"),
  panNumber: text("pan_number"),
  
  // Additional Information
  experience: text("experience").notNull(), // years of experience
  specialties: text("specialties").array(), // special dishes
  description: text("description"),
  
  // Status
  status: text("status").notNull().default("pending"), // pending, approved, rejected
  
  // Timestamps
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const citiesRelations = relations(cities, ({ many }) => ({
  restaurants: many(restaurants),
}));

export const restaurantsRelations = relations(restaurants, ({ one }) => ({
  city: one(cities, {
    fields: [restaurants.cityId],
    references: [cities.id],
  }),
}));

// Insert schemas
export const insertAdminSchema = createInsertSchema(admins).pick({
  username: true,
  password: true,
});

export const insertCitySchema = createInsertSchema(cities).pick({
  name: true,
  image: true,
  restaurantCount: true,
  isPopular: true,
});

export const insertRestaurantSchema = createInsertSchema(restaurants).pick({
  name: true,
  cuisine: true,
  rating: true,
  deliveryTime: true,
  image: true,
  cityId: true,
  isActive: true,
});

export const insertFeatureSchema = createInsertSchema(features).pick({
  title: true,
  description: true,
  icon: true,
  isActive: true,
  order: true,
});

export const insertStatsSchema = createInsertSchema(stats).pick({
  restaurants: true,
  cities: true,
  users: true,
  orders: true,
});

export const insertFooterPageSchema = createInsertSchema(footerPages).pick({
  title: true,
  slug: true,
  content: true,
  category: true,
  isPublished: true,
  order: true,
});

export const insertHeroSectionSchema = createInsertSchema(heroSection).pick({
  title: true,
  subtitle: true,
  backgroundImage: true,
  ctaText: true,
  ctaLink: true,
});

export const insertCookRegistrationSchema = createInsertSchema(cookRegistrations).pick({
  firstName: true,
  lastName: true,
  email: true,
  phone: true,
  kitchenName: true,
  kitchenType: true,
  cuisineTypes: true,
  address: true,
  city: true,
  state: true,
  pincode: true,
  fssaiLicense: true,
  gstNumber: true,
  panNumber: true,
  experience: true,
  specialties: true,
  description: true,
});

// Types
export type InsertAdmin = z.infer<typeof insertAdminSchema>;
export type Admin = typeof admins.$inferSelect;
export type InsertCity = z.infer<typeof insertCitySchema>;
export type City = typeof cities.$inferSelect;
export type InsertRestaurant = z.infer<typeof insertRestaurantSchema>;
export type Restaurant = typeof restaurants.$inferSelect;
export type InsertFeature = z.infer<typeof insertFeatureSchema>;
export type Feature = typeof features.$inferSelect;
export type InsertStats = z.infer<typeof insertStatsSchema>;
export type Stats = typeof stats.$inferSelect;
export type InsertFooterPage = z.infer<typeof insertFooterPageSchema>;
export type FooterPage = typeof footerPages.$inferSelect;
export type InsertHeroSection = z.infer<typeof insertHeroSectionSchema>;
export type HeroSection = typeof heroSection.$inferSelect;
export type InsertCookRegistration = z.infer<typeof insertCookRegistrationSchema>;
export type CookRegistration = typeof cookRegistrations.$inferSelect;
