import type { MenuItem, Role } from "./types";

const ALL: Role[] = ["OWNER", "ADMIN", "MANAGER", "ANALYST", "VIEWER"];
const ADMIN_UP: Role[] = ["OWNER", "ADMIN"];
const MANAGER_UP: Role[] = ["OWNER", "ADMIN", "MANAGER"];

export const sidebarMenu: MenuItem[] = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: "LayoutDashboard",
    roles: ALL,
  },
  {
    label: "Campanhas",
    icon: "Megaphone",
    roles: MANAGER_UP,
    items: [
      {
        label: "Todas as campanhas",
        path: "/campaign",
        icon: "Megaphone",
        roles: MANAGER_UP,
      },
      {
        label: "Criar campanha",
        path: "/campaigns/new",
        icon: "PlusCircle",
        roles: MANAGER_UP,
      },
      {
        label: "Grupos de anúncios",
        path: "/ad-groups",
        icon: "Layers",
        roles: MANAGER_UP,
      },
      {
        label: "Criativos (Ads)",
        path: "/ads",
        icon: "Image",
        roles: MANAGER_UP,
      },
      {
        label: "Métricas",
        path: "/metrics",
        icon: "BarChart3",
        roles: ALL,
      },
      { label: "Tags", path: "/tags", icon: "Tag", roles: MANAGER_UP },
    ],
  },
  {
    label: "Conteúdo",
    icon: "Folder",
    roles: MANAGER_UP,
    items: [
      {
        label: "Assets",
        path: "/assets",
        icon: "FolderOpen",
        roles: MANAGER_UP,
      },
      {
        label: "Posts Sociais",
        path: "/social-posts",
        icon: "Share2",
        roles: MANAGER_UP,
      },
      {
        label: "Agendamentos",
        path: "/social-schedule",
        icon: "CalendarDays",
        roles: MANAGER_UP,
      },
    ],
  },
  {
    label: "Relatórios",
    icon: "FileBarChart",
    roles: ALL,
    items: [
      {
        label: "Dashboards",
        path: "/reports/dashboards",
        icon: "PieChart",
        roles: ALL,
      },
      {
        label: "Relatórios",
        path: "/reports",
        icon: "FileText",
        roles: ALL,
      },
      {
        label: "Novo relatório",
        path: "/reports/new",
        icon: "Plus",
        roles: MANAGER_UP,
      },
    ],
  },
  {
    label: "Automação",
    icon: "Workflow",
    roles: MANAGER_UP,
    items: [
      {
        label: "Integrações",
        path: "/integrations",
        icon: "Plug",
        roles: ADMIN_UP,
      },
      {
        label: "Automações",
        path: "/automations",
        icon: "Bot",
        roles: MANAGER_UP,
      },
      {
        label: "Webhooks",
        path: "/webhooks",
        icon: "Webhook",
        roles: ADMIN_UP,
      },
    ],
  },
  {
    label: "Configurações",
    icon: "Settings",
    roles: ADMIN_UP,
    items: [
      {
        label: "Time & Permissões",
        path: "/settings/team",
        icon: "Shield",
        roles: ADMIN_UP,
      },
      {
        label: "Planos & Cobrança",
        path: "/settings/billing",
        icon: "CreditCard",
        roles: ADMIN_UP,
      },
      {
        label: "Preferências",
        path: "/settings/preferences",
        icon: "Sliders",
        roles: ALL,
      },
    ],
  },
];
