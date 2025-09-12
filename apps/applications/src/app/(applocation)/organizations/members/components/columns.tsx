import { IconButton } from "@mui/material";

import { PencilIcon, X } from "lucide-react";

import { Column } from "@/components/common/data-table";

export const columns: Column[] = [
  { id: "member", label: "Membro", minWidth: 120 },
  { id: "email", label: "Email", minWidth: 180 },
  { id: "role", label: "Função", minWidth: 140 },
  {
    id: "dateJoined",
    label: "Data de Entrada",
    minWidth: 140,
  },
  {
    id: "actions",
    label: "Ações",
    sortable: false,
    minWidth: 120,
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
