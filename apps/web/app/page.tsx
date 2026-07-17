import { Button } from "@classroom/ui";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center gap-6 p-8 text-center">
      <h1 className="text-4xl font-bold tracking-tight">Classroom</h1>
      <p className="text-muted-foreground">
        Turborepo scaffold is live. Next: authentication and the management dashboard.
      </p>
      <Button>Get started</Button>
    </main>
  );
}
