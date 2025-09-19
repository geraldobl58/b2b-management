import { Box, Paper, Typography } from "@mui/material";

interface ErrorStateProps {
  message: string;
  title?: string;
}

export const ErrorState = ({ message, title = "Erro" }: ErrorStateProps) => {
  return (
    <Box className="w-full">
      <Paper
        elevation={3}
        sx={{ display: "block", width: "100%" }}
        className="w-full max-w-full p-4 shadow-md rounded-md space-y-6"
      >
        <Box className="mb-4 p-3 border border-red-300 rounded-md bg-red-50">
          <Typography color="error" variant="body2" className="font-medium">
            {title}: {message}
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};
