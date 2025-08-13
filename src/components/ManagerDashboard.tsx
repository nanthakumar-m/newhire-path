import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmployeeTable } from "./EmployeeTable";
import { useState } from "react";
import { 
  Users, 
  UserCheck, 
  Clock, 
  BookOpen, 
  Shield, 
  Laptop, 
  MessageSquare,
  Building,
  Heart,
  Code,
  TrendingUp,
  AlertCircle,
  ArrowLeft
} from "lucide-react";

const employeeStats = {
  total: 24,
  onboarded: 18,
  inProgress: 4,
  notStarted: 2,
};

const taskStats = [
  {
    id: 1,
    title: "Safety Course",
    icon: Shield,
    completed: 20,
    total: 24,
    priority: "high" as const,
  },
  {
    id: 2,
    title: "IT Access Setup",
    icon: Laptop,
    completed: 22,
    total: 24,
    priority: "high" as const,
  },
  {
    id: 3,
    title: "Manager Meetings",
    icon: MessageSquare,
    completed: 18,
    total: 24,
    priority: "high" as const,
  },
  {
    id: 4,
    title: "HR Documentation",
    icon: Users,
    completed: 24,
    total: 24,
    priority: "high" as const,
  },
  {
    id: 5,
    title: "Team Introductions",
    icon: Building,
    completed: 16,
    total: 24,
    priority: "medium" as const,
  },
  {
    id: 6,
    title: "Culture Overview",
    icon: Heart,
    completed: 19,
    total: 24,
    priority: "medium" as const,
  },
  {
    id: 7,
    title: "Security Training",
    icon: Shield,
    completed: 21,
    total: 24,
    priority: "high" as const,
  },
  {
    id: 8,
    title: "Office Tour",
    icon: Building,
    completed: 15,
    total: 24,
    priority: "low" as const,
  },
  {
    id: 9,
    title: "Benefits Session",
    icon: Heart,
    completed: 17,
    total: 24,
    priority: "medium" as const,
  },
  {
    id: 10,
    title: "Dev Environment",
    icon: Code,
    completed: 14,
    total: 24,
    priority: "high" as const,
  },
];

const recentActivity = [
  { employee: "Sarah Johnson", task: "Completed Safety Course", time: "2 hours ago", type: "completed" },
  { employee: "Mike Chen", task: "Started IT Access Setup", time: "3 hours ago", type: "started" },
  { employee: "Emma Davis", task: "Scheduled Manager Meeting", time: "5 hours ago", type: "scheduled" },
  { employee: "Alex Rodriguez", task: "Completed HR Documentation", time: "1 day ago", type: "completed" },
];

export const ManagerDashboard = () => {
  const [selectedTask, setSelectedTask] = useState<{ id: number; title: string } | null>(null);
  
  const overallCompletion = Math.round(
    (taskStats.reduce((sum, task) => sum + task.completed, 0) / 
     (taskStats.length * employeeStats.total)) * 100
  );

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-destructive";
      case "medium": return "text-warning";
      case "low": return "text-muted-foreground";
      default: return "text-muted-foreground";
    }
  };

  const getPriorityBg = (priority: string) => {
    switch (priority) {
      case "high": return "bg-destructive/10 border-destructive/20";
      case "medium": return "bg-warning/10 border-warning/20";
      case "low": return "bg-muted/50 border-border";
      default: return "bg-muted/50 border-border";
    }
  };

  if (selectedTask) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => setSelectedTask(null)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          <h2 className="text-2xl font-bold">Task Details</h2>
        </div>
        <EmployeeTable taskTitle={selectedTask.title} taskId={selectedTask.id} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{employeeStats.total}</div>
            <p className="text-xs text-muted-foreground">Active in onboarding</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fully Onboarded</CardTitle>
            <UserCheck className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{employeeStats.onboarded}</div>
            <p className="text-xs text-muted-foreground">Completed all tasks</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{employeeStats.inProgress}</div>
            <p className="text-xs text-muted-foreground">Active onboarding</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Not Started</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{employeeStats.notStarted}</div>
            <p className="text-xs text-muted-foreground">Needs attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Overall Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Overall Onboarding Progress</span>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-success" />
              <Badge variant="secondary" className="text-lg px-3 py-1">
                {overallCompletion}%
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={overallCompletion} className="h-3 mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-success"></div>
              <span>Completed: {employeeStats.onboarded} employees</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-warning"></div>
              <span>In Progress: {employeeStats.inProgress} employees</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-destructive"></div>
              <span>Not Started: {employeeStats.notStarted} employees</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Task Completion Grid */}
      <div>
        <h3 className="text-xl font-semibold mb-6">Task Completion Overview</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {taskStats.map((task) => {
            const IconComponent = task.icon;
            const completionRate = Math.round((task.completed / task.total) * 100);
            
            return (
              <Card 
                key={task.id} 
                className={`${getPriorityBg(task.priority)} cursor-pointer hover:shadow-md transition-all duration-200`}
                onClick={() => setSelectedTask({ id: task.id, title: task.title })}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <IconComponent className={`h-4 w-4 ${getPriorityColor(task.priority)}`} />
                    {task.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-semibold">{completionRate}%</span>
                    </div>
                    <Progress value={completionRate} className="h-2" />
                    <div className="text-xs text-muted-foreground">
                      {task.completed} of {task.total} completed
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center gap-4 p-3 rounded-lg bg-muted/30">
                <div className={`w-2 h-2 rounded-full ${
                  activity.type === 'completed' ? 'bg-success' :
                  activity.type === 'started' ? 'bg-warning' : 'bg-primary'
                }`} />
                <div className="flex-1">
                  <p className="font-medium text-sm">{activity.employee}</p>
                  <p className="text-sm text-muted-foreground">{activity.task}</p>
                </div>
                <span className="text-xs text-muted-foreground">{activity.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};