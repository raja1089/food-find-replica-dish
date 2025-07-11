import mysql from 'mysql2/promise';

async function directMySQLTest() {
  try {
    console.log('Testing direct MySQL connection...');
    
    // Test connection with your exact credentials
    const connection = await mysql.createConnection({
      host: '156.67.74.205',
      user: 'u734142251_homemadefoods',
      password: 'u734142251_homemadefoodsS@',
      database: 'u734142251_homemadefoods',
      port: 3306,
      connectTimeout: 30000,
    });

    console.log('✅ MySQL connection successful!');
    
    // Test basic query
    const [rows] = await connection.execute('SELECT DATABASE() as current_db');
    console.log('Current database:', rows);
    
    // Check if required tables exist
    const [tables] = await connection.execute('SHOW TABLES');
    console.log('Available tables:', tables);
    
    // Test inserting a sample cook registration
    try {
      // First, check if user exists
      const [existingUser] = await connection.execute(
        'SELECT id FROM users WHERE mobile_number = ? OR email = ?',
        ['9999999999', 'test@example.com']
      );
      
      let userId;
      if (existingUser.length > 0) {
        userId = existingUser[0].id;
        console.log('Using existing user ID:', userId);
      } else {
        // Insert new user
        const [userResult] = await connection.execute(
          `INSERT INTO users (first_name, last_name, email, mobile_number, user_type, role_id, status, is_verified, created_at)
           VALUES (?, ?, ?, ?, 'cook', 2, 1, 1, NOW())`,
          ['Test', 'Cook', 'test@example.com', '9999999999']
        );
        userId = userResult.insertId;
        console.log('✅ New user created with ID:', userId);
      }
      
      // Insert into cooks table
      await connection.execute(
        `INSERT INTO cooks 
         (user_id, name, address, experience_years, cuisine_id, availability, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, 1, NOW(), NOW())`,
        [userId, 'Test Kitchen', 'Test Address, Test City, Test State - 123456', 5, null]
      );
      
      console.log('✅ Test cook registration inserted successfully!');
      
    } catch (insertError) {
      console.log('Insert test failed:', insertError.message);
    }
    
    await connection.end();
    
  } catch (error) {
    console.error('❌ MySQL connection failed:', error.message);
    console.error('Error code:', error.code);
  }
}

directMySQLTest();