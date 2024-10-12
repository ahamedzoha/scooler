import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { ITEMS_PER_PAGE } from "@/lib/constants/pagination.constant";
import { announcementsData, role } from "@/lib/data";
import prisma from "@/lib/prisma";
import { Announcement, Prisma } from "@prisma/client";
import Image from "next/image";

const columns = [
  {
    header: "Title",
    accessor: "title",
  },
  {
    header: "Class",
    accessor: "class",
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

type AnnouncementListItem = Announcement & {
  class: {
    name: string;
  };
};

export type AnnouncementListPageProps = {
  searchParams?: {
    [key: string]: string | undefined;
    page?: string;
  };
};
const renderRow = (item: AnnouncementListItem) => (
  <tr
    key={item.id}
    className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
  >
    <td className="flex items-center gap-4 p-4">{item.title}</td>
    <td>{item.class.name}</td>
    <td className="hidden md:table-cell">{item.date.toDateString()}</td>
    <td>
      <div className="flex items-center gap-2">
        {role === "admin" && (
          <>
            <FormModal table="announcement" type="update" data={item} />
            <FormModal
              table="announcement"
              type="delete"
              id={item.id.toString()}
            />
          </>
        )}
      </div>
    </td>
  </tr>
);
const AnnouncementListPage = async ({
  searchParams,
}: AnnouncementListPageProps) => {
  const { page, ...queryParams } = searchParams || {};
  const currentPage = parseInt(page || "1", 10);

  const query: Prisma.AnnouncementWhereInput = {};
  // URL PARAMS CONDITIONS
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "classId": {
            query.classId = value;
            break;
          }
          case "search": {
            query.OR = [
              { class: { name: { contains: value, mode: "insensitive" } } },
              { title: { contains: value, mode: "insensitive" } },
            ];
            break;
          }
          default:
            break;
        }
      }
    }
  }

  const [data, count] = await prisma.$transaction([
    prisma.announcement.findMany({
      where: query,
      include: {
        class: {
          select: {
            name: true,
          },
        },
      },
      take: ITEMS_PER_PAGE,
      skip: (currentPage - 1) * ITEMS_PER_PAGE,
    }),
    prisma.announcement.count({
      where: query,
    }),
  ]);

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">
          All Announcements
        </h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch search={queryParams.search} />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            {role === "admin" && (
              <FormModal table="announcement" type="create" />
            )}
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

export default AnnouncementListPage;
