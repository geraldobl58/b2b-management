import { DetailItem } from "@/components/details-item";
import { getPlanColor, getRoleColor } from "@/lib/colors";
import { Typography } from "@mui/material";
import { Calendar, CreditCard, Mail, Users } from "lucide-react";

interface InformationSystemProps {
  organization: {
    id: string;
    name: string;
    slug: string;
    domain: string;
    industry: string;
    companySize: string;
    timezone: string;
    createdAt: string;
    updatedAt: string;
    billingEmail: string;
    plan: string;
    currentUserRole: "OWNER" | "ADMIN" | "MANAGER" | "ANALYST" | "VIEWER";
  };
}

export const InformationSystem = ({ organization }: InformationSystemProps) => {
  return (
    <>
      {/* Informações do Sistema */}
      <Typography
        variant="h6"
        sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}
      >
        <CreditCard size={20} />
        Informações do Sistema
      </Typography>

      <DetailItem
        icon={<Mail size={16} />}
        label="Email de Cobrança"
        value={organization.billingEmail}
      />

      <DetailItem
        icon={<CreditCard size={16} />}
        label="Plano"
        value={organization.plan}
        variant="chip"
        chipColor={getPlanColor(organization.plan)}
      />

      <DetailItem
        icon={<Users size={16} />}
        label="Sua Função"
        value={organization.currentUserRole}
        variant="chip"
        chipColor={getRoleColor(organization.currentUserRole)}
      />

      <DetailItem
        icon={<Calendar size={16} />}
        label="Criada em"
        value={new Date(organization.createdAt).toLocaleDateString("pt-BR")}
      />

      <DetailItem
        icon={<Calendar size={16} />}
        label="Atualizada em"
        value={new Date(organization.updatedAt).toLocaleDateString("pt-BR")}
      />
    </>
  );
};
