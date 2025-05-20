'use client';
import React, { useEffect, useState } from 'react';
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { zodResolver } from '@hookform/resolvers/zod';
import { FormStructure } from './AFormStructure';
import { sessionSchema, Session, defaultSession } from '@/rails/model/session';
import { useAdminContext } from "@/rails/provider/admin-context-provider";
import { Controller } from 'react-hook-form';

// Form Sections
function SessionDetailsSection({ 
  register, 
  control,
  errors, 
  equipment 
}: { 
  register: any; 
  control: any;
  errors: any; 
  equipment: any[];
}) {
  // Group equipment by type
  const equipmentByType: Record<string, any[]> = {};
  equipment.forEach(item => {
    if (!equipmentByType[item.type]) {
      equipmentByType[item.type] = [];
    }
    equipmentByType[item.type].push(item);
  });

  return (
    <FormStructure.Section title="Session Details">
      <div className="flex flex-col gap-3 w-full">
        <FormStructure.Field label="Start Time *" id="start_time" error={errors.start_time?.message}>
          <Input
            id="start_time"
            type="datetime-local"
            {...register('start_time', {
              required: "Start time is required"
            })}
            className="w-full"
          />
        </FormStructure.Field>

        <FormStructure.Field label="Duration (minutes) *" id="duration" error={errors.duration?.message}>
          <Input
            id="duration"
            type="number"
            min="15"
            step="15"
            {...register('duration', {
              required: "Duration is required",
              valueAsNumber: true,
              min: { value: 15, message: "Duration must be at least 15 minutes" }
            })}
            className="w-full"
          />
        </FormStructure.Field>

        <FormStructure.Field 
          label="Equipment *" 
          id="equipment_ids" 
          error={errors.equipment_ids?.message}
        >
          <Controller
            name="equipment_ids"
            control={control}
            defaultValue={[]}
            rules={{
              validate: (value: number[]) => value.length > 0 || "At least one equipment item is required"
            }}
            render={({ field }) => (
              <div className="space-y-4">
                {Object.entries(equipmentByType).map(([type, items]) => (
                  <div key={type} className="space-y-2">
                    <h4 className="font-medium text-sm">{type.charAt(0).toUpperCase() + type.slice(1)}</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {items.map(item => (
                        <div key={item.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`equipment-${item.id}`}
                            checked={field.value?.includes(item.id)}
                            onCheckedChange={(checked) => {
                              const currentSelected = [...(field.value || [])];
                              
                              if (checked) {
                                if (!currentSelected.includes(item.id)) {
                                  field.onChange([...currentSelected, item.id]);
                                }
                              } else {
                                field.onChange(currentSelected.filter(id => id !== item.id));
                              }
                            }}
                          />
                          <label 
                            htmlFor={`equipment-${item.id}`}
                            className="text-sm cursor-pointer"
                          >
                            {item.model} ({item.size})
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          />
        </FormStructure.Field>
      </div>
    </FormStructure.Section>
  );
}

// Main Form Component
export function Session4AdminForm({ 
  onSubmit, 
  isOpen, 
  onClose,
  initialData
}: { 
  onSubmit: (data: Session) => Promise<boolean>; 
  isOpen: boolean; 
  onClose: () => void;
  initialData?: Partial<Session>;
}) {
  const { tables } = useAdminContext();
  const [equipmentData, setEquipmentData] = useState<any[]>([]);
  
  // Get equipment data from context
  useEffect(() => {
    if (tables?.equipment?.data) {
      // Sort equipment by type and then by size
      const sortedEquipment = [...tables.equipment.data].sort((a, b) => {
        if (a.type !== b.type) return a.type.localeCompare(b.type);
        return a.size - b.size;
      });
      setEquipmentData(sortedEquipment);
    }
  }, [tables]);

  // Initialize with default session values or use provided initial data
  const formDefaultValues = {
    ...defaultSession,
    ...initialData
  };

  return (
    <FormStructure.Form
      onSubmit={onSubmit}
      onCancel={onClose}
      title={initialData?.id ? "Edit Session" : "Add New Session"}
      isOpen={isOpen}
      defaultValues={formDefaultValues}
      resolver={zodResolver(sessionSchema)}
    >
      {({ register, control, errors, watch, setValue }) => (
        <div className="flex flex-wrap gap-2 w-full">
          <SessionDetailsSection 
            register={register} 
            control={control}
            errors={errors} 
            equipment={equipmentData} 
          />
        </div>
      )}
    </FormStructure.Form>
  );
}
