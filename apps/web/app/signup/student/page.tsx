import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@classroom/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@classroom/ui/components/card";
import { SignupForm } from "@/components/signup-form";
import { signupStudent } from "@/lib/actions/signup-actions";

// Public signup — parity with legacy's unauthenticated POST /attendee/student (#2 §1.4).
export default async function StudentSignupPage() {
  const session = await auth();
  if (session?.user) redirect("/");

  return (
    <div className="flex min-h-svh items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Sign up as student</CardTitle>
          <CardDescription>Create a student account to join classrooms.</CardDescription>
        </CardHeader>
        <CardContent>
          <SignupForm action={signupStudent} />
          <p className="mt-4 text-center text-muted-foreground text-sm">
            Already have an account?{" "}
            <Link href="/login" className="underline underline-offset-4">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
