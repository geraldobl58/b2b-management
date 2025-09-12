"use client";

import { DataTable } from "@/components/common/data-table";

import { useOrganization } from "@/hooks/organization";
import { columns } from "./columns";

export const ListOrganization = () => {
  const { isLoading, organizations } = useOrganization();

  return (
    <DataTable
      data={organizations || []}
      columns={columns}
      loading={isLoading}
      height="55vh"
      showPagination={true}
      rowsPerPageOptions={[5, 10, 25]}
      rowsPerPage={10}
      dense={false}
      stickyHeader={true}
    />
  );
};
