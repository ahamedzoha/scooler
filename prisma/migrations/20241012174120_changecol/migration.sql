-- Rename the column
ALTER TABLE "Exam" RENAME COLUMN "lessonsId" TO "lessonId";

-- Rename the foreign key constraint
ALTER TABLE "Exam" RENAME CONSTRAINT "Exam_lessonsId_fkey" TO "Exam_lessonId_fkey";