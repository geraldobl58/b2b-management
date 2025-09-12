"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { DataTable } from "@/components/common/data-table";
import { ConfirmationDialog } from "@/components/common";
import { createMemberColumns } from "./columns";
import { EditMemberDialog } from "./edit-member-dialog";
import { useMembers, useMember } from "@/hooks/use-member";
import { useConfirmation } from "@/hooks/use-confirmation";
import { useOrganizationDetails } from "@/hooks/use-organization-details";
import { MemberResponse } from "@/types/member";

export const ListMembers = () => {
  const params = useParams();
  const organizationId = (params.organizationId as string) || "";
  const { members, isLoading, refetch } = useMembers(organizationId);
  const { organization } = useOrganizationDetails(organizationId);
  const { removeMember, isRemoving } = useMember();
  const confirmation = useConfirmation();

  const [editDialog, setEditDialog] = useState<{
    open: boolean;
    data: MemberResponse | null;
  }>({
    open: false,
    data: null,
  });

  const handleEditMember = (member: MemberResponse) => {
    setEditDialog({
      open: true,
      data: member,
    });
  };

  const handleCloseEditDialog = () => {
    setEditDialog({
      open: false,
      data: null,
    });
    refetch();
  };

  const handleDeleteMember = (memberId: string, memberName: string) => {
    confirmation.showConfirmation({
      title: "Remover Membro",
      message: `Tem certeza que deseja remover "${memberName}" da organização? Esta ação não pode ser desfeita.`,
      confirmText: "Sim, remover",
      cancelText: "Cancelar",
      variant: "delete",
      onConfirm: async () => {
        await removeMember(organizationId, memberId, {
          onSuccess: () => {
            refetch();
          },
          onError: (error) => {
            console.error("Erro ao remover membro:", error);
          },
        });
      },
    });
  };

  const columns = createMemberColumns({
    onEdit: handleEditMember,
    onDelete: handleDeleteMember,
    currentUserRole: organization?.currentUserRole,
    currentUserId: organization?.users.find(
      (u) => u.role === organization.currentUserRole
    )?.userId,
  });

  return (
    <>
      <DataTable
        data={members}
        columns={columns}
        loading={isLoading}
        height="60vh"
        showPagination={true}
        rowsPerPageOptions={[5, 10, 25]}
        rowsPerPage={10}
        dense={false}
        stickyHeader={true}
      />

      {/* Role Information */}
      <div className="mt-6 bg-blue-50 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-900 mb-2">
          Sobre as Funções
        </h4>
        <div className="text-sm text-blue-800 space-y-1">
          <p>
            <strong>Proprietário:</strong> Acesso total, incluindo exclusão da
            organização
          </p>
          <p>
            <strong>Administrador:</strong> Gerenciar membros, configurações e
            todas as funcionalidades
          </p>
          <p>
            <strong>Gerente:</strong> Gerenciar campanhas, leads e conteúdo
          </p>
          <p>
            <strong>Analista:</strong> Visualizar relatórios e métricas
          </p>
          <p>
            <strong>Visualizador:</strong> Acesso apenas de leitura
          </p>
        </div>
      </div>

      <ConfirmationDialog
        open={confirmation.confirmation.isOpen}
        title={confirmation.confirmation.title}
        message={confirmation.confirmation.message}
        variant={confirmation.confirmation.variant}
        confirmText={confirmation.confirmation.confirmText}
        cancelText={confirmation.confirmation.cancelText}
        isLoading={confirmation.confirmation.isLoading || isRemoving}
        onClose={confirmation.handleCancel}
        onConfirm={confirmation.handleConfirm}
      />

      <EditMemberDialog
        open={editDialog.open}
        onClose={handleCloseEditDialog}
        memberData={editDialog.data}
        organizationId={organizationId}
      />
    </>
  );
};
