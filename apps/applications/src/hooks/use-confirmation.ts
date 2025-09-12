"use client";

import { useState } from "react";

interface ConfirmationState {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "delete" | "warning" | "info" | "confirm";
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

export const useConfirmation = () => {
  const [confirmation, setConfirmation] = useState<ConfirmationState>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  const showConfirmation = ({
    title,
    message,
    confirmText = "Confirmar",
    cancelText = "Cancelar",
    variant = "confirm",
    onConfirm,
    onCancel,
  }: {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: "delete" | "warning" | "info" | "confirm";
    onConfirm: () => void | Promise<void>;
    onCancel?: () => void;
  }) => {
    setConfirmation({
      isOpen: true,
      title,
      message,
      confirmText,
      cancelText,
      variant,
      onConfirm,
      onCancel,
      isLoading: false,
    });
  };

  const hideConfirmation = () => {
    setConfirmation(prev => ({
      ...prev,
      isOpen: false,
    }));
  };

  const handleConfirm = async () => {
    try {
      setConfirmation(prev => ({ ...prev, isLoading: true }));
      await confirmation.onConfirm();
      hideConfirmation();
    } catch (error) {
      console.error("Erro na confirmação:", error);
      // Mantem o dialog aberto em caso de erro
    } finally {
      setConfirmation(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleCancel = () => {
    confirmation.onCancel?.();
    hideConfirmation();
  };

  return {
    confirmation,
    showConfirmation,
    hideConfirmation,
    handleConfirm,
    handleCancel,
  };
};