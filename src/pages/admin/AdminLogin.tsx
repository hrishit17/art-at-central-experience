import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await signIn(email, password);
    if (error) {
      toast({ title: "Login failed", description: error.message, variant: "destructive" });
      setLoading(false);
      return;
    }

    toast({ title: "Welcome back" });
    navigate("/admin");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4" style={{ cursor: 'default' }}>
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center space-y-2">
          <h1 className="editorial-heading text-3xl text-foreground">Art at Central</h1>
          <p className="text-sm text-muted-foreground">Admin Dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-xs uppercase tracking-wider text-muted-foreground">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border-border"
              placeholder="admin@artatcentral.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-xs uppercase tracking-wider text-muted-foreground">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="border-border"
              placeholder="••••••••"
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <Loader2 className="animate-spin mr-2" size={16} /> : null}
            Sign In
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
