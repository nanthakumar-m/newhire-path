import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CheckCircle, Clock, AlertCircle, Star } from "lucide-react";
import { useState } from "react";

interface TaskProps {
  task: {
    id: number;
    title: string;
    description: string;
    priority: "high" | "medium" | "low";
    estimatedTime: string;
    isCustom?: boolean;
    deadline?: string;
  };
  isCompleted: boolean;
  onToggleComplete: () => void;
}

export const TaskCard = ({ task, isCompleted, onToggleComplete }: TaskProps) => {
  const [showDialog, setShowDialog] = useState(false);

  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case "high":
        return {
          color: "text-destructive",
          bg: "bg-destructive/10 border-destructive/20 hover:bg-destructive/15",
          badge: "bg-destructive/15 text-destructive border-destructive/30"
        };
      case "medium":
        return {
          color: "text-warning",
          bg: "bg-warning/10 border-warning/20 hover:bg-warning/15",
          badge: "bg-warning/15 text-warning border-warning/30"
        };
      case "low":
        return {
          color: "text-muted-foreground",
          bg: "bg-muted/20 border-border hover:bg-muted/30",
          badge: "bg-muted/30 text-muted-foreground border-border"
        };
      default:
        return {
          color: "text-muted-foreground",
          bg: "bg-muted/20 border-border hover:bg-muted/30",
          badge: "bg-muted/30 text-muted-foreground border-border"
        };
    }
  };

  const priorityConfig = getPriorityConfig(task.priority);

  const handleMarkComplete = () => {
    onToggleComplete();
    setShowDialog(false);
  };

  return (
    <Card className={`group transition-all duration-300 hover:shadow-lg hover:scale-[1.02] ${
      isCompleted 
        ? "bg-success/5 border-success/30 hover:bg-success/10" 
        : `${priorityConfig.bg} hover:shadow-md`
    }`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 space-y-2">
            <CardTitle className={`text-sm font-semibold leading-tight transition-colors ${
              isCompleted ? "text-success" : "text-foreground group-hover:text-primary"
            }`}>
              {task.title}
            </CardTitle>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge 
                variant="outline"
                className={`text-xs font-medium flex items-center gap-1 ${priorityConfig.badge}`}
              >
                {task.priority === "high" && <Star className="h-3 w-3" />}
                {task.priority === "medium" && <AlertCircle className="h-3 w-3" />}
                {task.priority === "low" && <Clock className="h-3 w-3" />}
                {task.priority.toUpperCase()}
              </Badge>
              {isCompleted && (
                <Badge className="bg-success/20 text-success border-success/30 text-xs">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Completed
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 space-y-4">
        <p className={`text-sm leading-relaxed ${
          isCompleted ? "text-success/80" : "text-muted-foreground"
        }`}>
          {task.description}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span className="font-medium">~{task.estimatedTime}</span>
            </div>
            {task.isCustom && (
              <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
                Manager Task
              </Badge>
            )}
          </div>

          <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <DialogTrigger asChild>
              <Button 
                size="sm"
                variant={isCompleted ? "outline" : "default"}
                className={`text-xs font-semibold transition-all duration-200 ${
                  isCompleted 
                    ? "hover:bg-success/10 hover:text-success hover:border-success/30" 
                    : "hover:scale-105 shadow-sm hover:shadow-md"
                }`}
              >
                {isCompleted ? 'Completed' : 'Mark as Complete'}
              </Button>
            </DialogTrigger>
            
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  Mark Task as Complete
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <h4 className="font-semibold text-primary mb-2">{task.title}</h4>
                  <p className="text-sm text-muted-foreground mb-3">{task.description}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>Estimated time: {task.estimatedTime}</span>
                  </div>
                </div>
                
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-sm text-muted-foreground">
                    Are you sure you want to mark this task as complete? This will update your progress tracking.
                  </p>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button 
                    onClick={handleMarkComplete}
                    className="flex-1 bg-success hover:bg-success/90"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Yes, Mark Complete
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowDialog(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
};