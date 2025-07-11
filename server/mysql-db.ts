import mysql from 'mysql2/promise';

// MySQL connection pool for kitchen registration data
const pool = mysql.createPool({
  host: process.env.DB_HOST || '156.67.74.205',
  user: process.env.DB_USER || 'u734142251_homemadefoods',
  password: process.env.DB_PASSWORD || 'u734142251_homemadefoodsS@',
  database: process.env.DB_NAME || 'u734142251_homemadefoods',
  waitForConnections: true,
  connectionLimit: 10,
  port: 3306,
  charset: 'utf8mb4'
});

// Interface for MySQL cook registration data
export interface MySQLCookRegistration {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  kitchenName: string;
  kitchenType: string;
  cuisineTypes: string[]; // Array of cuisine types
  address: string;
  city: string;
  state: string;
  pincode: string;
  fssaiLicense?: string;
  gstNumber?: string;
  panNumber?: string;
  experience: string;
  specialties?: string[];
  description?: string;
  status: string;
  latitude?: string;
  longitude?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// MySQL operations for cook registrations using your existing database structure
export class MySQLCookStorage {
  async createCookRegistration(registration: MySQLCookRegistration): Promise<MySQLCookRegistration> {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Check if user already exists
      const [existingUser] = await connection.query(
        'SELECT id FROM users WHERE mobile_number = ? OR email = ?',
        [registration.phone, registration.email]
      ) as any[];

      let userId;
      if (existingUser.length > 0) {
        userId = existingUser[0].id;
      } else {
        // Insert new user
        const [userResult] = await connection.query(
          `INSERT INTO users (first_name, last_name, email, mobile_number, user_type, role_id, status, is_verified, latitude, longitude, created_at)
           VALUES (?, ?, ?, ?, 'cook', 2, 1, 1, ?, ?, NOW())`,
          [
            registration.firstName,
            registration.lastName,
            registration.email,
            registration.phone,
            registration.latitude || null,
            registration.longitude || null
          ]
        ) as any[];
        userId = userResult.insertId;
      }

      // Insert into cooks table
      await connection.query(
        `INSERT INTO cooks 
         (user_id, name, address, experience_years, cuisine_id, availability, created_at, updated_at, landmark, instagram, twitter, facebook, profile_image_url, latitude, longitude)
         VALUES (?, ?, ?, ?, ?, 1, NOW(), NOW(), '', '', '', '', '', ?, ?)`,
        [
          userId,
          registration.kitchenName,
          `${registration.address}, ${registration.city}, ${registration.state} - ${registration.pincode}`,
          parseInt(registration.experience) || 0,
          null, // cuisine_id can be null for now
          registration.latitude || null,
          registration.longitude || null
        ]
      );

      // Insert business documents if provided
      if (registration.fssaiLicense || registration.gstNumber || registration.panNumber) {
        await connection.query(
          `INSERT INTO cook_documents (cook_id, fssai_number, gst_number, pan_number, created_at)
           VALUES (?, ?, ?, ?, NOW())`,
          [
            userId,
            registration.fssaiLicense || '',
            registration.gstNumber || '',
            registration.panNumber || ''
          ]
        );
      }

      await connection.commit();
      
      return { ...registration, id: userId };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async getAllCookRegistrations(): Promise<MySQLCookRegistration[]> {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.execute(
        `SELECT 
          u.id, u.first_name as firstName, u.last_name as lastName, u.email, 
          u.mobile_number as phone, c.name as kitchenName, 'home_kitchen' as kitchenType,
          c.address, u.latitude, u.longitude, c.experience_years as experience,
          '' as description, 'approved' as status, c.created_at as createdAt, c.updated_at as updatedAt
        FROM users u 
        LEFT JOIN cooks c ON u.id = c.user_id 
        WHERE u.user_type = 'cook' 
        ORDER BY c.created_at DESC`
      );
      
      const registrations = (rows as any[]).map(row => ({
        ...row,
        cuisineTypes: ['Indian'], // Default cuisine type
        specialties: [],
        city: row.address ? row.address.split(',')[1]?.trim() || '' : '',
        state: row.address ? row.address.split(',')[2]?.split('-')[0]?.trim() || '' : '',
        pincode: row.address ? row.address.split('-').pop()?.trim() || '' : ''
      }));
      
      return registrations;
    } finally {
      connection.release();
    }
  }

  async getCookRegistrationById(id: number): Promise<MySQLCookRegistration | null> {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.execute(
        `SELECT 
          u.id, u.first_name as firstName, u.last_name as lastName, u.email, 
          u.mobile_number as phone, c.name as kitchenName, 'home_kitchen' as kitchenType,
          c.address, u.latitude, u.longitude, c.experience_years as experience,
          '' as description, 'approved' as status, c.created_at as createdAt, c.updated_at as updatedAt
        FROM users u 
        LEFT JOIN cooks c ON u.id = c.user_id 
        WHERE u.id = ? AND u.user_type = 'cook'`,
        [id]
      );
      
      const result = rows as any[];
      if (result.length === 0) return null;
      
      const row = result[0];
      return {
        ...row,
        cuisineTypes: ['Indian'], // Default cuisine type
        specialties: [],
        city: row.address ? row.address.split(',')[1]?.trim() || '' : '',
        state: row.address ? row.address.split(',')[2]?.split('-')[0]?.trim() || '' : '',
        pincode: row.address ? row.address.split('-').pop()?.trim() || '' : ''
      };
    } finally {
      connection.release();
    }
  }

  async updateCookRegistrationStatus(id: number, status: string): Promise<MySQLCookRegistration | null> {
    const connection = await pool.getConnection();
    try {
      // Update user status (assuming status 1 = approved, 0 = rejected)
      const userStatus = status === 'approved' ? 1 : 0;
      await connection.execute(
        `UPDATE users SET status = ?, updated_at = NOW() WHERE id = ?`,
        [userStatus, id]
      );
      
      return await this.getCookRegistrationById(id);
    } finally {
      connection.release();
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      const connection = await pool.getConnection();
      await connection.execute('SELECT 1');
      connection.release();
      return true;
    } catch (error) {
      console.error('MySQL connection test failed:', error);
      return false;
    }
  }
}

export const mysqlCookStorage = new MySQLCookStorage();