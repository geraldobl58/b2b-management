import type { MenuItem, Role } from "./types";

const ALL: Role[] = ["OWNER", "ADMIN", "MANAGER", "ANALYST", "VIEWER"];
const ADMIN_UP: Role[] = ["OWNER", "ADMIN"];
const MANAGER_UP: Role[] = ["OWNER", "ADMIN", "MANAGER"];

export const sidebarMenu: MenuItem[] = [
  // === HOME ===
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: "LayoutDashboard",
    roles: ALL,
  },

  // === INTELIGÊNCIA COMERCIAL (core do projeto) ===
  {
    label: "Inteligência",
    icon: "Sparkles",
    roles: MANAGER_UP,
    items: [
      {
        label: "Empresas",
        path: "/companies",
        icon: "Building2",
        roles: MANAGER_UP,
      },
      {
        label: "Contatos",
        path: "/contacts",
        icon: "Contact",
        roles: MANAGER_UP,
      },
      {
        label: "Leads",
        path: "/leads",
        icon: "Pipeline",
        roles: MANAGER_UP,
      },
      {
        label: "Pipeline",
        path: "/pipeline",
        icon: "KanbanSquare",
        roles: MANAGER_UP,
      },
      {
        label: "Sinais",
        path: "/signals",
        icon: "Activity",
        roles: MANAGER_UP,
      },
      {
        label: "Vagas",
        path: "/jobs",
        icon: "Briefcase",
        roles: MANAGER_UP,
      },
      {
        label: "Alertas",
        path: "/alerts",
        icon: "BellRing",
        roles: ALL,
      },
      {
        label: "Enriquecimento (IA)",
        path: "/enrichment/runs",
        icon: "Brain",
        roles: MANAGER_UP,
      },
      {
        label: "Playbooks de IA",
        path: "/enrichment/playbooks",
        icon: "BezierCurve",
        roles: MANAGER_UP,
      },
      {
        label: "Scraping & Coleta",
        path: "/scrape/tasks",
        icon: "ScanSearch",
        roles: MANAGER_UP,
      },
      {
        label: "Logs de Coleta",
        path: "/scrape/logs",
        icon: "ScrollText",
        roles: MANAGER_UP,
      },
    ],
  },
  // === RELATÓRIOS (mantido, + atalhos úteis do core) ===
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
        label: "Leads por Sinais",
        path: "/reports/leads-by-signals",
        icon: "Radar",
        roles: MANAGER_UP,
      },
      {
        label: "Conversão por Fonte",
        path: "/reports/conversion-by-source",
        icon: "BarChart2",
        roles: MANAGER_UP,
      },
      {
        label: "Tempo por Estágio",
        path: "/reports/time-by-stage",
        icon: "Hourglass",
        roles: MANAGER_UP,
      },
      {
        label: "Novo relatório",
        path: "/reports/new",
        icon: "Plus",
        roles: MANAGER_UP,
      },
    ],
  },

  // === AUTOMAÇÃO (mantido) ===
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

  // === TAREFAS (novo, útil p/ follow-ups do pipeline) ===
  {
    label: "Tarefas",
    path: "/tasks",
    icon: "ListTodo",
    roles: ALL,
  },

  // === CONFIGURAÇÕES (mantido, sem billing) ===
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
      // Removido Planos & Cobrança (não SaaS)
      {
        label: "Preferências",
        path: "/settings/preferences",
        icon: "Sliders",
        roles: ALL,
      },
      {
        label: "Campos Customizados",
        path: "/settings/custom-fields",
        icon: "Wrench",
        roles: ADMIN_UP,
      },
      {
        label: "Auditoria",
        path: "/settings/audit",
        icon: "FileSearch",
        roles: ADMIN_UP,
      },
    ],
  },
];
