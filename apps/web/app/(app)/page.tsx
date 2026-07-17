import { Card, CardDescription, CardHeader, CardTitle } from "@classroom/ui/components/card";

// Overview landing inside the app shell. Real screens (list + detail per section)
// arrive with management CRUD (#11); this is the authenticated home.
export default function OverviewPage() {
  return (
    <div className="mx-auto max-w-4xl px-8 py-8">
      <h1 className="font-semibold text-2xl tracking-tight">Overview</h1>
      <p className="mt-1 text-muted-foreground text-sm">
        Welcome back. Pick a section from the rail to get started.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { title: "Students", desc: "Manage enrolment across your classrooms." },
          { title: "Classrooms", desc: "Spaces you own or co-teach." },
          { title: "Lessons", desc: "Slide decks to run in a live session." },
        ].map((c) => (
          <Card key={c.title}>
            <CardHeader>
              <CardTitle>{c.title}</CardTitle>
              <CardDescription>{c.desc}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
