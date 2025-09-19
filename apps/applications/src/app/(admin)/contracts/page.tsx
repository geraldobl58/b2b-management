"use client";

import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
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
import { useContract } from "@/features/contracts/hooks/use-contract";
import { DataTable } from "@/components/common/data-table";
import { createColumns } from "@/features/contracts/components/columns";
import { useConfirmationDialog } from "@/components/common";
import { Contract } from "@/features/contracts/types/contract";

const ContractPage = () => {
  const router = useRouter();

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

  const handleDeleteContract = () => {
    deleteDialog.showDialog();
    // TODO: Implement actual delete functionality
  };

  const columns = createColumns({
    onView: handleViewContract,
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
              onClick={() => router.push("/contracts/new")}
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
      </Box>
    </LocalizationProvider>
  );
};

export default ContractPage;
