import { Box, Chip, Typography } from "@mui/material";

export interface DetailItemProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  variant?: "default" | "chip";
  chipColor?:
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "error"
    | "info";
}

export const DetailItem = ({
  icon,
  label,
  value,
  variant = "default",
  chipColor = "default",
}: DetailItemProps) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
    <Box sx={{ color: "primary.main" }}>{icon}</Box>
    <Box sx={{ flex: 1 }}>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      {variant === "chip" ? (
        <Chip label={value} color={chipColor} size="small" />
      ) : (
        <Typography variant="body1" fontWeight="medium">
          {value || "Não informado"}
        </Typography>
      )}
    </Box>
  </Box>
);
