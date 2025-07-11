import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertAdminSchema, 
  insertCitySchema, 
  insertRestaurantSchema, 
  insertFeatureSchema,
  insertStatsSchema 
} from "@shared/schema";
import bcrypt from "bcrypt";
import session from "express-session";

export async function registerRoutes(app: Express): Promise<Server> {
  // Session middleware for admin authentication
  app.use(session({
    secret: process.env.SESSION_SECRET || 'fallback-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { 
      secure: false, // Set to true in production with HTTPS
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  }));

  // Middleware to check if admin is authenticated
  const requireAuth = (req: any, res: any, next: any) => {
    if (!req.session.adminId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    next();
  };

  // Admin Authentication Routes
  app.post('/api/admin/login', async (req, res) => {
    try {
      const { username, password } = insertAdminSchema.parse(req.body);
      
      const admin = await storage.getAdminByUsername(username);
      if (!admin) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const isValid = await bcrypt.compare(password, admin.password);
      if (!isValid) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      req.session.adminId = admin.id;
      res.json({ message: "Login successful", admin: { id: admin.id, username: admin.username } });
    } catch (error) {
      res.status(400).json({ error: "Invalid input" });
    }
  });

  app.post('/api/admin/logout', (req, res) => {
    req.session.destroy((err: any) => {
      if (err) {
        return res.status(500).json({ error: "Logout failed" });
      }
      res.json({ message: "Logout successful" });
    });
  });

  app.get('/api/admin/me', requireAuth, async (req, res) => {
    try {
      const admin = await storage.getAdminByUsername('admin'); // You'll need to get by ID
      res.json({ admin: { id: admin?.id, username: admin?.username } });
    } catch (error) {
      res.status(500).json({ error: "Failed to get admin info" });
    }
  });

  // Public API Routes (for frontend)
  app.get('/api/cities', async (req, res) => {
    try {
      const cities = await storage.getAllCities();
      res.json(cities);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch cities" });
    }
  });

  app.get('/api/cities/popular', async (req, res) => {
    try {
      const cities = await storage.getPopularCities();
      res.json(cities);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch popular cities" });
    }
  });

  app.get('/api/restaurants', async (req, res) => {
    try {
      const restaurants = await storage.getAllRestaurants();
      res.json(restaurants);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch restaurants" });
    }
  });

  app.get('/api/features', async (req, res) => {
    try {
      const features = await storage.getActiveFeatures();
      res.json(features);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch features" });
    }
  });

  app.get('/api/stats', async (req, res) => {
    try {
      const stats = await storage.getStats();
      res.json(stats || { restaurants: 0, cities: 0, users: 0, orders: 0 });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  // Admin API Routes (protected)
  // Cities management
  app.get('/api/admin/cities', requireAuth, async (req, res) => {
    try {
      const cities = await storage.getAllCities();
      res.json(cities);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch cities" });
    }
  });

  app.post('/api/admin/cities', requireAuth, async (req, res) => {
    try {
      const cityData = insertCitySchema.parse(req.body);
      const city = await storage.createCity(cityData);
      res.json(city);
    } catch (error) {
      res.status(400).json({ error: "Invalid city data" });
    }
  });

  app.put('/api/admin/cities/:id', requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const cityData = insertCitySchema.partial().parse(req.body);
      const city = await storage.updateCity(id, cityData);
      res.json(city);
    } catch (error) {
      res.status(400).json({ error: "Failed to update city" });
    }
  });

  app.delete('/api/admin/cities/:id', requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteCity(id);
      res.json({ message: "City deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete city" });
    }
  });

  // Restaurants management
  app.get('/api/admin/restaurants', requireAuth, async (req, res) => {
    try {
      const restaurants = await storage.getAllRestaurants();
      res.json(restaurants);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch restaurants" });
    }
  });

  app.post('/api/admin/restaurants', requireAuth, async (req, res) => {
    try {
      const restaurantData = insertRestaurantSchema.parse(req.body);
      const restaurant = await storage.createRestaurant(restaurantData);
      res.json(restaurant);
    } catch (error) {
      res.status(400).json({ error: "Invalid restaurant data" });
    }
  });

  app.put('/api/admin/restaurants/:id', requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const restaurantData = insertRestaurantSchema.partial().parse(req.body);
      const restaurant = await storage.updateRestaurant(id, restaurantData);
      res.json(restaurant);
    } catch (error) {
      res.status(400).json({ error: "Failed to update restaurant" });
    }
  });

  app.delete('/api/admin/restaurants/:id', requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteRestaurant(id);
      res.json({ message: "Restaurant deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete restaurant" });
    }
  });

  // Features management
  app.get('/api/admin/features', requireAuth, async (req, res) => {
    try {
      const features = await storage.getAllFeatures();
      res.json(features);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch features" });
    }
  });

  app.post('/api/admin/features', requireAuth, async (req, res) => {
    try {
      const featureData = insertFeatureSchema.parse(req.body);
      const feature = await storage.createFeature(featureData);
      res.json(feature);
    } catch (error) {
      res.status(400).json({ error: "Invalid feature data" });
    }
  });

  app.put('/api/admin/features/:id', requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const featureData = insertFeatureSchema.partial().parse(req.body);
      const feature = await storage.updateFeature(id, featureData);
      res.json(feature);
    } catch (error) {
      res.status(400).json({ error: "Failed to update feature" });
    }
  });

  app.delete('/api/admin/features/:id', requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteFeature(id);
      res.json({ message: "Feature deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete feature" });
    }
  });

  // Stats management
  app.put('/api/admin/stats', requireAuth, async (req, res) => {
    try {
      const statsData = insertStatsSchema.parse(req.body);
      const stats = await storage.updateStats(statsData);
      res.json(stats);
    } catch (error) {
      res.status(400).json({ error: "Invalid stats data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
