import type { MenuItem, Role } from "./types";

const ALL: Role[] = ["ADMIN", "BUSINESS", "TEAM_MEMBER", "VIEWER"];
const ADMIN_ONLY: Role[] = ["ADMIN"];
const ADMIN_BUSINESS: Role[] = ["ADMIN", "BUSINESS"];

export const sidebarMenu: MenuItem[] = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: "LayoutDashboard",
    roles: ALL,
  },

  // === CAMPANHAS ===
  {
    label: "Campanhas",
    path: "/campaigns",
    icon: "Megaphone",
    roles: ADMIN_BUSINESS,
  },

  // === CLIENTES ===
  {
    label: "Clientes",
    path: "/clients",
    icon: "Building2",
    roles: ALL,
  },

  // === CONTRATOS ===
  {
    label: "Contratos",
    path: "/contracts",
    icon: "FileText",
    roles: ADMIN_BUSINESS,
  },

  // === RELATÓRIOS ===
  {
    label: "Relatórios",
    icon: "BarChart3",
    roles: ALL,
    items: [
      {
        label: "Dashboard",
        path: "/reports/dashboard",
        icon: "PieChart",
        roles: ALL,
      },
      {
        label: "Clientes",
        path: "/reports/clients",
        icon: "Building2",
        roles: ALL,
      },
      {
        label: "Campanhas",
        path: "/reports/campaigns",
        icon: "TrendingUp",
        roles: ADMIN_BUSINESS,
      },
      {
        label: "Financeiro",
        path: "/reports/financial",
        icon: "DollarSign",
        roles: ADMIN_BUSINESS,
      },
    ],
  },

  // === CONFIGURAÇÕES ===
  {
    label: "Configurações",
    icon: "Settings",
    roles: ADMIN_ONLY,
    items: [
      {
        label: "Usuários",
        path: "/settings/users",
        icon: "Users",
        roles: ADMIN_ONLY,
      },
      {
        label: "Perfis",
        path: "/settings/profiles",
        icon: "UserCog",
        roles: ADMIN_ONLY,
      },
      {
        label: "Sistema",
        path: "/settings/system",
        icon: "Cog",
        roles: ADMIN_ONLY,
      },
    ],
  },
];
