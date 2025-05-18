// supabase-tables.js
const { createClient } = require('@supabase/supabase-js');
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
    return vars;
  } catch (error) {
    console.error('Error reading .env.local file:', error);
    return {};
  }
}

async function main() {
  const env = getEnvVars();
  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env.local file');
    process.exit(1);
  }

  console.log(`Connecting to Supabase at ${supabaseUrl}`);
  
  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Test connection by checking if we can access the auth API
    const { data: authData, error: authError } = await supabase.auth.getSession();
    if (authError) {
      throw new Error(`Failed to connect to Supabase: ${authError.message}`);
    }
    
    console.log('Connected successfully to Supabase API.');
    
    // Let's try to get a list of tables using the system schema
    console.log('Checking existing tables...');
    const { data, error } = await supabase.rpc('get_tables', {});
    
    if (error) {
      console.log('Could not fetch tables using RPC. This is likely because:');
      console.log('1. The RPC function does not exist (expected)');
      console.log('2. You do not have permission to call RPC functions');
      console.log('\nTrying alternative approach...');
      
      // Try direct query to a known table as a test
      const { error: queryError } = await supabase
        .from('students')
        .select('*')
        .limit(1);
      
      if (queryError) {
        if (queryError.code === 'PGRST116') {
          console.log('The "students" table does not exist yet. This is expected if you need to create tables.');
        } else {
          console.log(`Query error: ${queryError.message}`);
        }
      } else {
        console.log('The "students" table already exists.');
      }
    } else {
      console.log('Existing tables:');
      console.log(data.join(', '));
    }
    
    console.log('\n📋 Recommendations for creating tables in Supabase:');
    console.log('1. Use the Supabase Studio SQL Editor in the browser:');
    console.log(`   - Go to ${supabaseUrl.replace('https://', 'https://app.supabase.com/project/')}/sql`);
    console.log('   - Copy and paste the SQL from ./drizzle/migrations/0000_oval_starbolt.sql');
    console.log('   - Run the SQL script to create all tables');
    console.log('\n2. Install the Supabase CLI (which was our original goal):');
    console.log('   - On macOS: brew install supabase/tap/supabase');
    console.log('   - Then link your project: supabase link --project-ref tmlmnwqnueipocfcpcsy');
    console.log('   - Push the migrations: supabase db push');
    console.log('\n3. Use this migration file directly in your Next.js API routes:');
    console.log('   - Create a route that reads the migration file');
    console.log('   - Use the Supabase client to execute the SQL statements');
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

main().catch(e => {
  console.error('❌ Unexpected error:', e);
  process.exit(1);
});

