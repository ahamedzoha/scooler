type PaginationParams = {
  page?: string;
  [key: string]: string | undefined;
};

// Generic type that must extend one of Prisma's WhereInput types
type QueryBuilder<TWhereInput> = (
  params: Omit<PaginationParams, "page">
) => TWhereInput;

type ListViewParams<TWhereInput> = {
  searchParams: PaginationParams;
  pageSize: number;
  queryBuilder: QueryBuilder<TWhereInput>;
};

export async function getListViewData<TWhereInput>({
  searchParams,
  pageSize,
  queryBuilder,
}: ListViewParams<TWhereInput>) {
  const { page, ...queryParams } = searchParams || {};
  const currentPage = parseInt(page || "1", 10);

  // Build the query using the provided queryBuilder
  const query = queryBuilder(queryParams);

  return {
    query,
    pagination: {
      skip: (currentPage - 1) * pageSize,
      take: pageSize,
      currentPage,
    },
  };
}

// Type for the returned data from getListViewData
export type ListViewResult<TWhereInput> = {
  query: TWhereInput;
  pagination: {
    skip: number;
    take: number;
    currentPage: number;
  };
};
