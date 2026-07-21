import { ClassroomCrud } from "@/components/classrooms/classroom-crud";
import {
  addClassroomMember,
  createClassroom,
  deleteClassroom,
  removeClassroomMember,
  updateClassroom,
} from "@/lib/actions/classroom-actions";
import { getCaller } from "@/lib/trpc/server";

// Teacher-gated CRUD + membership (#11, gate map #7). Update/delete/member-mutations are
// additionally scoped to classroom-teacher membership via assertClassroomMember.
export default async function ClassroomsPage() {
  const caller = await getCaller();
  const [classrooms, users] = await Promise.all([caller.classroom.list(), caller.student.list()]);

  const rows = classrooms.map((c) => ({
    id: c.id,
    name: c.name,
    members: c.members.map((m) => ({
      userId: m.userId,
      email: m.user.email,
      memberRole: m.memberRole,
    })),
  }));

  return (
    <ClassroomCrud
      classrooms={rows}
      users={users.map((u) => ({ id: u.id, email: u.email }))}
      createAction={createClassroom}
      updateAction={updateClassroom}
      deleteAction={deleteClassroom}
      addMemberAction={addClassroomMember}
      removeMemberAction={removeClassroomMember}
    />
  );
}
