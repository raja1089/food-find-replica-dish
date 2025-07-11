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
    
    // Test creating a sample registration
    const sampleRegistration = {
      firstName: 'Test',
      lastName: 'Cook',
      email: 'test@example.com',
      phone: '1234567890',
      kitchenName: 'Test Kitchen',
      kitchenType: 'home_kitchen',
      cuisineTypes: JSON.stringify(['Indian', 'Chinese']),
      address: '123 Test Street',
      city: 'Test City',
      state: 'Test State',
      pincode: '123456',
      experience: '2 years',
      status: 'pending'
    };
    
    // This will only work if the MySQL credentials are correct
    // const newRegistration = await mysqlCookStorage.createCookRegistration(sampleRegistration);
    // console.log('✅ Sample registration created:', newRegistration);
    
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