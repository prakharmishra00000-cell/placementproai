import { PrismaClient } from '@prisma/client';
const db = new PrismaClient();
(async () => {
  console.log('questions:', await db.question.count());
  console.log('subjects:', await db.subject.count());
  console.log('jobs:', await db.jobListing.count());
  console.log('students:', await db.studentProfile.count());
  console.log('users:', await db.user.count());
  await db.$disconnect();
})();
