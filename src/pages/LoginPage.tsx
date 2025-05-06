
import { useState, FormEvent } from 'react';
import { Navigate, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Separator } from '@/components/ui/separator';

export default function LoginPage() {
  const { login, user, setCustomerRole, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // If user is already logged in, redirect to chat page
  if (user) {
    return <Navigate to="/chat" replace />;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      navigate('/chat');
    }
  };

  const handleCustomerAccess = () => {
    setCustomerRole();
    navigate('/chat');
  };

  // For demo purposes, pre-fill credentials
  const fillEmployeeCredentials = () => {
    setEmail('employee@botllm.com');
    setPassword('employee123');
  };

  const fillAdminCredentials = () => {
    setEmail('admin@botllm.com');
    setPassword('admin123');
  };

  return (
    <div className="flex min-h-screen bg-background items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground text-2xl font-bold">B</span>
          </div>
          <h1 className="mt-4 text-3xl font-extrabold">BotLLM</h1>
          <p className="mt-2 text-muted-foreground">
            Advanced AI chatbot for customer support and employee assistance
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>
              Enter your credentials or continue as a customer
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Logging in...' : 'Log in'}
              </Button>
            </form>

            {/* Demo account buttons */}
            <div className="mt-4 space-y-2 border-t pt-4">
              <p className="text-xs text-center text-muted-foreground">For demo purposes:</p>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" onClick={fillEmployeeCredentials}>
                  Use Employee Account
                </Button>
                <Button variant="outline" size="sm" onClick={fillAdminCredentials}>
                  Use Admin Account
                </Button>
              </div>
            </div>
            
            <Separator className="my-4" />
            
            <div className="text-center">
              <p className="text-sm">
                Don't have an account?{" "}
                <Link to="/signup" className="text-primary hover:underline">
                  Sign up
                </Link>
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              variant="ghost"
              className="w-full"
              onClick={handleCustomerAccess}
            >
              Continue as Customer
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
