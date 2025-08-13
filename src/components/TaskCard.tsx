import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Clock, AlertCircle, CheckCircle } from "lucide-react";

interface Task {
  id: number;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  estimatedTime: string;
}

interface TaskCardProps {
  task: Task;
  isCompleted: boolean;
  onToggleComplete: () => void;
}

export const TaskCard = ({ task, isCompleted, onToggleComplete }: TaskCardProps) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "destructive";
      case "medium": return "secondary";
      case "low": return "outline";
      default: return "secondary";
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high": return <AlertCircle className="h-3 w-3" />;
      case "medium": return <Clock className="h-3 w-3" />;
      case "low": return <CheckCircle className="h-3 w-3" />;
      default: return <Clock className="h-3 w-3" />;
    }
  };

  return (
    <Card className={`transition-all duration-200 hover:shadow-md ${
      isCompleted 
        ? "bg-success/5 border-success/30" 
        : "hover:border-primary/30"
    }`}>
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <Checkbox
            checked={isCompleted}
            onCheckedChange={onToggleComplete}
            className="mt-1"
          />
          <div className="flex-1 space-y-2">
            <CardTitle className={`text-sm leading-snug ${
              isCompleted ? "text-muted-foreground line-through" : ""
            }`}>
              {task.title}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge 
                variant={getPriorityColor(task.priority)} 
                className="text-xs flex items-center gap-1"
              >
                {getPriorityIcon(task.priority)}
                {task.priority}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className={`text-sm mb-3 ${
          isCompleted ? "text-muted-foreground line-through" : "text-foreground/80"
        }`}>
          {task.description}
        </p>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span>~{task.estimatedTime}</span>
        </div>
      </CardContent>
    </Card>
  );
};