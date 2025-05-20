import React, { useEffect, useState } from 'react';
import { Input } from "@/components/ui/input";
import { zodResolver } from '@hookform/resolvers/zod';
import { FormStructure } from './AFormStructure';
import { lessonSchema, Lesson, defaultLesson, lessonStatusValues } from '@/rails/model/lesson';
import { useAdminContext } from "@/rails/provider/admin-context-provider";
import { formatDateForInput } from "@/rails/src/formatters";
import { mapBookingForLessons } from '@/rails/src/mapping/bookingForLessonMapping';

// Form Sections
function LessonDetailsSection({ 
  register, 
  errors, 
  teachers,
  bookings,
  tables
}: { 
  register: any; 
  errors: any; 
  teachers: any[];
  bookings: any[];
  tables: Record<string, any>;
}) {
  return (
    <FormStructure.Section title="Lesson Details">
      <div className="flex flex-col gap-3 w-full">
        <FormStructure.Field label="Teacher *" id="teacher_id" error={errors.teacher_id?.message}>
          <select
            id="teacher_id"
            {...register('teacher_id', {
              required: "Teacher is required",
              valueAsNumber: true
            })}
            className="border border-gray-300 rounded-md px-3 py-2 w-full"
          >
            <option value="">Select a teacher</option>
            {teachers.map((teacher) => (
              <option key={teacher.id} value={teacher.id}>
                {teacher.name} - {teacher.languages?.join(', ') || 'No languages'}
              </option>
            ))}
          </select>
        </FormStructure.Field>

        <FormStructure.Field label="Booking *" id="booking_id" error={errors.booking_id?.message}>
          <select
            id="booking_id"
            {...register('booking_id', {
              required: "Booking is required",
              valueAsNumber: true
            })}
            className="border border-gray-300 rounded-md px-3 py-2 w-full"
          >
            <option value="">Select a booking</option>
            {bookings.map((booking) => (
              <option key={booking.id} value={booking.id}>
                {mapBookingForLessons(booking.id, tables)}
              </option>
            ))}
          </select>
        </FormStructure.Field>

        <FormStructure.Field label="Status" id="status" error={errors.status?.message}>
          <select
            id="status"
            {...register('status')}
            className="border border-gray-300 rounded-md px-3 py-2 w-full"
          >
            {lessonStatusValues.map((status) => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </FormStructure.Field>
      </div>
    </FormStructure.Section>
  );
}

// Optional payment information section
function PaymentSection({ 
  register, 
  errors,
  payments
}: { 
  register: any; 
  errors: any;
  payments: any[];
}) {
  return (
    <FormStructure.Section title="Payment Information (Optional)">
      <div className="flex flex-col gap-3 w-full">
        <FormStructure.Field label="Payment" id="payment_id" error={errors.payment_id?.message}>
          <select
            id="payment_id"
            {...register('payment_id', {
              valueAsNumber: true,
              setValueAs: (value: string) => value ? parseInt(value, 10) : null
            })}
            className="border border-gray-300 rounded-md px-3 py-2 w-full"
          >
            <option value="">No payment</option>
            {payments.map((payment) => (
              <option key={payment.id} value={payment.id}>
                {`Payment #${payment.id}: ${payment.amount}€ - ${payment.cash ? 'Cash' : 'Card'}`}
              </option>
            ))}
          </select>
        </FormStructure.Field>
      </div>
    </FormStructure.Section>
  );
}

// Main Form Component
export function Lesson4AdminForm({ 
  onSubmit, 
  isOpen, 
  onClose,
  teachers: propTeachers,
  bookings: propBookings,
  initialData
}: { 
  onSubmit: (data: Lesson) => Promise<boolean>; 
  isOpen: boolean; 
  onClose: () => void;
  teachers?: any[];
  bookings?: any[];
  initialData?: Partial<Lesson>;
}) {
  const { tables } = useAdminContext();
  const [teachersData, setTeachersData] = useState<any[]>([]);
  const [bookingsData, setBookingsData] = useState<any[]>([]);
  const [paymentsData, setPaymentsData] = useState<any[]>([]);
  
  // Use the tables from context or props, prioritizing context if available
  useEffect(() => {
    // Get teachers data - first try from context, then fall back to props
    if (tables?.teachers?.data) {
      setTeachersData(tables.teachers.data);
    } else if (propTeachers && propTeachers.length > 0) {
      setTeachersData(propTeachers);
    }
    
    // Get bookings data - first try from context, then fall back to props
    if (tables?.bookings?.data) {
      setBookingsData(tables.bookings.data);
    } else if (propBookings && propBookings.length > 0) {
      setBookingsData(propBookings);
    }

    // Get payments data if available
    if (tables?.payments?.data) {
      setPaymentsData(tables.payments.data);
    }
  }, [tables, propTeachers, propBookings]);

  // Process teachers for display - sort by name
  const renderTeachers = (teachers: any[]) => {
    return [...teachers].sort((a, b) => a.name.localeCompare(b.name));
  };

  // Process bookings for display - filter out bookings that already have lessons
  const renderBookings = (bookings: any[]) => {
    // Filter out bookings that already have lessons assigned
    // This would need more complex logic with a real backend query
    // For now, we'll just sort by date
    const sortedBookings = [...bookings].sort((a, b) => {
      const dateA = new Date(a.start_date);
      const dateB = new Date(b.start_date);
      return dateB.getTime() - dateA.getTime(); // Most recent first
    });
    
    return sortedBookings;
  };

  // Process payments - sort by most recent first
  const renderPayments = (payments: any[]) => {
    return [...payments].sort((a, b) => {
      const dateA = new Date(a.created_at || 0);
      const dateB = new Date(b.created_at || 0);
      return dateB.getTime() - dateA.getTime(); // Most recent first
    });
  };

  const processedTeachers = renderTeachers(teachersData);
  const processedBookings = renderBookings(bookingsData);
  const processedPayments = renderPayments(paymentsData);

  // Initialize with default lesson values or use provided initial data
  const formDefaultValues = {
    ...defaultLesson,
    ...initialData
  };

  return (
    <FormStructure.Form
      onSubmit={onSubmit}
      onCancel={onClose}
      title={initialData?.id ? "Edit Lesson" : "Add New Lesson"}
      isOpen={isOpen}
      defaultValues={formDefaultValues}
      resolver={zodResolver(lessonSchema)}
    >
      {({ register, control, errors }) => (
        <div className="flex flex-wrap gap-2 w-full">
          <LessonDetailsSection 
            register={register} 
            errors={errors} 
            teachers={processedTeachers} 
            bookings={processedBookings}
            tables={tables}
          />
          {processedPayments.length > 0 && (
            <PaymentSection
              register={register}
              errors={errors}
              payments={processedPayments}
            />
          )}
        </div>
      )}
    </FormStructure.Form>
  );
}
