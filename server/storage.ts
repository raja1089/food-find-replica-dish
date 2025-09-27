// storage.ts
import { 
  admins, 
  cities, 
  restaurants, 
  features, 
  stats,
  footerPages,
  heroSection,
  cookRegistrations,
  type Admin, 
  type InsertAdmin,
  type City,
  type InsertCity,
  type Restaurant,
  type InsertRestaurant,
  type Feature,
  type InsertFeature,
  type Stats,
  type InsertStats,
  type FooterPage,
  type InsertFooterPage,
  type HeroSection,
  type InsertHeroSection,
  type CookRegistration,
  type InsertCookRegistration
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // Admin operations
  getAdminByUsername(username: string): Promise<Admin | undefined>;
  createAdmin(admin: InsertAdmin): Promise<Admin>;
  
  // City operations
  getAllCities(): Promise<City[]>;
  getPopularCities(): Promise<City[]>;
  getCityById(id: number): Promise<City | undefined>;
  createCity(city: InsertCity): Promise<City>;
  updateCity(id: number, city: Partial<InsertCity>): Promise<City>;
  deleteCity(id: number): Promise<void>;
  
  // Restaurant operations
  getAllRestaurants(): Promise<Restaurant[]>;
  getRestaurantsByCity(cityId: number): Promise<Restaurant[]>;
  getRestaurantById(id: number): Promise<Restaurant | undefined>;
  createRestaurant(restaurant: InsertRestaurant): Promise<Restaurant>;
  updateRestaurant(id: number, restaurant: Partial<InsertRestaurant>): Promise<Restaurant>;
  deleteRestaurant(id: number): Promise<void>;
  
  // Feature operations
  getAllFeatures(): Promise<Feature[]>;
  getActiveFeatures(): Promise<Feature[]>;
  getFeatureById(id: number): Promise<Feature | undefined>;
  createFeature(feature: InsertFeature): Promise<Feature>;
  updateFeature(id: number, feature: Partial<InsertFeature>): Promise<Feature>;
  deleteFeature(id: number): Promise<void>;
  
  // Stats operations
  getStats(): Promise<Stats | undefined>;
  updateStats(stats: InsertStats): Promise<Stats>;
  
  // Footer page operations
  getAllFooterPages(): Promise<FooterPage[]>;
  getFooterPageById(id: number): Promise<FooterPage | undefined>;
  getFooterPageBySlug(slug: string): Promise<FooterPage | undefined>;
  createFooterPage(page: InsertFooterPage): Promise<FooterPage>;
  updateFooterPage(id: number, page: Partial<InsertFooterPage>): Promise<FooterPage>;
  deleteFooterPage(id: number): Promise<void>;
  
  // Hero section operations
  getHeroSection(): Promise<HeroSection | undefined>;
  updateHeroSection(hero: InsertHeroSection): Promise<HeroSection>;
  
  // Cook registration operations
  createCookRegistration(registration: InsertCookRegistration): Promise<CookRegistration>;
  getAllCookRegistrations(): Promise<CookRegistration[]>;
  getCookRegistrationById(id: number): Promise<CookRegistration | undefined>;
  updateCookRegistrationStatus(id: number, status: string): Promise<CookRegistration>;
}

export class DatabaseStorage implements IStorage {
  // Admin operations
  async getAdminByUsername(username: string): Promise<Admin | undefined> {
    console.log("🔍 Checking MySQL for admin:", username);
    const [admin] = await db.select().from(admins).where(eq(admins.username, username));
  console.log("Admin object from DB:", admin);
    console.log("🔑 Admin found:", admin);
    return admin;
  }

  async createAdmin(admin: InsertAdmin): Promise<Admin> {
    const [newAdmin] = await db.insert(admins).values(admin).returning();
    return newAdmin;
  }

  // City operations
  async getAllCities(): Promise<City[]> {
    return await db.select().from(cities).orderBy(desc(cities.createdAt));
  }

  async getPopularCities(): Promise<City[]> {
    return await db.select().from(cities).where(eq(cities.isPopular, true)).orderBy(desc(cities.restaurantCount));
  }

  async getCityById(id: number): Promise<City | undefined> {
    const [city] = await db.select().from(cities).where(eq(cities.id, id));
    return city;
  }

  async createCity(city: InsertCity): Promise<City> {
    const [newCity] = await db.insert(cities).values(city).returning();
    return newCity;
  }

  async updateCity(id: number, city: Partial<InsertCity>): Promise<City> {
    const [updatedCity] = await db.update(cities).set(city).where(eq(cities.id, id)).returning();
    return updatedCity;
  }

  async deleteCity(id: number): Promise<void> {
    await db.delete(cities).where(eq(cities.id, id));
  }

  // Restaurant operations
  async getAllRestaurants(): Promise<Restaurant[]> {
    return await db.select().from(restaurants).orderBy(desc(restaurants.createdAt));
  }

  async getRestaurantsByCity(cityId: number): Promise<Restaurant[]> {
    return await db.select().from(restaurants).where(eq(restaurants.cityId, cityId));
  }

  async getRestaurantById(id: number): Promise<Restaurant | undefined> {
    const [restaurant] = await db.select().from(restaurants).where(eq(restaurants.id, id));
    return restaurant;
  }

  async createRestaurant(restaurant: InsertRestaurant): Promise<Restaurant> {
    const [newRestaurant] = await db.insert(restaurants).values(restaurant).returning();
    return newRestaurant;
  }

  async updateRestaurant(id: number, restaurant: Partial<InsertRestaurant>): Promise<Restaurant> {
    const [updatedRestaurant] = await db.update(restaurants).set(restaurant).where(eq(restaurants.id, id)).returning();
    return updatedRestaurant;
  }

  async deleteRestaurant(id: number): Promise<void> {
    await db.delete(restaurants).where(eq(restaurants.id, id));
  }

  // Feature operations
  async getAllFeatures(): Promise<Feature[]> {
    return await db.select().from(features).orderBy(features.order);
  }

  async getActiveFeatures(): Promise<Feature[]> {
    return await db.select().from(features).where(eq(features.isActive, true)).orderBy(features.order);
  }

  async getFeatureById(id: number): Promise<Feature | undefined> {
    const [feature] = await db.select().from(features).where(eq(features.id, id));
    return feature;
  }

  async createFeature(feature: InsertFeature): Promise<Feature> {
    const [newFeature] = await db.insert(features).values(feature).returning();
    return newFeature;
  }

  async updateFeature(id: number, feature: Partial<InsertFeature>): Promise<Feature> {
    const [updatedFeature] = await db.update(features).set(feature).where(eq(features.id, id)).returning();
    return updatedFeature;
  }

  async deleteFeature(id: number): Promise<void> {
    await db.delete(features).where(eq(features.id, id));
  }

  // Stats operations
  async getStats(): Promise<Stats | undefined> {
    const [statsRecord] = await db.select().from(stats).limit(1);
    return statsRecord;
  }

  async updateStats(statsData: InsertStats): Promise<Stats> {
    const existingStats = await this.getStats();
    
    if (existingStats) {
      const [updatedStats] = await db.update(stats)
        .set({ ...statsData, updatedAt: new Date() })
        .where(eq(stats.id, existingStats.id))
        .returning();
      return updatedStats;
    } else {
      const [newStats] = await db.insert(stats).values(statsData).returning();
      return newStats;
    }
  }

  // Footer page operations
  async getAllFooterPages(): Promise<FooterPage[]> {
    return await db.select().from(footerPages).orderBy(footerPages.category, footerPages.order);
  }

  async getFooterPageById(id: number): Promise<FooterPage | undefined> {
    const [page] = await db.select().from(footerPages).where(eq(footerPages.id, id));
    return page;
  }

  async getFooterPageBySlug(slug: string): Promise<FooterPage | undefined> {
    const [page] = await db.select().from(footerPages).where(eq(footerPages.slug, slug));
    return page;
  }

  async createFooterPage(page: InsertFooterPage): Promise<FooterPage> {
    const [newPage] = await db.insert(footerPages).values(page).returning();
    return newPage;
  }

  async updateFooterPage(id: number, page: Partial<InsertFooterPage>): Promise<FooterPage> {
    const [updatedPage] = await db.update(footerPages)
      .set({ ...page, updatedAt: new Date() })
      .where(eq(footerPages.id, id))
      .returning();
    return updatedPage;
  }

  async deleteFooterPage(id: number): Promise<void> {
    await db.delete(footerPages).where(eq(footerPages.id, id));
  }

  // Hero section operations
  async getHeroSection(): Promise<HeroSection | undefined> {
    const [hero] = await db.select().from(heroSection).limit(1);
    return hero;
  }

  async updateHeroSection(hero: InsertHeroSection): Promise<HeroSection> {
    const existingHero = await this.getHeroSection();
    
    if (existingHero) {
      const [updatedHero] = await db.update(heroSection)
        .set({ ...hero, updatedAt: new Date() })
        .where(eq(heroSection.id, existingHero.id))
        .returning();
      return updatedHero;
    } else {
      const [newHero] = await db.insert(heroSection).values(hero).returning();
      return newHero;
    }
  }

  // Cook registration operations
  async createCookRegistration(registration: InsertCookRegistration): Promise<CookRegistration> {
    const [newRegistration] = await db
      .insert(cookRegistrations)
      .values(registration)
      .returning();
    return newRegistration;
  }

  async getAllCookRegistrations(): Promise<CookRegistration[]> {
    return await db.select().from(cookRegistrations).orderBy(cookRegistrations.createdAt);
  }

  async getCookRegistrationById(id: number): Promise<CookRegistration | undefined> {
    const [registration] = await db.select().from(cookRegistrations).where(eq(cookRegistrations.id, id));
    return registration;
  }

  async updateCookRegistrationStatus(id: number, status: string): Promise<CookRegistration> {
    const [updatedRegistration] = await db
      .update(cookRegistrations)
      .set({ status, updatedAt: new Date() })
      .where(eq(cookRegistrations.id, id))
      .returning();
    return updatedRegistration;
  }
}

export const storage = new DatabaseStorage();