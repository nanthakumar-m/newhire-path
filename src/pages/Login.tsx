import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Users, Lock, LogIn } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!employeeId || !password) {
      toast({
        title: 'Error',
        description: 'Please enter both Employee ID and password',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);
    const success = login(employeeId, password);
    
    if (!success) {
      toast({
        title: 'Login Failed',
        description: 'Invalid credentials. Please check your Employee ID and password.',
        variant: 'destructive'
      });
    } else {
      toast({
        title: 'Welcome!',
        description: 'Login successful. Redirecting to dashboard...'
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-0 bg-card/95 backdrop-blur-sm">
        <CardHeader className="text-center space-y-6 pb-8">
          <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-primary to-primary-dark mx-auto flex items-center justify-center shadow-lg">
            <Users className="h-10 w-10 text-primary-foreground" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
              NewHire Path
            </CardTitle>
            <p className="text-muted-foreground text-lg">Employee Onboarding Platform</p>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="employee-id" className="text-sm font-semibold flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Employee ID
                </Label>
                <Input
                  id="employee-id"
                  type="text"
                  placeholder="Enter your Employee ID (e.g., 12345 for Manager)"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  className="h-12 text-center font-mono text-lg tracking-wider"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-semibold flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 text-center font-mono text-lg tracking-wider"
                />
              </div>
            </div>

            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-sm space-y-2">
              <div className="font-semibold text-primary">Login Credentials:</div>
              <div className="space-y-1 text-muted-foreground">
                <div>• <span className="font-medium">Manager:</span> ID: 12345, Password: manager</div>
                <div>• <span className="font-medium">Employee:</span> ID: {'{Employee ID}'}, Password: {'{Same as Employee ID}'}</div>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary transition-all duration-300 shadow-lg hover:shadow-xl" 
              disabled={isLoading}
            >
              <LogIn className="h-5 w-5 mr-2" />
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;