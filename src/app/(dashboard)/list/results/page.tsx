import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { ITEMS_PER_PAGE } from "@/lib/constants/pagination.constant";
import { role } from "@/lib/data";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import Image from "next/image";

const columns = [
  {
    header: "Title",
    accessor: "title",
    className: "hidden md:table-cell",
  },
  {
    header: "Student",
    accessor: "student",
    className: "hidden md:table-cell",
  },
  {
    header: "Score",
    accessor: "score",
    className: "hidden md:table-cell",
  },
  {
    header: "Teacher",
    accessor: "teacher",
    className: "hidden md:table-cell",
  },
  {
    header: "Class",
    accessor: "class",
    className: "hidden md:table-cell",
  },
  {
    header: "Date",
    accessor: "date",
    className: "hidden md:table-cell",
  },
  {
    header: "Actions",
    accessor: "action",
  },
];
type ResultListItem = {
  id: number;
  title: string;
  studentName: string;
  studentSurname: string;
  teacherName: string;
  teacherSurname: string;
  score: number;
  className: string;
  startTime: Date;
};

export type ResultListPageProps = {
  searchParams?: {
    [key: string]: string | undefined;
    page?: string;
  };
};
const renderRow = (item: ResultListItem) => (
  <tr
    key={item.id}
    className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
  >
    <td className="flex items-center gap-4 p-4">{item.title}</td>
    <td>{item.studentName + " " + item.studentSurname}</td>
    <td className="hidden md:table-cell">{item.score}</td>
    <td className="hidden md:table-cell">
      {item.teacherName + " " + item.teacherSurname}
    </td>
    <td className="hidden md:table-cell">{item.className}</td>
    <td className="hidden md:table-cell">{item.startTime.toDateString()}</td>
    <td>
      <div className="flex items-center gap-2">
        {role === "admin" ||
          (role === "teacher" && (
            <>
              <FormModal table="result" type="update" data={item} />
              <FormModal table="result" type="delete" id={item.id.toString()} />
            </>
          ))}
      </div>
    </td>
  </tr>
);
const ResultListPage = async ({ searchParams }: ResultListPageProps) => {
  const { page, ...queryParams } = searchParams || {};
  const currentPage = parseInt(page || "1", 10);

  const query: Prisma.ResultWhereInput = {};
  // URL PARAMS CONDITIONS
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "studentId": {
            query.student = {
              id: value,
            };
            break;
          }
          case "search": {
            query.OR = [
              { exam: { title: { contains: value, mode: "insensitive" } } },
              { student: { name: { contains: value, mode: "insensitive" } } },
            ];
            break;
          }
          default:
            break;
        }
      }
    }
  }

  const [dataResp, count] = await prisma.$transaction([
    prisma.result.findMany({
      where: query,
      include: {
        student: {
          select: {
            name: true,
            surname: true,
          },
        },
        exam: {
          include: {
            lesson: {
              include: {
                class: { select: { name: true } },
                teacher: { select: { name: true, surname: true } },
              },
            },
          },
        },
        assignment: {
          include: {
            lesson: {
              include: {
                class: { select: { name: true } },
                teacher: { select: { name: true, surname: true } },
              },
            },
          },
        },
      },

      take: ITEMS_PER_PAGE,
      skip: (currentPage - 1) * ITEMS_PER_PAGE,
    }),
    prisma.result.count({
      where: query,
    }),
  ]);
  const data = dataResp.map((item) => {
    const assesment = item.exam || item.assignment;

    if (!assesment) return null;
    const isExam = "startTime" in assesment;
    return {
      id: item.id,
      title: assesment.title,
      studentName: item.student.name,
      studentSurname: item.student.surname,
      teacherName: assesment.lesson.teacher.name,
      teacherSurname: assesment.lesson.teacher.surname,
      score: item.score,
      className: assesment.lesson.class.name,
      startTime: isExam ? assesment.startTime : assesment.startDate,
    };
  });

  console.log({ data });

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Results</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            {role === "admin" ||
              (role === "teacher" && (
                <FormModal table="result" type="create" />
              ))}
          </div>
        </div>
      </div>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={data} />
      {/* PAGINATION */}
      <Pagination count={count} page={currentPage} />
    </div>
  );
};

export default ResultListPage;
