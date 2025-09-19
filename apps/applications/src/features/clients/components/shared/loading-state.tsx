import { Box, Paper, Typography } from "@mui/material";

interface LoadingStateProps {
  message?: string;
}

export const LoadingState = ({
  message = "Carregando...",
}: LoadingStateProps) => {
  return (
    <Box className="w-full">
      <Paper
        elevation={3}
        sx={{ display: "block", width: "100%" }}
        className="w-full max-w-full p-4 shadow-md rounded-md space-y-6"
      >
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="200px"
        >
          <Typography>{message}</Typography>
        </Box>
      </Paper>
    </Box>
  );
};
