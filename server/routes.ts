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
    
    // ... rest of your code
  } catch (error) {
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
      // Fetch cook profile from database or external API
      res.json({ 
        cook_id,
        message: "Cook profile retrieved successfully",
        // Add actual profile data here
      });
    } catch (error) {
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

  // Chef API Proxy Routes - Forward authenticated requests to Laravel
  app.use("/api/chef", async (req, res) => {
    try {
      const LARAVEL_API_URL = 'https://sealifepharmaceuticals.com/api';
      console.log(`🔗 Chef API proxy: ${req.method} ${req.originalUrl} -> ${LARAVEL_API_URL}`);
      
      // Forward the authorization header from the original request
      const headers: any = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      };
      
      if (req.headers.authorization) {
        headers['Authorization'] = req.headers.authorization;
        console.log('🔐 Forwarding Authorization header:', req.headers.authorization.substring(0, 20) + '...');
      } else {
        console.log('⚠️ No Authorization header found in request');
      }

      const url = req.originalUrl.replace('/api/chef', '');
      const response = await fetch(`${LARAVEL_API_URL}${url}`, {
        method: req.method,
        headers,
        body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined
      });

      const data = await response.json();
      
      if (!response.ok) {
        return res.status(response.status).json(data);
      }

      res.json(data);
    } catch (error) {
      console.error("Chef API proxy error:", error);
      res.status(500).json({ 
        error: "API request failed", 
        message: "Could not connect to backend service" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
