import { DetailItem } from "@/components/details-item";
import { Typography } from "@mui/material";
import { Building, Clock, Globe, Users } from "lucide-react";

interface InformationBasicProps {
  organization: {
    name: string;
    slug: string;
    domain: string;
    industry: string;
    companySize: string;
    timezone: string;
  };
}

export const InformationBasic = ({ organization }: InformationBasicProps) => {
  return (
    <>
      {/* Informações Básicas */}
      <Typography
        variant="h6"
        sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}
      >
        <Building size={20} />
        Informações Básicas
      </Typography>

      <DetailItem
        icon={<Building size={16} />}
        label="Nome"
        value={organization.name}
      />

      <DetailItem
        icon={<Globe size={16} />}
        label="Slug"
        value={organization.slug}
      />

      <DetailItem
        icon={<Globe size={16} />}
        label="Domínio"
        value={organization.domain}
      />

      <DetailItem
        icon={<Building size={16} />}
        label="Setor"
        value={organization.industry}
      />

      <DetailItem
        icon={<Users size={16} />}
        label="Tamanho da Empresa"
        value={organization.companySize}
      />

      <DetailItem
        icon={<Clock size={16} />}
        label="Fuso Horário"
        value={organization.timezone}
      />
    </>
  );
};
