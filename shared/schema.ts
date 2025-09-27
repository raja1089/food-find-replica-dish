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

// Chefs table - authenticated chef users
export const chefs = pgTable("chefs", {
  id: serial("id").primaryKey(),
  phone: text("phone").notNull().unique(),
  email: text("email"),
  isActive: boolean("is_active").default(true),
  isVerified: boolean("is_verified").default(false),
  lastLogin: timestamp("last_login"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Chef profiles table - detailed chef information
export const chefProfiles = pgTable("chef_profiles", {
  id: serial("id").primaryKey(),
  chefId: integer("chef_id").references(() => chefs.id).notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  kitchenName: text("kitchen_name"),
  kitchenType: text("kitchen_type"), // home_kitchen, restaurant, cloud_kitchen
  cuisineTypes: text("cuisine_types").array(),
  address: text("address"),
  city: text("city"),
  state: text("state"),
  pincode: text("pincode"),
  fssaiLicense: text("fssai_license"),
  gstNumber: text("gst_number"),
  panNumber: text("pan_number"),
  experience: text("experience"),
  specialties: text("specialties").array(),
  description: text("description"),
  profileImage: text("profile_image"),
  kitchenImages: text("kitchen_images").array(),
  rating: decimal("rating", { precision: 2, scale: 1 }).default("0.0"),
  totalOrders: integer("total_orders").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Chef dishes table
export const chefDishes = pgTable("chef_dishes", {
  id: serial("id").primaryKey(),
  chefId: integer("chef_id").references(() => chefs.id).notNull(),
  name: text("name").notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  discountPrice: decimal("discount_price", { precision: 10, scale: 2 }),
  category: text("category").notNull(),
  dishType: text("dish_type").notNull(), // veg, non-veg, vegan
  mealType: text("meal_type").notNull(), // breakfast, lunch, dinner, snack
  preparationTime: integer("preparation_time").notNull(), // in minutes
  servingSize: integer("serving_size").default(1),
  ingredients: text("ingredients").array(),
  allergens: text("allergens").array(),
  nutritionalInfo: text("nutritional_info"),
  images: text("images").array(),
  isAvailable: boolean("is_available").default(true),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// OTP table for chef authentication
export const chefOtps = pgTable("chef_otps", {
  id: serial("id").primaryKey(),
  phone: text("phone").notNull(),
  otp: text("otp").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  isUsed: boolean("is_used").default(false),
  attempts: integer("attempts").default(0),
  createdAt: timestamp("created_at").defaultNow(),
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

export const chefsRelations = relations(chefs, ({ one, many }) => ({
  profile: one(chefProfiles),
  dishes: many(chefDishes),
}));

export const chefProfilesRelations = relations(chefProfiles, ({ one }) => ({
  chef: one(chefs, {
    fields: [chefProfiles.chefId],
    references: [chefs.id],
  }),
}));

export const chefDishesRelations = relations(chefDishes, ({ one }) => ({
  chef: one(chefs, {
    fields: [chefDishes.chefId],
    references: [chefs.id],
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

export const insertChefSchema = createInsertSchema(chefs).pick({
  phone: true,
  email: true,
});

export const insertChefProfileSchema = createInsertSchema(chefProfiles).pick({
  chefId: true,
  firstName: true,
  lastName: true,
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
  profileImage: true,
  kitchenImages: true,
});

export const insertChefDishSchema = createInsertSchema(chefDishes).pick({
  chefId: true,
  name: true,
  description: true,
  price: true,
  discountPrice: true,
  category: true,
  dishType: true,
  mealType: true,
  preparationTime: true,
  servingSize: true,
  ingredients: true,
  allergens: true,
  nutritionalInfo: true,
  images: true,
  isAvailable: true,
});

export const insertChefOtpSchema = createInsertSchema(chefOtps).pick({
  phone: true,
  otp: true,
  expiresAt: true,
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

// Chef types
export type InsertChef = z.infer<typeof insertChefSchema>;
export type Chef = typeof chefs.$inferSelect;
export type InsertChefProfile = z.infer<typeof insertChefProfileSchema>;
export type ChefProfile = typeof chefProfiles.$inferSelect;
export type InsertChefDish = z.infer<typeof insertChefDishSchema>;
export type ChefDish = typeof chefDishes.$inferSelect;
export type InsertChefOtp = z.infer<typeof insertChefOtpSchema>;
export type ChefOtp = typeof chefOtps.$inferSelect;
