import React, { useEffect, useState } from 'react';
import { Input } from "@/components/ui/input";
import { zodResolver } from '@hookform/resolvers/zod';
import { FormStructure } from './FormStructure';
import { bookingSchema, Booking, defaultBooking } from '@/rails/model/booking';
import { useAdminContext } from "@/rails/provider/admin-context-provider";
import { formatDateForInput } from "@/rails/src/formatters";

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
        <FormStructure.Field label="Package *" id="packageId" error={errors.packageId?.message}>
          <select
            id="packageId"
            {...register('packageId', {
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

        <FormStructure.Field label="Student *" id="studentId" error={errors.studentId?.message}>
          <select
            id="studentId"
            {...register('studentId', {
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

        <FormStructure.Field label="Start Date *" id="startDate" error={errors.startDate?.message}>
          <Input
            id="startDate"
            type="date"
            {...register('startDate', {
              required: "Start date is required",
              setValueAs: (value: string) => value ? new Date(value) : null
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
  students = [],
  packages = []
}: { 
  onSubmit: (data: Booking) => Promise<boolean>; 
  isOpen: boolean; 
  onClose: () => void;
  students?: any[];
  packages?: any[];
}) {
  // This will be to apply logic when picking
  const renderPackages = (packages: any[]) => {
    // Here we can apply additional logic, filtering, or sorting when needed
    return packages;
  };

  // This will be to apply logic when picking
  const renderStudents = (students: any[]) => {
    // Here we can apply additional logic, filtering, or sorting when needed
    return students;
  };

  const processedPackages = renderPackages(packages);
  const processedStudents = renderStudents(students);

  // Initialize with default booking values, but use the string format for the date input
  const formDefaultValues = {
    ...defaultBooking,
    startDate: defaultBooking.startDate
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