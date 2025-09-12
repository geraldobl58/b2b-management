"use client";

import {
  Button,
  Chip,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";

export const FormMembersSettings = () => {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 bg-white shadow-md p-6 rounded-lg">
        <div>
          <Typography variant="h6">Informações de Cobrança</Typography>
          <TextField
            fullWidth
            label="E-mail"
            placeholder="Ex: contato@acme.com"
            margin="normal"
          />
        </div>
        <div className="flex flex-col md:flex-row items-center gap-4">
          <Typography variant="h6">Plano Atual</Typography>
          <Chip label="Pro" color="success" />
          <Button>Alterar Plano</Button>
        </div>
      </div>
      <div className="flex flex-col gap-4 border-red-400 border p-6 rounded-lg">
        <Typography variant="h6" className="text-red-500">
          Zona de Perigo
        </Typography>
        <Typography variant="body1">Excluir Organização</Typography>
        <Typography variant="body2">
          Esta ação não pode ser desfeita. Todos os dados, campanhas, leads e
          configurações serão permanentemente removidos.
        </Typography>
        <Button variant="contained" color="error">
          Excluir Organização
        </Button>
      </div>
    </div>
  );
};
