"use client";

import {
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";

export const FormOrganization = () => {
  return (
    <div className="w-full p-4 bg-white shadow-md rounded-md space-y-4">
      <div>
        <Typography variant="h4" sx={{ marginBottom: 2 }}>
          Organizações
        </Typography>
        <Typography sx={{ marginBottom: 2 }}>
          Esta é a página de organizações. Aqui você pode visualizar informações
          detalhadas sobre as organizações da sua conta.
        </Typography>
      </div>
      <div className="flex items-center justify-center gap-8">
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
      <div className="flex items-center gap-4">
        <Button variant="contained" color="primary">
          Criar Organização
        </Button>
        <Button variant="contained" color="error">
          Cancelar Ação
        </Button>
      </div>
    </div>
  );
};
