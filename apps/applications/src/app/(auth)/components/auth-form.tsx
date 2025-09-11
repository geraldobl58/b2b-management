"use client";

import { useState } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Logo } from "@/app/components/logo";
import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import { FiEyeOff } from "react-icons/fi";
import { BsEye } from "react-icons/bs";
import { formAuthSchema, FormAuthValues } from "@/schemas/auth";
import { useAuth } from "@/hooks/use-auth";

export const AuthForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading, loginError } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormAuthValues>({
    resolver: zodResolver(formAuthSchema),
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = (data: FormAuthValues) => {
    login(data);
  };

  return (
    <div className="flex flex-col items-center justify-center mb-8 space-y-4">
      <Logo />
      <Typography
        className="uppercase"
        variant="h6"
        component="h1"
        gutterBottom
        color="textSecondary"
      >
        B2B Management
      </Typography>
      <Paper elevation={3} className="w-full p-4 space-y-6">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box className="mb-4">
            <TextField
              type="email"
              fullWidth
              label="E-mail"
              variant="outlined"
              error={!!errors.email}
              helperText={errors.email?.message}
              {...register("email")}
            />
          </Box>

          <Box className="mb-4 relative">
            <TextField
              type={showPassword ? "text" : "password"}
              fullWidth
              label="Senha"
              variant="outlined"
              error={!!errors.password}
              helperText={errors.password?.message}
              {...register("password")}
              slotProps={{
                input: {
                  endAdornment: (
                    <Button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="min-w-0 p-1 text-gray-500 hover:text-gray-700"
                      aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                    >
                      {showPassword ? <FiEyeOff size={18} /> : <BsEye size={18} />}
                    </Button>
                  ),
                },
              }}
            />
          </Box>

          {loginError && (
            <Box className="mb-4">
              <Typography color="error" variant="body2">
                {loginError}
              </Typography>
            </Box>
          )}

          <Box>
            <Button 
              type="submit" 
              fullWidth 
              variant="contained"
              disabled={isLoading}
            >
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>
          </Box>
        </form>
      </Paper>
    </div>
  );
};
