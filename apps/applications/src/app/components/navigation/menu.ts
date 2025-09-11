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
        path: "/app/campaigns/new",
        icon: "PlusCircle",
        roles: MANAGER_UP,
      },
      {
        label: "Grupos de anúncios",
        path: "/app/ad-groups",
        icon: "Layers",
        roles: MANAGER_UP,
      },
      {
        label: "Criativos (Ads)",
        path: "/app/ads",
        icon: "Image",
        roles: MANAGER_UP,
      },
      {
        label: "Métricas",
        path: "/app/metrics",
        icon: "BarChart3",
        roles: ALL,
      },
      { label: "Tags", path: "/app/tags", icon: "Tag", roles: MANAGER_UP },
    ],
  },
  {
    label: "Leads & CRM",
    icon: "Users",
    roles: MANAGER_UP,
    items: [
      { label: "Leads", path: "/app/leads", icon: "Users", roles: MANAGER_UP },
      {
        label: "Fontes",
        path: "/app/lead-sources",
        icon: "Link2",
        roles: MANAGER_UP,
      },
      {
        label: "Pipeline",
        path: "/app/pipeline",
        icon: "KanbanSquare",
        roles: MANAGER_UP,
        featureFlag: "pipeline",
      },
    ],
  },
  {
    label: "Conteúdo",
    icon: "Folder",
    roles: MANAGER_UP,
    items: [
      {
        label: "Assets",
        path: "/app/assets",
        icon: "FolderOpen",
        roles: MANAGER_UP,
      },
      {
        label: "Posts Sociais",
        path: "/app/social-posts",
        icon: "Share2",
        roles: MANAGER_UP,
      },
      {
        label: "Agendamentos",
        path: "/app/social-schedule",
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
        path: "/app/reports/dashboards",
        icon: "PieChart",
        roles: ALL,
      },
      {
        label: "Relatórios",
        path: "/app/reports",
        icon: "FileText",
        roles: ALL,
      },
      {
        label: "Novo relatório",
        path: "/app/reports/new",
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
        path: "/app/integrations",
        icon: "Plug",
        roles: ADMIN_UP,
      },
      {
        label: "Automations",
        path: "/app/automations",
        icon: "Bot",
        roles: MANAGER_UP,
      },
      {
        label: "Webhooks",
        path: "/app/webhooks",
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
        label: "Workspace",
        path: "/app/settings/workspace",
        icon: "Building2",
        roles: ADMIN_UP,
      },
      {
        label: "Time & Permissões",
        path: "/app/settings/team",
        icon: "Shield",
        roles: ADMIN_UP,
      },
      {
        label: "Planos & Cobrança",
        path: "/app/settings/billing",
        icon: "CreditCard",
        roles: ADMIN_UP,
      },
      {
        label: "Preferências",
        path: "/app/settings/preferences",
        icon: "Sliders",
        roles: ALL,
      },
    ],
  },
];
