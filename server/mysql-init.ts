import { mysqlCookStorage } from './mysql-db';
import mysql from 'mysql2/promise';

// Initialize MySQL database for cook registrations
async function initializeMySQLDatabase() {
  const connection = await mysql.createConnection({
    host: '156.67.74.205',
    user: 'u734142251_homemadefoods',
    password: 'u734142251_homemadefoodsS@',
    database: 'u734142251_homemadefoods',
    port: 3306,
  });

  try {
    console.log('🔌 Connecting to MySQL database...');
    
    // Test connection
    await connection.execute('SELECT 1');
    console.log('✅ MySQL connection successful');

    // Create the cooks table
    console.log('🏗️  Creating cooks table...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS cooks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        phone VARCHAR(20) NOT NULL,
        kitchen_name VARCHAR(200) NOT NULL,
        kitchen_type VARCHAR(50) NOT NULL,
        cuisine_types JSON NOT NULL,
        address TEXT NOT NULL,
        city VARCHAR(100) NOT NULL,
        state VARCHAR(100) NOT NULL,
        pincode VARCHAR(10) NOT NULL,
        fssai_license VARCHAR(100),
        gst_number VARCHAR(50),
        pan_number VARCHAR(20),
        experience VARCHAR(50) NOT NULL,
        specialties JSON,
        description TEXT,
        status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `);

    // Create indexes for better performance
    console.log('🔍 Creating indexes...');
    await connection.execute('CREATE INDEX IF NOT EXISTS idx_cooks_email ON cooks(email);');
    await connection.execute('CREATE INDEX IF NOT EXISTS idx_cooks_phone ON cooks(phone);');
    await connection.execute('CREATE INDEX IF NOT EXISTS idx_cooks_status ON cooks(status);');
    await connection.execute('CREATE INDEX IF NOT EXISTS idx_cooks_city ON cooks(city);');
    await connection.execute('CREATE INDEX IF NOT EXISTS idx_cooks_created_at ON cooks(created_at);');

    console.log('✅ Cooks table and indexes created successfully');

    // Test the storage functions
    console.log('🧪 Testing storage functions...');
    const isWorking = await mysqlCookStorage.testConnection();
    if (isWorking) {
      console.log('✅ MySQL storage is working correctly');
    } else {
      console.log('❌ MySQL storage test failed');
    }

  } catch (error) {
    console.error('❌ Error initializing MySQL database:', error);
  } finally {
    await connection.end();
  }
}

// Run initialization if this file is executed directly
if (import.meta.main) {
  initializeMySQLDatabase();
}

export { initializeMySQLDatabase };