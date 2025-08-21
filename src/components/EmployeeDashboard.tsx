import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TaskCard } from "@/components/TaskCard";
import { OnboardingChatbot } from "@/components/OnboardingChatbot";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, Star, Award, TrendingUp } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Employee } from "@/types/auth";

const onboardingTasks = [
  {
    id: 1,
    title: "Complete Mandatory Safety Course",
    description: "Complete the workplace safety and emergency procedures course. Essential for all new employees.",
    priority: "high" as const,
    estimatedTime: "45 min",
  },
  {
    id: 2,
    title: "Get IT Access & Equipment Setup",
    description: "Collect laptop, phone, and get access to company systems",
    priority: "high" as const,
    estimatedTime: "30 min",
  },
  {
    id: 3,
    title: "Connect with Direct Manager",
    description: "Schedule and attend your first one-on-one meeting",
    priority: "high" as const,
    estimatedTime: "60 min",
  },
  {
    id: 4,
    title: "Complete HR Documentation",
    description: "Fill out tax forms, benefits enrollment, and emergency contacts",
    priority: "high" as const,
    estimatedTime: "20 min",
  },
  {
    id: 5,
    title: "Team Introduction Meeting",
    description: "Meet your team members and learn about ongoing projects",
    priority: "medium" as const,
    estimatedTime: "45 min",
  },
  {
    id: 6,
    title: "Company Culture Overview",
    description: "Learn about company values, mission, and culture",
    priority: "medium" as const,
    estimatedTime: "30 min",
  },
  {
    id: 7,
    title: "Security & Compliance Training",
    description: "Complete cybersecurity awareness and compliance training modules",
    priority: "high" as const,
    estimatedTime: "35 min",
  },
  {
    id: 8,
    title: "Office Tour & Facilities",
    description: "Get familiar with office layout, amenities, and facilities",
    priority: "low" as const,
    estimatedTime: "15 min",
  },
  {
    id: 9,
    title: "Benefits Information Session",
    description: "Learn about health insurance, retirement plans, and perks",
    priority: "medium" as const,
    estimatedTime: "40 min",
  },
  {
    id: 10,
    title: "Set Up Development Environment",
    description: "Install and configure necessary software and development tools",
    priority: "high" as const,
    estimatedTime: "90 min",
  },
];

export const EmployeeDashboard = () => {
  const { user } = useAuth();
  const currentEmployee = user as Employee;
  const [completedTasks, setCompletedTasks] = useState<Set<number>>(new Set());
  const [showChatbot, setShowChatbot] = useState(false);
  const [assignedTasks, setAssignedTasks] = useState<any[]>([]);

  useEffect(() => {
    if (currentEmployee?.completedTasks) {
      setCompletedTasks(new Set(currentEmployee.completedTasks));
    }

    // Load assigned tasks from manager
    const storedAssignedTasks = JSON.parse(localStorage.getItem('assignedTasks') || '[]');
    setAssignedTasks(storedAssignedTasks);

    // Show chatbot if mandatory tasks are not completed
    if (currentEmployee && !currentEmployee.mandatoryTasksCompleted) {
      setShowChatbot(true);
    }
  }, [currentEmployee]);

  // Combine default onboarding tasks with assigned tasks
  const allTasks = [
    ...onboardingTasks,
    ...assignedTasks.map(task => ({
      id: task.id,
      title: task.title,
      description: task.description,
      priority: task.priority,
      estimatedTime: task.estimatedTime,
      isCustom: true,
      deadline: task.deadline
    }))
  ];

  const completionPercentage = allTasks.length > 0 ? Math.round((completedTasks.size / allTasks.length) * 100) : 0;
  const remainingTasks = allTasks.length - completedTasks.size;

  const toggleTaskCompletion = (taskId: number) => {
    const newCompleted = new Set(completedTasks);

    if (newCompleted.has(taskId)) {
      newCompleted.delete(taskId);
    } else {
      newCompleted.add(taskId);
    }
    setCompletedTasks(newCompleted);

    // Update localStorage
    const employees = JSON.parse(localStorage.getItem('employees') || '[]');
    const updatedEmployees = employees.map((emp: Employee) => {
      if (emp.id === currentEmployee.id) {
        return { ...emp, completedTasks: Array.from(newCompleted) };
      }
      return emp;
    });
    localStorage.setItem('employees', JSON.stringify(updatedEmployees));

    // Update current user
    const updatedUser = { ...currentEmployee, completedTasks: Array.from(newCompleted) };
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
  };

  const handleChatbotComplete = () => {
    setShowChatbot(false);
    // Refresh the current user data to reflect the updated mandatory tasks status
    const updatedUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (updatedUser.mandatoryTasksCompleted) {
      // Force a re-render by updating the component state
      window.location.reload();
    }
  };

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
    <div className="space-y-8">
      {/* Welcome Section */}
      <Card className="relative overflow-hidden border-0 bg-gradient-to-r from-primary/10 via-primary/5 to-accent/10">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent" />
        <CardContent className="relative p-8">
          <div className="flex items-center gap-6">
            <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-lg">
              <Award className="h-10 w-10 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-foreground mb-3">
                Welcome back, {currentEmployee.name}! 
              </h2>
              <p className="text-foreground/70 text-lg mb-6 leading-relaxed">
                Great job on completing your initial setup! Continue with your onboarding tasks to unlock the full platform experience.
              </p>
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-white/80 dark:bg-black/20 backdrop-blur-sm">
                  <CheckCircle className="h-6 w-6 text-success" />
                  <div>
                    <div className="font-bold text-lg">{completedTasks.size}/{allTasks.length}</div>
                    <div className="text-sm text-muted-foreground">Tasks Completed</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-white/80 dark:bg-black/20 backdrop-blur-sm">
                  <TrendingUp className="h-6 w-6 text-primary" />
                  <div>
                    <div className="font-bold text-lg">{completionPercentage}%</div>
                    <div className="text-sm text-muted-foreground">Progress</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress Overview */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-xl">
            <span className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Your Onboarding Journey
            </span>
            <Badge 
              variant={completionPercentage === 100 ? "default" : "secondary"} 
              className="text-lg px-4 py-2 font-bold"
            >
              {completionPercentage}%
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Progress value={completionPercentage} className="h-4" />
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              {remainingTasks > 0 
                ? `${remainingTasks} tasks remaining` 
                : "All tasks completed! 🎉"
              }
            </span>
            <span className="font-medium">
              {completedTasks.size} of {allTasks.length} completed
            </span>
          </div>
          {completionPercentage === 100 && (
            <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
              <p className="text-success font-medium text-center">
                🎉 Congratulations! You've completed your onboarding journey!
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Professional Task Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-foreground">Learning & Development Tasks</h3>
          <Badge variant="outline" className="text-sm">
            {remainingTasks} Remaining
          </Badge>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {allTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              isCompleted={completedTasks.has(task.id)}
              onToggleComplete={() => toggleTaskCompletion(task.id)}
            />
          ))}
        </div>
      </div>

      <OnboardingChatbot 
        isOpen={showChatbot}
        onClose={() => setShowChatbot(false)}
        onComplete={handleChatbotComplete}
      />
    </div>
  );
};