import { Column } from "@/components/common/data-table";
import { ActionsMenu } from "@/components/shared/actions-menu";

import { Chip } from "@mui/material";
import { Contract } from "../types/contract";

interface ColumnsProps {
  onView?: (contract: Contract) => void;
  onEdit?: (contract: Contract) => void;
  onDelete?: (contract: Contract) => void;
}

export const createColumns = ({
  onEdit,
  onDelete,
}: ColumnsProps = {}): Column[] => [
  {
    id: "clientName",
    label: "Nome do cliente",
    minWidth: 140,
    sortable: true,
    renderCell: (value) => {
      return value as React.ReactNode;
    },
  },
  {
    id: "name",
    label: "Nome do contrato",
    minWidth: 140,
    sortable: true,
  },
  {
    id: "partner",
    label: "Nome do parceiro",
    minWidth: 200,
    sortable: true,
  },
  {
    id: "campaigns",
    label: "Nº Campanhas",
    minWidth: 100,
    sortable: false,
    renderCell: (value: unknown, row: Record<string, unknown>) => {
      // Try to get campaigns count from different possible paths
      let campaigns = 0;

      // Check if it's in _count.campaigns
      if (
        row._count &&
        typeof row._count === "object" &&
        "campaigns" in row._count
      ) {
        campaigns = (row._count as { campaigns: number }).campaigns;
      }
      // Check if it's directly in campaigns array
      else if (Array.isArray(row.campaigns)) {
        campaigns = row.campaigns.length;
      }
      // Check if value itself is a number
      else if (typeof value === "number") {
        campaigns = value;
      }

      return (
        <Chip
          label={campaigns}
          size="small"
          color="default"
          variant="filled"
          className="w-10 text-xs font-bold"
        />
      );
    },
  },
  {
    id: "startDate",
    label: "Data de Início",
    minWidth: 200,
    sortable: true,
    renderCell: (value) => {
      if (typeof value === "string") {
        const date = new Date(value);
        return date.toLocaleDateString("pt-BR");
      }
      return value as React.ReactNode;
    },
  },
  {
    id: "endDate",
    label: "Data de Término",
    minWidth: 200,
    sortable: true,
    renderCell: (value) => {
      if (typeof value === "string") {
        const date = new Date(value);
        return date.toLocaleDateString("pt-BR");
      }
      return value as React.ReactNode;
    },
  },
  {
    id: "actions",
    label: "Ações",
    minWidth: 120,
    sortable: false,
    renderCell: (_: unknown, row: Record<string, unknown>) => {
      const contract = row as unknown as Contract;
      return (
        <ActionsMenu
          item={contract}
          itemName={contract.name}
          itemType="contrato"
          onEdit={onEdit}
          onDelete={onDelete}
        />
      );
    },
  },
];

// Manter compatibilidade com código existente
export const columns = createColumns();
