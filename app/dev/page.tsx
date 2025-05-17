import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import TestForm from '@/components/forms/testform'

export default async function Page() {
  const supabase = await createClient()
  
  // Get data from the test table
  const { data: notes, error: fetchError } = await supabase.from('test').select()
  console.log('Current data:', notes)
  console.log('Fetch error:', fetchError)
  
  // This server action handles the database interaction
  async function insertData(formData: string) {
    'use server'
    
    const supabase = await createClient()
    console.log('Attempting to insert:', { funny: formData })
    
    try {
      const { data, error } = await supabase
        .from('test')
        .insert([{ funny: formData }])  // Changed from content to funny
        .select() // Add select to get the inserted data back
      
      if (error) {
        console.error('Supabase insert error details:', error.message, error.details, error.hint)
        throw new Error(`Failed to insert data: ${error.message}`)
      }
      
      console.log('Successfully inserted:', data)
      revalidatePath('/dev')
      return data
    } catch (e) {
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