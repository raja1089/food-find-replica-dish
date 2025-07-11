import bcrypt from "bcrypt";
import { db } from "./db";
import { admins, cities, restaurants, features, stats } from "@shared/schema";

async function seed() {
  try {
    console.log("🌱 Seeding database...");

    // Create default admin user
    const hashedPassword = await bcrypt.hash("admin123", 10);
    await db.insert(admins).values({
      username: "admin",
      password: hashedPassword,
    }).onConflictDoNothing();

    // Create sample cities
    const sampleCities = [
      {
        name: "Mumbai",
        image: "https://images.unsplash.com/photo-1595658658481-d53d3f999875?w=300&h=200&fit=crop",
        restaurantCount: 2500,
        isPopular: true
      },
      {
        name: "Delhi NCR",
        image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=300&h=200&fit=crop",
        restaurantCount: 3200,
        isPopular: true
      },
      {
        name: "Bangalore",
        image: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=300&h=200&fit=crop",
        restaurantCount: 1800,
        isPopular: true
      },
      {
        name: "Hyderabad",
        image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=300&h=200&fit=crop",
        restaurantCount: 1200,
        isPopular: true
      }
    ];

    const insertedCities = await db.insert(cities).values(sampleCities).onConflictDoNothing().returning();

    // Create sample restaurants
    const sampleRestaurants = [
      {
        name: "Pizza Palace",
        cuisine: "Italian, Pizza",
        rating: "4.5",
        deliveryTime: "30-35 mins",
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop",
        cityId: insertedCities[0]?.id || 1,
        isActive: true
      },
      {
        name: "Burger Junction",
        cuisine: "American, Fast Food",
        rating: "4.2",
        deliveryTime: "25-30 mins",
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
        cityId: insertedCities[0]?.id || 1,
        isActive: true
      },
      {
        name: "Sushi Express",
        cuisine: "Japanese, Sushi",
        rating: "4.7",
        deliveryTime: "35-40 mins",
        image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop",
        cityId: insertedCities[1]?.id || 2,
        isActive: true
      },
      {
        name: "Curry House",
        cuisine: "Indian, Curry",
        rating: "4.3",
        deliveryTime: "25-30 mins",
        image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop",
        cityId: insertedCities[1]?.id || 2,
        isActive: true
      }
    ];

    await db.insert(restaurants).values(sampleRestaurants).onConflictDoNothing();

    // Create sample features
    const sampleFeatures = [
      {
        title: "Fast Delivery",
        description: "Get your food delivered in 30 minutes or less",
        icon: "Clock",
        isActive: true,
        order: 1
      },
      {
        title: "Live Tracking",
        description: "Track your order in real-time from restaurant to your door",
        icon: "MapPin",
        isActive: true,
        order: 2
      },
      {
        title: "Quality Assured",
        description: "All restaurants are verified for hygiene and quality",
        icon: "Shield",
        isActive: true,
        order: 3
      },
      {
        title: "24/7 Support",
        description: "Get help anytime with our round-the-clock customer support",
        icon: "Headphones",
        isActive: true,
        order: 4
      }
    ];

    await db.insert(features).values(sampleFeatures).onConflictDoNothing();

    // Create stats
    await db.insert(stats).values({
      restaurants: 25000,
      cities: 800,
      users: 50000000,
      orders: 1000000000
    }).onConflictDoNothing();

    console.log("✅ Database seeded successfully!");
    console.log("🔑 Admin credentials: username=admin, password=admin123");

  } catch (error) {
    console.error("❌ Error seeding database:", error);
  }
}

if (import.meta.main) {
  seed();
}