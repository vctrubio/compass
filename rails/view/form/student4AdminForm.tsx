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
        <div className="sticky top-0 bg-background border-b p-4 flex justify-between items-center">
          <div className="space-y-1">
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
        
        <form onSubmit={handleSubmit(onFormSubmit)} className="p-6 space-y-6">
          <div className="space-y-6">
            {/* Personal Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-foreground/80">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">Full Name *</Label>
                  <Input
                    id="name"
                    {...register('name')}
                    ref={nameInputRef}
                    placeholder="Enter full name"
                    className="w-full"
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">{errors.name.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="age" className="text-sm font-medium">Age *</Label>
                  <Input
                    id="age"
                    type="number"
                    {...register('age', { valueAsNumber: true })}
                    placeholder="Enter age"
                    className="w-full"
                  />
                  {errors.age && (
                    <p className="text-sm text-destructive">{errors.age.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-foreground/80">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register('email')}
                    placeholder="Enter email address"
                    className="w-full"
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium">Phone Number</Label>
                  <Input
                    id="phone"
                    {...register('phone')}
                    placeholder="Enter phone number"
                    className="w-full"
                  />
                  {errors.phone && (
                    <p className="text-sm text-destructive">{errors.phone.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Languages Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-foreground/80">Languages *</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
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
            </div>
          </div>

          {/* Form Actions */}
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
        </form>
      </div>
    </div>
  );
}
