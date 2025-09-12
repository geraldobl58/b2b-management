"use client";

import { IconButton } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { PencilIcon, X } from "lucide-react";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", flex: 0.6, minWidth: 80 },
  { field: "name", headerName: "Nome da Organização", flex: 2, minWidth: 180 },
  { field: "slug", headerName: "Slug", flex: 1, minWidth: 140 },
  { field: "industry", headerName: "Setor", flex: 1, minWidth: 120 },
  { field: "companySize", headerName: "Tamanho", flex: 1, minWidth: 120 },
  {
    field: "currentUserRole",
    headerName: "Sua Função",
    flex: 1,
    minWidth: 120,
  },
  { field: "plan", headerName: "Plano", flex: 1, minWidth: 120 },
  {
    field: "memberCount",
    headerName: "Membros",
    type: "number",
    flex: 0.8,
    minWidth: 100,
  },
  {
    field: "workspaceCount",
    headerName: "Workspaces",
    type: "number",
    flex: 0.8,
    minWidth: 100,
  },
  {
    field: "actions",
    headerName: "Ações",
    flex: 0.9,
    minWidth: 120,
    sortable: false,
    filterable: false,
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

const rows = [
  {
    id: "org_1",
    name: "ACME Corporation",
    slug: "acme-corp",
    industry: "Technology",
    companySize: "51-200",
    currentUserRole: "OWNER",
    memberCount: 3,
    workspaceCount: 2,
    plan: "PRO",
  },
  {
    id: "org_2",
    name: "Startup Inc",
    slug: "startup-inc",
    industry: "SaaS",
    companySize: "11-50",
    currentUserRole: "ADMIN",
    memberCount: 1,
    workspaceCount: 1,
    plan: "BASIC",
  },
  {
    id: "org_3",
    name: "Tech Solutions",
    slug: "tech-solutions",
    industry: "Technology",
    companySize: "201-500",
    currentUserRole: "MANAGER",
    memberCount: 8,
    workspaceCount: 4,
    plan: "ENTERPRISE",
  },
  {
    id: "org_4",
    name: "Digital Marketing Co",
    slug: "digital-marketing",
    industry: "Marketing",
    companySize: "11-50",
    currentUserRole: "ANALYST",
    memberCount: 5,
    workspaceCount: 3,
    plan: "PRO",
  },
  {
    id: "org_5",
    name: "E-commerce Plus",
    slug: "ecommerce-plus",
    industry: "E-commerce",
    companySize: "101-250",
    currentUserRole: "VIEWER",
    memberCount: 12,
    workspaceCount: 6,
    plan: "ENTERPRISE",
  },
];

const paginationModel = { page: 0, pageSize: 5 };

export const ListOrganization = () => {
  return (
    <div
      style={{ width: "100%", height: "55vh" }}
      className="rounded-md overflow-hidden"
    >
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10]}
        autoHeight={false}
        density="standard"
        disableColumnFilter
        disableColumnMenu
        disableColumnSelector
        disableDensitySelector
        disableColumnSorting
        checkboxSelection={false}
        disableRowSelectionOnClick
        sx={{ height: "100%" }}
      />
    </div>
  );
};
