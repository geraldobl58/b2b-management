"use client";

import { useHydrationSafe } from "@/hooks/use-hydration-safe";

interface HydrationBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Componente que previne problemas de hidratação
 * Renderiza um fallback até que a hidratação seja concluída
 */
export const HydrationBoundary = ({
  children,
  fallback = null
}: HydrationBoundaryProps) => {
  const isHydrated = useHydrationSafe();

  if (!isHydrated) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};