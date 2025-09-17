"use client";

import { useRouter } from "next/navigation";
import { PlusIcon, Search, X } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

import { DataTable } from "@/components/common/data-table";
import { Header } from "@/components/header";
import { useClient } from "@/hooks/use-client";
import {
  searchClientSchema,
  SearchClientValues,
} from "@/schemas/search-client";
import {
  Box,
  Button,
  Alert,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Stack,
} from "@mui/material";
import { createColumns } from "./components/columns";
import { cnpjMask } from "@/lib/masks";
import { Client } from "@/types/client";
import {
  ConfirmationDialog,
  useConfirmationDialog,
} from "@/components/common/confirmation-dialog";

const ClientsPage = () => {
  const router = useRouter();
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const {
    clients,
    clientsMeta,
    isLoadingClients,
    error,
    page,
    limit,
    cnpj,
    companyName,
    fantasyName,
    taxpayerType,
    setPage,
    setLimit,
    applyFilters,
    clearFilters,
    deleteClient,
    isDeleting,
    deleteClientError,
  } = useClient();

  const deleteDialog = useConfirmationDialog({
    title: "Excluir Cliente",
    message:
      "Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita.",
    variant: "delete",
    confirmText: "Excluir",
  });

  const handleViewClient = (client: Client) => {
    router.push(`/clients/${client.id}/view`);
  };

  const handleEditClient: (client: Client) => void = (client: Client) => {
    router.push(`/clients/${client.id}`);
  };

  const handleDeleteClient = (client: Client) => {
    setSelectedClient(client);
    deleteDialog.showDialog();
  };

  const columns = createColumns({
    onView: handleViewClient,
    onEdit: handleEditClient,
    onDelete: handleDeleteClient,
  });

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<SearchClientValues>({
    resolver: zodResolver(searchClientSchema),
    defaultValues: {
      cnpj: cnpj || "",
      companyName: companyName || "",
      fantasyName: fantasyName || "",
      taxpayerType: taxpayerType || "",
    },
  });

  const onSubmit = (data: SearchClientValues) => {
    applyFilters(data);
  };

  const handleClearFilters = () => {
    const resetValues = {
      cnpj: "",
      companyName: "",
      fantasyName: "",
      taxpayerType: "",
    };
    reset(resetValues);
    clearFilters();
  };

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
            startIcon={<PlusIcon />}
            onClick={() => router.push("/clients/new")}
          >
            Adicionar Cliente
          </Button>
        }
      />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Erro ao carregar clientes: {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <Paper
          elevation={1}
          sx={{ display: "block", width: "100%" }}
          className="w-full max-w-full p-4 space-y-8"
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            alignItems="flex-end"
            sx={{ flexWrap: "wrap" }}
          >
            {/* CNPJ - ocupa largura disponível, mas respeita minWidth */}
            <Box sx={{ flex: "1 1 240px", minWidth: { xs: "100%", sm: 240 } }}>
              <Controller
                name="cnpj"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    size="small"
                    label="CNPJ"
                    variant="outlined"
                    placeholder="XX.XXX.XXX/XXXX-XX"
                    error={!!errors.cnpj}
                    helperText={errors.cnpj?.message}
                    onChange={(e) => {
                      const maskedValue = cnpjMask(e.target.value);
                      field.onChange(maskedValue);
                    }}
                    slotProps={{ htmlInput: { maxLength: 18 } }}
                  />
                )}
              />
            </Box>

            {/* Company name */}
            <Box sx={{ flex: "1 1 320px", minWidth: { xs: "100%", sm: 240 } }}>
              <Controller
                name="companyName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    size="small"
                    label="Empresa"
                    variant="outlined"
                    error={!!errors.companyName}
                    helperText={errors.companyName?.message}
                  />
                )}
              />
            </Box>

            {/* Fantasy name */}
            <Box sx={{ flex: "1 1 320px", minWidth: { xs: "100%", sm: 240 } }}>
              <Controller
                name="fantasyName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    size="small"
                    label="Nome Fantasia"
                    variant="outlined"
                    error={!!errors.fantasyName}
                    helperText={errors.fantasyName?.message}
                  />
                )}
              />
            </Box>

            {/* Taxpayer type - keep a reasonable min width */}
            <Box sx={{ flex: "0 1 220px", minWidth: { xs: "100%", sm: 220 } }}>
              <FormControl fullWidth size="small" error={!!errors.taxpayerType}>
                <InputLabel>Tipo de Contribuinte</InputLabel>
                <Select
                  {...register("taxpayerType")}
                  label="Tipo de Contribuinte"
                  defaultValue=""
                >
                  <MenuItem value="">Todos</MenuItem>
                  <MenuItem value="MEI">MEI</MenuItem>
                  <MenuItem value="INSENTO">Isento</MenuItem>
                  <MenuItem value="SIMPLES_NACIONAL">Simples Nacional</MenuItem>
                  <MenuItem value="LUCRO_PRESUMIDO">Lucro Presumido</MenuItem>
                  <MenuItem value="LUCRO_REAL">Lucro Real</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* Action buttons - kept fixed size and aligned */}
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <Button
                type="submit"
                size="small"
                variant="contained"
                color="primary"
                startIcon={<Search />}
                sx={{ minWidth: 120, height: 40 }}
              >
                Filtrar
              </Button>

              <Button
                type="button"
                size="small"
                variant="contained"
                color="error"
                startIcon={<X />}
                onClick={handleClearFilters}
                sx={{ minWidth: 120, height: 40 }}
              >
                Limpar
              </Button>
            </Box>
          </Stack>
        </Paper>
      </Box>

      <Paper
        elevation={3}
        sx={{ display: "block", width: "100%", mt: 5 }}
        className="w-full max-w-full p-4 space-y-8"
      >
        <div>
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
        </div>
      </Paper>

      {deleteClientError && (
        <Alert severity="error" sx={{ mt: 2 }}>
          Erro ao excluir cliente: {deleteClientError}
        </Alert>
      )}

      <ConfirmationDialog
        open={deleteDialog.isOpen}
        onClose={deleteDialog.hideDialog}
        onConfirm={async () => {
          if (selectedClient) {
            console.log(
              "Deletando cliente:",
              selectedClient.id,
              selectedClient.companyName
            );
            try {
              await deleteClient(selectedClient.id);
              console.log("Cliente deletado com sucesso");
              setSelectedClient(null);
              deleteDialog.hideDialog();
            } catch (error) {
              console.error("Erro ao deletar cliente:", error);
            }
          }
        }}
        title="Excluir Cliente"
        message={
          selectedClient
            ? `Tem certeza que deseja excluir o cliente "${selectedClient.companyName}"? Esta ação não pode ser desfeita.`
            : "Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita."
        }
        variant="delete"
        confirmText="Excluir"
        isLoading={isDeleting}
        disabled={isDeleting}
      />
    </Box>
  );
};

export default ClientsPage;
