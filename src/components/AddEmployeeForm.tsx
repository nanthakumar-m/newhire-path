import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { UserPlus } from 'lucide-react';
import { Employee } from '@/types/auth';
import { useToast } from '@/hooks/use-toast';

interface AddEmployeeFormProps {
  onEmployeeAdded: () => void;
}

export const AddEmployeeForm = ({ onEmployeeAdded }: AddEmployeeFormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    employeeId: '',
    department: '',
    onboardingDate: ''
  });
  const { toast } = useToast();

  const departments = [
    'ADM',
    'DE', 
    'SAP',
    'IoT',
    'QEA'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.employeeId || !formData.department || !formData.onboardingDate) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields',
        variant: 'destructive'
      });
      return;
    }

    const existingEmployees = JSON.parse(localStorage.getItem('employees') || '[]');
    
    // Check if employee ID already exists
    if (existingEmployees.find((emp: Employee) => emp.employeeId === formData.employeeId)) {
      toast({
        title: 'Error',
        description: 'Employee ID already exists',
        variant: 'destructive'
      });
      return;
    }

    const newEmployee: Employee = {
      id: Date.now().toString(),
      name: formData.name,
      type: 'employee',
      employeeId: formData.employeeId,
      department: formData.department,
      onboardingDate: formData.onboardingDate,
      completedTasks: [],
      mandatoryTasksCompleted: false
    };

    const updatedEmployees = [...existingEmployees, newEmployee];
    localStorage.setItem('employees', JSON.stringify(updatedEmployees));

    toast({
      title: 'Success',
      description: `Employee ${formData.name} (ID: ${formData.employeeId}) has been added successfully. Login credentials: ID and password are both "${formData.employeeId}"`
    });

    setFormData({ name: '', employeeId: '', department: '', onboardingDate: '' });
    setIsOpen(false);
    onEmployeeAdded();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          Add New Employee
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Employee</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter employee's full name"
            />
          </div>
          
            <div className="space-y-2">
              <Label htmlFor="employeeId">Employee ID</Label>
              <Input
                id="employeeId"
                value={formData.employeeId}
                onChange={(e) => setFormData(prev => ({ ...prev, employeeId: e.target.value }))}
                placeholder="e.g., EMP001, DEV123, etc."
              />
              <p className="text-xs text-muted-foreground">
                This will be used as both username and password for login
              </p>
            </div>
          
          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Select 
              value={formData.department} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, department: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map(dept => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="onboardingDate">Onboarding Date</Label>
            <Input
              id="onboardingDate"
              type="date"
              value={formData.onboardingDate}
              onChange={(e) => setFormData(prev => ({ ...prev, onboardingDate: e.target.value }))}
            />
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Employee</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};