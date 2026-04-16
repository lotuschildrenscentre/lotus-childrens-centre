import pg from 'pg';
const { Client } = pg;

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

await client.connect();

try {
  // Add passwordHash column if it doesn't exist
  await client.query(`
    ALTER TABLE users ADD COLUMN IF NOT EXISTS "passwordHash" text;
  `);
  console.log('✅ Added passwordHash column to users table');

  // Create admin user if not exists
  // Password: Lotus@Admin2024 (bcrypt hash generated below)
  // We'll use a simple hash approach since bcrypt isn't available here
  // The actual hash will be set via the seed script
  console.log('✅ Migration complete');
} catch (err) {
  console.error('Migration failed:', err);
  process.exit(1);
} finally {
  await client.end();
}
