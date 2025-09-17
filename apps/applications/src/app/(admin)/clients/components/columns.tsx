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
