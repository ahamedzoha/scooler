import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { ITEMS_PER_PAGE } from "@/lib/constants/pagination.constant";
import { role } from "@/lib/data";
import prisma from "@/lib/prisma";
import { Prisma, Subject, Teacher } from "@prisma/client";
import Image from "next/image";

const columns = [
  {
    header: "Subject Name",
    accessor: "name",
  },
  {
    header: "Teachers",
    accessor: "teachers",
    className: "hidden md:table-cell",
  },
  {
    header: "Actions",
    accessor: "action",
  },
];
type SubjectListItem = Subject & { teachers: Teacher[] };

export type SubjectListPageProps = {
  searchParams?: {
    [key: string]: string | undefined;
    page?: string;
  };
};
const renderRow = (item: SubjectListItem) => (
  <tr
    key={item.id}
    className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
  >
    <td className="flex items-center gap-4 p-4">{item.name}</td>
    <td className="hidden md:table-cell">
      {item.teachers
        .map((teacher) => teacher.name + " " + teacher.surname)
        .join(", ")}
    </td>
    <td>
      <div className="flex items-center gap-2">
        {role === "admin" && (
          <>
            <FormModal table="subject" type="update" data={item} />
            <FormModal table="subject" type="delete" id={item.id.toString()} />
          </>
        )}
      </div>
    </td>
  </tr>
);
const SubjectListPage = async ({ searchParams }: SubjectListPageProps) => {
  const { page, ...queryParams } = searchParams || {};
  const currentPage = parseInt(page || "1", 10);

  const query: Prisma.SubjectWhereInput = {};

  // URL PARAMS CONDITIONS
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "studentId": {
            query.teachers = {
              some: {
                id: value,
              },
            };
            break;
          }
          case "search": {
            query.name = {
              contains: value,
              mode: "insensitive",
            };
            break;
          }
          default: {
            break;
          }
        }
      }
    }
  }
  const [data, count] = await prisma.$transaction([
    prisma.subject.findMany({
      where: query,
      include: {
        teachers: true,
      },
      take: ITEMS_PER_PAGE,
      skip: (currentPage - 1) * ITEMS_PER_PAGE,
    }),
    prisma.subject.count({
      where: query,
    }),
  ]);
  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Subjects</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch search={queryParams.search} />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            {role === "admin" && <FormModal table="teacher" type="create" />}
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

export default SubjectListPage;
