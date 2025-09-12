import { getRoleColor } from "@/lib/colors";
import { Box, Chip, Typography } from "@mui/material";
import { Users } from "lucide-react";

interface MembersOrganizationProps {
  organization: {
    users: {
      id: string;
      role: string;
      createdAt: string;
      user: {
        name: string;
        email: string;
      };
    }[];
  };
}

export const MembersOrganization = ({ organization }: MembersOrganizationProps) => {
  return (
    <>
      {/* Membros da Organização */}
      <Typography
        variant="h6"
        sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}
      >
        <Users size={20} />
        Membros da Organização ({organization.users.length})
      </Typography>
      <div>
        {organization.users.map((member) => (
          <Box
            key={member.id}
            sx={{
              p: 2,
              border: 1,
              borderColor: "divider",
              borderRadius: 1,
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
            <Typography variant="subtitle1" fontWeight="medium">
              {member.user.name}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              {member.user.email}
            </Typography>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mt: 1,
              }}
            >
              <Chip
                label={member.role}
                size="small"
                color={getRoleColor(member.role)}
              />

              <Typography variant="caption" color="text.secondary">
                {new Date(member.createdAt).toLocaleDateString("pt-BR")}
              </Typography>
            </Box>
          </Box>
        ))}
      </div>
    </>
  );
};
