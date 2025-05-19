import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Student } from "@/rails/model/student";
import { availableLanguages } from "@/rails/model/languages";
import { Checkbox } from "@/components/ui/checkbox";

interface StudentIdViewProps {
  student: Student;
  onSave?: (student: Student) => void;
}

export function StudentIdView({ student, onSave }: StudentIdViewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedStudent, setEditedStudent] = useState<Student>(student);

  const handleEdit = () => {
    setIsEditing(true);
    console.log("Edit clicked");
  };

  const handleSave = () => {
    console.log("Save clicked with data:", editedStudent);
    if (onSave) {
      onSave(editedStudent);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    console.log("Cancel clicked");
    setEditedStudent(student);
    setIsEditing(false);
  };

  const handleLanguageChange = (language: typeof availableLanguages[number], checked: boolean) => {
    setEditedStudent(prev => {
      const currentLanguages = prev.languages || [];
      if (checked) {
        return {
          ...prev,
          languages: [...currentLanguages, language]
        };
      } else {
        return {
          ...prev,
          languages: currentLanguages.filter(l => l !== language)
        };
      }
    });
  };

  const renderField = (key: string, value: any) => {
    if (key === 'languages') {
      if (isEditing) {
        return (
          <div className="space-y-2">
            {availableLanguages.map((lang) => (
              <div key={lang} className="flex items-center space-x-2">
                <Checkbox
                  id={`lang-${lang}`}
                  checked={editedStudent.languages?.includes(lang)}
                  onCheckedChange={(checked) => 
                    handleLanguageChange(lang, checked as boolean)
                  }
                />
                <label
                  htmlFor={`lang-${lang}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {lang.charAt(0).toUpperCase() + lang.slice(1)}
                </label>
              </div>
            ))}
          </div>
        );
      }
      return (
        <p>
          {Array.isArray(value)
            ? value.map(lang => lang.charAt(0).toUpperCase() + lang.slice(1)).join(", ")
            : "-"}
        </p>
      );
    }

    return isEditing ? (
      <input
        type="text"
        value={String(editedStudent[key as keyof Student] || "")}
        onChange={(e) => 
          setEditedStudent(prev => ({
            ...prev,
            [key]: e.target.value
          }))
        }
        className="w-full p-2 border rounded"
      />
    ) : (
      <p>
        {Array.isArray(value)
          ? value.join(", ")
          : String(value || "-")}
      </p>
    );
  };

  return (
    <div className="p-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Student Details</h1>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                Save Changes
              </Button>
            </>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleEdit}
              className="h-8 w-8"
            >
              <Pencil className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      
      {/* Fields Section */}
      <div className="border rounded-md p-6">
        <h2 className="text-lg font-semibold mb-4">Student Fields</h2>
        <div className="space-y-4">
          {Object.entries(student).map(([key, value]) => (
            <div key={key} className="flex items-start gap-4">
              <div className="w-1/3">
                <span className="font-medium">{key}</span>
              </div>
              <div className="w-2/3">
                {renderField(key, value)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Relationships Section */}
      <div className="border rounded-md p-6">
        <h2 className="text-lg font-semibold mb-4">Relationships</h2>
        <div className="text-muted-foreground">
          No relationships defined
        </div>
      </div>
    </div>
  );
} 