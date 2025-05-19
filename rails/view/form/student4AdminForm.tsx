import React, { useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { X } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { studentSchema, Student, defaultStudent } from '@/rails/model/student';
import { availableLanguages } from '@/rails/model/languages';

interface StudentFormProps {
  onSubmit: (student: Student) => void;
  isOpen: boolean;
  onClose: () => void;
}

interface FormFieldProps {
  label: string;
  id: string;
  error?: string;
  children: React.ReactNode;
}

function FormField({ label, id, error, children }: FormFieldProps) {
  return (
    <div className="flex flex-col space-y-2">
      <Label htmlFor={id} className="text-sm font-medium">{label}</Label>
      {children}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col space-y-4">
      <h3 className="text-lg font-medium text-foreground/80">{title}</h3>
      <div className="flex flex-col md:flex-row gap-4">
        {children}
      </div>
    </div>
  );
}

function FormHeader({ onClose }: { onClose: () => void }) {
  return (
    <div className="sticky top-0 bg-background border-b p-4 flex justify-between items-center">
      <div className="flex flex-col space-y-1">
        <h2 className="text-xl font-semibold">Add New Student</h2>
        <p className="text-sm text-muted-foreground">Admin Panel</p>
      </div>
      <Button 
        variant="ghost" 
        size="sm" 
        className="h-8 w-8 p-0 hover:bg-muted" 
        onClick={onClose}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}

function FormActions({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex justify-end space-x-8 pt-4 border-t">
      <Button
        type="button"
        variant="outline"
        onClick={onClose}
        className="px-8"
      >
        Cancel
      </Button>
      <Button
        type="submit"
        className="px-8"
      >
        Add Student
      </Button>
    </div>
  );
}

export function Student4AdminForm({ onSubmit, isOpen, onClose }: StudentFormProps) {
  const nameInputRef = useRef<HTMLInputElement>(null);
  const { register, handleSubmit, control, formState: { errors } } = useForm<Student>({
    resolver: zodResolver(studentSchema),
    defaultValues: defaultStudent
  });

  useEffect(() => {
    if (isOpen && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [isOpen]);

  const onFormSubmit = (data: Student) => {
    console.log('Form data:', data);
    console.log('Trying to submit...');
    onSubmit(data);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background rounded-lg shadow-lg w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <FormHeader onClose={onClose} />
        
        <form onSubmit={handleSubmit(onFormSubmit)} className="p-6 space-y-6">
          <div className="flex flex-col space-y-6">
            <FormSection title="Personal Information">
              <div className="flex-1">
                <FormField label="Full Name *" id="name" error={errors.name?.message}>
                  <Input
                    id="name"
                    {...register('name')}
                    ref={nameInputRef}
                    placeholder="Enter full name"
                    className="w-full"
                  />
                </FormField>
              </div>
              
              <div className="flex-1">
                <FormField label="Age *" id="age" error={errors.age?.message}>
                  <Input
                    id="age"
                    type="number"
                    {...register('age', { valueAsNumber: true })}
                    placeholder="Enter age"
                    className="w-full"
                  />
                </FormField>
              </div>
            </FormSection>

            <FormSection title="Contact Information">
              <div className="flex-1">
                <FormField label="Email Address" id="email" error={errors.email?.message}>
                  <Input
                    id="email"
                    type="email"
                    {...register('email')}
                    placeholder="Enter email address"
                    className="w-full"
                  />
                </FormField>
              </div>
              
              <div className="flex-1">
                <FormField label="Phone Number" id="phone" error={errors.phone?.message}>
                  <Input
                    id="phone"
                    {...register('phone')}
                    placeholder="Enter phone number"
                    className="w-full"
                  />
                </FormField>
              </div>
            </FormSection>

            <FormSection title="Languages *">
              <div className="flex flex-wrap gap-4">
                {Array.from(availableLanguages).map((language) => (
                  <div key={language} className="flex items-center space-x-2">
                    <Controller
                      name="languages"
                      control={control}
                      render={({ field }) => (
                        <Checkbox
                          id={`lang-${language}`}
                          checked={field.value?.includes(language)}
                          onCheckedChange={(checked) => {
                            const currentLanguages = field.value || [];
                            if (checked) {
                              field.onChange([...currentLanguages, language]);
                            } else {
                              field.onChange(currentLanguages.filter(l => l !== language));
                            }
                          }}
                          className="border-2"
                        />
                      )}
                    />
                    <label
                      htmlFor={`lang-${language}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 capitalize"
                    >
                      {language}
                    </label>
                  </div>
                ))}
              </div>
              {errors.languages && (
                <p className="text-sm text-destructive">{errors.languages.message}</p>
              )}
            </FormSection>
          </div>

          <div className="flex justify-end space-x-8 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="px-8"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="px-8"
              onClick={() => {
                console.log('Submit button clicked');
                handleSubmit(onFormSubmit)();
              }}
            >
              Add Student
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
