import { Column, TableHelpers } from "@/components/common/data-table";

import { Chip } from "@mui/material";
import { Edit, Eye, Trash } from "lucide-react";
import { Contract } from "../types/contract";

interface ColumnsProps {
  onView?: (contract: Contract) => void;
  onEdit?: (contract: Contract) => void;
  onDelete?: (contract: Contract) => void;
}

export const createColumns = ({
  onView,
  onEdit,
  onDelete,
}: ColumnsProps = {}): Column[] => [
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
    renderCell: (value: unknown) => {
      const campaigns =
        typeof value === "object" &&
        value !== null &&
        "campaigns" in value &&
        typeof (value as { campaigns?: unknown }).campaigns === "number"
          ? (value as { campaigns: number }).campaigns
          : 0;
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
    id: "actions",
    label: "Ações",
    minWidth: 120,
    sortable: false,
    renderCell: (_: unknown, row: Record<string, unknown>) => {
      const contract = row as unknown as Contract;
      return TableHelpers.renderActions([
        {
          icon: <Eye size={16} />,
          label: "Visualizar",
          color: "primary",
          onClick: () => {
            if (onView) {
              onView(contract);
            }
          },
        },
        {
          icon: <Edit size={16} />,
          label: "Editar",
          color: "primary",
          onClick: () => {
            if (onEdit) {
              onEdit(contract);
            }
          },
        },
        {
          icon: <Trash size={16} />,
          label: "Deletar",
          color: "error",
          onClick: () => {
            if (onDelete) {
              onDelete(contract);
            }
          },
        },
      ]);
    },
  },
];

// Manter compatibilidade com código existente
export const columns = createColumns();
