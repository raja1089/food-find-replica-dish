import mysql from 'mysql2/promise';

// MySQL connection pool for kitchen registration data
const pool = mysql.createPool({
  host: '156.67.74.205',
  user: 'u734142251_homemadefoods',
  password: 'u734142251_homemadefoodsS@',
  database: 'u734142251_homemadefoods',
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
  cuisineTypes: string; // JSON string
  address: string;
  city: string;
  state: string;
  pincode: string;
  fssaiLicense?: string;
  gstNumber?: string;
  panNumber?: string;
  experience: string;
  specialties?: string; // JSON string
  description?: string;
  status: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// MySQL operations for cook registrations
export class MySQLCookStorage {
  async createCookRegistration(registration: MySQLCookRegistration): Promise<MySQLCookRegistration> {
    const connection = await pool.getConnection();
    try {
      const [result] = await connection.execute(
        `INSERT INTO cooks (
          first_name, last_name, email, phone, kitchen_name, kitchen_type, 
          cuisine_types, address, city, state, pincode, fssai_license, 
          gst_number, pan_number, experience, specialties, description, status,
          created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [
          registration.firstName,
          registration.lastName,
          registration.email,
          registration.phone,
          registration.kitchenName,
          registration.kitchenType,
          registration.cuisineTypes,
          registration.address,
          registration.city,
          registration.state,
          registration.pincode,
          registration.fssaiLicense || null,
          registration.gstNumber || null,
          registration.panNumber || null,
          registration.experience,
          registration.specialties || null,
          registration.description || null,
          registration.status
        ]
      );

      const insertId = (result as any).insertId;
      return { ...registration, id: insertId };
    } finally {
      connection.release();
    }
  }

  async getAllCookRegistrations(): Promise<MySQLCookRegistration[]> {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.execute(
        `SELECT 
          id, first_name as firstName, last_name as lastName, email, phone, 
          kitchen_name as kitchenName, kitchen_type as kitchenType, 
          cuisine_types as cuisineTypes, address, city, state, pincode, 
          fssai_license as fssaiLicense, gst_number as gstNumber, 
          pan_number as panNumber, experience, specialties, description, 
          status, created_at as createdAt, updated_at as updatedAt
        FROM cooks ORDER BY created_at DESC`
      );
      return rows as MySQLCookRegistration[];
    } finally {
      connection.release();
    }
  }

  async getCookRegistrationById(id: number): Promise<MySQLCookRegistration | null> {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.execute(
        `SELECT 
          id, first_name as firstName, last_name as lastName, email, phone, 
          kitchen_name as kitchenName, kitchen_type as kitchenType, 
          cuisine_types as cuisineTypes, address, city, state, pincode, 
          fssai_license as fssaiLicense, gst_number as gstNumber, 
          pan_number as panNumber, experience, specialties, description, 
          status, created_at as createdAt, updated_at as updatedAt
        FROM cooks WHERE id = ?`,
        [id]
      );
      const result = rows as MySQLCookRegistration[];
      return result.length > 0 ? result[0] : null;
    } finally {
      connection.release();
    }
  }

  async updateCookRegistrationStatus(id: number, status: string): Promise<MySQLCookRegistration | null> {
    const connection = await pool.getConnection();
    try {
      await connection.execute(
        `UPDATE cooks SET status = ?, updated_at = NOW() WHERE id = ?`,
        [status, id]
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