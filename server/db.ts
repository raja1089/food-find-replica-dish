import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from '@shared/schema';
import dotenv from 'dotenv';

dotenv.config();

// MySQL connection pool configuration  
const poolConnection = mysql.createPool({
  host: '103.38.50.233',
  port: 3306,
  user: 'niharsk_qookkar',
  password: 'niharsk_qookkar',
  database: 'niharsk_qookkar',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export const db = drizzle(poolConnection, { schema, mode: 'default' });