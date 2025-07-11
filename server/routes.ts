import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertAdminSchema, 
  insertCitySchema, 
  insertRestaurantSchema, 
  insertFeatureSchema,
  insertStatsSchema,
  insertFooterPageSchema,
  insertHeroSectionSchema,
  insertCookRegistrationSchema
} from "@shared/schema";
import { mysqlCookStorage } from "./mysql-db";
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

  app.get('/api/admin/verify', requireAuth, async (req, res) => {
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

  // Public footer pages endpoint
  app.get('/api/footer-pages', async (req, res) => {
    try {
      const pages = await storage.getAllFooterPages();
      // Only return published pages for public endpoint
      const publishedPages = pages.filter(page => page.isPublished);
      res.json(publishedPages);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch footer pages" });
    }
  });

  // Get specific footer page by slug
  app.get('/api/footer-pages/:slug', async (req, res) => {
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

  // Footer pages management
  app.get('/api/admin/footer-pages', requireAuth, async (req, res) => {
    try {
      const pages = await storage.getAllFooterPages();
      res.json(pages);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch footer pages" });
    }
  });

  app.post('/api/admin/footer-pages', requireAuth, async (req, res) => {
    try {
      const pageData = insertFooterPageSchema.parse(req.body);
      const page = await storage.createFooterPage(pageData);
      res.json(page);
    } catch (error) {
      res.status(400).json({ error: "Invalid footer page data" });
    }
  });

  app.put('/api/admin/footer-pages/:id', requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const pageData = insertFooterPageSchema.partial().parse(req.body);
      const page = await storage.updateFooterPage(id, pageData);
      res.json(page);
    } catch (error) {
      res.status(400).json({ error: "Failed to update footer page" });
    }
  });

  app.delete('/api/admin/footer-pages/:id', requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteFooterPage(id);
      res.json({ message: "Footer page deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete footer page" });
    }
  });

  // Hero section management
  app.get('/api/admin/hero', requireAuth, async (req, res) => {
    try {
      const hero = await storage.getHeroSection();
      res.json(hero);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch hero section" });
    }
  });

  app.put('/api/admin/hero', requireAuth, async (req, res) => {
    try {
      const heroData = insertHeroSectionSchema.parse(req.body);
      const hero = await storage.updateHeroSection(heroData);
      res.json(hero);
    } catch (error) {
      res.status(400).json({ error: "Invalid hero section data" });
    }
  });

  // Cook registration routes (public) - Using MySQL
  app.post('/api/cook-registration', async (req, res) => {
    try {
      const registrationData = insertCookRegistrationSchema.parse(req.body);
      
      // Convert arrays to JSON strings for MySQL storage
      const mysqlData = {
        firstName: registrationData.firstName,
        lastName: registrationData.lastName,
        email: registrationData.email,
        phone: registrationData.phone,
        kitchenName: registrationData.kitchenName,
        kitchenType: registrationData.kitchenType,
        cuisineTypes: JSON.stringify(registrationData.cuisineTypes),
        address: registrationData.address,
        city: registrationData.city,
        state: registrationData.state,
        pincode: registrationData.pincode,
        fssaiLicense: registrationData.fssaiLicense,
        gstNumber: registrationData.gstNumber,
        panNumber: registrationData.panNumber,
        experience: registrationData.experience,
        specialties: registrationData.specialties ? JSON.stringify(registrationData.specialties) : null,
        description: registrationData.description,
        status: 'pending'
      };
      
      const registration = await mysqlCookStorage.createCookRegistration(mysqlData);
      res.json({ message: "Registration submitted successfully", registration });
    } catch (error) {
      console.error('Cook registration error:', error);
      res.status(400).json({ error: "Invalid registration data" });
    }
  });

  // Cook registration admin routes - Using MySQL
  app.get('/api/admin/cook-registrations', requireAuth, async (req, res) => {
    try {
      const registrations = await mysqlCookStorage.getAllCookRegistrations();
      
      // Convert JSON strings back to arrays for frontend
      const formattedRegistrations = registrations.map(reg => ({
        ...reg,
        cuisineTypes: typeof reg.cuisineTypes === 'string' ? JSON.parse(reg.cuisineTypes) : reg.cuisineTypes,
        specialties: reg.specialties && typeof reg.specialties === 'string' ? JSON.parse(reg.specialties) : reg.specialties
      }));
      
      res.json(formattedRegistrations);
    } catch (error) {
      console.error('Error fetching cook registrations:', error);
      res.status(500).json({ error: "Failed to fetch cook registrations" });
    }
  });

  app.get('/api/admin/cook-registrations/:id', requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const registration = await mysqlCookStorage.getCookRegistrationById(id);
      if (!registration) {
        return res.status(404).json({ error: "Registration not found" });
      }
      
      // Convert JSON strings back to arrays for frontend
      const formattedRegistration = {
        ...registration,
        cuisineTypes: typeof registration.cuisineTypes === 'string' ? JSON.parse(registration.cuisineTypes) : registration.cuisineTypes,
        specialties: registration.specialties && typeof registration.specialties === 'string' ? JSON.parse(registration.specialties) : registration.specialties
      };
      
      res.json(formattedRegistration);
    } catch (error) {
      console.error('Error fetching cook registration:', error);
      res.status(500).json({ error: "Failed to fetch registration" });
    }
  });

  app.put('/api/admin/cook-registrations/:id/status', requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!['pending', 'approved', 'rejected'].includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
      }
      
      const registration = await mysqlCookStorage.updateCookRegistrationStatus(id, status);
      if (!registration) {
        return res.status(404).json({ error: "Registration not found" });
      }
      
      // Convert JSON strings back to arrays for frontend
      const formattedRegistration = {
        ...registration,
        cuisineTypes: typeof registration.cuisineTypes === 'string' ? JSON.parse(registration.cuisineTypes) : registration.cuisineTypes,
        specialties: registration.specialties && typeof registration.specialties === 'string' ? JSON.parse(registration.specialties) : registration.specialties
      };
      
      res.json(formattedRegistration);
    } catch (error) {
      console.error('Error updating cook registration status:', error);
      res.status(400).json({ error: "Failed to update registration status" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
