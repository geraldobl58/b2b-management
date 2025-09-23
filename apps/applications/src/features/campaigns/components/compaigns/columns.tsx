import { Column } from "@/components/common/data-table";
import { ActionsMenu } from "@/components/shared/actions-menu";

import { Campaign } from "../../types/campaign";

interface ColumnsProps {
  onView?: (contract: Campaign) => void;
  onEdit?: (contract: Campaign) => void;
  onDelete?: (contract: Campaign) => void;
}

export const createColumns = ({
  onView,
  onEdit,
  onDelete,
}: ColumnsProps = {}): Column[] => [
  {
    id: "name",
    label: "Nome da Campanha",
    minWidth: 200,
    sortable: true,
  },
  {
    id: "type",
    label: "Tipo",
    minWidth: 120,
    sortable: true,
    renderCell: (value) => {
      const typeMap = {
        MKT: "Marketing",
        SALES: "Vendas",
        RETENTION: "Retenção",
        UPSELL: "Upsell",
      };
      return typeMap[value as keyof typeof typeMap] || String(value);
    },
  },
  {
    id: "branchType",
    label: "Filial",
    minWidth: 100,
    sortable: true,
    renderCell: (value) => {
      const branchMap = {
        MATRIZ: "Matriz",
        FILIAL: "Filial",
      };
      return branchMap[value as keyof typeof branchMap] || String(value);
    },
  },
  {
    id: "city",
    label: "Cidade",
    minWidth: 150,
    sortable: true,
  },
  {
    id: "client",
    label: "Cliente",
    minWidth: 200,
    sortable: true,
    renderCell: (value, row) => {
      const campaign = row as unknown as Campaign;
      return campaign.client?.companyName || campaign.client?.fantasyName || "";
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
      const campaign = row as unknown as Campaign;
      return (
        <ActionsMenu
          item={campaign}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      );
    },
  },
];

// Manter compatibilidade com código existente
export const columns = createColumns();
