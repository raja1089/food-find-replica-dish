import type { Express, Request } from "express";
import express from "express";
import { createServer, type Server } from "http";

// Extend Request interface to include cook properties
interface AuthenticatedRequest extends Request {
  cook?: any;
  cook_id?: number;
}
import { storage } from "./storage";
import {
  insertAdminSchema,
  insertCitySchema,
  insertRestaurantSchema,
  insertFeatureSchema,
  insertStatsSchema,
  insertFooterPageSchema,
  insertFooterSettingsSchema,
  insertHeroSectionSchema,
  insertCookRegistrationSchema,
} from "@shared/schema";
import { mysqlCookStorage } from "./mysql-db";
import bcrypt from "bcrypt";
import session from "express-session";
import jwt from "jsonwebtoken";

export async function registerRoutes(app: Express): Promise<Server> {
  // Add this line to parse JSON request bodies
  app.use(express.json());

  // Session middleware for admin authentication
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "fallback-secret-key",
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: false, // Set to true in production with HTTPS
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      },
    }),
  );
  // Middleware to check if admin is authenticated
  const requireAuth = (req: any, res: any, next: any) => {
    if (!req.session.adminId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    next();
  };

  // JWT authentication middleware for cook APIs
  const requireCookAuth = (req: AuthenticatedRequest, res: any, next: any) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: "Authorization token required" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
      req.cook = decoded; // Contains cook_id and other cook info
      req.cook_id = decoded.cook_id;
      next();
    } catch (error) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }
  };

  // Admin Authentication Routes
app.post("/api/admin/login", async (req, res) => {
  try {
    const { username, password } = insertAdminSchema.parse(req.body);
    const admin = await storage.getAdminByUsername(username);

    if (!admin) {
      return res.status(401).json({ error: "wrong cred" });
    }
    
    // ✅ Add these two lines
    console.log("Password from request:", password);
    console.log("Password from database:", admin.password);
    
    const isValid = await bcrypt.compare(password, admin.password);
    
    if (!isValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Set admin session
    req.session.adminId = admin.id;
    
    res.json({ 
      message: "Login successful", 
      admin: { 
        id: admin.id, 
        username: admin.username 
      } 
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(400).json({ error: "Invalid input value" });
  }
});

  app.post("/api/admin/logout", (req, res) => {
    req.session.destroy((err: any) => {
      if (err) {
        return res.status(500).json({ error: "Logout failed" });
      }
      res.json({ message: "Logout successful" });
    });
  });

  app.get("/api/admin/verify", requireAuth, async (req, res) => {
    try {
      const admin = await storage.getAdminByUsername("admin"); // You'll need to get by ID
      res.json({ admin: { id: admin?.id, username: admin?.username } });
    } catch (error) {
      res.status(500).json({ error: "Failed to get admin info" });
    }
  });

  // Public API Routes (for frontend)
  app.get("/api/cities", async (req, res) => {
    try {
      const cities = await storage.getAllCities();
      res.json(cities);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch cities" });
    }
  });

  app.get("/api/cities/popular", async (req, res) => {
    try {
      const cities = await storage.getPopularCities();
      res.json(cities);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch popular cities" });
    }
  });

  app.get("/api/restaurants", async (req, res) => {
    try {
      const restaurants = await storage.getAllRestaurants();
      res.json(restaurants);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch restaurants" });
    }
  });

  app.get("/api/features", async (req, res) => {
    try {
      const features = await storage.getActiveFeatures();
      res.json(features);
    } catch (error) {
      console.error("Features error:", error);
      res.status(500).json({ error: "Failed to fetch features" });
    }
  });

  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getStats();
      res.json(stats || { restaurants: 0, cities: 0, users: 0, orders: 0 });
    } catch (error) {
      console.error("Stats error:", error);
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  // Public footer pages endpoint
  app.get("/api/footer-pages", async (req, res) => {
    try {
      const pages = await storage.getAllFooterPages();
      // Only return published pages for public endpoint
      const publishedPages = pages.filter((page) => page.isPublished);
      res.json(publishedPages);
    } catch (error) {
      console.error("Footer pages error:", error);
      res.status(500).json({ error: "Failed to fetch footer pages" });
    }
  });

  // Get specific footer page by slug
  app.get("/api/footer-pages/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const page = await storage.getFooterPageBySlug(slug);

      if (!page || !page.isPublished) {
        return res.status(404).json({ error: "Page not found" });
      }

      res.json(page);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch page" });
    }
  });

  // Admin API Routes (protected)
  // Cities management
  app.get("/api/admin/cities", requireAuth, async (req, res) => {
    try {
      const cities = await storage.getAllCities();
      res.json(cities);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch cities" });
    }
  });

  app.post("/api/admin/cities", requireAuth, async (req, res) => {
    try {
      const cityData = insertCitySchema.parse(req.body);
      const city = await storage.createCity(cityData);
      res.json(city);
    } catch (error) {
      res.status(400).json({ error: "Invalid city data" });
    }
  });

  app.put("/api/admin/cities/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const cityData = insertCitySchema.partial().parse(req.body);
      const city = await storage.updateCity(id, cityData);
      res.json(city);
    } catch (error) {
      res.status(400).json({ error: "Failed to update city" });
    }
  });

  app.delete("/api/admin/cities/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteCity(id);
      res.json({ message: "City deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete city" });
    }
  });

  // Restaurants management
  app.get("/api/admin/restaurants", requireAuth, async (req, res) => {
    try {
      const restaurants = await storage.getAllRestaurants();
      res.json(restaurants);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch restaurants" });
    }
  });

  app.post("/api/admin/restaurants", requireAuth, async (req, res) => {
    try {
      const restaurantData = insertRestaurantSchema.parse(req.body);
      const restaurant = await storage.createRestaurant(restaurantData);
      res.json(restaurant);
    } catch (error) {
      res.status(400).json({ error: "Invalid restaurant data" });
    }
  });

  app.put("/api/admin/restaurants/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const restaurantData = insertRestaurantSchema.partial().parse(req.body);
      const restaurant = await storage.updateRestaurant(id, restaurantData);
      res.json(restaurant);
    } catch (error) {
      res.status(400).json({ error: "Failed to update restaurant" });
    }
  });

  app.delete("/api/admin/restaurants/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteRestaurant(id);
      res.json({ message: "Restaurant deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete restaurant" });
    }
  });

  // Features management
  app.get("/api/admin/features", requireAuth, async (req, res) => {
    try {
      const features = await storage.getAllFeatures();
      res.json(features);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch features" });
    }
  });

  app.post("/api/admin/features", requireAuth, async (req, res) => {
    try {
      const featureData = insertFeatureSchema.parse(req.body);
      const feature = await storage.createFeature(featureData);
      res.json(feature);
    } catch (error) {
      res.status(400).json({ error: "Invalid feature data" });
    }
  });

  app.put("/api/admin/features/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const featureData = insertFeatureSchema.partial().parse(req.body);
      const feature = await storage.updateFeature(id, featureData);
      res.json(feature);
    } catch (error) {
      res.status(400).json({ error: "Failed to update feature" });
    }
  });

  app.delete("/api/admin/features/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteFeature(id);
      res.json({ message: "Feature deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete feature" });
    }
  });

  // Stats management
  app.put("/api/admin/stats", requireAuth, async (req, res) => {
    try {
      const statsData = insertStatsSchema.parse(req.body);
      const stats = await storage.updateStats(statsData);
      res.json(stats);
    } catch (error) {
      res.status(400).json({ error: "Invalid stats data" });
    }
  });

  // Footer pages management
  app.get("/api/admin/footer-pages", requireAuth, async (req, res) => {
    try {
      const pages = await storage.getAllFooterPages();
      res.json(pages);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch footer pages" });
    }
  });

  app.post("/api/admin/footer-pages", requireAuth, async (req, res) => {
    try {
      const pageData = insertFooterPageSchema.parse(req.body);
      const page = await storage.createFooterPage(pageData);
      res.json(page);
    } catch (error) {
      res.status(400).json({ error: "Invalid footer page data" });
    }
  });

  app.put("/api/admin/footer-pages/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const pageData = insertFooterPageSchema.partial().parse(req.body);
      const page = await storage.updateFooterPage(id, pageData);
      res.json(page);
    } catch (error) {
      res.status(400).json({ error: "Failed to update footer page" });
    }
  });

  app.delete("/api/admin/footer-pages/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteFooterPage(id);
      res.json({ message: "Footer page deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete footer page" });
    }
  });

  // Footer settings management
  app.get("/api/admin/footer-settings", requireAuth, async (req, res) => {
    try {
      const settings = await storage.getFooterSettings();
      res.json(settings);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch footer settings" });
    }
  });

  app.put("/api/admin/footer-settings", requireAuth, async (req, res) => {
    try {
      const settingsData = insertFooterSettingsSchema.parse(req.body);
      const settings = await storage.updateFooterSettings(settingsData);
      res.json(settings);
    } catch (error) {
      res.status(400).json({ error: "Invalid footer settings data" });
    }
  });

  // Hero section management
  app.get("/api/admin/hero", requireAuth, async (req, res) => {
    try {
      const hero = await storage.getHeroSection();
      res.json(hero);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch hero section" });
    }
  });

  app.put("/api/admin/hero", requireAuth, async (req, res) => {
    try {
      const heroData = insertHeroSectionSchema.parse(req.body);
      const hero = await storage.updateHeroSection(heroData);
      res.json(hero);
    } catch (error) {
      res.status(400).json({ error: "Invalid hero section data" });
    }
  });

  // Cook registration routes (public) - Using MySQL with PostgreSQL fallback
  app.post("/api/kitchen-registration", async (req, res) => {
    try {
      const registrationData = insertCookRegistrationSchema.parse(req.body);

      // Try MySQL first
      try {
        const mysqlData = {
          firstName: registrationData.firstName,
          lastName: registrationData.lastName,
          email: registrationData.email,
          phone: registrationData.phone,
          kitchenName: registrationData.kitchenName,
          kitchenType: registrationData.kitchenType,
          cuisineTypes: registrationData.cuisineTypes,
          address: registrationData.address,
          city: registrationData.city,
          state: registrationData.state,
          pincode: registrationData.pincode,
          fssaiLicense: registrationData.fssaiLicense || undefined,
          gstNumber: registrationData.gstNumber || undefined,
          panNumber: registrationData.panNumber || undefined,
          experience: registrationData.experience,
          specialties: registrationData.specialties || [],
          description: registrationData.description || undefined,
          status: "pending",
          latitude: undefined,
          longitude: undefined,
        };

        const registration =
          await mysqlCookStorage.createCookRegistration(mysqlData);
        res.json({
          message: "Registration submitted successfully",
          registration,
        });
      } catch (mysqlError) {
        console.log("MySQL unavailable, using PostgreSQL fallback");
        // Fallback to PostgreSQL
        const registration =
          await storage.createCookRegistration(registrationData);
        res.json({
          message: "Registration submitted successfully",
          registration,
        });
      }
    } catch (error) {
      console.error("Cook registration error:", error);
      res.status(500).json({ error: "Registration failed. Please try again." });
    }
  });

  // Cook registration admin routes - Using MySQL with PostgreSQL fallback
  app.get("/api/admin/cook-registrations", requireAuth, async (req, res) => {
    try {
      // Try MySQL first
      try {
        const registrations = await mysqlCookStorage.getAllCookRegistrations();
        res.json(registrations);
      } catch (mysqlError) {
        console.log("MySQL unavailable, using PostgreSQL fallback");
        // Fallback to PostgreSQL
        const registrations = await storage.getAllCookRegistrations();
        res.json(registrations);
      }
    } catch (error) {
      console.error("Error fetching cook registrations:", error);
      res.status(500).json({ error: "Failed to fetch cook registrations" });
    }
  });

  app.get(
    "/api/admin/cook-registrations/:id",
    requireAuth,
    async (req, res) => {
      try {
        const id = parseInt(req.params.id);
        // Try MySQL first
        try {
          const registration =
            await mysqlCookStorage.getCookRegistrationById(id);
          if (!registration) {
            return res.status(404).json({ error: "Registration not found" });
          }
          res.json(registration);
        } catch (mysqlError) {
          console.log("MySQL unavailable, using PostgreSQL fallback");
          // Fallback to PostgreSQL
          const registration = await storage.getCookRegistrationById(id);
          if (!registration) {
            return res.status(404).json({ error: "Registration not found" });
          }
          res.json(registration);
        }
      } catch (error) {
        console.error("Error fetching cook registration:", error);
        res.status(500).json({ error: "Failed to fetch registration" });
      }
    },
  );

  app.put(
    "/api/admin/cook-registrations/:id/status",
    requireAuth,
    async (req, res) => {
      try {
        const id = parseInt(req.params.id);
        const { status } = req.body;

        if (!["pending", "approved", "rejected"].includes(status)) {
          return res.status(400).json({ error: "Invalid status" });
        }

        // Try MySQL first
        try {
          const registration =
            await mysqlCookStorage.updateCookRegistrationStatus(id, status);
          if (!registration) {
            return res.status(404).json({ error: "Registration not found" });
          }
          res.json(registration);
        } catch (mysqlError) {
          console.log("MySQL unavailable, using PostgreSQL fallback");
          // Fallback to PostgreSQL
          const registration = await storage.updateCookRegistrationStatus(
            id,
            status,
          );
          res.json(registration);
        }
      } catch (error) {
        console.error("Error updating cook registration status:", error);
        res.status(400).json({ error: "Failed to update registration status" });
      }
    },
  );

  // Chef Authentication Proxy Routes - Forward to Laravel Backend
  app.post("/api/send-otp", async (req, res) => {
    try {
      const { phone, user_type } = req.body;
      
      if (!phone) {
        return res.status(400).json({ 
          error: "Phone number is required" 
        });
      }

      console.log(`📱 Sending real OTP to ${phone} for ${user_type}`);
      
      // Call real OTP API
      const OTP_API_URL = 'https://sealifepharmaceuticals.com/api/send-otp';
      
      const response = await fetch(OTP_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          mobile_number: phone,
          user_type: user_type || 'cook'
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        console.error('OTP API Error:', response.status, data);
        return res.status(response.status).json({
          error: data.message || data.error || "Failed to send OTP",
          details: data
        });
      }

      console.log('✅ OTP sent successfully:', data);
      res.json(data);
      
    } catch (error) {
      console.error("Send OTP error:", error);
      res.status(500).json({ 
        error: "Failed to send OTP", 
        message: "Could not connect to authentication service",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });

  app.post("/api/verify-otp", async (req, res) => {
    try {
      const { phone, otp, user_type } = req.body;
      
      if (!phone || !otp) {
        return res.status(400).json({ 
          error: "Phone number and OTP are required" 
        });
      }

      console.log(`✅ Verifying OTP for ${phone} (${user_type})`);
      
      // Call real OTP verification API
      const VERIFY_OTP_API_URL = 'https://sealifepharmaceuticals.com/api/verify-otp';
      
      const response = await fetch(VERIFY_OTP_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          mobile_number: phone,
          otp: otp,
          user_type: user_type || 'cook'
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        console.error('OTP Verify API Error:', response.status, data);
        return res.status(response.status).json({
          error: data.message || data.error || "Failed to verify OTP",
          details: data
        });
      }

      console.log('✅ OTP verified successfully:', data);
      res.json(data);
    } catch (error) {
      console.error("Verify OTP error:", error);
      res.status(500).json({ 
        error: "Failed to verify OTP", 
        message: "Could not connect to authentication service" 
      });
    }
  });

  // Cook Authentication Routes
  app.post("/api/cook/login", async (req, res) => {
    try {
      const { phone, password } = req.body;
      
      if (!phone) {
        return res.status(400).json({ error: "Phone number is required" });
      }

      // Here you would verify cook credentials against your database
      // For now, I'll create a simple example
      const cookData = {
        cook_id: 1, // This would come from your database
        phone: phone,
        // Add other cook data as needed
      };

      // Generate JWT token with cook_id
      const token = jwt.sign(
        { 
          cook_id: cookData.cook_id, 
          phone: cookData.phone 
        },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      res.json({
        success: true,
        token: token,
        cook_id: cookData.cook_id,
        cook: cookData
      });
    } catch (error) {
      console.error("Cook login error:", error);
      res.status(500).json({ error: "Login failed" });
    }
  });

  // Protected Cook GET API Routes
  app.get("/api/cook/profile", requireCookAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const cook_id = req.cook_id;
      const token = req.headers.authorization?.replace('Bearer ', '');
      
      console.log(`📱 GET Cook Profile for cook_id: ${cook_id}`);
      
      // Return comprehensive cook profile data
      const profileData = {
        cook_id: cook_id,
        profile: {
          id: cook_id,
          name: "Chef Kumar",
          email: "chef.kumar@example.com",
          mobile_number: "8808504376",
          user_type: "cook",
          role_id: 2,
          avatar: null,
          profile_completed: true,
          rating: 4.5,
          total_orders: 145,
          specialties: ["North Indian", "Chinese", "Italian"],
          experience_years: 5,
          location: {
            city: "Delhi",
            area: "Connaught Place"
          },
          kyc: {
            kyc_id: 6,
            kyc_status: "APPROVED",
            kyc_submitted_at: "2025-09-08 06:52:15"
          },
          business_info: {
            kitchen_name: "Kumar's Kitchen",
            cuisine_types: ["North Indian", "Chinese"],
            operating_hours: "9:00 AM - 10:00 PM",
            minimum_order: 150
          }
        },
        message: "Cook profile retrieved successfully"
      };
      
      console.log(`✅ Returning profile data for cook_id: ${cook_id}`);
      res.json(profileData);
    } catch (error) {
      console.error("Cook profile API error:", error);
      res.status(500).json({ error: "Failed to fetch cook profile" });
    }
  });

  app.get("/api/cook/cuisine", requireCookAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const cook_id = req.cook_id;
      // Fetch cook cuisine data
      res.json({ 
        cook_id,
        message: "Cook cuisine data retrieved successfully",
        // Add actual cuisine data here
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch cook cuisine" });
    }
  });

  app.get("/api/cook/subregions/:cuisineId", requireCookAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const cook_id = req.cook_id;
      const { cuisineId } = req.params;
      // Fetch subregions for the given cuisine
      res.json({ 
        cook_id,
        cuisineId,
        message: "Subregions retrieved successfully",
        // Add actual subregions data here
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch subregions" });
    }
  });

  app.get("/api/cook/dishes/:dishId", requireCookAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const cook_id = req.cook_id;
      const { dishId } = req.params;
      // Fetch dish details
      res.json({ 
        cook_id,
        dishId,
        message: "Dish details retrieved successfully",
        // Add actual dish data here
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch dish details" });
    }
  });

  app.get("/api/cook/kitchen-types", requireCookAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const cook_id = req.cook_id;
      // Fetch kitchen types
      res.json({ 
        cook_id,
        message: "Kitchen types retrieved successfully",
        kitchen_types: ["home_kitchen", "restaurant", "cloud_kitchen"]
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch kitchen types" });
    }
  });

  app.get("/api/cook/rewards", requireCookAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const cook_id = req.cook_id;
      // Fetch cook rewards
      res.json({ 
        cook_id,
        message: "Cook rewards retrieved successfully",
        // Add actual rewards data here
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch cook rewards" });
    }
  });

  app.get("/api/cook/orders/:cookId", requireCookAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const cook_id = req.cook_id;
      const { cookId } = req.params;
      
      // Verify that the requested cookId matches the authenticated cook
      if (parseInt(cookId) !== cook_id) {
        return res.status(403).json({ error: "Access denied" });
      }

      // Fetch orders for the cook
      res.json({ 
        cook_id,
        message: "Cook orders retrieved successfully",
        // Add actual orders data here
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch cook orders" });
    }
  });

  app.get("/api/cook/coupons", requireCookAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const cook_id = req.cook_id;
      // Fetch cook coupons
      res.json({ 
        cook_id,
        message: "Cook coupons retrieved successfully",
        // Add actual coupons data here
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch cook coupons" });
    }
  });

  app.get("/api/cook/kyc", requireCookAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const cook_id = req.cook_id;
      // Fetch cook KYC status
      res.json({ 
        cook_id,
        message: "Cook KYC status retrieved successfully",
        // Add actual KYC data here
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch cook KYC status" });
    }
  });

  // Chef profile GET endpoint 
  app.get("/api/chef/profile", requireCookAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const cook_id = req.cook_id;
      if (!cook_id) {
        return res.status(401).json({ error: "Authentication required" });
      }
      console.log(`👤 GET Chef Profile for cook_id: ${cook_id}`);
      
      const profileData = {
        cook_id: cook_id.toString(),
        name: "Raj Singh",
        email: null,
        mobile_number: "8808504376",
        user_type: "cook",
        role_id: 2,
        avatar: null,
        profile_completed: true,
        kyc: {
          kyc_id: 6,
          kyc_status: "APPROVED",
          kyc_submitted_at: "2025-09-08 06:52:15"
        }
      };
      
      console.log(`✅ Returning chef profile data for cook_id: ${cook_id}`);
      res.json(profileData);
    } catch (error) {
      console.error("Chef profile API error:", error);
      res.status(500).json({ error: "Failed to fetch chef profile" });
    }
  });

  // Chef dishes GET endpoint
  app.get("/api/chef/dishes", requireCookAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const cook_id = req.cook_id;
      if (!cook_id) {
        return res.status(401).json({ error: "Authentication required" });
      }
      console.log(`🍽️ GET Chef Dishes for cook_id: ${cook_id}`);
      
      const dishesData = {
        cook_id: cook_id.toString(),
        dishes: [
          {
            id: 1,
            name: "Vada Pav",
            price: 40,
            category: "Snacks",
            image: "https://sealifepharmaceuticals.com/public/uploads/dishes/1758612772_scaled_1000003432.png",
            is_available: true,
            preparation_time: 15
          },
          {
            id: 2,
            name: "Chicken Biryani",
            price: 180,
            category: "Main Course",
            image: "https://example.com/biryani.jpg",
            is_available: true,
            preparation_time: 45
          }
        ],
        message: "Chef dishes retrieved successfully"
      };
      
      console.log(`✅ Returning chef dishes data for cook_id: ${cook_id}`);
      res.json(dishesData);
    } catch (error) {
      console.error("Chef dishes API error:", error);
      res.status(500).json({ error: "Failed to fetch chef dishes" });
    }
  });

  // Analytics API POST method with cook_id as JSON parameter
  app.post("/api/cook/analytics", requireCookAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const auth_cook_id = req.cook_id;
      const { cook_id } = req.body;
      
      console.log(`📊 POST Analytics with JSON cook_id: ${cook_id}, auth cook_id: ${auth_cook_id}`);
      
      // Verify that the requested cook_id matches the authenticated cook
      if (parseInt(cook_id) !== auth_cook_id) {
        return res.status(403).json({ error: "Access denied" });
      }

      // Return analytics data in the exact format you provided
      const analyticsData = {
        cook_id: cook_id.toString(),
        total_orders: 7,
        total_revenue: 280,
        average_preparation_time: 0,
        top_dishes: [
          {
            count: 7,
            name: "Vada Pav",
            image: "https://sealifepharmaceuticals.com/public/uploads/dishes/1758612772_scaled_1000003432.png"
          }
        ],
        today: {
          orders: 0,
          revenue: 0,
          average_preparation_time: 0
        }
      };
      
      console.log(`✅ Returning analytics data:`, analyticsData);
      res.json(analyticsData);
    } catch (error) {
      console.error("Analytics API error:", error);
      res.status(500).json({ error: "Failed to fetch cook analytics" });
    }
  });

  // GET endpoint for cook analytics 
  app.get("/api/cook/analytics", requireCookAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const cook_id = req.cook_id;
      if (!cook_id) {
        return res.status(401).json({ error: "Authentication required" });
      }
      
      console.log(`📊 GET Analytics for cook_id: ${cook_id}`);

      // Return analytics data in the exact format you provided
      const analyticsData = {
        cook_id: cook_id.toString(),
        total_orders: 7,
        total_revenue: 280,
        average_preparation_time: 0,
        top_dishes: [
          {
            count: 7,
            name: "Vada Pav",
            image: "https://sealifepharmaceuticals.com/public/uploads/dishes/1758612772_scaled_1000003432.png"
          }
        ],
        today: {
          orders: 0,
          revenue: 0,
          average_preparation_time: 0
        }
      };
      
      console.log(`✅ Returning analytics data:`, analyticsData);
      res.json(analyticsData);
    } catch (error) {
      console.error("Analytics API error:", error);
      res.status(500).json({ error: "Failed to fetch cook analytics" });
    }
  });

  app.post("/api/cook/analytics/:cook_id", requireCookAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const cook_id = req.cook_id;
      const { cook_id: urlCookId } = req.params;
      
      // Verify that the requested cook_id matches the authenticated cook
      if (parseInt(urlCookId) !== cook_id) {
        return res.status(403).json({ error: "Access denied" });
      }

      // Fetch cook analytics data
      res.json({ 
        cook_id,
        message: "Cook analytics retrieved successfully",
        analytics: {
          total_orders: 0,
          revenue: 0,
          rating: 0,
          active_dishes: 0
        }
        // Add actual analytics data here
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch cook analytics" });
    }
  });

  // Dishes-related GET endpoints
  app.get("/api/dishes", requireCookAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const cook_id = req.cook_id;
      // Fetch all dishes for the authenticated cook
      res.json({ 
        cook_id,
        message: "Dishes retrieved successfully",
        dishes: []
        // Add actual dishes data here
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch dishes" });
    }
  });

  app.get("/api/dish-types", requireCookAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const cook_id = req.cook_id;
      // Fetch dish types
      res.json({ 
        cook_id,
        message: "Dish types retrieved successfully",
        dish_types: ["veg", "non-veg", "vegan", "jain"]
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch dish types" });
    }
  });

  app.get("/api/meal-types", requireCookAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const cook_id = req.cook_id;
      // Fetch meal types
      res.json({ 
        cook_id,
        message: "Meal types retrieved successfully",
        meal_types: ["breakfast", "lunch", "dinner", "snack", "beverage"]
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch meal types" });
    }
  });

  app.get("/api/dishes/by-dish-type/:id", requireCookAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const cook_id = req.cook_id;
      const { id } = req.params;
      // Fetch dishes by dish type
      res.json({ 
        cook_id,
        dish_type_id: id,
        message: "Dishes by dish type retrieved successfully",
        dishes: []
        // Add actual dishes data here
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch dishes by dish type" });
    }
  });

  app.get("/api/subregion-tags/:cuisine_id", requireCookAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const cook_id = req.cook_id;
      const { cuisine_id } = req.params;
      // Fetch subregion tags for cuisine
      res.json({ 
        cook_id,
        cuisine_id,
        message: "Subregion tags retrieved successfully",
        subregion_tags: []
        // Add actual subregion tags data here
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch subregion tags" });
    }
  });

  // Orders-related GET endpoints
  app.get("/api/orders/:id", requireCookAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const cook_id = req.cook_id;
      const { id } = req.params;
      // Fetch specific order details
      res.json({ 
        cook_id,
        order_id: id,
        message: "Order details retrieved successfully",
        order: {}
        // Add actual order data here
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch order details" });
    }
  });

  app.get("/api/my-orders", requireCookAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const cook_id = req.cook_id;
      // Fetch orders for the authenticated cook
      res.json({ 
        cook_id,
        message: "My orders retrieved successfully",
        orders: []
        // Add actual orders data here
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch my orders" });
    }
  });

  app.get("/api/orders/tracking/:id", requireCookAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const cook_id = req.cook_id;
      const { id } = req.params;
      // Fetch order tracking information
      res.json({ 
        cook_id,
        order_id: id,
        message: "Order tracking retrieved successfully",
        tracking: {
          status: "preparing",
          estimated_time: "30 minutes",
          current_location: null
        }
        // Add actual tracking data here
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch order tracking" });
    }
  });

  app.get("/api/tracking/orders/:id", requireCookAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const cook_id = req.cook_id;
      const { id } = req.params;
      // Track order status
      res.json({ 
        cook_id,
        order_id: id,
        message: "Order tracking status retrieved successfully",
        tracking_status: {
          order_placed: true,
          confirmed: true,
          preparing: true,
          ready: false,
          picked_up: false,
          delivered: false
        }
        // Add actual tracking status data here
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to track order" });
    }
  });

  app.get("/api/orders/user/:userId", requireCookAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const cook_id = req.cook_id;
      const { userId } = req.params;
      // Fetch orders for specific user (cook can see their customer orders)
      res.json({ 
        cook_id,
        user_id: userId,
        message: "User orders retrieved successfully",
        orders: []
        // Add actual user orders data here
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user orders" });
    }
  });

  // Dishes-related endpoints - Forward to Laravel API
  app.post("/api/add-dishes", requireCookAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const LARAVEL_API_URL = 'https://sealifepharmaceuticals.com/api';
      const headers: any = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      };
      
      if (req.headers.authorization) {
        headers['Authorization'] = req.headers.authorization;
      }

      const response = await fetch(`${LARAVEL_API_URL}/add-dishes`, {
        method: 'POST',
        headers,
        body: JSON.stringify(req.body)
      });

      const data = await response.json();
      
      if (!response.ok) {
        return res.status(response.status).json(data);
      }

      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to add dish" });
    }
  });

  app.get("/api/dishes", requireCookAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const LARAVEL_API_URL = 'https://sealifepharmaceuticals.com/api';
      const headers: any = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      };
      
      if (req.headers.authorization) {
        headers['Authorization'] = req.headers.authorization;
      }

      const response = await fetch(`${LARAVEL_API_URL}/dishes`, {
        method: 'GET',
        headers
      });

      const data = await response.json();
      
      if (!response.ok) {
        return res.status(response.status).json(data);
      }

      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch dishes" });
    }
  });

  app.put("/api/update-dish/:id", requireCookAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const { id } = req.params;
      const LARAVEL_API_URL = 'https://sealifepharmaceuticals.com/api';
      const headers: any = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      };
      
      if (req.headers.authorization) {
        headers['Authorization'] = req.headers.authorization;
      }

      const response = await fetch(`${LARAVEL_API_URL}/update-dish/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(req.body)
      });

      const data = await response.json();
      
      if (!response.ok) {
        return res.status(response.status).json(data);
      }

      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to update dish" });
    }
  });

  app.post("/api/dishes/:id/photo", requireCookAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const { id } = req.params;
      const LARAVEL_API_URL = 'https://sealifepharmaceuticals.com/api';
      const headers: any = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      };
      
      if (req.headers.authorization) {
        headers['Authorization'] = req.headers.authorization;
      }

      const response = await fetch(`${LARAVEL_API_URL}/dishes/${id}/photo`, {
        method: 'POST',
        headers,
        body: JSON.stringify(req.body)
      });

      const data = await response.json();
      
      if (!response.ok) {
        return res.status(response.status).json(data);
      }

      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to update dish photo" });
    }
  });

  app.delete("/api/dishes/:id", requireCookAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const { id } = req.params;
      const LARAVEL_API_URL = 'https://sealifepharmaceuticals.com/api';
      const headers: any = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      };
      
      if (req.headers.authorization) {
        headers['Authorization'] = req.headers.authorization;
      }

      const response = await fetch(`${LARAVEL_API_URL}/dishes/${id}`, {
        method: 'DELETE',
        headers
      });

      const data = await response.json();
      
      if (!response.ok) {
        return res.status(response.status).json(data);
      }

      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to delete dish" });
    }
  });

  app.get("/api/cook/dishes/:dishId", requireCookAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const { dishId } = req.params;
      const LARAVEL_API_URL = 'https://sealifepharmaceuticals.com/api';
      const headers: any = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      };
      
      if (req.headers.authorization) {
        headers['Authorization'] = req.headers.authorization;
      }

      const response = await fetch(`${LARAVEL_API_URL}/cook/dishes/${dishId}`, {
        method: 'GET',
        headers
      });

      const data = await response.json();
      
      if (!response.ok) {
        return res.status(response.status).json(data);
      }

      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch dish details" });
    }
  });

  app.patch("/api/dishes/:id/availability", requireCookAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const { id } = req.params;
      const LARAVEL_API_URL = 'https://sealifepharmaceuticals.com/api';
      const headers: any = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      };
      
      if (req.headers.authorization) {
        headers['Authorization'] = req.headers.authorization;
      }

      const response = await fetch(`${LARAVEL_API_URL}/dishes/${id}/availability`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(req.body)
      });

      const data = await response.json();
      
      if (!response.ok) {
        return res.status(response.status).json(data);
      }

      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to update dish availability" });
    }
  });

  // Cook analytics endpoint - POST method with bearer token authentication
  app.post("/api/analytics/track", requireCookAuth, async (req: AuthenticatedRequest, res) => {
    try {
      // cook_id comes from the authenticated token after login
      const cook_id = req.cook_id;
      
      console.log(`🔗 Analytics API POST: /analytics/track for cook_id: ${cook_id}`);
      
      // Store analytics data locally (you can extend this to send to external APIs)
      const analyticsData = {
        cook_id: cook_id,
        timestamp: new Date().toISOString(),
        ...req.body
      };
      
      console.log('📊 Analytics data:', analyticsData);
      
      // If you want to forward to external API, uncomment below:
      /*
      const LARAVEL_API_URL = 'https://sealifepharmaceuticals.com/api';
      const headers: any = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': req.headers.authorization
      };

      const response = await fetch(`${LARAVEL_API_URL}/cook/analytics/${cook_id}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(analyticsData)
      });

      const data = await response.json();
      
      if (!response.ok) {
        return res.status(response.status).json(data);
      }
      */

      res.json({ 
        success: true, 
        message: "Analytics tracked successfully",
        cook_id: cook_id,
        data: analyticsData
      });
    } catch (error) {
      console.error("Analytics API error:", error);
      res.status(500).json({ 
        error: "Failed to track analytics", 
        message: "Analytics tracking failed" 
      });
    }
  });

  // Cook analytics dashboard endpoint - GET method with bearer token
  app.get("/api/analytics/dashboard", requireCookAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const cook_id = req.cook_id;
      
      console.log(`📈 Analytics Dashboard API GET for cook_id: ${cook_id}`);
      
      // Return mock analytics dashboard data (extend this with real data)
      const dashboardData = {
        cook_id: cook_id,
        summary: {
          total_views: 0,
          total_orders: 0,
          total_revenue: 0,
          active_dishes: 0
        },
        recent_activity: [],
        timestamp: new Date().toISOString()
      };

      res.json(dashboardData);
    } catch (error) {
      console.error("Analytics Dashboard API error:", error);
      res.status(500).json({ 
        error: "Failed to fetch analytics dashboard", 
        message: "Dashboard data unavailable" 
      });
    }
  });

  // Cook analytics events endpoint - POST method with bearer token
  app.post("/api/analytics/events", requireCookAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const cook_id = req.cook_id;
      const { event_type, event_data } = req.body;
      
      console.log(`🎯 Analytics Event API POST for cook_id: ${cook_id}, event: ${event_type}`);
      
      const eventRecord = {
        cook_id: cook_id,
        event_type: event_type,
        event_data: event_data,
        timestamp: new Date().toISOString()
      };
      
      console.log('🎯 Event recorded:', eventRecord);

      res.json({ 
        success: true, 
        message: "Event tracked successfully",
        cook_id: cook_id,
        event: eventRecord
      });
    } catch (error) {
      console.error("Analytics Events API error:", error);
      res.status(500).json({ 
        error: "Failed to track event", 
        message: "Event tracking failed" 
      });
    }
  });


  const httpServer = createServer(app);
  return httpServer;
}
