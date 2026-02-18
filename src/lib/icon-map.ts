import {
  TrendingUp,
  LineChart,
  BarChart3,
  Activity,
  Zap,
  Target,
  Package,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  TrendingUp,
  LineChart,
  BarChart3,
  Activity,
  Zap,
  Target,
};

export function resolveIcon(iconName: string): LucideIcon {
  return iconMap[iconName] ?? Package;
}
