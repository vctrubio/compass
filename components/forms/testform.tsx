'use client'
import React from 'react'
import { useState } from 'react'
import { z } from 'zod'

// Define the schema for our form input
const formSchema = z.object({
  text: z.string()
    .min(3, { message: "Text must be at least 3 characters long" })
    .max(100, { message: "Text must be less than 100 characters" })
});

// Type for the form data based on the Zod schema
type FormData = z.infer<typeof formSchema>;

// Type for validation errors
type FormErrors = {
  [K in keyof FormData]?: string;
};

export default function TestForm({ 
  onSubmit 
}: { 
  onSubmit: (text: string) => Promise<void> 
}) {
  const [text, setText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})

  const validateForm = (): boolean => {
    try {
      formSchema.parse({ text });
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: FormErrors = {};
        error.errors.forEach(err => {
          const path = err.path[0] as keyof FormData;
          fieldErrors[path] = err.message;
        });
        setErrors(fieldErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true)
    try {
      await onSubmit(text)
      setText('') // Clear form after successful submission
    } catch (error) {
      console.error('Error submitting form:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="text" className="block mb-2">Enter text:</label>
        <input
          id="text"
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className={`border p-2 w-full ${errors.text ? 'border-red-500' : ''}`}
          disabled={isSubmitting}
        />
        {errors.text && (
          <p className="text-red-500 text-sm mt-1">{errors.text}</p>
        )}
      </div>
      <button 
        type="submit" 
        disabled={isSubmitting}
        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
      >
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  )
}
