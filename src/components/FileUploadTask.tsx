import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { TaskSubmission, Employee } from "@/types/auth";
import { Upload, Eye, Check, X, Clock, AlertCircle } from "lucide-react";

interface FileUploadTaskProps {
  task: {
    id: number;
    title: string;
    description: string;
    priority: "high" | "medium" | "low";
    estimatedTime: string;
    requiresUpload?: boolean;
  };
  isCompleted: boolean;
  onToggleComplete: () => void;
}

export const FileUploadTask = ({ task, isCompleted, onToggleComplete }: FileUploadTaskProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [viewSubmission, setViewSubmission] = useState(false);
  const [managerFeedback, setManagerFeedback] = useState('');

  const currentEmployee = user as Employee;
  const submission = currentEmployee?.taskSubmissions?.[task.id];
  const canUpload = task.requiresUpload && !isCompleted && !submission;
  const isManager = user?.type === 'manager';

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length !== files.length) {
      toast({
        title: 'Error',
        description: 'Only image files (screenshots) are allowed',
        variant: 'destructive'
      });
      return;
    }
    
    setSelectedFiles(imageFiles);
  };

  const handleSubmit = async () => {
    if (selectedFiles.length === 0) {
      toast({
        title: 'Error',
        description: 'Please select at least one screenshot',
        variant: 'destructive'
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Convert files to base64 for storage
      const screenshots: string[] = [];
      for (const file of selectedFiles) {
        const base64 = await fileToBase64(file);
        screenshots.push(base64);
      }

      const newSubmission: TaskSubmission = {
        taskId: task.id,
        employeeId: currentEmployee.employeeId,
        screenshots,
        submittedAt: new Date().toISOString(),
        status: 'pending'
      };

      // Update employee's submissions
      const employees = JSON.parse(localStorage.getItem('employees') || '[]');
      const updatedEmployees = employees.map((emp: Employee) => {
        if (emp.id === currentEmployee.id) {
          return {
            ...emp,
            taskSubmissions: {
              ...emp.taskSubmissions,
              [task.id]: newSubmission
            }
          };
        }
        return emp;
      });

      localStorage.setItem('employees', JSON.stringify(updatedEmployees));

      // Update current user in localStorage
      const updatedUser = {
        ...currentEmployee,
        taskSubmissions: {
          ...currentEmployee.taskSubmissions,
          [task.id]: newSubmission
        }
      };
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));

      toast({
        title: 'Success',
        description: 'Screenshots submitted for manager review'
      });

      setSelectedFiles([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      // Reload the page to reflect changes
      window.location.reload();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit screenshots',
        variant: 'destructive'
      });
    }

    setIsSubmitting(false);
  };

  const handleManagerAction = (action: 'approved' | 'rejected') => {
    if (!submission) return;

    const employees = JSON.parse(localStorage.getItem('employees') || '[]');
    const updatedEmployees = employees.map((emp: Employee) => {
      if (emp.employeeId === submission.employeeId) {
        const updatedSubmission = {
          ...submission,
          status: action,
          managerFeedback: managerFeedback || undefined
        };

        let updatedCompletedTasks = emp.completedTasks;
        if (action === 'approved' && !updatedCompletedTasks.includes(task.id)) {
          updatedCompletedTasks = [...updatedCompletedTasks, task.id];
        }

        return {
          ...emp,
          taskSubmissions: {
            ...emp.taskSubmissions,
            [task.id]: updatedSubmission
          },
          completedTasks: updatedCompletedTasks
        };
      }
      return emp;
    });

    localStorage.setItem('employees', JSON.stringify(updatedEmployees));

    toast({
      title: 'Success',
      description: `Task ${action} successfully`
    });

    setViewSubmission(false);
    setManagerFeedback('');
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const getStatusBadge = () => {
    if (isCompleted) {
      return <Badge className="bg-success text-success-foreground">Completed</Badge>;
    }
    
    if (submission) {
      switch (submission.status) {
        case 'pending':
          return <Badge variant="secondary" className="bg-warning/20 text-warning-foreground">
            <Clock className="h-3 w-3 mr-1" />
            Pending Review
          </Badge>;
        case 'approved':
          return <Badge className="bg-success text-success-foreground">
            <Check className="h-3 w-3 mr-1" />
            Approved
          </Badge>;
        case 'rejected':
          return <Badge variant="destructive">
            <X className="h-3 w-3 mr-1" />
            Rejected
          </Badge>;
      }
    }

    if (task.requiresUpload) {
      return <Badge variant="outline" className="border-warning text-warning">
        <AlertCircle className="h-3 w-3 mr-1" />
        Upload Required
      </Badge>;
    }

    return null;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-destructive";
      case "medium": return "text-warning";
      case "low": return "text-muted-foreground";
      default: return "text-muted-foreground";
    }
  };

  return (
    <Card className={`transition-all duration-200 hover:shadow-md ${
      isCompleted 
        ? "bg-success/10 border-success/50" 
        : submission?.status === 'pending'
        ? "bg-warning/10 border-warning/30"
        : "hover:border-primary/30"
    }`}>
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <div className="flex-1 space-y-2">
            <CardTitle className={`text-sm leading-snug ${
              isCompleted ? "text-success/80" : ""
            }`}>
              {task.title}
            </CardTitle>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge 
                variant="outline"
                className={`text-xs flex items-center gap-1 ${getPriorityColor(task.priority)}`}
              >
                <AlertCircle className="h-3 w-3" />
                {task.priority}
              </Badge>
              {getStatusBadge()}
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 space-y-3">
        <p className={`text-sm ${
          isCompleted ? "text-success/70" : "text-foreground/80"
        }`}>
          {task.description}
        </p>
        
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span>~{task.estimatedTime}</span>
        </div>

        {/* Upload Section for Employees */}
        {canUpload && (
          <div className="space-y-3 pt-2 border-t">
            <div className="space-y-2">
              <Label htmlFor={`file-${task.id}`} className="text-sm font-medium">
                Upload Screenshots
              </Label>
              <input
                ref={fileInputRef}
                id={`file-${task.id}`}
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
              />
            </div>
            
            {selectedFiles.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">
                  {selectedFiles.length} file(s) selected
                </p>
                <Button 
                  onClick={handleSubmit} 
                  disabled={isSubmitting}
                  className="w-full"
                  size="sm"
                >
                  <Upload className="h-3 w-3 mr-2" />
                  {isSubmitting ? 'Uploading...' : 'Submit for Review'}
                </Button>
              </div>
            )}
          </div>
        )}

        {/* View Submission */}
        {submission && (
          <div className="pt-2 border-t">
            <Dialog open={viewSubmission} onOpenChange={setViewSubmission}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="w-full">
                  <Eye className="h-3 w-3 mr-2" />
                  View Submission
                </Button>
              </DialogTrigger>
              
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Task Submission - {task.title}</DialogTitle>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <Label>Employee</Label>
                      <p className="font-medium">{currentEmployee.name}</p>
                    </div>
                    <div>
                      <Label>Submitted</Label>
                      <p>{new Date(submission.submittedAt).toLocaleString()}</p>
                    </div>
                    <div>
                      <Label>Status</Label>
                      <div className="mt-1">{getStatusBadge()}</div>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Screenshots ({submission.screenshots.length})</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {submission.screenshots.map((screenshot, index) => (
                        <img
                          key={index}
                          src={screenshot}
                          alt={`Screenshot ${index + 1}`}
                          className="w-full h-32 object-cover rounded border"
                        />
                      ))}
                    </div>
                  </div>

                  {isManager && submission.status === 'pending' && (
                    <div className="space-y-3 pt-4 border-t">
                      <div>
                        <Label htmlFor="feedback">Manager Feedback (Optional)</Label>
                        <Textarea
                          id="feedback"
                          placeholder="Add feedback for the employee..."
                          value={managerFeedback}
                          onChange={(e) => setManagerFeedback(e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          onClick={() => handleManagerAction('approved')}
                          className="flex-1 bg-success hover:bg-success/90"
                        >
                          <Check className="h-4 w-4 mr-2" />
                          Approve
                        </Button>
                        <Button 
                          onClick={() => handleManagerAction('rejected')}
                          variant="destructive"
                          className="flex-1"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  )}

                  {submission.managerFeedback && (
                    <div className="pt-4 border-t">
                      <Label>Manager Feedback</Label>
                      <p className="text-sm text-muted-foreground mt-1 p-3 bg-muted/50 rounded">
                        {submission.managerFeedback}
                      </p>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}

        {!task.requiresUpload && (
          <Button 
            onClick={onToggleComplete}
            variant={isCompleted ? "secondary" : "default"}
            size="sm"
            className="w-full"
          >
            {isCompleted ? 'Mark Incomplete' : 'Mark Complete'}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};