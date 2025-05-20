import React, { useEffect, useState } from 'react';
import { Input } from "@/components/ui/input";
import { zodResolver } from '@hookform/resolvers/zod';
import { FormStructure } from './AFormStructure';
import { bookingSchema, Booking, defaultBooking } from '@/rails/model/booking';
import { useAdminContext } from "@/rails/provider/admin-context-provider";
import { formatDateForInput } from "@/rails/src/dateFormatter";

// Form Sections
function BookingDetailsSection({ 
  register, 
  errors, 
  students, 
  packages 
}: { 
  register: any; 
  errors: any; 
  students: any[]; 
  packages: any[];
}) {
  return (
    <FormStructure.Section title="Booking Details">
      <div className="flex flex-col gap-3 w-full">
        <FormStructure.Field label="Package *" id="package_id" error={errors.package_id?.message}>
          <select
            id="package_id"
            {...register('package_id', {
              required: "Package is required",
              valueAsNumber: true
            })}
            className="border border-gray-300 rounded-md px-3 py-2 w-full"
          >
            <option value="">Select a package</option>
            {packages.map((pkg) => (
              <option key={pkg.id} value={pkg.id}>
                {pkg.hours} hours - ${pkg.price} - {pkg.description || 'No description'}
              </option>
            ))}
          </select>
        </FormStructure.Field>

        <FormStructure.Field label="Student *" id="student_id" error={errors.student_id?.message}>
          <select
            id="student_id"
            {...register('student_id', {
              required: "Student is required",
              valueAsNumber: true
            })}
            className="border border-gray-300 rounded-md px-3 py-2 w-full"
          >
            <option value="">Select a student</option>
            {students.map((student) => (
              <option key={student.id} value={student.id}>
                {student.name} - {student.email || 'No email'}
              </option>
            ))}
          </select>
        </FormStructure.Field>

        <FormStructure.Field label="Start Date *" id="start_date" error={errors.start_date?.message}>
          <Input
            id="start_date"
            type="date"
            {...register('start_date', {
              required: "Start date is required"
            })}
            className="w-full"
          />
        </FormStructure.Field>
      </div>
    </FormStructure.Section>
  );
}

// Main Form Component
export function Booking4AdminForm({ 
  onSubmit, 
  isOpen, 
  onClose,
  students: propStudents,
  packages: propPackages
}: { 
  onSubmit: (data: Booking) => Promise<boolean>; 
  isOpen: boolean; 
  onClose: () => void;
  students?: any[];
  packages?: any[];
}) {
  const { tables } = useAdminContext();
  const [studentsData, setStudentsData] = useState<any[]>([]);
  const [packagesData, setPackagesData] = useState<any[]>([]);
  
  // Use the tables from context or props, prioritizing context if available
  useEffect(() => {
    // Get students data - first try from context, then fall back to props
    if (tables?.students?.data) {
      setStudentsData(tables.students.data);
    } else if (propStudents && propStudents.length > 0) {
      setStudentsData(propStudents);
    }
    
    // Get packages data - first try from context, then fall back to props
    if (tables?.packages?.data) {
      setPackagesData(tables.packages.data);
    } else if (propPackages && propPackages.length > 0) {
      setPackagesData(propPackages);
    }
  }, [tables, propStudents, propPackages]);

  // This will be to apply logic when picking
  const renderPackages = (packages: any[]) => {
    // Here we can apply additional logic, filtering, or sorting when needed
    // For example, sort by price
    return [...packages].sort((a, b) => a.price - b.price);
  };

  // This will be to apply logic when picking
  const renderStudents = (students: any[]) => {
    // Here we can apply additional logic, filtering, or sorting when needed
    // For example, sort alphabetically by name
    return [...students].sort((a, b) => a.name.localeCompare(b.name));
  };

  const processedPackages = renderPackages(packagesData);
  const processedStudents = renderStudents(studentsData);

  // Initialize with default booking values
  const formDefaultValues = {
    ...defaultBooking
  };

  return (
    <FormStructure.Form
      onSubmit={onSubmit}
      onCancel={onClose}
      title="Add New Booking"
      isOpen={isOpen}
      defaultValues={formDefaultValues}
      resolver={zodResolver(bookingSchema)}
    >
      {({ register, control, errors }) => (
        <div className="flex flex-wrap gap-2 w-full">
          <BookingDetailsSection 
            register={register} 
            errors={errors} 
            students={processedStudents} 
            packages={processedPackages} 
          />
        </div>
      )}
    </FormStructure.Form>
  );
}