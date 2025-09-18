"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { PlusIcon, Search, X } from "lucide-react";

import { Alert, Box, Button, Paper, Stack, TextField } from "@mui/material";

import { Header } from "@/components/header";
import {
  searchContractSchema,
  SearchContractValues,
} from "@/features/contracts/schemas/search-contract";
import { useContract } from "@/features/contracts/hooks/use-contract";
import { DataTable } from "@/components/common/data-table";
import { createColumns } from "@/features/contracts/components/columns";
import { useConfirmationDialog } from "@/components/common";
import { Contract } from "@/features/contracts/types/contract";

const ContractPage = () => {
  const router = useRouter();
  const [selectedContract, setSelectedContract] = useState<Contract | null>(
    null
  );

  const {
    contracts,
    contractsMeta,
    isLoadingContracts,
    error,
    page,
    limit,
    name,
    partner,
    applyFilters,
    setPage,
    setLimit,
    clearFilters,
  } = useContract();

  const deleteDialog = useConfirmationDialog({
    title: "Excluir Contrato",
    message:
      "Tem certeza que deseja excluir este contrato? Esta ação não pode ser desfeita.",
    variant: "delete",
    confirmText: "Excluir",
  });

  const handleViewContract = (contract: Contract) => {
    router.push(`/contracts/${contract.id}/view`);
  };

  const handleEditContract: (contract: Contract) => void = (
    contract: Contract
  ) => {
    router.push(`/contracts/${contract.id}`);
  };

  const handleDeleteContract = (contract: Contract) => {
    setSelectedContract(contract);
    deleteDialog.showDialog();
  };

  const columns = createColumns({
    onView: handleViewContract,
    onEdit: handleEditContract,
    onDelete: handleDeleteContract,
  });

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<SearchContractValues>({
    resolver: zodResolver(searchContractSchema),
    defaultValues: {
      name: name || "",
      partner: partner || "",
    },
  });

  const onSubmit = (data: SearchContractValues) => {
    applyFilters(data);
  };

  const handleClearFilters = () => {
    const resetValues = {
      name: "",
      partner: "",
    };
    reset(resetValues);
    clearFilters();
  };

  return (
    <Box>
      <Header
        title="Contratos"
        description="Gerencie os contratos da sua empresa, aqui você pode adicionar, editar ou remover contratos."
        content={
          <Button
            className="normal-case"
            variant="contained"
            color="primary"
            startIcon={<PlusIcon />}
            onClick={() => router.push("/clients/new")}
          >
            Adicionar Contrato
          </Button>
        }
      />
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Erro ao carregar o contrato: {error}
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
            <Box sx={{ flex: "1 1 240px", minWidth: { xs: "100%", sm: 240 } }}>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    size="small"
                    label="Nome do contrato"
                    variant="outlined"
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                )}
              />
            </Box>

            <Box sx={{ flex: "1 1 240px", minWidth: { xs: "100%", sm: 240 } }}>
              <Controller
                name="partner"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    size="small"
                    label="Nome do parceiro"
                    variant="outlined"
                    error={!!errors.partner}
                    helperText={errors.partner?.message}
                  />
                )}
              />
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
              contracts?.map((contract) => ({
                ...contract,
                campaigns: contract._count?.contracts ?? 0,
                actions: "", // Placeholder, handled by renderCell
              })) ?? []
            }
            columns={columns}
            loading={isLoadingContracts}
            getRowId={(row) => row.id}
            // Pagination
            page={page - 1} // DataTable uses 0-based pagination
            rowsPerPage={limit}
            totalCount={contractsMeta?.total || 0}
            onPageChange={(newPage) => setPage(newPage + 1)} // Convert to 1-based
            onRowsPerPageChange={setLimit}
            // Features
            showPagination
            stickyHeader
            emptyMessage="Nenhum cliente encontrado"
            // Layout
            maxHeight={700}
            dense={true}
          />
        </div>
      </Paper>
    </Box>
  );
};

export default ContractPage;
