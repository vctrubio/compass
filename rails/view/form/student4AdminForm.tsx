import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { X } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from '@/components/ui/use-toast';

// Import the student schema, types, and constants
import { studentSchema, Student, defaultStudent, availableLanguages } from '@/rails/model/student';

interface StudentFormProps {
  onSubmit: (student: Student) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function Student4AdminForm({ onSubmit, isOpen, onClose }: StudentFormProps) {
  const [student, setStudent] = useState<Student>({
    name: '',
    email: '',
    phone: '',
    languages: [],
    age: 0
  });

  const formRef = useRef<HTMLFormElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  // Focus on name input when form opens
  useEffect(() => {
    if (isOpen && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setStudent(prev => ({
      ...prev,
      [name]: name === 'age' ? parseInt(value) || 0 : value
    }));
  };

  const handleLanguageToggle = (language: string) => {
    setStudent(prev => {
      const languages = prev.languages.includes(language)
        ? prev.languages.filter(l => l !== language)
        : [...prev.languages, language];
      return { ...prev, languages };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate languages - at least one language is required
    if (student.languages.length === 0) {
      alert("Please select at least one language");
      return;
    }
    onSubmit(student);
    
    // Reset the form after submission
    setStudent({
      name: '',
      email: '',
      phone: '',
      languages: [],
      age: 0
    });
    
    // Focus back on the name input for better UX
    if (nameInputRef.current) {
      nameInputRef.current.focus();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="p-4 border rounded-md bg-card shadow-sm my-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Add New Student</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0" 
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              name="name"
              ref={nameInputRef}
              value={student.name}
              onChange={handleInputChange}
              placeholder="Full name"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="age">Age *</Label>
            <Input
              id="age"
              name="age"
              type="number"
              value={student.age || ''}
              onChange={handleInputChange}
              placeholder="Age"
              required
              min={1}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={student.email}
              onChange={handleInputChange}
              placeholder="Email address"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              name="phone"
              value={student.phone}
              onChange={handleInputChange}
              placeholder="Phone number"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label>Languages *</Label>
          <div className="flex flex-wrap gap-4">
            {availableLanguages.map((language) => (
              <div key={language} className="flex items-center space-x-2">
                <Checkbox
                  id={`lang-${language}`}
                  checked={student.languages.includes(language)}
                  onCheckedChange={() => handleLanguageToggle(language)}
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
        </div>
        
        <div className="flex justify-end">
          <Button type="submit" className="w-full sm:w-auto">
            Add Student
          </Button>
        </div>
      </form>
    </div>
  );
}