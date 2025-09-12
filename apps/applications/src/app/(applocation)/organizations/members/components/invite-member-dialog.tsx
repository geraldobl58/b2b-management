"use client";

import { useState } from "react";
import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { FormDialog } from "@/components/common";
import { memberInviteSchema, MemberInviteData } from "@/schemas/member";

interface InviteMemberDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (
    data: MemberInviteData
  ) => Promise<{ success: boolean; error?: string }>;
  isLoading: boolean;
}

export const InviteMemberDialog = ({
  open,
  onClose,
  onSubmit,
  isLoading,
}: InviteMemberDialogProps) => {
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<MemberInviteData>({
    resolver: zodResolver(memberInviteSchema),
    defaultValues: {
      email: "",
      role: "VIEWER",
    },
  });

  const handleClose = () => {
    reset();
    setSubmitError(null);
    onClose();
  };

  const handleFormSubmit = async (data: MemberInviteData) => {
    setSubmitError(null);

    const result = await onSubmit(data);

    if (result.success) {
      reset();
      onClose();
    } else {
      setSubmitError(result.error || "Erro ao convidar membro");
    }
  };

  const roleValue = watch("role");

  return (
    <FormDialog
      open={open}
      onClose={handleClose}
      title="Convidar Novo Membro"
      mode="create"
      onSubmit={handleSubmit(handleFormSubmit)}
      submitText="Enviar Convite"
      cancelText="Cancelar"
      maxWidth="sm"
      isLoading={isLoading}
      hasErrors={!!submitError || Object.keys(errors).length > 0}
      errorMessage={submitError}
    >
      <div className="space-y-6">
        <p className="text-gray-600 text-sm mb-4">
          Para adicionar um novo membro, envie um convite por email. O usuário
          receberá um link para aceitar o convite e se juntar à organização.
        </p>

        <TextField
          fullWidth
          label="E-mail do Membro"
          placeholder="Ex: membro@exemplo.com"
          {...register("email")}
          error={!!errors.email}
          helperText={
            errors.email?.message || "E-mail do membro a ser convidado"
          }
          required
          disabled={isLoading}
          autoComplete="email"
        />

        <FormControl fullWidth error={!!errors.role}>
          <InputLabel id="invite-member-role-label">Função</InputLabel>
          <Select
            labelId="invite-member-role-label"
            value={roleValue}
            label="Função"
            onChange={(e) =>
              setValue("role", e.target.value as MemberInviteData["role"])
            }
            required
            disabled={isLoading}
          >
            <MenuItem value="VIEWER">
              <div>
                <div className="font-medium">Visualizador</div>
                <div className="text-xs text-gray-500">
                  Acesso apenas de leitura
                </div>
              </div>
            </MenuItem>
            <MenuItem value="ANALYST">
              <div>
                <div className="font-medium">Analista</div>
                <div className="text-xs text-gray-500">
                  Visualizar relatórios e métricas
                </div>
              </div>
            </MenuItem>
            <MenuItem value="MANAGER">
              <div>
                <div className="font-medium">Gerente</div>
                <div className="text-xs text-gray-500">
                  Gerenciar campanhas, leads e conteúdo
                </div>
              </div>
            </MenuItem>
            <MenuItem value="ADMIN">
              <div>
                <div className="font-medium">Administrador</div>
                <div className="text-xs text-gray-500">
                  Gerenciar membros e configurações
                </div>
              </div>
            </MenuItem>
            <MenuItem value="OWNER">
              <div>
                <div className="font-medium">Proprietário</div>
                <div className="text-xs text-gray-500">
                  Acesso total, incluindo exclusão da organização
                </div>
              </div>
            </MenuItem>
          </Select>
          <FormHelperText>
            {errors.role?.message || "Selecione uma função para o novo membro"}
          </FormHelperText>
        </FormControl>

        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-900 mb-2">
            💡 Como funciona o convite
          </h4>
          <div className="text-sm text-blue-800 space-y-1">
            <p>• O usuário receberá um email com um link de convite</p>
            <p>• O convite expira em 7 dias após o envio</p>
            <p>
              • Se o usuário não possui conta, será direcionado para o cadastro
            </p>
            <p>• Após aceitar, o usuário aparecerá na lista de membros</p>
          </div>
        </div>
      </div>
    </FormDialog>
  );
};
