import * as LucideIcons from "lucide-react";

// Mapa de ícones Lucide React
const iconMap: Record<string, React.ComponentType<any>> = {
  LayoutDashboard: LucideIcons.LayoutDashboard,
  Megaphone: LucideIcons.Megaphone,
  PlusCircle: LucideIcons.PlusCircle,
  Layers: LucideIcons.Layers,
  Image: LucideIcons.Image,
  BarChart3: LucideIcons.BarChart3,
  Tag: LucideIcons.Tag,
  Users: LucideIcons.Users,
  Link2: LucideIcons.Link2,
  KanbanSquare: LucideIcons.KanbanSquare,
  Folder: LucideIcons.Folder,
  FolderOpen: LucideIcons.FolderOpen,
  Share2: LucideIcons.Share2,
  CalendarDays: LucideIcons.CalendarDays,
  FileBarChart: LucideIcons.FileBarChart,
  PieChart: LucideIcons.PieChart,
  FileText: LucideIcons.FileText,
  Plus: LucideIcons.Plus,
  Workflow: LucideIcons.Workflow,
  Plug: LucideIcons.Plug,
  Bot: LucideIcons.Bot,
  Webhook: LucideIcons.Webhook,
  Settings: LucideIcons.Settings,
  Building2: LucideIcons.Building2,
  Shield: LucideIcons.Shield,
  CreditCard: LucideIcons.CreditCard,
  Sliders: LucideIcons.Sliders,
};

export const getIcon = (iconName: string, size: number = 20) => {
  const IconComponent = iconMap[iconName];
  
  if (!IconComponent) {
    // Fallback para um ícone padrão se o ícone não for encontrado
    return <LucideIcons.Square size={size} />;
  }
  
  return <IconComponent size={size} />;
};