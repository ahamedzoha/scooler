import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { ITEMS_PER_PAGE } from "@/lib/constants/pagination.constant";
import { role } from "@/lib/data";
import prisma from "@/lib/prisma";
import { Event, Prisma } from "@prisma/client";
import Image from "next/image";

// type Event = {
//   id: number;
//   title: string;
//   class: string;
//   date: string;
//   startTime: string;
//   endTime: string;
// };

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
    header: "Start Time",
    accessor: "startTime",
    className: "hidden md:table-cell",
  },
  {
    header: "End Time",
    accessor: "endTime",
    className: "hidden md:table-cell",
  },
  {
    header: "Actions",
    accessor: "action",
  },
];

type EventListItem = Event & {
  class: {
    name: string;
  };
};

export type EventListPageProps = {
  searchParams?: {
    [key: string]: string | undefined;
    page?: string;
  };
};
const renderRow = (item: EventListItem) => (
  <tr
    key={item.id}
    className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
  >
    <td className="flex items-center gap-4 p-4">{item.title}</td>
    <td>{item.class.name}</td>
    <td className="hidden md:table-cell">{item.startTime.toDateString()}</td>
    <td className="hidden md:table-cell">
      {item.startTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}
    </td>
    <td className="hidden md:table-cell">
      {item.endTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}
    </td>
    <td>
      <div className="flex items-center gap-2">
        {role === "admin" && (
          <>
            <FormModal table="event" type="update" data={item} />
            <FormModal table="event" type="delete" id={item.id.toString()} />
          </>
        )}
      </div>
    </td>
  </tr>
);
const EventListPage = async ({ searchParams }: EventListPageProps) => {
  const { page, ...queryParams } = searchParams || {};
  const currentPage = parseInt(page || "1", 10);

  const query: Prisma.EventWhereInput = {};
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
    prisma.event.findMany({
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
    prisma.event.count({
      where: query,
    }),
  ]);

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Events</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch search={queryParams.search} />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            {role === "admin" && <FormModal table="event" type="create" />}
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

export default EventListPage;
