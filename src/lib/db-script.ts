
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from '../db/schema';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Point to root sqlite.db from src/lib
const dbPath = path.resolve(__dirname, '../../sqlite.db');
const sqlite = new Database(dbPath);

export const db = drizzle(sqlite, { schema });





