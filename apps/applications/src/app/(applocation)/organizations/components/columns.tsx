import { IconButton, Tooltip } from "@mui/material";

import { PencilIcon, Trash2 } from "lucide-react";

import { Column } from "@/components/common/data-table";

interface ColumnsOptions {
  onEdit?: (organizationId: string, organizationName: string) => void;
  onDelete?: (organizationId: string, organizationName: string) => void;
}

export const createColumns = (options: ColumnsOptions = {}): Column[] => [
  { id: "name", label: "Nome da Organização", minWidth: 180 },
  { id: "slug", label: "Slug", minWidth: 140 },
  { id: "industry", label: "Setor", minWidth: 120 },
  { id: "companySize", label: "Tamanho", minWidth: 120 },
  {
    id: "currentUserRole",
    label: "Sua Função",
    minWidth: 120,
  },
  { id: "plan", label: "Plano", minWidth: 120 },
  {
    id: "memberCount",
    label: "Membros",
    minWidth: 100,
    align: "center",
  },
  {
    id: "workspaceCount",
    label: "Workspaces",
    minWidth: 100,
    align: "center",
  },
  {
    id: "actions",
    label: "Ações",
    minWidth: 120,
    sortable: false,
    renderCell: (_, row) => (
      <div className="flex gap-1">
        {options.onEdit && (
          <Tooltip title="Editar organização" arrow>
            <IconButton
              size="small"
              color="primary"
              onClick={() => options.onEdit?.(row.id, row.name)}
            >
              <PencilIcon size={16} />
            </IconButton>
          </Tooltip>
        )}

        {options.onDelete && row.currentUserRole === "OWNER" && (
          <Tooltip title="Excluir organização" arrow>
            <IconButton
              size="small"
              color="error"
              onClick={() => options.onDelete?.(row.id, row.name)}
            >
              <Trash2 size={16} />
            </IconButton>
          </Tooltip>
        )}
      </div>
    ),
  },
];

// Export legacy columns for backward compatibility
export const columns = createColumns();
