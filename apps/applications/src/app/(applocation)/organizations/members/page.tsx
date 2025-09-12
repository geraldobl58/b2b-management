"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { DashboardLayout } from "@/components/layout/app-layout";
import { Button, Typography } from "@mui/material";
import { ListMembers } from "./components/list-members";
import { InviteMemberDialog } from "./components/invite-member-dialog";
import { useMember } from "@/hooks/use-member";
import { MemberInviteData } from "@/schemas/member";

const OrganizationMembersPage = () => {
  const params = useParams();
  const organizationId = params.organizationId as string || "";
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const { inviteMember, isInviting } = useMember();

  const handleOpenInviteDialog = () => {
    setInviteDialogOpen(true);
  };

  const handleCloseInviteDialog = () => {
    setInviteDialogOpen(false);
  };

  const handleInviteMember = async (data: MemberInviteData) => {
    const result = await inviteMember(organizationId, data, {
      onSuccess: () => {
        // A lista será atualizada automaticamente através do cache do React Query
      },
      onError: (error) => {
        console.error("Erro ao convidar membro:", error);
      },
    });

    return result;
  };

  return (
    <DashboardLayout title="Gerenciamento completo de membros da organização">
      <div>
        <div className="flex justify-between items-center">
          <div>
            <Typography variant="h4" sx={{ marginBottom: 2 }}>
              Membros da Organização
            </Typography>
            <Typography sx={{ marginBottom: 2 }}>
              Esta é a página de membros da organização. Aqui você pode
              visualizar informações detalhadas sobre os membros da sua
              organização e gerenciar convites.
            </Typography>
          </div>
          <div>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleOpenInviteDialog}
            >
              Convidar Membro
            </Button>
          </div>
        </div>
        <div style={{ marginTop: 16 }}>
          <Typography variant="subtitle1">
            Abaixo está a lista de todos os membros associados à sua
            organização. Você pode convidar novos membros, editar funções e
            remover membros conforme sua permissão.
          </Typography>
        </div>
        <div>
          <ListMembers />
        </div>
      </div>

      <InviteMemberDialog
        open={inviteDialogOpen}
        onClose={handleCloseInviteDialog}
        onSubmit={handleInviteMember}
        isLoading={isInviting}
      />
    </DashboardLayout>
  );
};

export default OrganizationMembersPage;
