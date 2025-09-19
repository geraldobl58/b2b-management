import { Box, Typography } from "@mui/material";

interface ClientHeaderProps {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
}

export const ClientHeader = ({
  title = "Clientes",
  subtitle = "Gerencie os clientes da sua empresa",
  children,
}: ClientHeaderProps) => {
  return (
    <Box className="flex items-center justify-between mb-6">
      <Box>
        <Typography
          variant="h4"
          component="h1"
          className="text-2xl font-bold text-gray-900"
        >
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body1" className="text-gray-600 mt-1">
            {subtitle}
          </Typography>
        )}
      </Box>
      {children && <Box>{children}</Box>}
    </Box>
  );
};
