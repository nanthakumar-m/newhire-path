import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, CheckCircle, Clock, ArrowRight, Lock, Star } from 'lucide-react';

interface TaskCardProps {
  id: number;
  title: string;
  description: string;
  deadline: string;
  isCompleted: boolean;
  onToggleComplete: (id: number) => void;
  points?: number;
  isLocked?: boolean;
  requiredPoints?: number;
}

export const TaskCard = ({ id, title, description, deadline, isCompleted, onToggleComplete, points = 10, isLocked = false, requiredPoints = 0 }: TaskCardProps) => {
  const handleMarkComplete = () => {
    onToggleComplete(id);
  };

  return (
    <Card className={`hover:shadow-lg transition-all duration-200 border-l-4 ${
      isLocked ? 'border-l-muted bg-muted/30 opacity-60' : 
      isCompleted ? 'border-l-success/50 bg-success/5' : 'border-l-primary/20'
    }`}>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <h3 className={`font-semibold text-lg ${isLocked ? 'text-muted-foreground' : 'text-primary'}`}>
                  {title}
                </h3>
                {isLocked && <Lock className="h-4 w-4 text-muted-foreground" />}
              </div>
              <p className={`text-sm leading-relaxed ${isLocked ? 'text-muted-foreground' : 'text-muted-foreground'}`}>
                {description}
              </p>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Due: {deadline}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="text-muted-foreground">{points} points</span>
                </div>
              </div>
              {isLocked && (
                <p className="text-xs text-warning">
                  Requires {requiredPoints} points to unlock
                </p>
              )}
            </div>
            <Badge 
              variant={isCompleted ? "default" : isLocked ? "outline" : "secondary"} 
              className={`ml-4 ${
                isCompleted ? 'bg-success text-success-foreground' : 
                isLocked ? 'text-muted-foreground' : ''
              }`}
            >
              {isCompleted ? (
                <><CheckCircle className="h-3 w-3 mr-1" /> Completed</>
              ) : isLocked ? (
                <><Lock className="h-3 w-3 mr-1" /> Locked</>
              ) : (
                <><Calendar className="h-3 w-3 mr-1" /> Pending</>
              )}
            </Badge>
          </div>
          
          {!isCompleted && !isLocked && (
            <Button 
              onClick={handleMarkComplete} 
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Mark as Complete
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};