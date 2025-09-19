"use client";

import { useForm } from "react-hook-form";
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
import { Box } from "@mui/material";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import {
  useContract,
  useContractById,
} from "@/features/contracts/hooks/use-contract";
import { useClient } from "@/features/clients/hooks/use-client";
import {
  ClientSelect,
  ContractBasicFields,
  DateRangeFields,
  LoadingState,
} from "./shared";
import { DatePickerProvider, FormErrorAlert } from "@/components/shared";

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
            await onSubmit(data);
            onSuccess?.();
          } else {
            // Fallback to internal logic
            if (mode === "create") {
              await createContract(data);
            } else if (mode === "edit" && contractId) {
              await updateContract({ id: contractId, data });
            }
            onSuccess?.();
          }
          console.log("Form submission completed successfully");
        } catch (error) {
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
      return <LoadingState isLoading={true} />;
    }

    // Show error if contract not found
    if (
      mode === "edit" &&
      contractId &&
      !isLoadingContract &&
      !contractData &&
      contractError
    ) {
      return <LoadingState error={contractError} />;
    }

    return (
      <DatePickerProvider>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <FormErrorAlert error={error} />

          <ClientSelect
            control={control}
            errors={errors}
            clients={clients}
            isLoading={isLoading}
            isLoadingClients={isLoadingClients}
          />

          <ContractBasicFields
            control={control}
            errors={errors}
            isLoading={isLoading}
          />

          <DateRangeFields
            control={control}
            errors={errors}
            startDate={startDate}
            isLoading={isLoading}
          />
        </Box>
      </DatePickerProvider>
    );
  }
);

ContractForm.displayName = "ContractForm";
