import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmployeeTable } from "./EmployeeTable";
import { AddEmployeeForm } from "./AddEmployeeForm";
import { EmployeeListTable } from "./EmployeeListTable";
import { TaskAssignmentForm } from "./TaskAssignmentForm";
import { useState, useEffect } from "react";
import { Employee } from "@/types/auth";
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
  ArrowLeft,
  FileText
} from "lucide-react";
import { GenCTicketTracking } from "./GenCTicketTracking";

// This will be calculated from localStorage

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
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showTicketTracking, setShowTicketTracking] = useState(false);
  const [employeeStats, setEmployeeStats] = useState({
    total: 0,
    onboarded: 0,
    inProgress: 0,
    notStarted: 0,
  });

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = () => {
    const storedEmployees = JSON.parse(localStorage.getItem('employees') || '[]');
    setEmployees(storedEmployees);
    
    // Calculate stats
    const total = storedEmployees.length;
    const onboarded = storedEmployees.filter((emp: Employee) => emp.completedTasks.length === 10).length;
    const inProgress = storedEmployees.filter((emp: Employee) => emp.completedTasks.length > 0 && emp.completedTasks.length < 10).length;
    const notStarted = storedEmployees.filter((emp: Employee) => emp.completedTasks.length === 0).length;

    setEmployeeStats({ total, onboarded, inProgress, notStarted });
  };

  // Update task stats based on real employee data
  const getUpdatedTaskStats = () => {
    return taskStats.map(task => ({
      ...task,
      completed: employees.filter(emp => emp.completedTasks.includes(task.id)).length,
      total: employees.length
    }));
  };

  const updatedTaskStats = getUpdatedTaskStats();
  const overallCompletion = employees.length > 0 ? Math.round(
    (updatedTaskStats.reduce((sum, task) => sum + task.completed, 0) / 
     (updatedTaskStats.length * employees.length)) * 100
  ) : 0;

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

  if (showTicketTracking) {
    return <GenCTicketTracking onBack={() => setShowTicketTracking(false)} />;
  }

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
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-foreground">{employeeStats.total}</div>
                <p className="text-xs text-muted-foreground">Active in onboarding</p>
              </div>
              <EmployeeListTable 
                title="All Employees" 
                employees={employees} 
                type="total" 
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fully Onboarded</CardTitle>
            <UserCheck className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-success">{employeeStats.onboarded}</div>
                <p className="text-xs text-muted-foreground">Completed all tasks</p>
              </div>
              <EmployeeListTable 
                title="Fully Onboarded Employees" 
                employees={employees.filter(emp => emp.completedTasks.length === 10)} 
                type="onboarded" 
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-warning">{employeeStats.inProgress}</div>
                <p className="text-xs text-muted-foreground">Active onboarding</p>
              </div>
              <EmployeeListTable 
                title="In Progress Employees" 
                employees={employees.filter(emp => emp.completedTasks.length > 0 && emp.completedTasks.length < 10)} 
                type="in-progress" 
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Not Started</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-destructive">{employeeStats.notStarted}</div>
                <p className="text-xs text-muted-foreground">Needs attention</p>
              </div>
              <EmployeeListTable 
                title="Not Started Employees" 
                employees={employees.filter(emp => emp.completedTasks.length === 0)} 
                type="not-started" 
              />
            </div>
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

      {/* Add Employee Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Employee Management</CardTitle>
            <div className="flex gap-2">
              <Button 
                variant="outline"
                onClick={() => setShowTaskForm(true)}
                className="flex items-center gap-2"
              >
                <BookOpen className="h-4 w-4" />
                Assign New Task
              </Button>
              <AddEmployeeForm onEmployeeAdded={loadEmployees} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Add new employees to the onboarding system and assign custom tasks to all employees.
          </p>
        </CardContent>
      </Card>

      {/* GenC Ticket Tracking */}
      <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer" onClick={() => setShowTicketTracking(true)}>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-secondary/10 flex items-center justify-center">
              <FileText className="h-5 w-5 text-secondary-foreground" />
            </div>
            GenC Ticket Tracking
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Monitor and track all GenC employee ticket submissions and their incident reports.
          </p>
          <Button variant="secondary" onClick={() => setShowTicketTracking(true)}>
            <FileText className="h-4 w-4 mr-2" />
            View All Tickets
          </Button>
        </CardContent>
      </Card>

      {/* Task Completion Grid */}
      <div>
        <h3 className="text-xl font-semibold mb-6">Task Completion Overview</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {updatedTaskStats.map((task) => {
            const IconComponent = task.icon;
            const completionRate = employees.length > 0 ? Math.round((task.completed / task.total) * 100) : 0;
            
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

      <TaskAssignmentForm 
        isOpen={showTaskForm}
        onClose={() => setShowTaskForm(false)}
        onTaskAssigned={loadEmployees}
      />
    </div>
  );
};