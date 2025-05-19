import React from 'react';
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller } from 'react-hook-form';
import { studentSchema, Student, defaultStudent } from '@/rails/model/student';
import { availableLanguages } from '@/rails/model/languages';
import { FormStructure, FormProps } from './FormStructure';

// Form Sections
function PersonalInfoSection({ register, errors }: { register: any; errors: any }) {
  return (
    <div className="lg:w-1/3 py-6 lg:px-6">
      <FormStructure.Section title="Personal Information">
        <div className="flex-1">
          <FormStructure.Field label="Name *" id="name" error={errors.name?.message}>
            <Input
              id="name"
              autoFocus
              {...register('name', {
                required: "Name is required",
                validate: (value: string) => value?.trim()?.length > 0 || "Name cannot be empty"
              })}
              placeholder="Enter name"
              className="w-full"
            />
          </FormStructure.Field>
        </div>
        
        <div className="flex-1">
          <FormStructure.Field label="Age *" id="age" error={errors.age?.message}>
            <Input
              id="age"
              type="number"
              {...register('age', {
                required: "Age is required",
                valueAsNumber: true,
                min: { value: 1, message: "Age must be positive" }
              })}
              placeholder="Enter age"
              className="w-full"
            />
          </FormStructure.Field>
        </div>
      </FormStructure.Section>
    </div>
  );
}

function ContactInfoSection({ register, errors }: { register: any; errors: any }) {
  return (
    <div className="lg:w-1/3 py-6 lg:px-6">
      <FormStructure.Section title="Contact Information">
        <div className="flex-1">
          <FormStructure.Field label="Email Address" id="email" error={errors.email?.message}>
            <Input
              id="email"
              type="email"
              {...register('email')}
              placeholder="Enter email address"
              className="w-full"
            />
          </FormStructure.Field>
        </div>

        <div className="flex-1">
          <FormStructure.Field label="Phone Number" id="phone" error={errors.phone?.message}>
            <Input
              id="phone"
              {...register('phone')}
              placeholder="Enter phone number"
              className="w-full"
            />
          </FormStructure.Field>
        </div>
      </FormStructure.Section>
    </div>
  );
}

function LanguagesSection({ control, errors }: { control: any; errors: any }) {
  return (
    <div className="lg:w-1/3 py-6 lg:px-6">
      <FormStructure.Section title="Languages *">
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
                      const newLanguages = checked
                        ? [...currentLanguages, language]
                        : currentLanguages.filter((l: string) => l !== language);
                      field.onChange(newLanguages);
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
      </FormStructure.Section>
    </div>
  );
}

// Main Form Component
export function Student4AdminForm({ onSubmit, isOpen, onClose }: { onSubmit: (data: Student) => Promise<boolean>; isOpen: boolean; onClose: () => void }) {
  return (
    <FormStructure.Form
      onSubmit={onSubmit}
      onCancel={onClose}
      title="Add New Student"
      isOpen={isOpen}
      defaultValues={defaultStudent}
      resolver={zodResolver(studentSchema)}
    >
      {({ register, control, errors }) => (
        <>
          <PersonalInfoSection register={register} errors={errors} />
          <ContactInfoSection register={register} errors={errors} />
          <LanguagesSection control={control} errors={errors} />
        </>
      )}
    </FormStructure.Form>
  );
}
