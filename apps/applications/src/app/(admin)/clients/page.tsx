"use client";

import { useRouter } from "next/navigation";
import { PlusIcon } from "lucide-react";

import { DataTable } from "@/components/common/data-table";
import { Header } from "@/components/header";
import { useClient } from "@/hooks/use-client";
import { Box, Button, Alert } from "@mui/material";
import { columns } from "./components/columns";

const ClientsPage = () => {
  const {
    clients,
    clientsMeta,
    isLoadingClients,
    error,
    page,
    limit,
    setPage,
    setLimit,
  } = useClient();

  const router = useRouter();

  return (
    <Box>
      <Header
        title="Clientes"
        description="Gerencie os clientes da sua empresa, aqui você pode adicionar, editar ou remover clientes."
        content={
          <Button
            className="normal-case"
            variant="contained"
            color="primary"
            onClick={() => router.push("/clients/new")}
          >
            <PlusIcon className="mr-2" size={16} />
            Adicionar Cliente
          </Button>
        }
      />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Erro ao carregar clientes: {error}
        </Alert>
      )}

      <DataTable
        data={
          clients?.map((client) => ({
            ...client,
            campaigns: client._count?.campaigns ?? 0,
            contracts: client._count?.contracts ?? 0,
            actions: "", // Placeholder, handled by renderCell
          })) ?? []
        }
        columns={columns}
        loading={isLoadingClients}
        getRowId={(row) => row.id}
        // Pagination
        page={page - 1} // DataTable uses 0-based pagination
        rowsPerPage={limit}
        totalCount={clientsMeta?.total || 0}
        onPageChange={(newPage) => setPage(newPage + 1)} // Convert to 1-based
        onRowsPerPageChange={setLimit}
        // Features
        showPagination
        stickyHeader
        emptyMessage="Nenhum cliente encontrado"
        // Layout
        maxHeight={700}
        dense={false}
      />
    </Box>
  );
};

export default ClientsPage;
