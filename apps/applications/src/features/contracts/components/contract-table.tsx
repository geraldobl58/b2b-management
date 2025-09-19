"use client";

import { Paper, Alert } from "@mui/material";

import { DataTable } from "@/components/common/data-table";
import { createColumns } from "@/features/contracts/components/columns";
import { Contract } from "@/features/contracts/types/contract";

interface ContractTableProps {
  contracts: Contract[];
  contractsMeta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  isLoadingContracts: boolean;
  error?: string | null;
  page: number;
  limit: number;
  onPageChange: (newPage: number) => void;
  onRowsPerPageChange: (newLimit: number) => void;
  onEditContract: (contract: Contract) => void;
  onDeleteContract: (contract: Contract) => void;
}

export const ContractTable = ({
  contracts,
  contractsMeta,
  isLoadingContracts,
  error,
  page,
  limit,
  onPageChange,
  onRowsPerPageChange,
  onEditContract,
  onDeleteContract,
}: ContractTableProps) => {
  const columns = createColumns({
    onEdit: onEditContract,
    onDelete: onDeleteContract,
  });

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        Erro ao carregar o contrato: {error}
      </Alert>
    );
  }

  return (
    <Paper
      elevation={3}
      sx={{ display: "block", width: "100%", mt: 5 }}
      className="w-full max-w-full p-4 space-y-8"
    >
      <div>
        <DataTable
          data={
            contracts?.map((contract) => ({
              ...contract,
              campaigns: contract._count?.campaigns ?? 0,
              actions: "", // Placeholder, handled by renderCell
            })) ?? []
          }
          columns={columns}
          loading={isLoadingContracts}
          getRowId={(row) => row.id}
          // Pagination
          page={page - 1} // DataTable uses 0-based pagination
          rowsPerPage={limit}
          totalCount={contractsMeta?.total || 0}
          onPageChange={(newPage) => onPageChange(newPage + 1)} // Convert to 1-based
          onRowsPerPageChange={onRowsPerPageChange}
          // Features
          showPagination
          stickyHeader
          emptyMessage="Nenhum contrato encontrado"
          // Layout
          maxHeight={700}
          dense={true}
        />
      </div>
    </Paper>
  );
};
