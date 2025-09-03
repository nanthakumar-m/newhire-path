import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar, CheckCircle, Clock, User, Target, BookOpen, Users, Trophy } from 'lucide-react';
import { TaskCard } from '@/components/TaskCard';
import { OnboardingChatbot } from '@/components/OnboardingChatbot';
import { TicketSystem } from '@/components/TicketSystem';
import { useAuth } from '@/contexts/AuthContext';
import { Employee } from '@/types/auth';

export const EmployeeDashboard = () => {
  const { user } = useAuth();
  const currentEmployee = user as Employee;
  const [showChatbot, setShowChatbot] = useState(false);
  const [showCongratulations, setShowCongratulations] = useState(false);
  const [allTasksCompleted, setAllTasksCompleted] = useState(false);

  useEffect(() => {
    // Initialize tasks if not present
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    if (tasks.length === 0) {
      const newTasks = [
        { id: 1, name: 'Cargill Onboarding', deadline: '2024-02-15' },
        { id: 2, name: 'AWS', deadline: '2024-02-18' },
        { id: 3, name: 'Gen AI', deadline: '2024-02-20' },
        { id: 4, name: 'CyberSecurity', deadline: '2024-02-22' },
        { id: 5, name: 'Cargill Mandatory Course 1', deadline: '2024-02-25' },
        { id: 6, name: 'Cargill Mandatory Course 2', deadline: '2024-02-28' },
        { id: 7, name: 'Cargill Mandatory Course 3', deadline: '2024-03-02' },
        { id: 8, name: 'Complete KT', deadline: '2024-03-05' },
        { id: 9, name: 'Complete Reverse KT', deadline: '2024-03-08' },
        { id: 10, name: 'System Integration Training', deadline: '2024-03-10' }
      ];
      localStorage.setItem('tasks', JSON.stringify(newTasks));
    }

    // Show chatbot if mandatory tasks are not completed
    if (currentEmployee && !currentEmployee.mandatoryTasksCompleted) {
      setShowChatbot(true);
    }

    // Check if Reverse KT (task 9) is completed to show tickets
    const completedTasks = currentEmployee?.completedTasks || [];
    if (completedTasks.includes(9)) {
      setAllTasksCompleted(true);
    }
  }, [currentEmployee]);

  const handleToggleComplete = (taskId: number) => {
    const employees = JSON.parse(localStorage.getItem('employees') || '[]');
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    
    const updatedEmployees = employees.map((emp: Employee) => {
      if (emp.id === currentEmployee.id) {
        const isCompleting = !emp.completedTasks.includes(taskId);
        const updatedTasks = isCompleting
          ? [...emp.completedTasks, taskId]
          : emp.completedTasks.filter(id => id !== taskId);
          
        const updatedEmployee = { ...emp, completedTasks: updatedTasks };
        
        // Check if Reverse KT (task 9) is completed to show tickets
        if (updatedTasks.includes(9)) {
          setAllTasksCompleted(true);
          setShowCongratulations(true);
        }
        
        return updatedEmployee;
      }
      return emp;
    });

    localStorage.setItem('employees', JSON.stringify(updatedEmployees));
    
    // Update the current user in localStorage as well to sync with auth context
    const updatedCurrentEmployee = updatedEmployees.find(emp => emp.id === currentEmployee.id);
    if (updatedCurrentEmployee) {
      localStorage.setItem('currentUser', JSON.stringify(updatedCurrentEmployee));
    }
    
    // Force component re-render by reloading
    window.location.reload();
  };

  const handleChatbotComplete = () => {
    setShowChatbot(false);
    // Force a re-render to show the full dashboard
    window.location.reload();
  };

  const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
  const completedCount = currentEmployee?.completedTasks?.length || 0;
  const totalTasks = tasks.length;
  const progress = totalTasks > 0 ? (completedCount / totalTasks) * 100 : 0;

  const getTasksWithLockStatus = () => {
    return tasks.map((task: any, index: number) => {
      // First task is always unlocked, subsequent tasks require previous completion
      const isLocked = index > 0 && !currentEmployee?.completedTasks?.includes(tasks[index - 1].id);
      return {
        ...task,
        isLocked
      };
    });
  };

  const tasksWithLockStatus = getTasksWithLockStatus();

  // If all tasks are completed, show ticket system
  if (allTasksCompleted) {
    return (
      <>
        <TicketSystem />
        
        <Dialog open={showCongratulations} onOpenChange={setShowCongratulations}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <div className="text-center space-y-4">
                <div className="mx-auto h-16 w-16 rounded-full bg-green-500/10 flex items-center justify-center">
                  <Trophy className="h-8 w-8 text-green-600" />
                </div>
                <DialogTitle className="text-2xl font-bold text-green-600">
                  Congratulations! 🎉
                </DialogTitle>
              </div>
            </DialogHeader>
            <div className="text-center space-y-4">
              <p className="text-lg">
                You have successfully completed all your onboarding tasks!
              </p>
              <p className="text-muted-foreground">
                You can now manage your GenC incident tickets using the ticket system.
              </p>
              <Button onClick={() => setShowCongratulations(false)} className="w-full">
                <CheckCircle className="h-4 w-4 mr-2" />
                Continue to Ticket System
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  // Show simplified view if mandatory tasks not completed
  if (!currentEmployee?.mandatoryTasksCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/10 flex items-center justify-center p-6">
        <Card className="max-w-lg text-center shadow-xl border-0 bg-card/80 backdrop-blur-sm">
          <CardContent className="p-8 space-y-6">
            <div className="h-20 w-20 rounded-full bg-primary/10 mx-auto flex items-center justify-center">
              <Users className="h-10 w-10 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-foreground">Welcome to Onboarding!</h3>
              <p className="text-muted-foreground">
                Let's get you started with your journey. Complete the setup process to access your personalized dashboard.
              </p>
            </div>
          </CardContent>
        </Card>
        
        <OnboardingChatbot 
          isOpen={showChatbot}
          onClose={() => setShowChatbot(false)}
          onComplete={handleChatbotComplete}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/5">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-3 py-6">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Welcome, {currentEmployee?.name}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Complete your onboarding journey and unlock your full potential with our step-by-step process
          </p>
        </div>

        {/* Stats Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-primary/5 to-primary/10 hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6 text-center">
              <div className="h-14 w-14 rounded-full bg-primary/10 mx-auto mb-4 flex items-center justify-center">
                <User className="h-7 w-7 text-primary" />
              </div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Employee ID</p>
              <p className="text-xl font-bold text-foreground">{currentEmployee?.employeeId}</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6 text-center">
              <div className="h-14 w-14 rounded-full bg-blue-500/10 mx-auto mb-4 flex items-center justify-between">
                <BookOpen className="h-7 w-7 text-blue-600 dark:text-blue-400" />
              </div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Department</p>
              <p className="text-xl font-bold text-foreground">{currentEmployee?.department}</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6 text-center">
              <div className="h-14 w-14 rounded-full bg-green-500/10 mx-auto mb-4 flex items-center justify-center">
                <CheckCircle className="h-7 w-7 text-green-600 dark:text-green-400" />
              </div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Tasks Completed</p>
              <p className="text-xl font-bold text-foreground">{completedCount} / {totalTasks}</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/20 hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6 text-center">
              <div className="h-14 w-14 rounded-full bg-orange-500/10 mx-auto mb-4 flex items-center justify-center">
                <Target className="h-7 w-7 text-orange-600 dark:text-orange-400" />
              </div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Progress</p>
              <p className="text-xl font-bold text-foreground">{Math.round(progress)}%</p>
            </CardContent>
          </Card>
        </div>

        {/* Progress Overview */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Target className="h-5 w-5 text-primary" />
              </div>
              Onboarding Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-foreground">Overall Completion</span>
                <span className="text-sm text-muted-foreground font-medium">{completedCount} of {totalTasks} tasks completed</span>
              </div>
              <Progress value={progress} className="h-3 bg-secondary" />
            </div>
            <div className="flex justify-center gap-8 text-sm pt-2">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-green-500"></div>
                <span className="font-medium">{completedCount} Completed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-orange-500"></div>
                <span className="font-medium">{totalTasks - completedCount} Remaining</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tasks Section */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              Your Onboarding Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            {tasksWithLockStatus.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {tasksWithLockStatus.map((task: any) => (
                  <TaskCard
                    key={task.id}
                    id={task.id}
                    title={task.name}
                    description={`Complete this essential onboarding task by the specified deadline to progress to the next step.`}
                    deadline={task.deadline}
                    isCompleted={currentEmployee?.completedTasks?.includes(task.id) || false}
                    onToggleComplete={handleToggleComplete}
                    isLocked={task.isLocked}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 text-muted-foreground">
                <Calendar className="h-20 w-20 mx-auto mb-6 opacity-30" />
                <h3 className="text-xl font-semibold mb-2 text-foreground">No Tasks Available</h3>
                <p className="text-lg">Your onboarding tasks will appear here once they are assigned by your manager.</p>
              </div>
            )}
          </CardContent>
        </Card>

        <OnboardingChatbot 
          isOpen={showChatbot}
          onClose={() => setShowChatbot(false)}
          onComplete={handleChatbotComplete}
        />
      </div>
    </div>
  );
};