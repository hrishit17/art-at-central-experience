import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const AdminSettings = () => {
  const { user } = useAuth();
  const [newEmail, setNewEmail] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  const [enquiryEmail, setEnquiryEmail] = useState("");
  const [enquiryLoading, setEnquiryLoading] = useState(false);
  const [settingsId, setSettingsId] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data, error } = await supabase
          .from("site_settings")
          .select("id, enquiry_receiving_email")
          .order("created_at", { ascending: false }) // Ensures we always get the newest row
          .limit(1)
          .maybeSingle(); // Prevents crashing if the table is completely empty

        if (error) throw error;
        if (data) {
          setEnquiryEmail(data.enquiry_receiving_email);
          setSettingsId(data.id);
        }
      } catch (err: any) {
        toast({ title: "Failed to load settings", description: err.message, variant: "destructive" });
      }
    };
    fetchSettings();
  }, []);

  const handleEmailUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim()) return;
    setEmailLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ email: newEmail });
      if (error) throw error;
      toast({ title: "Email update requested", description: "Check your new email for a confirmation link." });
      setNewEmail("");
    } catch (err: any) {
      toast({ title: "Update failed", description: err.message, variant: "destructive" });
    } finally {
      setEmailLoading(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast({ title: "Passwords don't match", description: "Please ensure both fields are identical.", variant: "destructive" });
      return;
    }
    if (newPassword.length < 6) {
      toast({ title: "Password too short", description: "Minimum 6 characters required.", variant: "destructive" });
      return;
    }
    setPasswordLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      toast({ title: "Credentials updated", description: "Your password has been changed successfully." });
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      toast({ title: "Update failed", description: err.message, variant: "destructive" });
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleEnquiryEmailUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enquiryEmail.trim()) return;
    setEnquiryLoading(true);
    
    try {
      if (settingsId) {
        // Update existing row
        const { error } = await supabase
          .from("site_settings")
          .update({ enquiry_receiving_email: enquiryEmail })
          .eq("id", settingsId);
        if (error) throw error;
      } else {
        // Fallback: Insert a new row if the table was empty
        const { data, error } = await supabase
          .from("site_settings")
          .insert({ enquiry_receiving_email: enquiryEmail })
          .select("id")
          .single();
        if (error) throw error;
        if (data) {
          setSettingsId(data.id);
        }
      }
      
      toast({ title: "Enquiry email updated", description: `All enquiries will now be sent to ${enquiryEmail}.` });
    } catch (err: any) {
      toast({ title: "Update failed", description: err.message, variant: "destructive" });
    } finally {
      setEnquiryLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your admin credentials & site configuration</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Change Email</CardTitle>
            <CardDescription>Current: {user?.email}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleEmailUpdate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-email" className="text-xs uppercase tracking-wider text-muted-foreground">New Email</Label>
                <Input id="new-email" type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} required placeholder="new@email.com" />
              </div>
              <Button type="submit" className="w-full" disabled={emailLoading}>
                {emailLoading ? <Loader2 className="animate-spin mr-2" size={16} /> : null}
                Update Email
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Change Password</CardTitle>
            <CardDescription>Set a new secure password</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordUpdate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-password" className="text-xs uppercase tracking-wider text-muted-foreground">New Password</Label>
                <Input id="new-password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required placeholder="••••••••" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="text-xs uppercase tracking-wider text-muted-foreground">Confirm Password</Label>
                <Input id="confirm-password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required placeholder="••••••••" />
              </div>
              <Button type="submit" className="w-full" disabled={passwordLoading}>
                {passwordLoading ? <Loader2 className="animate-spin mr-2" size={16} /> : null}
                Update Password
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Contact Form Configuration</CardTitle>
          <CardDescription>Set the email address that receives all general enquiries from the website</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleEnquiryEmailUpdate} className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 space-y-2">
              <Label htmlFor="enquiry-email" className="text-xs uppercase tracking-wider text-muted-foreground">Enquiry Receiving Email</Label>
              <Input id="enquiry-email" type="email" value={enquiryEmail} onChange={(e) => setEnquiryEmail(e.target.value)} required placeholder="info@artatcentral.com" />
            </div>
            <Button type="submit" className="sm:self-end" disabled={enquiryLoading}>
              {enquiryLoading ? <Loader2 className="animate-spin mr-2" size={16} /> : null}
              Save
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSettings;
