import { IconButton } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { PencilIcon, X } from "lucide-react";

const columns: GridColDef[] = [
  { field: "member", headerName: "Membro", flex: 1, minWidth: 120 },
  { field: "email", headerName: "Email", flex: 2, minWidth: 180 },
  { field: "role", headerName: "Função", flex: 1, minWidth: 140 },
  {
    field: "dateJoined",
    headerName: "Data de Entrada",
    flex: 1,
    minWidth: 140,
  },
  {
    field: "actions",
    headerName: "Ações",
    sortable: false,
    filterable: false,
    resizable: false,
    flex: 0.7,
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

const rows = [
  {
    id: 1,
    member: "John Smith",
    email: "john@acme.com",
    role: "Admin",
    dateJoined: "01/01/2025",
  },
];

export const ListMembers = () => {
  return (
    <>
      {/* full height/width container for DataGrid */}
      <div
        style={{ height: "60vh", width: "100%" }}
        className="rounded-md overflow-hidden"
      >
        <DataGrid
          rows={rows}
          columns={columns}
          pageSizeOptions={[5, 10]}
          // let the grid fill the container
          autoHeight={false}
          density="standard"
          // feature toggles - keep as in original but updated names
          disableColumnFilter
          disableColumnMenu
          disableColumnSelector
          disableDensitySelector
          disableColumnSorting
          // selection
          checkboxSelection={false}
          disableRowSelectionOnClick
          sx={{
            "& .MuiDataGrid-virtualScroller": { background: "transparent" },
            "& .MuiDataGrid-cell": { outline: "none" },
            "& .MuiDataGrid-columnHeaders": { backgroundColor: "transparent" },
            height: "100%",
          }}
        />
      </div>
      {/* Role Information */}
      <div className="mt-6 bg-blue-50 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-900 mb-2">
          Sobre as Funções
        </h4>
        <div className="text-sm text-blue-800 space-y-1">
          <p>
            <strong>OWNER:</strong> Acesso total, incluindo exclusão da
            organização
          </p>
          <p>
            <strong>ADMIN:</strong> Gerenciar membros, configurações e todas as
            funcionalidades
          </p>
          <p>
            <strong>MANAGER:</strong> Gerenciar campanhas, leads e conteúdo
          </p>
          <p>
            <strong>ANALYST:</strong> Visualizar relatórios e métricas
          </p>
          <p>
            <strong>VIEWER:</strong> Acesso apenas de leitura
          </p>
        </div>
      </div>
    </>
  );
};
