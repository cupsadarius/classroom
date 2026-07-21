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
import { LoginForm } from "@/components/login-form";

// Public login route — deliberately outside the (app) group so it renders without
// the authenticated shell. Route protection lives in (app)/layout.tsx (#10).
export default async function LoginPage() {
  const session = await auth();
  if (session?.user) redirect("/");

  return (
    <div className="flex min-h-svh items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Sign in</CardTitle>
          <CardDescription>Enter your credentials to access Classroom.</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
          <p className="mt-4 text-center text-muted-foreground text-sm">
            New here?{" "}
            <Link href="/signup/student" className="underline underline-offset-4">
              Sign up as student
            </Link>{" "}
            or{" "}
            <Link href="/signup/teacher" className="underline underline-offset-4">
              teacher
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
