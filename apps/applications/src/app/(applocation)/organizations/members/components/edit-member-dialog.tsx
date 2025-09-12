"use client";

import { useState } from "react";
import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { FormDialog } from "@/components/common";
import { memberUpdateSchema, MemberUpdateData } from "@/schemas/member";
import { MemberResponse } from "@/http/member";
import { useMember } from "@/hooks/use-member";

interface EditMemberDialogProps {
  open: boolean;
  onClose: () => void;
  memberData: MemberResponse | null;
  organizationId: string;
}

export const EditMemberDialog = ({
  open,
  onClose,
  memberData,
  organizationId,
}: EditMemberDialogProps) => {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { updateMemberRole, isUpdating } = useMember();

  const {
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<MemberUpdateData>({
    resolver: zodResolver(memberUpdateSchema),
    defaultValues: {
      role: memberData?.role || "VIEWER",
    },
  });

  const handleClose = () => {
    reset();
    setSubmitError(null);
    onClose();
  };

  const handleFormSubmit = async (data: MemberUpdateData) => {
    if (!memberData) return;

    setSubmitError(null);
    
    await updateMemberRole(organizationId, memberData.id, data, {
      onSuccess: () => {
        reset();
        onClose();
      },
      onError: (error) => {
        setSubmitError(error);
      },
    });
  };

  const roleValue = watch("role");

  // Atualizar valores quando memberData muda
  useState(() => {
    if (memberData) {
      setValue("role", memberData.role);
    }
  });

  if (!memberData) return null;

  return (
    <FormDialog
      open={open}
      onClose={handleClose}
      title="Editar Função do Membro"
      mode="edit"
      onSubmit={handleSubmit(handleFormSubmit)}
      submitText="Atualizar Função"
      cancelText="Cancelar"
      maxWidth="sm"
      isLoading={isUpdating}
      hasErrors={!!submitError || Object.keys(errors).length > 0}
      errorMessage={submitError}
    >
      <div className="space-y-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">
            Informações do Membro
          </h4>
          <div className="space-y-1">
            <p className="text-sm text-gray-600">
              <strong>Nome:</strong> {memberData.user.name}
            </p>
            <p className="text-sm text-gray-600">
              <strong>E-mail:</strong> {memberData.user.email}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Função atual:</strong> {memberData.role}
            </p>
          </div>
        </div>

        <FormControl fullWidth error={!!errors.role}>
          <InputLabel id="edit-member-role-label">Nova Função</InputLabel>
          <Select
            labelId="edit-member-role-label"
            value={roleValue}
            label="Nova Função"
            onChange={(e) => setValue("role", e.target.value as MemberUpdateData["role"])}
            required
            disabled={isUpdating}
          >
            <MenuItem value="VIEWER">
              <div>
                <div className="font-medium">Visualizador</div>
                <div className="text-xs text-gray-500">Acesso apenas de leitura</div>
              </div>
            </MenuItem>
            <MenuItem value="ANALYST">
              <div>
                <div className="font-medium">Analista</div>
                <div className="text-xs text-gray-500">Visualizar relatórios e métricas</div>
              </div>
            </MenuItem>
            <MenuItem value="MANAGER">
              <div>
                <div className="font-medium">Gerente</div>
                <div className="text-xs text-gray-500">Gerenciar campanhas, leads e conteúdo</div>
              </div>
            </MenuItem>
            <MenuItem value="ADMIN">
              <div>
                <div className="font-medium">Administrador</div>
                <div className="text-xs text-gray-500">Gerenciar membros e configurações</div>
              </div>
            </MenuItem>
            <MenuItem value="OWNER">
              <div>
                <div className="font-medium">Proprietário</div>
                <div className="text-xs text-gray-500">Acesso total, incluindo exclusão da organização</div>
              </div>
            </MenuItem>
          </Select>
          <FormHelperText>
            {errors.role?.message || "Selecione a nova função para este membro"}
          </FormHelperText>
        </FormControl>

        <div className="bg-yellow-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-yellow-900 mb-2">
            ⚠️ Aviso Importante
          </h4>
          <div className="text-sm text-yellow-800 space-y-1">
            <p>• A mudança de função será aplicada imediatamente</p>
            <p>• O membro receberá notificação sobre a alteração</p>
            <p>• Certifique-se de que a nova função é apropriada</p>
            <p>• Proprietários têm acesso total à organização</p>
          </div>
        </div>
      </div>
    </FormDialog>
  );
};