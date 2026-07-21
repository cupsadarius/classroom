import { classroomMembers, classrooms, sessions } from "@classroom/db";
import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { assertClassroomMember, publicUserColumns } from "../helpers";
import { router, studentProcedure, teacherProcedure } from "../trpc";

// Gate map (#7): teacher → classrooms; student → sessions. Mutations additionally require
// classroom-teacher membership (#11 hardening — legacy only checked the global teacher role).
export const classroomRouter = router({
  list: teacherProcedure.query(({ ctx }) =>
    ctx.db.query.classrooms.findMany({
      with: { members: { with: { user: { columns: publicUserColumns } } } },
    }),
  ),
  byId: teacherProcedure.input(z.object({ id: z.string().uuid() })).query(({ ctx, input }) =>
    ctx.db.query.classrooms.findFirst({
      where: eq(classrooms.id, input.id),
      with: {
        members: { with: { user: { columns: publicUserColumns } } },
        sessions: true,
      },
    }),
  ),

  create: teacherProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(({ ctx, input }) =>
      ctx.db.transaction(async (tx) => {
        const [classroom] = await tx.insert(classrooms).values(input).returning();
        if (!classroom) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
        await tx.insert(classroomMembers).values({
          classroomId: classroom.id,
          userId: ctx.user.id,
          memberRole: "teacher",
        });
        return classroom;
      }),
    ),

  update: teacherProcedure
    .input(z.object({ id: z.string().uuid(), name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      await assertClassroomMember(ctx, input.id, "teacher");
      const [updated] = await ctx.db
        .update(classrooms)
        .set({ name: input.name })
        .where(eq(classrooms.id, input.id))
        .returning();
      if (!updated) throw new TRPCError({ code: "NOT_FOUND" });
      return updated;
    }),

  delete: teacherProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      await assertClassroomMember(ctx, input.id, "teacher");
      const [deleted] = await ctx.db
        .update(classrooms)
        .set({ deletedAt: new Date() })
        .where(eq(classrooms.id, input.id))
        .returning();
      if (!deleted) throw new TRPCError({ code: "NOT_FOUND" });
      return { id: deleted.id };
    }),

  addMember: teacherProcedure
    .input(
      z.object({
        classroomId: z.string().uuid(),
        userId: z.string().uuid(),
        memberRole: z.enum(["teacher", "student"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await assertClassroomMember(ctx, input.classroomId, "teacher");
      const [member] = await ctx.db.insert(classroomMembers).values(input).returning();
      return member;
    }),

  removeMember: teacherProcedure
    .input(z.object({ classroomId: z.string().uuid(), userId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      await assertClassroomMember(ctx, input.classroomId, "teacher");
      await ctx.db
        .delete(classroomMembers)
        .where(
          and(
            eq(classroomMembers.classroomId, input.classroomId),
            eq(classroomMembers.userId, input.userId),
          ),
        );
      return { classroomId: input.classroomId, userId: input.userId };
    }),
});

const sessionFields = z
  .object({
    classroomId: z.string().uuid(),
    lessonId: z.string().uuid().optional(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
  })
  .refine((v) => !v.startDate || !v.endDate || v.endDate > v.startDate, {
    message: "endDate must be after startDate",
    path: ["endDate"],
  });

export const sessionRouter = router({
  list: studentProcedure.query(({ ctx }) => ctx.db.query.sessions.findMany()),
  byId: studentProcedure.input(z.object({ id: z.string().uuid() })).query(({ ctx, input }) =>
    ctx.db.query.sessions.findFirst({
      where: eq(sessions.id, input.id),
      with: { classroom: true, lesson: true },
    }),
  ),

  create: teacherProcedure.input(sessionFields).mutation(async ({ ctx, input }) => {
    await assertClassroomMember(ctx, input.classroomId, "teacher");
    const [session] = await ctx.db.insert(sessions).values(input).returning();
    if (session) {
      await ctx.db
        .update(classrooms)
        .set({ lastSessionId: session.id })
        .where(eq(classrooms.id, input.classroomId));
    }
    return session;
  }),

  update: teacherProcedure
    .input(sessionFields.and(z.object({ id: z.string().uuid() })))
    .mutation(async ({ ctx, input }) => {
      const { id, ...fields } = input;
      await assertClassroomMember(ctx, fields.classroomId, "teacher");
      const [updated] = await ctx.db.update(sessions).set(fields).where(eq(sessions.id, id)).returning();
      if (!updated) throw new TRPCError({ code: "NOT_FOUND" });
      return updated;
    }),

  delete: teacherProcedure
    .input(z.object({ id: z.string().uuid(), classroomId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      await assertClassroomMember(ctx, input.classroomId, "teacher");
      const [deleted] = await ctx.db
        .update(sessions)
        .set({ deletedAt: new Date() })
        .where(eq(sessions.id, input.id))
        .returning();
      if (!deleted) throw new TRPCError({ code: "NOT_FOUND" });
      return { id: deleted.id };
    }),
});
