import React, { useEffect, RefObject } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { useForm, FieldValues, UseFormProps, SubmitHandler } from 'react-hook-form';
import { Checkbox } from "@/components/ui/checkbox";

interface FormFieldProps {
  label: string;
  id: string;
  error?: string;
  children: React.ReactNode;
}

export interface FormProps<T extends FieldValues = FieldValues> {
  onSubmit: (data: T) => Promise<boolean>;
  onCancel: () => void;
  title: string;
  isOpen: boolean;
  defaultValues: T;
  resolver: UseFormProps<T>['resolver'];
  mode?: UseFormProps<T>['mode'];
}

export const FormStructure = {
  Field: ({ label, id, error, children }: FormFieldProps) => (
    <div className="mb-4">
      <Label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </Label>
      {children}
      {error && <p className="text-sm text-destructive mt-1">{error}</p>}
    </div>
  ),

  Section: ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      {children}
    </div>
  ),

  Header: ({ title, onClose }: { title: string; onClose: () => void }) => (
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl font-bold">{title}</h2>
      <Button
        variant="ghost"
        size="icon"
        onClick={onClose}
        className="h-8 w-8"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  ),

  Form: <T extends FieldValues>({ 
    onSubmit, 
    onCancel, 
    title, 
    isOpen, 
    defaultValues, 
    resolver, 
    mode = "onChange",
    children 
  }: FormProps<T> & { children: (props: { register: any; control: any; errors: any; }) => React.ReactNode }) => {
    const [keepFormOpen, setKeepFormOpen] = React.useState(false);
    const [submitError, setSubmitError] = React.useState<string | null>(null);
    
    const { register, handleSubmit, control, formState: { errors }, reset } = useForm<T>({
      defaultValues,
      resolver,
      mode
    });

    const onFormSubmit: SubmitHandler<T> = async (data) => {
      setSubmitError(null);
      try {
        const success = await onSubmit(data);
        if (success) {
          reset(defaultValues as T);
          if (!keepFormOpen) {
            onCancel();
          }
        }
      } catch (error) {
        setSubmitError(error instanceof Error ? error.message : 'An error occurred');
      }
    };

    const onError = (errors: any) => {
      console.error('Form validation errors:', errors);
      setSubmitError('Please check the form for errors');
    };

    if (!isOpen) return null;

    return (
      <form onSubmit={handleSubmit(onFormSubmit, onError)} className="space-y-6">
        <FormStructure.Header title={title} onClose={onCancel} />
        
        <div className="flex flex-col lg:flex-row">
          {children({ register, control, errors })}
        </div>

        {submitError && (
          <div className="bg-destructive/10 text-destructive p-3 rounded-md">
            {submitError}
          </div>
        )}

        <div className="flex items-center justify-between pt-6 border-t">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="keepFormOpen"
              checked={keepFormOpen}
              onCheckedChange={(checked) => setKeepFormOpen(checked as boolean)}
            />
            <label
              htmlFor="keepFormOpen"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Keep form open after submission
            </label>
          </div>
          <div className="flex gap-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">
              Submit
            </Button>
          </div>
        </div>
      </form>
    );
  }
}; 