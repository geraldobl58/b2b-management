import { Column, TableHelpers } from "@/components/common/data-table";

import { Chip } from "@mui/material";
import { Edit, Trash } from "lucide-react";

export const columns: Column[] = [
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
        className="w-35 text-xs font-bold"
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
        color="primary"
        variant="filled"
        className="w-35 text-xs font-bold"
      />
    ),
  },
  {
    id: "actions",
    label: "Ações",
    minWidth: 120,
    align: "center",
    sortable: false,
    renderCell: (_value: unknown) =>
      TableHelpers.renderActions([
        {
          icon: <Edit size={16} />,
          label: "Editar",
          color: "primary",
          onClick: () => {
            // TODO: Implementar delete
            console.log("Edit client");
          },
        },
        {
          icon: <Trash size={16} />,
          label: "Deletar",
          color: "error",
          onClick: () => {
            // TODO: Implementar delete
            console.log("Delete client");
          },
        },
      ]),
  },
];
