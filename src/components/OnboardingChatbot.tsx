import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Bot, CheckCircle, XCircle, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Employee } from '@/types/auth';

const mandatoryTasks = [
  {
    id: 'odc_access',
    question: 'Have you got the ODC access?',
    yesResponse: "That's awesome! You're all set with ODC access.",
    noResponse: 'Please reach out to your manager and get ODC access to proceed further.',
    noAction: 'Please click OK and come back once you get the ODC access to continue further.'
  },
  {
    id: 'personal_details',
    question: 'Have you updated your personal details in People Soft HCM site?',
    yesResponse: "Perfect! Your personal details are now updated in People Soft HCM.",
    noResponse: 'Please navigate to People Soft HCM site and complete your personal details update.',
    noAction: 'Please reach out to your manager and ask for assistance with People Soft HCM access.'
  },
  {
    id: 'vdi_access',
    question: 'Have you requested VDI access?',
    yesResponse: "Excellent! Your VDI access request is in progress.",
    noResponse: 'Please reach out to your manager and request VDI access.',
    noAction: 'Please contact your manager to get VDI access and return to continue.'
  }
];

interface OnboardingChatbotProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export const OnboardingChatbot = ({ isOpen, onClose, onComplete }: OnboardingChatbotProps) => {
  const { user } = useAuth();
  const currentEmployee = user as Employee;
  
  const [currentStep, setCurrentStep] = useState<'welcome' | 'confirmation' | 'task' | 'waiting' | 'completed'>('welcome');
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [showResponse, setShowResponse] = useState(false);
  const [responseType, setResponseType] = useState<'yes' | 'no' | null>(null);

  useEffect(() => {
    if (isOpen && currentEmployee?.mandatoryTasksCompleted) {
      setCurrentStep('completed');
    } else if (isOpen && currentEmployee) {
      // Load saved progress
      const savedProgress = localStorage.getItem(`onboarding_${currentEmployee.id}`);
      if (savedProgress) {
        const progress = JSON.parse(savedProgress);
        setCurrentStep(progress.currentStep);
        setCurrentTaskIndex(progress.currentTaskIndex);
        setCompletedTasks(progress.completedTasks);
      }
    }
  }, [isOpen, currentEmployee]);

  const handleWelcomeNext = () => {
    setCurrentStep('confirmation');
  };

  const handleStartTasks = () => {
    setCurrentStep('task');
    setCurrentTaskIndex(0);
  };

  const saveProgress = () => {
    if (currentEmployee) {
      const progress = {
        currentStep,
        currentTaskIndex,
        completedTasks
      };
      localStorage.setItem(`onboarding_${currentEmployee.id}`, JSON.stringify(progress));
    }
  };

  const handleTaskResponse = (response: 'yes' | 'no') => {
    setResponseType(response);
    setShowResponse(true);

    if (response === 'yes') {
      const taskId = mandatoryTasks[currentTaskIndex].id;
      const newCompletedTasks = [...completedTasks, taskId];
      setCompletedTasks(newCompletedTasks);
      
      setTimeout(() => {
        if (currentTaskIndex < mandatoryTasks.length - 1) {
          setCurrentTaskIndex(prev => prev + 1);
          setShowResponse(false);
          setResponseType(null);
          saveProgress();
        } else {
          // All tasks completed
          setCurrentStep('completed');
          updateEmployeeMandatoryStatus(true);
          localStorage.removeItem(`onboarding_${currentEmployee?.id}`);
          onComplete();
        }
      }, 2000);
    } else {
      setTimeout(() => {
        setShowResponse(false);
        setResponseType(null);
        saveProgress();
      }, 3000);
    }
  };

  const updateEmployeeMandatoryStatus = (completed: boolean) => {
    const employees = JSON.parse(localStorage.getItem('employees') || '[]');
    const updatedEmployees = employees.map((emp: Employee) => {
      if (emp.id === currentEmployee.id) {
        // Add tasks 1, 2, 3 (chatbot questions) to completed tasks
        const updatedTasks = [...new Set([...emp.completedTasks, 1, 2, 3])];
        return { 
          ...emp, 
          mandatoryTasksCompleted: completed,
          completedTasks: updatedTasks
        };
      }
      return emp;
    });
    localStorage.setItem('employees', JSON.stringify(updatedEmployees));

    // Update current user in localStorage as well
    const updatedCurrentEmployee = updatedEmployees.find(emp => emp.id === currentEmployee.id);
    if (updatedCurrentEmployee) {
      localStorage.setItem('currentUser', JSON.stringify(updatedCurrentEmployee));
    }
  };

  const handleContinueToDashboard = () => {
    onComplete();
    onClose();
  };

  const currentTask = mandatoryTasks[currentTaskIndex];
  const progress = Math.round(((completedTasks.length) / mandatoryTasks.length) * 100);

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center shadow-lg">
              <Bot className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <DialogTitle className="text-center text-lg font-semibold">
            Onboarding Assistant
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {currentStep === 'welcome' && (
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <span className="font-semibold text-primary">Welcome to GenC Tracker!</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Hi {currentEmployee?.name}! 👋 I'm your onboarding assistant. I'm here to help you get started with some important setup tasks.
                </p>
                <Button onClick={handleWelcomeNext} className="w-full">
                  Let's Get Started
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          )}

          {currentStep === 'confirmation' && (
            <Card className="border-warning/20 bg-warning/5">
              <CardContent className="p-4 space-y-4">
                <p className="text-sm">
                  You have some <span className="font-semibold text-warning">mandatory tasks</span> to complete before accessing your full dashboard. Let's get started!
                </p>
                <Button onClick={handleStartTasks} className="w-full">
                  Proceed with Tasks
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          )}

          {currentStep === 'task' && (
            <Card>
              <CardContent className="p-4 space-y-4">
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <span>Task {currentTaskIndex + 1} of {mandatoryTasks.length}</span>
                  <span>{progress}% Complete</span>
                </div>
                
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${progress}%` }}
                  />
                </div>

                {!showResponse ? (
                  <>
                    <p className="font-medium">{currentTask.question}</p>
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => handleTaskResponse('yes')} 
                        className="flex-1 bg-success hover:bg-success/90"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Yes
                      </Button>
                      <Button 
                        onClick={() => handleTaskResponse('no')} 
                        variant="destructive" 
                        className="flex-1"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        No
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className={`p-4 rounded-lg ${responseType === 'yes' ? 'bg-success/20 border border-success/30' : 'bg-destructive/20 border border-destructive/30'}`}>
                    <p className={`text-sm font-medium ${responseType === 'yes' ? 'text-success' : 'text-destructive'}`}>
                      {responseType === 'yes' ? currentTask.yesResponse : currentTask.noResponse}
                    </p>
                    {responseType === 'no' && (
                      <p className="text-xs text-foreground/80 mt-2">
                        {currentTask.noAction}
                      </p>
                    )}
                    {responseType === 'no' && (
                      <Button 
                        onClick={() => {
                          setShowResponse(false);
                          setResponseType(null);
                        }} 
                        size="sm" 
                        className="mt-3 w-full"
                      >
                        I've Completed This Task
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {currentStep === 'completed' && (
            <Card className="border-success/20 bg-success/5">
              <CardContent className="p-4 space-y-4 text-center">
                <div className="flex justify-center">
                  <div className="h-12 w-12 rounded-full bg-success flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-success-foreground" />
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-success mb-2">That's Awesome!</p>
                  <p className="text-sm text-muted-foreground">
                    You've completed all mandatory tasks. Now let's go and explore the courses and tasks assigned for you.
                  </p>
                </div>
                <Button onClick={handleContinueToDashboard} className="w-full">
                  Explore Dashboard
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};