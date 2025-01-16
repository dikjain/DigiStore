"use client";

import { useState } from "react";
import { useSignUp, useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff } from "lucide-react";

export default function SignUp() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const { isLoaded: isSignInLoaded, signIn } = useSignIn();
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  if (!isLoaded || !isSignInLoaded) {
    return null;
  }

  async function submit(e) {
    e.preventDefault();
    if (!isLoaded) {
      return;
    }

    try {
      // Step 1: Create the user with required fields
      await signUp.create({
        emailAddress,
        password,
      });

      // Step 2: Update metadata with custom fields
      await signUp.update({
        unsafeMetadata: {
          name,
        }
      });

      // Step 3: Trigger email verification
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
    } catch (err) {
      console.error("Sign-up error:", err);
      setError(err?.errors?.[0]?.message || "An unexpected error occurred.");
    }
  }

  async function onPressVerify(e) {
    e.preventDefault();
    if (!isLoaded) {
      return;
    }

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });
      if (completeSignUp.status !== "complete") {
        console.log(JSON.stringify(completeSignUp, null, 2));
      }

      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        router.push("/dashboard");
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
      setError(err?.errors?.[0]?.message || "Verification failed");
    }
  }

  const signUpWithGoogle = async () => {
    try {
      await signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: `${window.location.origin}/sign-in/sso-callback`,
        redirectUrlComplete: `${window.location.origin}/dashboard`,
      });
    } catch (err) {
      console.error("Google sign-up error:", err);
      setError(err?.errors?.[0]?.message || "Failed to sign up with Google");
    }
  };

  const signUpWithFacebook = async () => {
    try {
      await signIn.authenticateWithRedirect({
        strategy: "oauth_facebook",
        redirectUrl: `${window.location.origin}/sign-in/sso-callback`,
        redirectUrlComplete: `${window.location.origin}/dashboard`
      });
    } catch (err) {
      console.error("Facebook sign-up error:", err);
      setError(err?.errors?.[0]?.message || "Failed to sign up with Facebook");
    }
  };

  return (
    <div className="flex items-center justify-center h-[calc(100vh-74px)] bg-background">
      <Card className="w-full max-w-md lol">
        <CardHeader>
          <CardTitle className="text-2xl font-bold lol bg-secondary py-2 text-center">
            Sign Up for DigiStore
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!pendingVerification ? (
            <>
              <div className="space-y-4 mb-4">
                <Button 
                  type="button" 
                  className="w-full flex items-center justify-center bg-tertiary hover:bg-tertiary gap-2"
                  onClick={signUpWithGoogle}
                >
                  <img src="/google.png" alt="Google" className="w-5 " />
                  Continue with Google
                </Button>
                <Button 
                  type="button" 
                  className="w-full flex items-center justify-center bg-tertiary hover:bg-tertiary gap-2"
                  onClick={signUpWithFacebook}
                >
                  <img src="/facebook.png" alt="Facebook" className="w-5 " />
                  Continue with Facebook
                </Button>
              </div>
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-background text-muted-foreground">Or continue with email</span>
                </div>
              </div>
              <form onSubmit={submit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    type="email"
                    id="email"
                    value={emailAddress}
                    onChange={(e) => setEmailAddress(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-500" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-500" />
                      )}
                    </button>
                  </div>
                </div>
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <Button type="submit" className="w-full">
                  Sign Up with Email
                </Button>
              </form>
            </>
          ) : (
            <form onSubmit={onPressVerify} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">Verification Code</Label>
                <Input
                  id="code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Enter verification code"
                  required
                />
              </div>
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <Button type="submit" className="w-full">
                Verify Email
              </Button>
            </form>
          )}
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="font-medium text-primary hover:underline"
            >
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}