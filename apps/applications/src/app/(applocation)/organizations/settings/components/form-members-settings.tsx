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
      <div className="flex flex-col items-center justify-center gap-8 bg-white shadow-md p-6 rounded-lg">
        <div className="w-full flex flex-col md:flex-row gap-4">
          <TextField
            fullWidth
            label="Nome da Organização"
            placeholder="Ex: ACME Corporation"
            margin="normal"
            helperText="Nome completo da organização"
          />
          <TextField
            fullWidth
            label="Slug da Organização"
            placeholder="Ex: acme-corporation"
            margin="normal"
            helperText="Identificador único"
          />
        </div>
        <div className="w-full flex flex-col md:flex-row gap-4">
          <TextField
            fullWidth
            label=" Domínio (Opcional)"
            placeholder="Ex: acme.com"
            margin="normal"
            helperText="Domínio principal da organização"
          />
          <FormControl fullWidth>
            <InputLabel id="select-sector-label">Setor</InputLabel>
            <Select
              labelId="select-sector-label"
              id="select-sector-label"
              value={""}
              label="Setor"
              onChange={() => {}}
            >
              <MenuItem value="TECNOLOGIA">Tecnologia</MenuItem>
              <MenuItem value="SAAS">SaaS</MenuItem>
              <MenuItem value="ECOMMERCE">E-commerce</MenuItem>
              <MenuItem value="SAUDE">Saúde</MenuItem>
              <MenuItem value="FINANCEIRO">Financeiro</MenuItem>
              <MenuItem value="EDUCACAO">Educação</MenuItem>
              <MenuItem value="OUTRO">Outro</MenuItem>
            </Select>
            <FormHelperText>Selecione um setor</FormHelperText>
          </FormControl>
        </div>

        <div className="w-full flex flex-col md:flex-row gap-4">
          <FormControl fullWidth>
            <InputLabel id="select-size-label">Tamanho</InputLabel>
            <Select
              labelId="select-size-label"
              id="select-size-label"
              value={""}
              label="Tamanho"
              onChange={() => {}}
            >
              <MenuItem value="1-10">1-10 funcionários</MenuItem>
              <MenuItem value="11-50">11-50 funcionários</MenuItem>
              <MenuItem value="51-200">51-200 funcionários</MenuItem>
              <MenuItem value="201-500">201-500 funcionários</MenuItem>
              <MenuItem value="500+">500+ funcionários</MenuItem>
            </Select>
            <FormHelperText>Selecione um tamanho</FormHelperText>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel id="select-timezone-label">Fuso Horário</InputLabel>
            <Select
              labelId="select-timezone-label"
              id="select-timezone-label"
              value={""}
              label="Fuso Horário"
              onChange={() => {}}
            >
              <MenuItem value="AMERICA_NEW_YORK">America/New_York</MenuItem>
              <MenuItem value="AMERICA_DENVER">America/Denver</MenuItem>
              <MenuItem value="AMERICA_CHICAGO">America/Chicago</MenuItem>
              <MenuItem value="AMERICA_SAO_PAULO">America/Sao_Paulo</MenuItem>
              <MenuItem value="EUROPE_LONDRES">Europe/Londres</MenuItem>
            </Select>
            <FormHelperText>Selecione um fuso horário</FormHelperText>
          </FormControl>
        </div>
      </div>
      <div className="flex items-center gap-4 bg-white shadow-md p-6 rounded-lg">
        <Button variant="contained" color="primary">
          Salvar Alterações
        </Button>
      </div>
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
