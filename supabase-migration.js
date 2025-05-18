// supabase-migration.js
const { Pool } = require('pg');
const fs = require('fs');

// Read environment variables from .env.local
function getEnvVars() {
  try {
    const envContent = fs.readFileSync('./.env.local', 'utf8');
    const vars = {};
    envContent.split('\n').forEach(line => {
      const match = line.match(/^([^=]+)=(.*)$/);
      if (match) {
        vars[match[1]] = match[2].trim();
      }
    });
    
    // Fix the DATABASE_URL format for Supabase
    if (vars.DATABASE_URL) {
      // Parse the connection string
      const regex = /^(postgresql:\/\/)([^:]+):([^@]+)@db\.([^:]+)(:.*)$/;
      const match = vars.DATABASE_URL.match(regex);
      
      if (match) {
        // Reconstruct the URL without the 'db.' prefix
        vars.DATABASE_URL = `${match[1]}${match[2]}:${match[3]}@${match[4]}${match[5]}`;
        console.log(`Modified DATABASE_URL to use standard Supabase format`);
      }
    }
    
    return vars;
  } catch (error) {
    console.error('Error reading .env.local file:', error);
    return {};
  }
}

// Format connection string for Supabase
function getConnectionConfig(databaseUrl) {
  try {
    // Extract connection parts if it's a connection string
    if (databaseUrl) {
      // For Supabase, we need to ensure SSL is enabled
      return {
        connectionString: databaseUrl,
        ssl: {
          rejectUnauthorized: false // Required for Supabase connections
        }
      };
    }
    throw new Error('Invalid database URL');
  } catch (error) {
    console.error('Error parsing database URL:', error);
    process.exit(1);
  }
}

async function main() {
  const env = getEnvVars();
  const databaseUrl = env.DATABASE_URL;
  
  if (!databaseUrl) {
    console.error('Missing DATABASE_URL in .env.local file');
    process.exit(1);
  }

  // Parse the URL to show only host for security
  const urlParts = databaseUrl.split('@');
  const hostPart = urlParts.length > 1 ? urlParts[1] : 'unknown-host';
  
  console.log(`Connecting to database at ${hostPart}`);
  
  try {
    // Create connection pool
    const pool = new Pool(getConnectionConfig(databaseUrl));
    
    // Test connection
    await pool.query('SELECT 1');
    console.log('Connected successfully to the database.');
    
    // Read migration SQL file
    console.log('Reading migration file...');
    const migrationContent = fs.readFileSync('./drizzle/migrations/0000_oval_starbolt.sql', 'utf8');
    
    // Split the SQL content into separate statements (assuming each ends with a semicolon)
    const statements = migrationContent.split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);
    
    console.log(`Found ${statements.length} SQL statements to execute.`);
    
    // Execute each statement in a transaction
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      for (let i = 0; i < statements.length; i++) {
        const statement = statements[i];
        console.log(`Executing statement ${i + 1}/${statements.length}...`);
        await client.query(statement);
      }
      
      await client.query('COMMIT');
      console.log('✅ Migration applied successfully!');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
      await pool.end();
    }
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

main().catch(e => {
  console.error('❌ Unexpected error:', e);
  process.exit(1);
});

