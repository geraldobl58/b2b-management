import { Box, Typography } from "@mui/material";

interface HeaderProps {
  title: string;
  description: string;
  content?: React.ReactNode;
}

export const Header = ({ title, description, content }: HeaderProps) => {
  return (
    <Box className="mb-4 flex items-start justify-between">
      <Box>
        <Typography variant="h4" sx={{ marginBottom: 2 }}>
          {title}
        </Typography>
        <Typography sx={{ marginBottom: 2 }}>{description}</Typography>
      </Box>
      <Box>{content && content}</Box>
    </Box>
  );
};
