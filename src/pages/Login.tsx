import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, UserCheck, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState<'manager' | 'employee'>('employee');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      toast({
        title: 'Error',
        description: 'Please enter both username and password',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);
    const success = login(username, password, userType);
    
    if (!success) {
      toast({
        title: 'Login Failed',
        description: userType === 'manager' 
          ? 'Invalid manager credentials' 
          : 'Invalid employee name or employee not found',
        variant: 'destructive'
      });
    } else {
      toast({
        title: 'Success',
        description: `Welcome ${userType === 'manager' ? 'Manager' : username}!`
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center space-y-4">
          <div className="h-16 w-16 rounded-full bg-primary mx-auto flex items-center justify-center">
            <Users className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">NewHire Path</CardTitle>
            <p className="text-muted-foreground mt-2">Employee Onboarding Platform</p>
          </div>
        </CardHeader>
        
        <CardContent>
          <Tabs value={userType} onValueChange={(value) => setUserType(value as 'manager' | 'employee')}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="employee" className="flex items-center gap-2">
                <UserCheck className="h-4 w-4" />
                Employee
              </TabsTrigger>
              <TabsTrigger value="manager" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Manager
              </TabsTrigger>
            </TabsList>

            <form onSubmit={handleLogin} className="space-y-4">
              <TabsContent value="employee" className="space-y-4 mt-0">
                <div className="space-y-2">
                  <Label htmlFor="emp-username">Employee Name</Label>
                  <Input
                    id="emp-username"
                    type="text"
                    placeholder="Enter your full name"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emp-password">Password</Label>
                  <Input
                    id="emp-password"
                    type="password"
                    placeholder="Enter your name as password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="bg-muted/50 rounded-lg p-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    Your password is the same as your name
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="manager" className="space-y-4 mt-0">
                <div className="space-y-2">
                  <Label htmlFor="mgr-username">Username</Label>
                  <Input
                    id="mgr-username"
                    type="text"
                    placeholder="manager"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mgr-password">Password</Label>
                  <Input
                    id="mgr-password"
                    type="password"
                    placeholder="manager"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="bg-muted/50 rounded-lg p-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    Demo: username and password are both "manager"
                  </div>
                </div>
              </TabsContent>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : `Sign in as ${userType === 'manager' ? 'Manager' : 'Employee'}`}
              </Button>
            </form>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;