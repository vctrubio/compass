'use client'
import React from 'react';
import { DataCard, DataRows, DataItem } from '@/components/ui/data-rows';
import { Button } from '@/components/ui/button';
import { Edit, Trash } from 'lucide-react';

// Re-export the existing view fields for reference
const studentViewFields = ['name, email', 'age', 'language', "bookingsId", "lessonsId", "availabiltysId"];
const teacherViewFields = ['name', 'language', 'lessonsId', 'sessionsId'];
const bookingViewFields = ['studentId', 'startDate'];
const lessonViewFields = ['teacherId', 'studentId', 'status'];

// Interfaces for our model data
export interface StudentData {
  id?: string;
  name?: string;
  email?: string;
  age?: number;
  language?: string;
  bookingsId?: string[];
  lessonsId?: string[];
  availabilitysId?: string[];
  [key: string]: any; // Allow additional dynamic fields
}

export interface TeacherData {
  id?: string;
  name?: string;
  language?: string;
  lessonsId?: string[];
  sessionsId?: string[];
  [key: string]: any; // Allow additional dynamic fields
}

export interface BookingData {
  id?: string;
  studentId?: string;
  startDate?: string;
  [key: string]: any; // Allow additional dynamic fields
}

export interface LessonData {
  id?: string;
  teacherId?: string;
  studentId?: string;
  status?: string;
  [key: string]: any; // Allow additional dynamic fields
}

// Generic ModelView component with edit/delete functionality
interface ModelViewProps<T> {
  data: T;
  title?: string;
  subtitle?: string; 
  onEdit?: (data: T) => void;
  onDelete?: (data: T) => void;
  className?: string;
}

function convertToDataItems(data: any): DataItem[] {
  return Object.entries(data)
    .filter(([key]) => key !== 'id') // Optionally exclude ID field
    .map(([key, value]) => {
      // Format the heading for better display
      const formattedHeading = key
        .replace(/([A-Z])/g, ' $1') // Add space before capital letters
        .replace(/Id$|Ids$/, '') // Remove Id or Ids suffix
        .replace(/^./, (str) => str.toUpperCase()); // Capitalize first letter

      // Format arrays and objects for better display
      let formattedValue = value;
      if (Array.isArray(value)) {
        formattedValue = value.length > 0 ? `${value.length} items` : 'None';
      } else if (typeof value === 'object' && value !== null) {
        formattedValue = JSON.stringify(value);
      }

      return {
        heading: formattedHeading,
        value: formattedValue
      };
    });
}

// Generic component for all model views
export function ModelView<T>({ 
  data, 
  title, 
  subtitle, 
  onEdit, 
  onDelete,
  className 
}: ModelViewProps<T>) {
  const dataItems = convertToDataItems(data);
  
  const actions = (
    <div className="flex space-x-2">
      {onEdit && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onEdit(data)}
          className="flex items-center gap-1"
        >
          <Edit className="h-3.5 w-3.5" />
          <span>Edit</span>
        </Button>
      )}
      {onDelete && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onDelete(data)}
          className="flex items-center gap-1 text-destructive border-destructive/20 hover:bg-destructive/10"
        >
          <Trash className="h-3.5 w-3.5" />
          <span>Delete</span>
        </Button>
      )}
    </div>
  );
  
  return (
    <DataCard
      data={dataItems}
      title={title || `${data.name || 'Item'} Details`}
      subtitle={subtitle}
      actions={onEdit || onDelete ? actions : undefined}
      cardClassName={className}
    />
  );
}

// Specific view components for each model
export function StudentView({
  data,
  onEdit,
  onDelete,
  className
}: ModelViewProps<StudentData>) {
  return (
    <ModelView
      data={data}
      title={`Student: ${data.name || 'Unnamed'}`}
      subtitle={data.email}
      onEdit={onEdit}
      onDelete={onDelete}
      className={className}
    />
  );
}

export function TeacherView({
  data,
  onEdit,
  onDelete,
  className
}: ModelViewProps<TeacherData>) {
  return (
    <ModelView
      data={data}
      title={`Teacher: ${data.name || 'Unnamed'}`}
      subtitle={`Language: ${data.language || 'Not specified'}`}
      onEdit={onEdit}
      onDelete={onDelete}
      className={className}
    />
  );
}

export function BookingView({
  data,
  onEdit,
  onDelete,
  className
}: ModelViewProps<BookingData>) {
  return (
    <ModelView
      data={data}
      title={`Booking`}
      subtitle={`Start: ${data.startDate || 'Not scheduled'}`}
      onEdit={onEdit}
      onDelete={onDelete}
      className={className}
    />
  );
}

export function LessonView({
  data,
  onEdit,
  onDelete,
  className
}: ModelViewProps<LessonData>) {
  return (
    <ModelView
      data={data}
      title={`Lesson`}
      subtitle={`Status: ${data.status || 'Not set'}`}
      onEdit={onEdit}
      onDelete={onDelete}
      className={className}
    />
  );
}