import bcrypt from "bcrypt";
import { db } from "./db";
import { admins, cities, restaurants, features, stats, footerPages, heroSection } from "@shared/schema";

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

    // Create footer pages
    const footerPagesData = [
      {
        title: "Privacy Policy",
        slug: "privacy-policy",
        content: `
          <h1>Privacy Policy</h1>
          <p>This Privacy Policy describes how QOOKKAR collects, uses, and protects your personal information when you use our food delivery platform.</p>
          
          <h2>Information We Collect</h2>
          <p>We collect information you provide directly to us, such as when you create an account, place an order, or contact us.</p>
          
          <h2>How We Use Your Information</h2>
          <p>We use the information we collect to provide, maintain, and improve our services, process orders, and communicate with you.</p>
          
          <h2>Information Sharing</h2>
          <p>We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.</p>
          
          <h2>Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us at privacy@qookkar.com</p>
        `,
        category: "legal",
        isPublished: true,
        order: 1
      },
      {
        title: "Terms and Conditions",
        slug: "terms-and-conditions",
        content: `
          <h1>Terms and Conditions</h1>
          <p>These Terms and Conditions govern your use of the QOOKKAR platform and services.</p>
          
          <h2>Acceptance of Terms</h2>
          <p>By accessing and using our platform, you accept and agree to be bound by the terms and provision of this agreement.</p>
          
          <h2>Use License</h2>
          <p>Permission is granted to temporarily download one copy of QOOKKAR materials for personal, non-commercial transitory viewing only.</p>
          
          <h2>Service Terms</h2>
          <p>QOOKKAR reserves the right to refuse service, terminate accounts, or cancel orders at our sole discretion.</p>
          
          <h2>Limitation of Liability</h2>
          <p>QOOKKAR shall not be liable for any damages arising from the use or inability to use our services.</p>
        `,
        category: "legal",
        isPublished: true,
        order: 2
      },
      {
        title: "Refund Policy",
        slug: "refund-policy",
        content: `
          <h1>Refund Policy</h1>
          <p>At QOOKKAR, we strive to ensure customer satisfaction with every order.</p>
          
          <h2>Refund Eligibility</h2>
          <p>Refunds may be issued for orders that are significantly delayed, cancelled by the restaurant, or if there are quality issues with the food.</p>
          
          <h2>Refund Process</h2>
          <p>To request a refund, contact our customer support within 24 hours of your order. Refunds are typically processed within 5-7 business days.</p>
          
          <h2>Non-Refundable Items</h2>
          <p>Certain items may not be eligible for refunds, including completed deliveries and orders with special promotions.</p>
          
          <h2>Contact for Refunds</h2>
          <p>For refund requests, please contact us at refunds@qookkar.com or through our customer support.</p>
        `,
        category: "legal",
        isPublished: true,
        order: 3
      },
      {
        title: "Contact Us",
        slug: "contact",
        content: `
          <h1>Contact Us</h1>
          <p>We're here to help! Get in touch with us through any of the following methods:</p>
          
          <h2>Customer Support</h2>
          <p>📞 Phone: +1-800-QOOKKAR (776-6552)</p>
          <p>📧 Email: support@qookkar.com</p>
          <p>🕒 Hours: 24/7 Customer Support</p>
          
          <h2>Business Inquiries</h2>
          <p>📧 Email: business@qookkar.com</p>
          
          <h2>Partner with Us</h2>
          <p>Interested in joining our platform as a restaurant partner?</p>
          <p>📧 Email: partners@qookkar.com</p>
          
          <h2>Office Address</h2>
          <p>QOOKKAR Headquarters<br>
          123 Food Street<br>
          Delivery City, DC 12345</p>
          
          <h2>Social Media</h2>
          <p>Follow us on social media for updates and special offers!</p>
        `,
        category: "support",
        isPublished: true,
        order: 4
      }
    ];

    await db.insert(footerPages).values(footerPagesData).onConflictDoNothing();

    // Create hero section data  
    const heroSectionData = {
      title: "Partner with QOOKKAR",
      subtitle: "Join thousands of home chefs earning with us. Turn your cooking passion into profit with our homemade food delivery platform.",
      backgroundImage: "https://images.unsplash.com/photo-1556909114-b1e4a2b238a3?w=1200&h=800&fit=crop&auto=format",
      ctaText: "Become a Chef",
      ctaLink: "/kitchen-registration",
    };

    await db.insert(heroSection).values(heroSectionData).onConflictDoNothing();

    console.log("✅ Database seeded successfully!");
    console.log("🔑 Admin credentials: username=admin, password=admin123");

  } catch (error) {
    console.error("❌ Error seeding database:", error);
  }
}

// Run seed if this file is executed directly
seed();