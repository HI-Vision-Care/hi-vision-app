// models/service/metric.types.ts
import { IoniconsGlyphs } from "@expo/vector-icons/build/Ionicons";

export interface MetricCardProps {
  color: string;
  title: string;
  icon: IoniconsGlyphs;
  value: string;
  unit: string;
  children: React.ReactNode;
}

export interface ActivityIcon {
  name: string;
  color: string;
  bg: string;
}

export type ActivityType = "linear" | "status" | "tags" | "circular";

export interface ActivityData {
  id: number;
  title: string;
  icon: ActivityIcon;
  type: ActivityType;
  currentValue?: number;
  targetValue?: number;
  unit?: string;
  description?: string;
  tags?: string[];
  progress?: number;
}

export interface ActivityItemProps {
  item: ActivityData;
}
