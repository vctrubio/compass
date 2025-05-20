'use client'
import React, { useState, useEffect } from 'react';
import { useAdminContext } from '@/rails/provider/admin-context-provider'
import Link from 'next/link';
import CompassLoader from '@/components/admin/CompassLoader';

// Table data definitions
const tableDescriptions = {
  students: {
    title: "Students",
    description: "Central registry of all students in the kite school",
    points: [
      "Add students manually, through magic links, or self-registration",
      "Link students to authentication system via authId for notifications",
      "Track individual progress and preferences"
    ]
  },
  teachers: {
    title: "Teachers",
    description: "Instructor management and scheduling system",
    points: [
      "Added exclusively by administrators",
      "Manage classes, confirm teaching hours, and track student progress",
      "Record notes about students and equipment for future lessons"
    ]
  },
  equipment: {
    title: "Equipment",
    description: "Inventory tracking for kites and gear",
    points: [
      "Easily add and categorize different types of equipment",
      "Track equipment usage in lessons and rentals",
      "Monitor condition and maintenance status"
    ]
  },
  packages: {
    title: "Packages",
    description: "Learning options offered to students",
    points: [
      "Create customizable kiting instruction packages",
      "Set pricing, hours included, and capacity limits",
      "Display offerings to prospective students"
    ]
  },
  bookings: {
    title: "Bookings",
    description: "Student package selections and scheduling",
    points: [
      "Created when students select a learning package",
      "Links package details to a unique booking ID",
      "Records student's preferred starting dates"
    ]
  },
  availability_windows: {
    title: "Availability Windows",
    description: "Student availability tracking system",
    points: [
      "Records date spans when students are available for lessons",
      "Critical for efficient lesson scheduling",
      "Helps match student and teacher availability"
    ]
  },
  lessons: {
    title: "Lessons",
    description: "The core teaching sessions system",
    points: [
      "Associates bookings with specific teachers and sessions",
      "Tracks hours used from the student's purchased package",
      "Manages the lesson status from creation to completion"
    ]
  },
  sessions: {
    title: "Sessions",
    description: "Specific time blocks with equipment allocations",
    points: [
      "Records duration and specific equipment used in each lesson",
      "Tracked to subtract hours from the student's booking",
      "Documents equipment usage history and preferences"
    ]
  },
  payments: {
    title: "Payments",
    description: "Financial transaction tracking system",
    points: [
      "Record in-app payments or cash transactions",
      "Track financial history of all student bookings",
      "Generate payment reports and financial summaries"
    ]
  },
  lesson_confirmations: {
    title: "Lesson Confirmations",
    description: "Verification system for completed lessons",
    points: [
      "Teachers confirm hours with a simple click",
      "Students provide ratings and complete payment when lessons finish",
      "Prevents discrepancies between teacher and student records"
    ]
  }
};

export default function AdminPage() {
  const { listTables } = useAdminContext();
  const [loading, setLoading] = useState(true);

  // Simulate loading for 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);

  if (loading || !listTables) {
    return <CompassLoader />;
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Main Header */}
      <div className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white p-8 rounded-lg shadow-lg mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2">Compass</h1>
        <p className="text-xl">
          North's Management System
        </p>
      </div>

      {/* Tables List */}
      <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-md border border-slate-200 dark:border-slate-700 mb-10">
        <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-200 border-b pb-3">System Tables</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(tableDescriptions).map(([table, tableInfo]) => (
            <Link href={`/${table}`} key={table}>
              <div className="bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg p-6 hover:shadow-md transition-shadow h-full">
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-600 pb-2 mb-3">
                  {tableInfo.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-300 mb-3 font-medium text-sm">
                  {tableInfo.description}
                </p>
                <ul className="list-disc ml-5 text-slate-600 dark:text-slate-300 space-y-1 text-sm">
                  {tableInfo.points.map((point, index) => (
                    <li key={index}>{point}</li>
                  ))}
                </ul>
              </div>
            </Link>
          ))}
        </div>
      </div>

   
    </div>
  );
}