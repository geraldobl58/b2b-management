import { IconButton } from "@mui/material";

import { PencilIcon, X } from "lucide-react";

import { Column } from "@/components/common/data-table";

export const columns: Column[] = [
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
    renderCell: () => (
      <div className="flex gap-2">
        <IconButton size="small">
          <PencilIcon />
        </IconButton>
        <IconButton size="small">
          <X />
        </IconButton>
      </div>
    ),
  },
];
