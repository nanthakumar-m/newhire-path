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
    associateId: user?.associateId || '',
    associateName: user?.name || '',
    incidentId: '',
    customer: '',
    assignedGroup: '',
    priority: '',
    applicationName: '',
    ticketStatus: 'Resolved',
    slaMet: true,
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
    if (!formData.incidentId || !formData.customer || !formData.assignedGroup || !formData.priority || !formData.applicationName) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    if (formData.ticketStatus === 'Resolved' && !formData.slaMet && !formData.reasonForDelay) {
      toast({
        title: "Validation Error", 
        description: "Please provide a reason for not meeting SLA",
        variant: "destructive"
      });
      return;
    }

    if (formData.ticketStatus === 'Canceled' && !formData.reasonForDelay) {
      toast({
        title: "Validation Error", 
        description: "Please provide a reason for cancellation",
        variant: "destructive"
      });
      return;
    }

    setShowConfirmation(true);
  };

  const confirmSubmit = () => {
    const newTicket: Ticket = {
      id: Date.now().toString(),
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="associateId">Associate ID *</Label>
              <Input
                id="associateId"
                value={formData.associateId}
                onChange={(e) => handleInputChange('associateId', e.target.value)}
                placeholder="Enter associate ID"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="associateName">Associate Name *</Label>
              <Input
                id="associateName"
                value={formData.associateName}
                onChange={(e) => handleInputChange('associateName', e.target.value)}
                placeholder="Enter associate name"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="incidentId">Incident ID *</Label>
            <Input
              id="incidentId"
              value={formData.incidentId}
              onChange={(e) => handleInputChange('incidentId', e.target.value)}
              placeholder="Enter incident ID"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customer">Customer *</Label>
              <Input
                id="customer"
                value={formData.customer}
                onChange={(e) => handleInputChange('customer', e.target.value)}
                placeholder="Enter customer name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="assignedGroup">Assigned Group *</Label>
              <Input
                id="assignedGroup"
                value={formData.assignedGroup}
                onChange={(e) => handleInputChange('assignedGroup', e.target.value)}
                placeholder="Enter assigned group"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Priority *</Label>
              <Input
                id="priority"
                value={formData.priority}
                onChange={(e) => handleInputChange('priority', e.target.value)}
                placeholder="Enter priority (e.g., High, Medium, Low)"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="applicationName">Application Name *</Label>
              <Input
                id="applicationName"
                value={formData.applicationName}
                onChange={(e) => handleInputChange('applicationName', e.target.value)}
                placeholder="Project name"
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label>Ticket Status *</Label>
            <RadioGroup 
              value={formData.ticketStatus} 
              onValueChange={(value) => handleInputChange('ticketStatus', value as 'Resolved' | 'Canceled')}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Resolved" id="resolved" />
                <Label htmlFor="resolved">Resolved</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Canceled" id="canceled" />
                <Label htmlFor="canceled">Canceled</Label>
              </div>
            </RadioGroup>
          </div>

          {formData.ticketStatus === 'Resolved' && (
          <div className="space-y-3">
            <Label>SLA</Label>
            <RadioGroup 
              value={formData.slaMet?.toString()} 
              onValueChange={(value) => handleInputChange('slaMet', value === 'true')}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="true" id="sla-met" />
                <Label htmlFor="sla-met">Met</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="false" id="sla-not-met" />
                <Label htmlFor="sla-not-met">Not Met</Label>
              </div>
            </RadioGroup>
          </div>
          )}

          {((formData.ticketStatus === 'Resolved' && formData.slaMet === false) || formData.ticketStatus === 'Canceled') && (
            <div className="space-y-2">
              <Label htmlFor="reasonForDelay">
                {formData.ticketStatus === 'Canceled' ? 'Reason for Cancellation *' : 'Reason for SLA Not Met *'}
              </Label>
              <Textarea
                id="reasonForDelay"
                value={formData.reasonForDelay || ''}
                onChange={(e) => handleInputChange('reasonForDelay', e.target.value)}
                placeholder={formData.ticketStatus === 'Canceled' ? 'Please explain why the ticket was canceled' : 'Please explain why SLA was not met'}
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
              <div><strong>Associate ID:</strong> {formData.associateId}</div>
              <div><strong>Associate Name:</strong> {formData.associateName}</div>
              <div><strong>Incident ID:</strong> {formData.incidentId}</div>
              <div><strong>Customer:</strong> {formData.customer}</div>
              <div><strong>Assigned Group:</strong> {formData.assignedGroup}</div>
              <div><strong>Priority:</strong> {formData.priority}</div>
              <div><strong>Application Name:</strong> {formData.applicationName}</div>
              <div><strong>Ticket Status:</strong> {formData.ticketStatus}</div>
              {formData.ticketStatus === 'Resolved' && (
                <div><strong>SLA:</strong> {formData.slaMet ? 'Met' : 'Not Met'}</div>
              )}
              {formData.reasonForDelay && (
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