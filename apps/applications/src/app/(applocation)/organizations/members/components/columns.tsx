import { IconButton, Tooltip, Chip } from "@mui/material";
import { PencilIcon, Trash2 } from "lucide-react";
import { Column } from "@/components/common/data-table";
import { MemberResponse } from "@/http/member";
import { getRoleColor, getRoleLabel } from "@/lib/colors";

interface ColumnsOptions {
  onEdit?: (member: MemberResponse) => void;
  onDelete?: (memberId: string, memberName: string) => void;
  currentUserRole?: "OWNER" | "ADMIN" | "MANAGER" | "ANALYST" | "VIEWER";
  currentUserId?: string;
}

export const createMemberColumns = (options: ColumnsOptions = {}): Column[] => [
  {
    id: "user.name",
    label: "Membro",
    minWidth: 180,
    renderCell: (_, row) => (
      <div>
        <div className="font-medium">{row.user.name}</div>
        <div className="text-sm text-gray-500">{row.user.email}</div>
      </div>
    ),
  },
  {
    id: "role",
    label: "Função",
    minWidth: 140,
    renderCell: (_, row) => (
      <Chip
        label={getRoleLabel(row.role)}
        color={getRoleColor(row.role)}
        size="small"
      />
    ),
  },
  {
    id: "createdAt",
    label: "Data de Entrada",
    minWidth: 140,
    renderCell: (_, row) => new Date(row.createdAt).toLocaleDateString("pt-BR"),
  },
  {
    id: "actions",
    label: "Ações",
    minWidth: 120,
    sortable: false,
    renderCell: (_, row) => {
      const canEdit =
        options.currentUserRole &&
        (options.currentUserRole === "OWNER" ||
          options.currentUserRole === "ADMIN") &&
        options.currentUserId !== row.userId; // Não pode editar a si mesmo

      const canDelete =
        options.currentUserRole === "OWNER" &&
        options.currentUserId !== row.userId; // Owner não pode remover a si mesmo

      return (
        <div className="flex gap-1">
          {canEdit && options.onEdit && (
            <Tooltip title="Editar função do membro" arrow>
              <IconButton
                size="small"
                color="primary"
                onClick={() => options.onEdit?.(row)}
              >
                <PencilIcon size={16} />
              </IconButton>
            </Tooltip>
          )}

          {canDelete && options.onDelete && (
            <Tooltip title="Remover membro da organização" arrow>
              <IconButton
                size="small"
                color="error"
                onClick={() => options.onDelete?.(row.id, row.user.name)}
              >
                <Trash2 size={16} />
              </IconButton>
            </Tooltip>
          )}
        </div>
      );
    },
  },
];

// Export legacy columns for backward compatibility
export const columns = createMemberColumns();
