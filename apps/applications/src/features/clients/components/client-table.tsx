import { DataTable } from "@/components/common/data-table";
import { createColumns } from "./columns";
import { Client } from "../types/client";

interface ClientTableProps {
  clients: Client[];
  isLoading?: boolean;
  error?: string;
  onView?: (client: Client) => void;
  onEdit?: (client: Client) => void;
  onDelete?: (client: Client) => void;
  // Pagination props
  page?: number;
  limit?: number;
  total?: number;
  onPageChange?: (page: number) => void;
  onLimitChange?: (limit: number) => void;
}

export const ClientTable = ({
  clients,
  isLoading = false,
  error,
  onView,
  onEdit,
  onDelete,
  page = 1,
  limit = 10,
  total = 0,
  onPageChange,
  onLimitChange,
}: ClientTableProps) => {
  const columns = createColumns({
    onView,
    onEdit,
    onDelete,
  });

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Erro ao carregar clientes: {error}</p>
      </div>
    );
  }

  return (
    <DataTable
      columns={columns}
      data={clients as unknown as Record<string, unknown>[]}
      loading={isLoading}
      page={page - 1} // DataTable usa base 0, nós usamos base 1
      rowsPerPage={limit}
      totalCount={total}
      onPageChange={(newPage) => onPageChange?.(newPage + 1)} // Converter de volta para base 1
      onRowsPerPageChange={onLimitChange}
    />
  );
};
