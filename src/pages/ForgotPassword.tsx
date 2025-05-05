
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Mail, CheckCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { API_ENDPOINTS } from "@/config/api";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    
    if (!email) {
      setError("Please enter your email");
      return;
    }

    try {
      setLoading(true);
      await resetPassword(email);
      setMessage("Password reset email sent! Check your inbox.");
      console.log("Password reset requested for:", email);
    } catch (err: any) {
      setError(err.message || "Failed to reset password");
      console.error("Password reset error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="container max-w-md mx-auto py-10 px-4">
        <Card className="w-full">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Reset Password</CardTitle>
            <CardDescription className="text-center">
              Enter your email to receive a password reset link
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {message && (
              <Alert className="mb-4 border-green-500 text-green-700">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Sending..." : "Reset Password"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col">
            <div className="text-center text-sm text-muted-foreground mt-2">
              <Link to="/login" className="text-primary hover:underline">
                Back to login
              </Link>
            </div>
          </CardFooter>
        </Card>
      </main>
      <Footer />
    </>
  );
};

export default ForgotPassword;
