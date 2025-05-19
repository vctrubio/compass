"use client";

import React, { useState, useEffect } from 'react';
import { useRailsContext } from '@/rails/provider/rails-context-provider';

export default function PlaygroundPage() {
  const [currentText, setCurrentText] = useState<string>('');
  const { user, isLoading } = useRailsContext();
  
  useEffect(() => {
    // Function to handle keydown events
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        // Clear the text when Enter is pressed
        setCurrentText('');
      } else if (event.key === 'Backspace') {
        // Remove the last character when Backspace is pressed
        setCurrentText(prev => prev.slice(0, -1));
      } else if (event.key.length === 1) {
        // Add character to the current text (only single characters, not special keys)
        setCurrentText(prev => prev + event.key);
      }
      // Ignore other special keys like Shift, Ctrl, etc.
    };

    // Add event listener when component mounts
    window.addEventListener('keydown', handleKeyDown);

    // Clean up event listener when component unmounts
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="mb-8 bg-slate-100 dark:bg-slate-800 p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-2">Current User:</h2>
        {isLoading ? (
          <div className="bg-white dark:bg-slate-700 p-3 rounded text-center">Loading user data...</div>
        ) : (
          <pre className="bg-white dark:bg-slate-700 p-3 rounded overflow-auto max-w-xl">
            {JSON.stringify(user, null, 2)}
          </pre>
        )}
      </div>
      
      <div className="w-full max-w-3xl flex items-center justify-center h-80">
        {currentText ? (
          <div className="text-6xl font-mono font-bold flex justify-center items-center 
                        h-full w-full bg-slate-100 dark:bg-slate-800 rounded-xl shadow-lg 
                        p-8 break-all overflow-hidden">
            {currentText}
          </div>
        ) : (
          <p className="text-2xl text-slate-400">
            Type to build words. Press Enter to clear.
          </p>
        )}
      </div>
    </div>
  );
}