"use client";

import { useForm, Controller } from "react-hook-form";
import {
  useState,
  useEffect,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  formContractSchema,
  FormContractValues,
} from "@/features/contracts/schemas/contract";
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  FormHelperText,
  Alert,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import {
  useContract,
  useContractById,
} from "@/features/contracts/hooks/use-contract";
import { useClient } from "@/features/clients/hooks/use-client";

dayjs.locale("pt-br");

interface ContractFormProps {
  onSuccess?: () => void;
  onSubmit?: (data: FormContractValues) => void | Promise<void>;
  mode?: "create" | "edit";
  contract?: string; // contract ID for edit mode
}

export interface ContractFormRef {
  submit: () => Promise<void>;
}

export const ContractForm = forwardRef<ContractFormRef, ContractFormProps>(
  ({ onSuccess, onSubmit, mode = "create", contract }, ref) => {
    const {
      createContract,
      updateContract,
      isCreatingContract,
      isUpdatingContract,
      createContractError,
      updateContractError,
    } = useContract();

    // Get contract data for edit mode
    const contractId = contract || "";
    const {
      data: contractData,
      isLoading: isLoadingContract,
      error: contractError,
    } = useContractById(contractId);

    // Get clients for dropdown
    const { clients, isLoadingClients } = useClient();

    const [submitError, setSubmitError] = useState<string | null>(null);

    const {
      control,
      reset,
      trigger,
      getValues,
      watch,
      formState: { errors },
    } = useForm<FormContractValues>({
      resolver: zodResolver(formContractSchema),
      defaultValues: {
        clientId: "",
        name: "",
        partner: "",
        startDate: new Date(),
        endDate: new Date(),
      },
    });

    // Watch startDate to validate endDate
    const startDate = watch("startDate"); // Reset form when contract data loads (edit mode)
    useEffect(() => {
      if (mode === "edit" && contractData && contractId) {
        console.log("Contract data received:", contractData);
        const resetData = {
          clientId: contractData.clientId || "",
          name: contractData.name || "",
          partner: contractData.partner || "",
          startDate: contractData.startDate
            ? new Date(contractData.startDate)
            : new Date(),
          endDate: contractData.endDate
            ? new Date(contractData.endDate)
            : new Date(),
        };
        console.log("Resetting form with:", resetData);
        reset(resetData);
      } else if (mode === "create") {
        // Reset to default values for create mode
        reset({
          clientId: "",
          name: "",
          partner: "",
          startDate: new Date(),
          endDate: new Date(),
        });
      }
    }, [contractData, mode, reset, contractId]);

    const onSubmitHandler = useCallback(
      async (data: FormContractValues) => {
        console.log("onSubmitHandler called with:", data);
        console.log("Mode:", mode, "ContractId:", contractId);
        console.log("onSubmit prop:", onSubmit);
        try {
          setSubmitError(null);

          if (onSubmit) {
            console.log("Using external onSubmit handler");
            // Use external onSubmit handler (for FormDialog integration)
            await onSubmit(data);
            console.log("External onSubmit completed");
            onSuccess?.();
          } else {
            console.log("Using internal logic");
            // Fallback to internal logic
            if (mode === "create") {
              console.log("Creating contract");
              await createContract(data);
            } else if (mode === "edit" && contractId) {
              console.log("Updating contract with id:", contractId);
              await updateContract({ id: contractId, data });
            }
            onSuccess?.();
          }
          console.log("Form submission completed successfully");
        } catch (error) {
          console.error("Error submitting form:", error);
          setSubmitError(
            error instanceof Error ? error.message : "Erro desconhecido"
          );
        }
      },
      [onSubmit, onSuccess, mode, contractId, createContract, updateContract]
    );

    // Expose submit function via ref
    useImperativeHandle(
      ref,
      () => ({
        submit: async () => {
          console.log("Manual submit triggered via ref");
          const isValid = await trigger();
          if (isValid) {
            const data = getValues();
            await onSubmitHandler(data);
          } else {
            console.log("Form validation failed");
          }
        },
      }),
      [trigger, getValues, onSubmitHandler]
    );

    const isLoading =
      isCreatingContract || isUpdatingContract || isLoadingContract;
    const error =
      createContractError ||
      updateContractError ||
      contractError ||
      submitError;

    // Don't render form until contract data is loaded for edit mode
    if (mode === "edit" && contractId && isLoadingContract) {
      return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
          <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
            Carregando dados do contrato...
          </Box>
        </LocalizationProvider>
      );
    }

    // Show error if contract not found
    if (
      mode === "edit" &&
      contractId &&
      !isLoadingContract &&
      !contractData &&
      contractError
    ) {
      return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
          <Alert severity="error" sx={{ mb: 2 }}>
            Erro ao carregar contrato: {contractError}
          </Alert>
        </LocalizationProvider>
      );
    }

    return (
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {/* Client Selection */}
          <Controller
            name="clientId"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.clientId}>
                <InputLabel>Cliente *</InputLabel>
                <Select
                  {...field}
                  label="Cliente *"
                  disabled={isLoading || isLoadingClients}
                >
                  {clients?.map((client) => (
                    <MenuItem key={client.id} value={client.id}>
                      {client.companyName} (
                      {client.fantasyName || "Sem nome fantasia"})
                    </MenuItem>
                  ))}
                </Select>
                {errors.clientId && (
                  <FormHelperText>{errors.clientId.message}</FormHelperText>
                )}
              </FormControl>
            )}
          />

          {/* Contract Name */}
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Nome do Contrato"
                error={!!errors.name}
                helperText={errors.name?.message}
                disabled={isLoading}
              />
            )}
          />

          {/* Partner */}
          <Controller
            name="partner"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Parceiro"
                error={!!errors.partner}
                helperText={errors.partner?.message}
                disabled={isLoading}
              />
            )}
          />

          {/* Date Range */}
          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexDirection: { xs: "column", sm: "row" },
            }}
          >
            {/* Start Date */}
            <Controller
              name="startDate"
              control={control}
              render={({ field }) => (
                <DatePicker
                  label="Data de Início *"
                  value={field.value ? dayjs(field.value) : null}
                  onChange={(newValue: dayjs.Dayjs | null) => {
                    field.onChange(newValue ? newValue.toDate() : null);
                  }}
                  disabled={isLoading}
                  minDate={dayjs()} // Disable past dates
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!errors.startDate,
                      helperText: errors.startDate?.message,
                    },
                  }}
                />
              )}
            />

            {/* End Date */}
            <Controller
              name="endDate"
              control={control}
              render={({ field }) => (
                <DatePicker
                  label="Data de Término *"
                  value={field.value ? dayjs(field.value) : null}
                  onChange={(newValue: dayjs.Dayjs | null) => {
                    field.onChange(newValue ? newValue.toDate() : null);
                  }}
                  disabled={isLoading}
                  minDate={
                    startDate
                      ? dayjs(startDate).add(1, "day")
                      : dayjs().add(1, "day")
                  } // Minimum is start date + 1 day or tomorrow
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!errors.endDate,
                      helperText: errors.endDate?.message,
                    },
                  }}
                />
              )}
            />
          </Box>
        </Box>
      </LocalizationProvider>
    );
  }
);

ContractForm.displayName = "ContractForm";
