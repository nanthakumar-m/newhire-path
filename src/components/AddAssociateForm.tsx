import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { UserPlus } from 'lucide-react';
import { Associate } from '@/types/auth';
import { useToast } from '@/hooks/use-toast';

interface AddAssociateFormProps {
  onAssociateAdded: () => void;
}

export const AddAssociateForm = ({ onAssociateAdded }: AddAssociateFormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    associateId: '',
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
    
    if (!formData.name || !formData.associateId || !formData.department || !formData.onboardingDate) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields',
        variant: 'destructive'
      });
      return;
    }

    const existingAssociates = JSON.parse(localStorage.getItem('associates') || '[]');
    
    // Check if associate ID already exists
    if (existingAssociates.find((emp: Associate) => emp.associateId === formData.associateId)) {
      toast({
        title: 'Error',
        description: 'Associate ID already exists',
        variant: 'destructive'
      });
      return;
    }

    const newAssociate: Associate = {
      id: Date.now().toString(),
      name: formData.name,
      type: 'associate',
      associateId: formData.associateId,
      department: formData.department,
      onboardingDate: formData.onboardingDate,
      completedTasks: [],
      mandatoryTasksCompleted: false,
      taskCompletionDates: {}
    };

    const updatedAssociates = [...existingAssociates, newAssociate];
    localStorage.setItem('associates', JSON.stringify(updatedAssociates));

    toast({
      title: 'Success',
      description: `Associate ${formData.name} (ID: ${formData.associateId}) has been added successfully. Login credentials: ID and password are both "${formData.associateId}"`
    });

    setFormData({ name: '', associateId: '', department: '', onboardingDate: '' });
    setIsOpen(false);
    onAssociateAdded();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          Add New Associate
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Associate</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter associate's full name"
            />
          </div>
          
            <div className="space-y-2">
              <Label htmlFor="associateId">Associate ID</Label>
              <Input
                id="associateId"
                value={formData.associateId}
                onChange={(e) => setFormData(prev => ({ ...prev, associateId: e.target.value }))}
              />
              <p className="text-xs text-muted-foreground">
                This will be used as both username and password for login
              </p>
            </div>
          
          <div className="space-y-2">
            <Label htmlFor="department">Service Line</Label>
            <Select 
              value={formData.department} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, department: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select service line" />
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
            <Button type="submit">Add Associate</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};