"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState, useRef } from "react";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";

import { PlusIcon, Search, X } from "lucide-react";

import { Alert, Box, Button, Paper, Stack, TextField } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

// Configure dayjs to use Portuguese locale
dayjs.locale("pt-br");

import { Header } from "@/components/header";
import {
  searchContractSchema,
  SearchContractValues,
} from "@/features/contracts/schemas/search-contract";
import { FormContractValues } from "@/features/contracts/schemas/contract";
import { useContract } from "@/features/contracts/hooks/use-contract";
import { DataTable } from "@/components/common/data-table";
import { createColumns } from "@/features/contracts/components/columns";
import {
  ConfirmationDialog,
  useConfirmationDialog,
  FormDialog,
} from "@/components/common";
import {
  ContractForm,
  ContractFormRef,
} from "@/features/contracts/components/contract-form";
import { Contract } from "@/features/contracts/types/contract";

const ContractPage = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [editingContract, setEditingContract] = useState<Contract | null>(null);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(
    null
  );
  const contractFormRef = useRef<ContractFormRef>(null);

  const {
    contracts,
    contractsMeta,
    isLoadingContracts,
    error,
    page,
    limit,
    name,
    partner,
    clientName,
    startDate,
    endDate,
    applyFilters,
    setPage,
    setLimit,
    clearFilters,
    isCreatingContract,
    isUpdatingContract,
    createContract,
    updateContract,
    deleteContract,
    isDeletingContract,
    deleteContractError,
  } = useContract();

  const deleteDialog = useConfirmationDialog({
    title: "Excluir Contrato",
    message:
      "Tem certeza que deseja excluir este contrato? Esta ação não pode ser desfeita.",
    variant: "delete",
    confirmText: "Excluir",
  });

  const handleEditContract: (contract: Contract) => void = (
    contract: Contract
  ) => {
    setEditingContract(contract);
    setOpenDialog(true);
  };

  const handleDeleteContract = (contract: Contract) => {
    setSelectedContract(contract);
    deleteDialog.showDialog();
  };

  const handleOpenDialog = () => {
    setEditingContract(null);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingContract(null);
  };

  const handleContractSubmit = async (data: FormContractValues) => {
    console.log("handleContractSubmit called with:", data);
    console.log("editingContract:", editingContract);
    try {
      if (editingContract) {
        // Update existing contract
        console.log(
          "Attempting to update contract with ID:",
          editingContract.id
        );
        const result = await updateContract({
          id: editingContract.id,
          data,
        });
        console.log("Update result:", result);
      } else {
        // Create new contract
        console.log("Attempting to create new contract");
        const result = await createContract(data);
        console.log("Create result:", result);
      }
      console.log("Contract operation completed successfully");
    } catch (error) {
      console.error("Error in handleContractSubmit:", error);
      throw error; // Re-throw to let the form handle it
    }
  };

  const columns = createColumns({
    onEdit: handleEditContract,
    onDelete: handleDeleteContract,
  });

  const {
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<SearchContractValues>({
    resolver: zodResolver(searchContractSchema),
    defaultValues: {
      name: "",
      partner: "",
      clientName: "",
      startDate: "",
      endDate: "",
    },
  });

  // Sync form with hook state when URL params change
  useEffect(() => {
    reset({
      name: name || "",
      partner: partner || "",
      clientName: clientName || "",
      startDate: startDate || "",
      endDate: endDate || "",
    });
  }, [name, partner, clientName, startDate, endDate, reset]);

  const onSubmit = (data: SearchContractValues) => {
    applyFilters(data);
  };

  const handleClearFilters = () => {
    const resetValues = {
      name: "",
      partner: "",
      clientName: "",
      startDate: "",
      endDate: "",
    };
    reset(resetValues);
    clearFilters();
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
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
              onClick={() => handleOpenDialog()}
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

        {/* Filter Form */}
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
              <Box
                sx={{ flex: "1 1 240px", minWidth: { xs: "100%", sm: 240 } }}
              >
                <Controller
                  name="clientName"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      size="small"
                      label="Nome do cliente"
                      variant="outlined"
                      error={!!errors.clientName}
                      helperText={errors.clientName?.message}
                    />
                  )}
                />
              </Box>
              <Box
                sx={{ flex: "1 1 240px", minWidth: { xs: "100%", sm: 240 } }}
              >
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

              <Box
                sx={{ flex: "1 1 240px", minWidth: { xs: "100%", sm: 240 } }}
              >
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
              <Box
                sx={{ flex: "1 1 240px", minWidth: { xs: "100%", sm: 240 } }}
              >
                <Controller
                  name="startDate"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      label="Data Inicial"
                      value={field.value ? dayjs(field.value) : null}
                      onChange={(newValue: dayjs.Dayjs | null) => {
                        const formattedDate =
                          newValue && newValue.isValid()
                            ? newValue.toISOString()
                            : "";
                        field.onChange(formattedDate);
                      }}
                      slotProps={{
                        textField: {
                          size: "small",
                          fullWidth: true,
                          error: !!errors.startDate,
                          helperText: errors.startDate?.message,
                        },
                        popper: {
                          sx: {
                            zIndex: 9999,
                            "& .MuiPaper-root": {
                              backgroundColor: "background.paper",
                              border: "1px solid",
                              borderColor: "divider",
                              borderRadius: 2,
                              boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
                              overflow: "hidden",
                            },
                            "& .MuiPickersCalendarHeader-root": {
                              backgroundColor: "primary.main",
                              color: "primary.contrastText",
                              padding: "16px",
                            },
                            "& .MuiPickersCalendarHeader-label": {
                              color: "primary.contrastText",
                              fontWeight: "bold",
                            },
                            "& .MuiPickersArrowSwitcher-root": {
                              "& .MuiIconButton-root": {
                                color: "primary.contrastText",
                              },
                            },
                            "& .MuiDayCalendar-header": {
                              backgroundColor: "grey.50",
                            },
                            "& .MuiDayCalendar-weekDayLabel": {
                              backgroundColor: "grey.100",
                              color: "text.primary",
                              fontWeight: "bold",
                              fontSize: "0.875rem",
                            },
                            "& .MuiPickersDay-root": {
                              color: "text.primary",
                              fontSize: "0.875rem",
                              "&:hover": {
                                backgroundColor: "primary.light",
                                color: "primary.contrastText",
                              },
                              "&.Mui-selected": {
                                backgroundColor: "primary.main",
                                color: "primary.contrastText",
                                fontWeight: "bold",
                                "&:hover": {
                                  backgroundColor: "primary.dark",
                                },
                              },
                              "&.MuiPickersDay-today": {
                                border: "2px solid",
                                borderColor: "primary.main",
                              },
                            },
                            "& .MuiPickersDay-dayOutsideMonth": {
                              color: "text.disabled",
                            },
                          },
                        },
                      }}
                    />
                  )}
                />
              </Box>
              <Box
                sx={{ flex: "1 1 240px", minWidth: { xs: "100%", sm: 240 } }}
              >
                <Controller
                  name="endDate"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      label="Data Final"
                      value={field.value ? dayjs(field.value) : null}
                      onChange={(newValue: dayjs.Dayjs | null) => {
                        const formattedDate =
                          newValue && newValue.isValid()
                            ? newValue.toISOString()
                            : "";
                        field.onChange(formattedDate);
                      }}
                      slotProps={{
                        textField: {
                          size: "small",
                          fullWidth: true,
                          error: !!errors.endDate,
                          helperText: errors.endDate?.message,
                        },
                        popper: {
                          sx: {
                            zIndex: 9999,
                            "& .MuiPaper-root": {
                              backgroundColor: "background.paper",
                              border: "1px solid",
                              borderColor: "divider",
                              borderRadius: 2,
                              boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
                              overflow: "hidden",
                            },
                            "& .MuiPickersCalendarHeader-root": {
                              backgroundColor: "primary.main",
                              color: "primary.contrastText",
                              padding: "16px",
                            },
                            "& .MuiPickersCalendarHeader-label": {
                              color: "primary.contrastText",
                              fontWeight: "bold",
                            },
                            "& .MuiPickersArrowSwitcher-root": {
                              "& .MuiIconButton-root": {
                                color: "primary.contrastText",
                              },
                            },
                            "& .MuiDayCalendar-header": {
                              backgroundColor: "grey.50",
                            },
                            "& .MuiDayCalendar-weekDayLabel": {
                              backgroundColor: "grey.100",
                              color: "text.primary",
                              fontWeight: "bold",
                              fontSize: "0.875rem",
                            },
                            "& .MuiPickersDay-root": {
                              color: "text.primary",
                              fontSize: "0.875rem",
                              "&:hover": {
                                backgroundColor: "primary.light",
                                color: "primary.contrastText",
                              },
                              "&.Mui-selected": {
                                backgroundColor: "primary.main",
                                color: "primary.contrastText",
                                fontWeight: "bold",
                                "&:hover": {
                                  backgroundColor: "primary.dark",
                                },
                              },
                              "&.MuiPickersDay-today": {
                                border: "2px solid",
                                borderColor: "primary.main",
                              },
                            },
                            "& .MuiPickersDay-dayOutsideMonth": {
                              color: "text.disabled",
                            },
                          },
                        },
                      }}
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
                  campaigns: contract._count?.campaigns ?? 0,
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
              emptyMessage="Nenhum contrato encontrado"
              // Layout
              maxHeight={700}
              dense={true}
            />
          </div>
        </Paper>

        <FormDialog
          open={openDialog}
          onClose={handleCloseDialog}
          onSubmit={async (e) => {
            e.preventDefault();
            console.log("FormDialog onSubmit called - triggering ref submit");

            // Use the ref to trigger form submission
            if (contractFormRef.current) {
              await contractFormRef.current.submit();
            } else {
              console.error("ContractForm ref is not available");
            }
          }}
          title={editingContract ? "Editar Contrato" : "Novo Contrato"}
          mode={editingContract ? "edit" : "create"}
          isLoading={isCreatingContract || isUpdatingContract}
          maxWidth="md"
          fullWidth
        >
          <ContractForm
            ref={contractFormRef}
            key={editingContract?.id || "new"} // Force re-render when switching between create/edit
            contract={editingContract?.id}
            mode={editingContract ? "edit" : "create"}
            onSubmit={handleContractSubmit}
            onSuccess={handleCloseDialog}
          />
        </FormDialog>

        <ConfirmationDialog
          open={deleteDialog.isOpen}
          onClose={deleteDialog.hideDialog}
          onConfirm={async () => {
            if (selectedContract) {
              try {
                await deleteContract(selectedContract.id);
                setSelectedContract(null);
                deleteDialog.hideDialog();
              } catch (error) {
                console.error("Erro ao deletar contrato:", error);
              }
            }
          }}
          title="Excluir Contrato"
          message={
            selectedContract
              ? `Tem certeza que deseja excluir o contrato "${selectedContract.name}"? Esta ação não pode ser desfeita.`
              : "Tem certeza que deseja excluir este contrato? Esta ação não pode ser desfeita."
          }
          variant="delete"
          confirmText="Excluir"
          isLoading={isDeletingContract}
          disabled={isDeletingContract}
        />

        {deleteContractError && (
          <Alert severity="error" sx={{ mt: 2 }}>
            Erro ao excluir contrato: {deleteContractError}
          </Alert>
        )}
      </Box>
    </LocalizationProvider>
  );
};

export default ContractPage;
