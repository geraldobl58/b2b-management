export const getRoleColor = (
  role: string
):
  | "default"
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "error"
  | "info" => {
  switch (role) {
    case "OWNER":
      return "error";
    case "ADMIN":
      return "warning";
    case "MANAGER":
      return "primary";
    case "ANALYST":
      return "secondary";
    case "VIEWER":
      return "default";
    default:
      return "default";
  }
};

export const getPlanColor = (
  plan: string
):
  | "default"
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "error"
  | "info" => {
  switch (plan.toUpperCase()) {
    case "ENTERPRISE":
      return "error";
    case "PRO":
      return "warning";
    case "BASIC":
      return "primary";
    default:
      return "default";
  }
};

export const getRoleLabel = (role: string): string => {
  switch (role) {
    case "OWNER":
      return "Proprietário";
    case "ADMIN":
      return "Administrador";
    case "MANAGER":
      return "Gerente";
    case "ANALYST":
      return "Analista";
    case "VIEWER":
      return "Visualizador";
    default:
      return role;
  }
};
