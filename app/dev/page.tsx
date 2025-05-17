import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import TestForm from '@/components/forms/testform'
import { z } from 'zod'

// Define the schema for server-side validation
const inputSchema = z.string()
  .min(3, { message: "Text must be at least 3 characters long" })
  .max(100, { message: "Text must be less than 100 characters" });

export default async function Page() {
  const supabase = await createClient()
  
  // Get data from the test table
  const { data: notes, error: fetchError } = await supabase.from('test').select().order('id', { ascending: false })
  console.log('Current data:', notes)
  console.log('Fetch error:', fetchError)
  
  // Server action with Zod validation
  async function insertData(formData: string) {
    'use server'
    
    try {
      // Validate the input data
      const validatedData = inputSchema.parse(formData);
      
      const supabase = await createClient()
      const { data, error } = await supabase
        .from('test')
        .insert([{ funny: validatedData }])
        .select()
      
      if (error) {
        console.error('Supabase insert error details:', error)
        throw new Error(`Failed to insert data: ${error.message}`)
      }
      
      console.log('Successfully inserted:', data)
      revalidatePath('/dev')
      return data
    } catch (e) {
      if (e instanceof z.ZodError) {
        // Handle validation error
        console.error('Validation error:', e.errors);
        throw new Error(`Validation error: ${e.errors[0].message}`);
      }
      console.error('Exception during insert operation:', e)
      throw e // Re-throw the error after logging
    }
  }
  
  return (
    <div>
      <h1>Supabase Test Table</h1>
      
      <div>
        <h2>Insert Data</h2>
        <TestForm onSubmit={insertData} />
        <p style={{marginTop: '10px'}}>
          <strong>Check your browser console (F12 or Command+Option+J) for detailed debug information</strong>
        </p>
      </div>
      <div style={{marginTop: '20px'}}>
        <h2>Current Data</h2>
        
        
        <div>
          <h3>Raw Data:</h3>
          <pre>{JSON.stringify(notes, null, 2)}</pre>
          {Array.isArray(notes) && notes.length === 0 && (
            <p>The test table is empty. Use the form above to insert data.</p>
          )}
        </div>
      </div>
    </div>
  )
}