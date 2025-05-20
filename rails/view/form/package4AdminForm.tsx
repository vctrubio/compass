import React from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from '@hookform/resolvers/zod';
import { packageSchema, Package, defaultPackage } from '@/rails/model/package';
import { FormStructure, FormProps } from './AFormStructure';

// Form Sections
function PackageDetailsSection({ register, errors }: { register: any; errors: any }) {
  return (
      <FormStructure.Section title="Package Details">
        <div className="flex gap-3">
          <FormStructure.Field label="Price (€) *" id="price" error={errors.price?.message}>
            <Input
              id="price"
              autoFocus
              type="number"
              {...register('price', {
                required: "Price is required",
                valueAsNumber: true,
                min: { value: 1, message: "Price must be positive" }
              })}
              placeholder="Enter price in euros"
              className="w-full"
            />
          </FormStructure.Field>

          <FormStructure.Field label="Hours *" id="hours" error={errors.hours?.message}>
            <Input
              id="hours"
              type="number"
              {...register('hours', {
                required: "Hours is required",
                valueAsNumber: true,
                min: { value: 1, message: "Hours must be at least 1" }
              })}
              placeholder="Enter hours"
              className="w-full"
            />
          </FormStructure.Field>
        </div>

        <div className="flex gap-3 mt-4">
          <FormStructure.Field label="Capacity *" id="capacity" error={errors.capacity?.message}>
            <Input
              id="capacity"
              type="number"
              {...register('capacity', {
                required: "Capacity is required",
                valueAsNumber: true,
                min: { value: 1, message: "Capacity must be at least 1" }
              })}
              placeholder="Enter capacity"
              className="w-full"
            />
          </FormStructure.Field>
        </div>
      </FormStructure.Section>
  );
}

function DescriptionSection({ register, errors }: { register: any; errors: any }) {
  return (
      <FormStructure.Section title="Description">
        <FormStructure.Field label="Description" id="description" error={errors.description?.message}>
          <Textarea
            id="description"
            {...register('description')}
            placeholder="Enter package description"
            className="w-full h-24"
          />
        </FormStructure.Field>
      </FormStructure.Section>
  );
}

// Main Form Component
export function Package4AdminForm({ onSubmit, isOpen, onClose }: { onSubmit: (data: Package) => Promise<boolean>; isOpen: boolean; onClose: () => void }) {
  return (
    <FormStructure.Form
      onSubmit={onSubmit}
      onCancel={onClose}
      title="Add New Package"
      isOpen={isOpen}
      defaultValues={defaultPackage}
      resolver={zodResolver(packageSchema)}
    >
      {({ register, control, errors }) => (
        <div className="flex flex-wrap gap-2">
          <PackageDetailsSection register={register} errors={errors} />
          <DescriptionSection register={register} errors={errors} />
        </div>
      )}
    </FormStructure.Form>
  );
}
