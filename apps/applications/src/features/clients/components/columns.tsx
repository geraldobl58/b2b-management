import { Column, TableHelpers } from "@/components/common/data-table";

import { Chip } from "@mui/material";
import { Edit, Eye, Trash } from "lucide-react";
import { Client } from "@/features/clients/types/client";

interface ColumnsProps {
  onView?: (client: Client) => void;
  onEdit?: (client: Client) => void;
  onDelete?: (client: Client) => void;
}

export const createColumns = ({
  onView,
  onEdit,
  onDelete,
}: ColumnsProps = {}): Column[] => [
  {
    id: "cnpj",
    label: "CNPJ",
    minWidth: 140,
    sortable: true,
  },
  {
    id: "companyName",
    label: "Empresa",
    minWidth: 200,
    sortable: true,
  },
  {
    id: "fantasyName",
    label: "Nome Fantasia",
    minWidth: 180,
    sortable: true,
  },
  {
    id: "typeRelationship",
    label: "Tipo Relacionamento",
    minWidth: 160,
    sortable: true,
    format: (value: unknown) => (
      <Chip
        label={typeof value === "string" && value ? value : "N/A"}
        size="small"
        color={value ? "primary" : "default"}
        variant="filled"
        className="w-35 text-xs font-bold uppercase"
      />
    ),
  },
  {
    id: "taxpayerType",
    label: "Tipo Contribuinte",
    minWidth: 140,
    sortable: true,
    format: (value: unknown) => (
      <Chip
        label={typeof value === "string" ? value.replace("_", " ") : ""}
        size="small"
        color="secondary"
        variant="filled"
        className="w-35 text-xs font-bold uppercase"
      />
    ),
  },
  {
    id: "contracts",
    label: "Nº Contratos",
    minWidth: 100,
    sortable: false,
    renderCell: (value: unknown) => {
      const contracts =
        typeof value === "object" &&
        value !== null &&
        "contracts" in value &&
        typeof (value as { contracts?: unknown }).contracts === "number"
          ? (value as { contracts: number }).contracts
          : 0;
      return (
        <Chip
          label={contracts}
          size="small"
          color="default"
          variant="filled"
          className="w-10 text-xs font-bold"
        />
      );
    },
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
      const client = row as unknown as Client;
      return TableHelpers.renderActions([
        {
          icon: <Eye size={16} />,
          label: "Visualizar",
          color: "primary",
          onClick: () => {
            if (onView) {
              onView(client);
            }
          },
        },
        {
          icon: <Edit size={16} />,
          label: "Editar",
          color: "primary",
          onClick: () => {
            if (onEdit) {
              onEdit(client);
            }
          },
        },
        {
          icon: <Trash size={16} />,
          label: "Deletar",
          color: "error",
          onClick: () => {
            if (onDelete) {
              onDelete(client);
            }
          },
        },
      ]);
    },
  },
];

// Manter compatibilidade com código existente
export const columns = createColumns();
