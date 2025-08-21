import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, CheckCircle, Clock, User, Award, Trophy } from 'lucide-react';
import { TaskCard } from '@/components/TaskCard';
import { OnboardingChatbot } from '@/components/OnboardingChatbot';
import { Leaderboard } from '@/components/Leaderboard';
import { useAuth } from '@/contexts/AuthContext';
import { Employee } from '@/types/auth';

export const EmployeeDashboard = () => {
  const { user } = useAuth();
  const currentEmployee = user as Employee;
  const [showChatbot, setShowChatbot] = useState(false);

  useEffect(() => {
    // Show chatbot if mandatory tasks are not completed
    if (currentEmployee && !currentEmployee.mandatoryTasksCompleted) {
      setShowChatbot(true);
    }
  }, [currentEmployee]);

  const handleToggleComplete = (taskId: number) => {
    const employees = JSON.parse(localStorage.getItem('employees') || '[]');
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    const task = tasks.find((t: any) => t.id === taskId);
    const taskPoints = task?.points || 10;
    
    const updatedEmployees = employees.map((emp: Employee) => {
      if (emp.id === currentEmployee.id) {
        const isCompleting = !emp.completedTasks.includes(taskId);
        const updatedTasks = isCompleting
          ? [...emp.completedTasks, taskId]
          : emp.completedTasks.filter(id => id !== taskId);
        
        const currentPoints = emp.points || 0;
        const updatedPoints = isCompleting 
          ? currentPoints + taskPoints 
          : Math.max(0, currentPoints - taskPoints);
          
        return { ...emp, completedTasks: updatedTasks, points: updatedPoints };
      }
      return emp;
    });

    localStorage.setItem('employees', JSON.stringify(updatedEmployees));
    window.dispatchEvent(new Event('storage'));
  };

  const handleChatbotComplete = () => {
    setShowChatbot(false);
    // Force a re-render to show the full dashboard
    window.location.reload();
  };

  const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
  const employees = JSON.parse(localStorage.getItem('employees') || '[]');
  const completedCount = currentEmployee?.completedTasks?.length || 0;
  const totalTasks = tasks.length;
  const progress = totalTasks > 0 ? (completedCount / totalTasks) * 100 : 0;
  const currentPoints = currentEmployee?.points || 0;

  const getTasksWithLockStatus = () => {
    return tasks.map((task: any, index: number) => {
      const requiredPoints = index * 10; // Each task requires 10 more points than the previous
      const isLocked = currentPoints < requiredPoints && !currentEmployee?.completedTasks?.includes(task.id);
      return {
        ...task,
        isLocked,
        requiredPoints,
        points: task.points || 10
      };
    });
  };

  const tasksWithLockStatus = getTasksWithLockStatus();

  // Show simplified view if mandatory tasks not completed
  if (!currentEmployee?.mandatoryTasksCompleted) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md text-center">
          <CardContent className="p-8 space-y-4">
            <div className="h-16 w-16 rounded-full bg-primary mx-auto flex items-center justify-center">
              <Clock className="h-8 w-8 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-semibold">Almost There!</h3>
            <p className="text-muted-foreground">
              Please complete the mandatory setup tasks first to access your full dashboard.
            </p>
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
    <div className="container mx-auto p-6">
      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          {/* Welcome Section */}
          <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-primary mb-2">
                    Welcome back, {currentEmployee?.name}!
                  </h1>
                  <p className="text-muted-foreground">
                    Employee ID: {currentEmployee?.employeeId} • Department: {currentEmployee?.department}
                  </p>
                </div>
                <div className="text-right">
                  <Badge variant="outline" className="mb-2">
                    <User className="h-3 w-3 mr-1" />
                    Employee
                  </Badge>
                  <div className="flex items-center gap-2 text-sm">
                    <Award className="h-4 w-4 text-yellow-500" />
                    <span className="font-semibold">{currentPoints} points</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Progress Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                Progress Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Tasks Completed</span>
                  <span className="text-sm text-muted-foreground">{completedCount}/{totalTasks}</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
              <div className="flex gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span>{completedCount} Completed</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-warning" />
                  <span>{totalTasks - completedCount} Pending</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-yellow-500" />
                  <span>{currentPoints} Points</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tasks Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Your Tasks
              </CardTitle>
            </CardHeader>
            <CardContent>
              {tasksWithLockStatus.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {tasksWithLockStatus.map((task: any) => (
                    <TaskCard
                      key={task.id}
                      id={task.id}
                      title={task.name}
                      description={`Complete this task by the deadline to earn ${task.points} points.`}
                      deadline={task.deadline}
                      isCompleted={currentEmployee?.completedTasks?.includes(task.id) || false}
                      onToggleComplete={handleToggleComplete}
                      points={task.points}
                      isLocked={task.isLocked}
                      requiredPoints={task.requiredPoints}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No tasks assigned yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leaderboard">
          <Leaderboard employees={employees} />
        </TabsContent>
      </Tabs>

      <OnboardingChatbot 
        isOpen={showChatbot}
        onClose={() => setShowChatbot(false)}
        onComplete={handleChatbotComplete}
      />
    </div>
  );
};