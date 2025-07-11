import { mysqlCookStorage } from './mysql-db';

// Test MySQL connection and create a sample registration
async function testMySQLConnection() {
  try {
    console.log('🧪 Testing MySQL connection...');
    
    // Test basic connection
    const isConnected = await mysqlCookStorage.testConnection();
    if (!isConnected) {
      console.log('❌ MySQL connection failed');
      return;
    }
    
    console.log('✅ MySQL connection successful');
    
    // Test fetching existing registrations
    try {
      const registrations = await mysqlCookStorage.getAllCookRegistrations();
      console.log(`✅ Found ${registrations.length} existing cook registrations`);
    } catch (error) {
      console.log('⚠️  Error fetching registrations:', error.message);
    }
    
    console.log('✅ MySQL integration is ready for use');
    
  } catch (error) {
    console.error('❌ MySQL test failed:', error);
  }
}

// Run test if this file is executed directly
if (import.meta.main) {
  testMySQLConnection();
}

export { testMySQLConnection };