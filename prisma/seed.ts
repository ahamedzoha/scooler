import { PrismaClient, Day, Sex } from "@prisma/client";
import { faker } from "@faker-js/faker";

async function createInBatches<T>(
  items: unknown[],
  batchSize: number,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createFn: (batch: any[]) => Promise<T[]>
): Promise<T[]> {
  const results: T[] = [];
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await createFn(batch);
    results.push(...batchResults);
    // Optional: Add a small delay between batches to prevent overwhelming the database
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  return results;
}

const prisma = new PrismaClient({
  log: ["info", "warn"],
});

// Helper to generate a random enum value
const randomEnum = <T>(enumObj: T): T[keyof T] => {
  const enumValues = Object.values(enumObj as object);
  return enumValues[
    Math.floor(Math.random() * enumValues.length)
  ] as T[keyof T];
};

// Helper to generate a random time between two hours
const randomTime = (startHour: number, endHour: number): Date => {
  const hour = faker.number.int({ min: startHour, max: endHour });
  const minute = faker.number.int({ min: 0, max: 59 });
  return new Date(2024, 0, 1, hour, minute);
};

// Helper to capitalize first letter of each word
const capitalizeWords = (str: string): string => {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
};

async function clearDatabase() {
  const tableNames = [
    "Attendance",
    "Result",
    "Exam",
    "Assignment",
    "Announcement",
    "Event",
    "Lesson",
    "Student",
    "Class",
    "Teacher",
    "Subject",
    "Parent",
    "Grade",
    "Admin",
  ];

  console.log("🧹 Cleaning database...");
  for (const table of tableNames) {
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE "${table}" CASCADE;`);
  }
}

async function main() {
  try {
    await clearDatabase();
    console.log("🌱 Starting seeding...");

    // Create Admins (increased for larger school)
    const admins = await Promise.all(
      Array(5)
        .fill(null)
        .map(async () => {
          return await prisma.admin.create({
            data: {
              username: faker.internet.userName().toLowerCase(),
            },
          });
        })
    );
    console.log("✓ Created admins:", admins.length);

    // Create Grades (K-12)
    const grades = await Promise.all(
      Array(13)
        .fill(null)
        .map(async (_, i) => {
          return await prisma.grade.create({
            data: { level: i }, // 0 represents Kindergarten
          });
        })
    );
    console.log("✓ Created grades:", grades.length);

    // Create Subjects (expanded for K-12)
    const subjectsByLevel = {
      elementary: [
        "Reading",
        "Writing",
        "Mathematics",
        "Science",
        "Social Studies",
        "Art",
        "Music",
        "Physical Education",
      ],
      middle: [
        "English Language Arts",
        "Mathematics",
        "Life Science",
        "Earth Science",
        "World History",
        "Physical Education",
        "Art",
        "Music",
        "Computer Science",
      ],
      high: [
        "English Literature",
        "Advanced Mathematics",
        "Physics",
        "Chemistry",
        "Biology",
        "World History",
        "Economics",
        "Computer Science",
        "Physical Education",
        "Foreign Language",
        "Art History",
        "Music Theory",
      ],
    };

    const allSubjects = Array.from(
      new Set([
        ...subjectsByLevel.elementary,
        ...subjectsByLevel.middle,
        ...subjectsByLevel.high,
      ])
    );

    const subjects = await Promise.all(
      allSubjects.map(async (name) => {
        return await prisma.subject.create({
          data: { name },
        });
      })
    );
    console.log("✓ Created subjects:", subjects.length);

    // Create Teachers (increased for K-12)
    const teachers = await Promise.all(
      Array(60)
        .fill(null)
        .map(async () => {
          const firstName = faker.person.firstName();
          const lastName = faker.person.lastName();
          return await prisma.teacher.create({
            data: {
              username: faker.internet
                .userName({ firstName, lastName })
                .toLowerCase(),
              name: firstName,
              surname: lastName,
              email: faker.internet
                .email({ firstName, lastName })
                .toLowerCase(),
              phone: faker.phone.number({ style: "international" }),
              address: faker.location.streetAddress(true),
              bloodType: faker.helpers.arrayElement([
                "A+",
                "A-",
                "B+",
                "B-",
                "O+",
                "O-",
                "AB+",
                "AB-",
              ]),
              sex: faker.helpers.arrayElement([Sex.MALE, Sex.FEMALE]),
              birthdate: faker.date.between({
                from: new Date("1970-01-01"),
                to: new Date("1995-12-31"),
              }),
              subjects: {
                connect: [
                  {
                    id: faker.helpers.arrayElement(subjects).id,
                  },
                ],
              },
            },
          });
        })
    );
    console.log("✓ Created teachers:", teachers.length);

    // Create Classes (multiple sections per grade)
    const classes = await Promise.all(
      grades.flatMap((grade) => {
        // More sections for larger grades
        const sectionsCount = grade.level <= 5 ? 2 : 3; // 2 sections for K-5, 3 for 6-12
        return Array(sectionsCount)
          .fill(null)
          .map(async (_, index) => {
            const section = String.fromCharCode(65 + index); // A, B, C
            const gradeName = grade.level === 0 ? "K" : grade.level.toString();
            return await prisma.class.create({
              data: {
                name: `${gradeName}${section}`,
                capacity: faker.number.int({ min: 20, max: 30 }),
                gradeId: grade.id,
                supervisorId: faker.helpers.arrayElement(teachers).id,
              },
            });
          });
      })
    );
    console.log("✓ Created classes:", classes.length);

    // Create Parents (increased for K-12)
    const parents = await Promise.all(
      Array(400)
        .fill(null)
        .map(async () => {
          const firstName = faker.person.firstName();
          const lastName = faker.person.lastName();
          return await prisma.parent.create({
            data: {
              username: faker.internet
                .userName({ firstName, lastName })
                .toLowerCase(),
              name: firstName,
              surname: lastName,
              email: faker.internet
                .email({ firstName, lastName })
                .toLowerCase(),
              phone: faker.phone.number({ style: "international" }),
              address: faker.location.streetAddress(true),
            },
          });
        })
    );
    console.log("✓ Created parents:", parents.length);

    // Create Students (scaled for K-12)
    // Students
    const studentData = Array(700)
      .fill(null)
      .map(() => {
        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();
        const selectedClass = faker.helpers.arrayElement(classes);

        return {
          username: faker.internet
            .userName({ firstName, lastName })
            .toLowerCase(),
          name: firstName,
          surname: lastName,
          email: faker.internet.email({ firstName, lastName }).toLowerCase(),
          phone: faker.phone.number({ style: "international" }),
          address: faker.location.streetAddress(true),
          bloodType: faker.helpers.arrayElement([
            "A+",
            "A-",
            "B+",
            "B-",
            "O+",
            "O-",
            "AB+",
            "AB-",
          ]),
          sex: faker.helpers.arrayElement([Sex.MALE, Sex.FEMALE]),
          birthdate: faker.date.between({
            from: new Date("2006-01-01"),
            to: new Date("2019-12-31"),
          }),
          classId: selectedClass.id,
          gradeId: selectedClass.gradeId,
          parentId: faker.helpers.arrayElement(parents).id,
        };
      });

    const students = await createInBatches(studentData, 50, async (batch) => {
      return await prisma.$transaction(
        batch.map((data) => prisma.student.create({ data }))
      );
    });
    console.log("✓ Created students:", students.length);

    // Create Lessons (increased for K-12)
    const lessons = await Promise.all(
      Array(200)
        .fill(null)
        .map(async () => {
          const selectedClass = faker.helpers.arrayElement(classes);
          const selectedTeacher = faker.helpers.arrayElement(teachers);
          const selectedSubject = faker.helpers.arrayElement(subjects);

          return await prisma.lesson.create({
            data: {
              name: `${selectedSubject.name} ${selectedClass.name}`,
              day: randomEnum(Day),
              startTime: randomTime(8, 15),
              endTime: randomTime(9, 16),
              subjectId: selectedSubject.id,
              classId: selectedClass.id,
              teacherId: selectedTeacher.id,
            },
          });
        })
    );
    console.log("✓ Created lessons:", lessons.length);

    // Create Exams (scaled for K-12)
    const exams = await Promise.all(
      Array(100)
        .fill(null)
        .map(async () => {
          const selectedLesson = faker.helpers.arrayElement(lessons);
          const examDate = faker.date.future();

          return await prisma.exam.create({
            data: {
              title: capitalizeWords(
                `${faker.word.adjective()} ${selectedLesson.name} Exam`
              ),
              startTime: examDate,
              endTime: new Date(examDate.getTime() + 2 * 60 * 60 * 1000), // 2 hours later
              lessonId: selectedLesson.id,
            },
          });
        })
    );
    console.log("✓ Created exams:", exams.length);

    // Create Assignments (scaled for K-12)
    const assignments = await Promise.all(
      Array(150)
        .fill(null)
        .map(async () => {
          const selectedLesson = faker.helpers.arrayElement(lessons);
          const startDate = faker.date.future();

          return await prisma.assignment.create({
            data: {
              title: capitalizeWords(
                `${faker.word.adjective()} ${selectedLesson.name} Assignment`
              ),
              startDate,
              dueDate: new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000), // 1 week later
              lessonId: selectedLesson.id,
            },
          });
        })
    );
    console.log("✓ Created assignments:", assignments.length);

    // Create Results (scaled for K-12)
    const resultData = Array(1000)
      .fill(null)
      .map(() => {
        const isExam = faker.datatype.boolean();
        return {
          score: faker.number.int({ min: 0, max: 100 }),
          studentId: faker.helpers.arrayElement(students).id,
          ...(isExam
            ? { examId: faker.helpers.arrayElement(exams).id }
            : { assignmentId: faker.helpers.arrayElement(assignments).id }),
        };
      });

    const results = await createInBatches(resultData, 50, async (batch) => {
      return await prisma.$transaction(
        batch.map((data) => prisma.result.create({ data }))
      );
    });
    console.log("✓ Created results:", results.length);

    // Create Attendance Records (scaled for K-12)
    const attendanceData = Array(2000)
      .fill(null)
      .map(() => {
        const selectedStudent = faker.helpers.arrayElement(students);
        const selectedLesson = faker.helpers.arrayElement(lessons);

        return {
          date: faker.date.recent({ days: 30 }),
          present: faker.helpers.weightedArrayElement([
            { weight: 90, value: true },
            { weight: 10, value: false },
          ]),
          studentId: selectedStudent.id,
          lessonId: selectedLesson.id,
        };
      });

    const attendances = await createInBatches(
      attendanceData,
      50,
      async (batch) => {
        return await prisma.$transaction(
          batch.map((data) => prisma.attendance.create({ data }))
        );
      }
    );
    console.log("✓ Created attendance records:", attendances.length);

    // Create Events (scaled for K-12)
    const events = await Promise.all(
      Array(30)
        .fill(null)
        .map(async () => {
          const startTime = faker.date.future();
          return await prisma.event.create({
            data: {
              title: faker.helpers.arrayElement([
                "Parent-Teacher Conference",
                "Science Fair",
                "Sports Day",
                "Art Exhibition",
                "Annual Day",
                "Career Guidance Session",
                "Cultural Festival",
                "Field Trip",
                "Book Fair",
                "Math Olympics",
                "Drama Performance",
                "Music Concert",
                "Poetry Reading",
                "Technology Showcase",
                "Environmental Awareness Day",
              ]),
              description: faker.lorem.paragraph(),
              startTime,
              endTime: new Date(startTime.getTime() + 3 * 60 * 60 * 1000), // 3 hours later
              classId: faker.helpers.arrayElement(classes).id,
            },
          });
        })
    );
    console.log("✓ Created events:", events.length);

    // Create Announcements (scaled for K-12)
    const announcements = await Promise.all(
      Array(50)
        .fill(null)
        .map(async () => {
          return await prisma.announcement.create({
            data: {
              title: faker.helpers.arrayElement([
                "Important Notice",
                "Schedule Change",
                "Upcoming Event",
                "Holiday Announcement",
                "Exam Schedule",
                "Parent Meeting",
                "Curriculum Update",
                "School Policy Change",
                "Facility Maintenance",
                "Weather Advisory",
                "Transportation Update",
                "Lunch Menu Change",
                "After-School Program",
                "School Spirit Week",
                "Community Service Opportunity",
              ]),
              description: faker.lorem.paragraph(),
              date: faker.date.recent({ days: 10 }),
              classId: faker.helpers.arrayElement(classes).id,
            },
          });
        })
    );
    console.log("✓ Created announcements:", announcements.length);

    console.log("✨ Seeding completed successfully!");
  } catch (error) {
    console.error("Error during seeding:", error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
