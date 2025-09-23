"use client";

import { DataTable, Column } from "@/components/common/data-table";
import { Alert, Paper } from "@mui/material";
import { Campaign } from "../../types/campaign";
import { createColumns } from "./columns";

interface CampaignTableProps {
  campaigns: Campaign[];
  campaignsMeta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  isLoadingCampaigns: boolean;
  error?: string | null;
  page: number;
  limit: number;
  onPageChange: (newPage: number) => void;
  onRowsPerPageChange: (newLimit: number) => void;
  onEditCampaign: (campaign: Campaign) => void;
  onDeleteCampaign: (campaign: Campaign) => void;
}

export const CampaignTable = ({
  campaigns,
  campaignsMeta,
  isLoadingCampaigns,
  error,
  page,
  limit,
  onPageChange,
  onRowsPerPageChange,
  onEditCampaign,
  onDeleteCampaign,
}: CampaignTableProps) => {
  const columns = createColumns({
    onEdit: onEditCampaign,
    onDelete: onDeleteCampaign,
  });

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        Erro ao carregar as campanhas: {error}
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
          data={campaigns as unknown as Record<string, unknown>[]}
          columns={columns as unknown as Column<Record<string, unknown>>[]}
          loading={isLoadingCampaigns}
          getRowId={(row) => (row as unknown as Campaign).id}
          // Pagination
          page={page - 1} // DataTable uses 0-based pagination
          rowsPerPage={limit}
          totalCount={campaignsMeta?.total || 0}
          onPageChange={(newPage) => onPageChange(newPage + 1)} // Convert to 1-based
          onRowsPerPageChange={onRowsPerPageChange}
          // Features
          showPagination
          stickyHeader
          emptyMessage="Nenhuma campanha encontrada"
          // Layout
          maxHeight={700}
          dense={true}
        />
      </div>
    </Paper>
  );
};
