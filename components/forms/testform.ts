'use client'

import { useState } from 'react'

export default function TestForm({ 
  onSubmit 
}: { 
  onSubmit: (text: string) => Promise<any> 
}) {
  const [text, setText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim()) return

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
          className="border p-2 w-full"
          disabled={isSubmitting}
        />
      </div>
      <button 
        type="submit" 
        disabled={isSubmitting || !text.trim()}
        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
      >
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  )
}