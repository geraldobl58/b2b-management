"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import {
  Typography,
  Box,
  Chip,
  Divider,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  Building,
  Globe,
  Users,
  Calendar,
  Clock,
  Mail,
  CreditCard,
  Edit,
  ArrowLeft,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/app-layout";
import { useOrganizationDetails } from "@/hooks/use-organization-details";
import { EditOrganizationDialog } from "../components/edit-organization-dialog";
import Link from "next/link";
import { InformationBasic } from "./components/information-basic";
import { InformationSystem } from "./components/information-system";
import { MembersOrganization } from "./components/members-organization";

const OrganizationDetailsPage = () => {
  const params = useParams();
  const organizationId = params.organizationId as string;
  const { organization, isLoading, error, refetch } =
    useOrganizationDetails(organizationId);
  const [editDialog, setEditDialog] = useState<{
    open: boolean;
    data: {
      id: string;
      name: string;
      slug: string;
      domain: string;
      industry: string;
      companySize: string;
      timezone: string;
    } | null;
  }>({
    open: false,
    data: null,
  });

  if (isLoading) {
    return (
      <DashboardLayout title="Carregando organização...">
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: 400,
          }}
        >
          <CircularProgress size={48} />
        </Box>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout title="Erro ao carregar organização">
        <Alert severity="error" sx={{ mt: 2 }}>
          Não foi possível carregar os dados da organização. Verifique se você
          tem permissão para visualizá-la.
        </Alert>
      </DashboardLayout>
    );
  }

  if (!organization) {
    return (
      <DashboardLayout title="Organização não encontrada">
        <Alert severity="warning" sx={{ mt: 2 }}>
          A organização solicitada não foi encontrada.
        </Alert>
      </DashboardLayout>
    );
  }

  const handleEditOrganization = () => {
    if (!organization) return;

    setEditDialog({
      open: true,
      data: {
        id: organization.id,
        name: organization.name,
        slug: organization.slug,
        domain: organization.domain,
        industry: organization.industry,
        companySize: organization.companySize,
        timezone: organization.timezone,
      },
    });
  };

  const handleCloseEditDialog = () => {
    setEditDialog({
      open: false,
      data: null,
    });
    // Atualiza os dados após edição
    refetch();
  };

  return (
    <DashboardLayout title={`Organização: ${organization.name}`}>
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
          <Link href="/organizations" passHref>
            <Tooltip title="Voltar para organizações">
              <IconButton>
                <ArrowLeft size={20} />
              </IconButton>
            </Tooltip>
          </Link>

          <Typography variant="h4" sx={{ flex: 1 }}>
            {organization.name}
          </Typography>

          {(organization.currentUserRole === "OWNER" ||
            organization.currentUserRole === "ADMIN") && (
            <Tooltip title="Editar organização">
              <IconButton
                color="primary"
                size="large"
                onClick={handleEditOrganization}
              >
                <Edit size={20} />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        <Typography variant="body1" color="text.secondary">
          Informações detalhadas da organização e membros.
        </Typography>
      </Box>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 shadow-md p-6 bg-white rounded-md">
        <div>
          <InformationBasic organization={organization} />
        </div>
        <div>
          <InformationSystem organization={organization} />
        </div>
        <div>
          <MembersOrganization organization={organization} />
        </div>
      </div>

      <EditOrganizationDialog
        open={editDialog.open}
        onClose={handleCloseEditDialog}
        organizationData={editDialog.data}
      />
    </DashboardLayout>
  );
};

export default OrganizationDetailsPage;
