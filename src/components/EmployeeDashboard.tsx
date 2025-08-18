import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileUploadTask } from "@/components/FileUploadTask";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, Star } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Employee } from "@/types/auth";

const onboardingTasks = [
  {
    id: 1,
    title: "Complete Mandatory Safety Course",
    description: "Complete the workplace safety and emergency procedures course",
    priority: "high" as const,
    estimatedTime: "45 min",
    requiresUpload: true,
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
    description: "Complete cybersecurity awareness and compliance training",
    priority: "high" as const,
    estimatedTime: "35 min",
    requiresUpload: true,
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

  useEffect(() => {
    if (currentEmployee?.completedTasks) {
      setCompletedTasks(new Set(currentEmployee.completedTasks));
    }
  }, [currentEmployee]);

  const toggleTaskCompletion = (taskId: number) => {
    const newCompleted = new Set(completedTasks);
    const task = onboardingTasks.find(t => t.id === taskId);
    
    // Don't allow manual completion for upload-required tasks
    if (task?.requiresUpload) return;

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

  const completionPercentage = Math.round((completedTasks.size / onboardingTasks.length) * 100);
  const remainingTasks = onboardingTasks.length - completedTasks.size;

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <Card className="border-primary-lighter bg-gradient-to-r from-primary-lighter to-accent">
        <CardContent className="p-8">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center">
              <Star className="h-8 w-8 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Welcome {currentEmployee.name}! 🎉
              </h2>
              <p className="text-foreground/80 text-lg mb-4">
                We're excited to have you on board! Here are the tasks you need to complete during your first week.
              </p>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span className="font-semibold text-foreground">
                    {completedTasks.size} of {onboardingTasks.length} completed
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-warning" />
                  <span className="font-semibold text-foreground">
                    {remainingTasks} tasks remaining
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Your Onboarding Progress</span>
            <Badge variant={completionPercentage === 100 ? "default" : "secondary"} className="text-lg px-3 py-1">
              {completionPercentage}%
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={completionPercentage} className="h-3" />
          <p className="text-sm text-muted-foreground mt-2">
            {completionPercentage === 100 
              ? "🎉 Congratulations! You've completed all onboarding tasks!" 
              : `Keep going! You're doing great.`
            }
          </p>
        </CardContent>
      </Card>

      {/* Task Grid */}
      <div>
        <h3 className="text-xl font-semibold mb-6">Onboarding Tasks</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {onboardingTasks.map((task) => (
            <FileUploadTask
              key={task.id}
              task={task}
              isCompleted={completedTasks.has(task.id)}
              onToggleComplete={() => toggleTaskCompletion(task.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};