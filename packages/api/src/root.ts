import { studentRouter, teacherRouter } from "./routers/attendee";
import { classroomRouter, sessionRouter } from "./routers/classroom";
import { categoryRouter, lessonRouter } from "./routers/content";
import { userRouter } from "./routers/user";
import { router } from "./trpc";

export const appRouter = router({
  user: userRouter,
  teacher: teacherRouter,
  student: studentRouter,
  category: categoryRouter,
  lesson: lessonRouter,
  classroom: classroomRouter,
  session: sessionRouter,
});

export type AppRouter = typeof appRouter;
