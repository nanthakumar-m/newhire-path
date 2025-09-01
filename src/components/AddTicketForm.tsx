import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { ArrowLeft, Send } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { TicketFormData, Ticket } from '@/types/ticket';
import { useToast } from '@/hooks/use-toast';

interface AddTicketFormProps {
  onBack: () => void;
}

export const AddTicketForm = ({ onBack }: AddTicketFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState<TicketFormData>({
    incidentId: '',
    applicationName: '',
    applicationGroupName: '',
    deadlineMet: true,
    reasonForDelay: ''
  });
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleInputChange = (field: keyof TicketFormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    // Validation
    if (!formData.incidentId || !formData.applicationName || !formData.applicationGroupName) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    if (!formData.deadlineMet && !formData.reasonForDelay) {
      toast({
        title: "Validation Error", 
        description: "Please provide a reason for not meeting the deadline",
        variant: "destructive"
      });
      return;
    }

    setShowConfirmation(true);
  };

  const confirmSubmit = () => {
    const newTicket: Ticket = {
      id: Date.now().toString(),
      employeeId: user?.id || '',
      employeeName: user?.name || '',
      ...formData,
      submittedAt: new Date().toISOString()
    };

    // Save to localStorage
    const existingTickets = JSON.parse(localStorage.getItem('tickets') || '[]');
    const updatedTickets = [...existingTickets, newTicket];
    localStorage.setItem('tickets', JSON.stringify(updatedTickets));

    toast({
      title: "Success!",
      description: "Ticket submitted successfully"
    });

    setShowConfirmation(false);
    onBack();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">Add New Ticket</h1>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Incident Ticket Form</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="incidentId">Incident ID *</Label>
            <Input
              id="incidentId"
              value={formData.incidentId}
              onChange={(e) => handleInputChange('incidentId', e.target.value)}
              placeholder="Enter incident ID"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="applicationName">Application Name *</Label>
            <Input
              id="applicationName"
              value={formData.applicationName}
              onChange={(e) => handleInputChange('applicationName', e.target.value)}
              placeholder="Enter application name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="applicationGroupName">Application Group Name *</Label>
            <Input
              id="applicationGroupName"
              value={formData.applicationGroupName}
              onChange={(e) => handleInputChange('applicationGroupName', e.target.value)}
              placeholder="Enter application group name"
            />
          </div>

          <div className="space-y-3">
            <Label>Deadline Status *</Label>
            <RadioGroup 
              value={formData.deadlineMet.toString()} 
              onValueChange={(value) => handleInputChange('deadlineMet', value === 'true')}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="true" id="deadline-met" />
                <Label htmlFor="deadline-met">Deadline Met</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="false" id="deadline-not-met" />
                <Label htmlFor="deadline-not-met">Deadline Not Met</Label>
              </div>
            </RadioGroup>
          </div>

          {!formData.deadlineMet && (
            <div className="space-y-2">
              <Label htmlFor="reasonForDelay">Reason for Not Completion *</Label>
              <Textarea
                id="reasonForDelay"
                value={formData.reasonForDelay || ''}
                onChange={(e) => handleInputChange('reasonForDelay', e.target.value)}
                placeholder="Please explain why the deadline was not met"
                rows={3}
              />
            </div>
          )}

          <Button onClick={handleSubmit} className="w-full">
            <Send className="h-4 w-4 mr-2" />
            Submit Ticket
          </Button>
        </CardContent>
      </Card>

      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Ticket Submission</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground mb-4">
              Please review your ticket details. Once submitted, this cannot be edited.
            </p>
            <div className="space-y-2 text-sm">
              <div><strong>Incident ID:</strong> {formData.incidentId}</div>
              <div><strong>Application Name:</strong> {formData.applicationName}</div>
              <div><strong>Application Group:</strong> {formData.applicationGroupName}</div>
              <div><strong>Deadline Status:</strong> {formData.deadlineMet ? 'Met' : 'Not Met'}</div>
              {!formData.deadlineMet && (
                <div><strong>Reason:</strong> {formData.reasonForDelay}</div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmation(false)}>
              Cancel
            </Button>
            <Button onClick={confirmSubmit}>
              Confirm Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};