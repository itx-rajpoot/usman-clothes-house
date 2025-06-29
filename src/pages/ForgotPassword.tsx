
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const ForgotPassword = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setEmailSent(true);
      toast({
        title: "Reset Email Sent!",
        description: "Please check your email for password reset instructions.",
      });
    } catch (error: any) {
      console.error('Password reset error:', error);
      toast({
        title: "Error",
        description: error.message || "Please check your email address and try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-800">
              Reset Your Password
            </CardTitle>

            <p className="text-gray-600">
              Enter your email address and we'll send you a link to reset your password
            </p>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Link to="/" className="text-amber-600 hover:underline text-sm">
                &larr; Go Back to Home
              </Link>
            </div>

            {!emailSent ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Enter your email"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-amber-600 hover:bg-amber-700"
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </Button>
              </form>
            ) : (
              <div className="text-center space-y-4">
                <div className="text-green-600 text-lg font-semibold">
                  Email Sent Successfully!
                </div>
                <p className="text-gray-600">
                  We've sent a password reset link to <strong>{email}</strong>.
                  Please check your email and follow the instructions to reset your password.
                </p>
                <Button
                  onClick={() => {
                    setEmailSent(false);
                    setEmail('');
                  }}
                  variant="outline"
                  className="w-full"
                >
                  Send Another Email
                </Button>
              </div>
            )}

            <div className="mt-6 text-center">
              <Link
                to="/login"
                className="text-amber-600 hover:underline text-sm flex items-center justify-center"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;
