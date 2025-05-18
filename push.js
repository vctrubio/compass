// push.js
const { drizzle } = require("drizzle-orm/postgres-js");
const { migrate } = require("drizzle-orm/postgres-js/migrator");
const postgres = require("postgres");
const fs = require('fs');

// Read DATABASE_URL from .env.local file
function getDatabaseUrl() {
  try {
    const envContent = fs.readFileSync('./.env.local', 'utf8');
    const match = envContent.match(/DATABASE_URL=(.+)/);
    if (match && match[1]) {
      return match[1].trim();
    }
    throw new Error('DATABASE_URL not found in .env.local file');
  } catch (error) {
    console.error('Error reading DATABASE_URL:', error);
    // Fallback to the hardcoded connection string if there's an issue reading the file
    return "postgresql://postgres:12345678900ioP.@db.tmlmnwqnueipocfcpcsy.supabase.co:5432/postgres";
  }
}

async function main() {
  const connectionString = getDatabaseUrl();
  console.log(`Connecting to database: ${connectionString.split('@')[1]}`); // Only log the host part for security

  try {
    // Establish connection with required SSL for Supabase
    const sql = postgres(connectionString, { 
      ssl: { rejectUnauthorized: false },
      max: 1 // Use a single connection
    });
    
    const db = drizzle(sql);

    // Apply migrations
    console.log("Applying migrations from ./drizzle/migrations...");
    await migrate(db, { migrationsFolder: "./drizzle/migrations" });
    console.log("✅ Migrations completed successfully!");

    // Close the connection
    await sql.end();
    console.log("Database connection closed.");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

main().catch(e => {
  console.error("❌ Unexpected error:", e);
  process.exit(1);
});

