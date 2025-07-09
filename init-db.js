// Initialize database schema for production deployment
import pkg from 'pg';
const { Pool } = pkg;

console.log('Initializing database schema...');

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL environment variable is required');
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Create tables manually since we don't have migrations
async function createTables() {
  try {
    console.log('Creating users table...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL
      );
    `);

    console.log('Creating health_profiles table...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS health_profiles (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        age INTEGER NOT NULL,
        gender VARCHAR(50) NOT NULL,
        body_weight VARCHAR(100) NOT NULL,
        dietary_habit VARCHAR(255) NOT NULL,
        health_problem TEXT,
        medication TEXT,
        daily_activities TEXT NOT NULL,
        health_goal TEXT NOT NULL,
        ai_advice TEXT NOT NULL,
        share_text TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('Creating comments table...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS comments (
        id SERIAL PRIMARY KEY,
        health_profile_id INTEGER NOT NULL REFERENCES health_profiles(id) ON DELETE CASCADE,
        parent_comment_id INTEGER REFERENCES comments(id) ON DELETE CASCADE,
        author_name VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('Database schema created successfully!');
    
    // Test the connection
    const result = await pool.query('SELECT COUNT(*) FROM health_profiles');
    console.log(`Health profiles table ready. Current count: ${result.rows[0].count}`);
    
  } catch (error) {
    console.error('Error creating database schema:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

createTables();