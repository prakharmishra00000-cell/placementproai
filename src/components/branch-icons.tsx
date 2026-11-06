'use client';
// Helper: branch icon mapping using Lucide
import {
  Cpu, Network, CircuitBoard, Zap, Plug, Cog, Building2, FlaskConical,
  Dna, HeartPulse, Plane, Car, Factory, BarChart3, Hammer, Pickaxe,
  Sprout, Fuel, Gauge, Bot, Leaf, Ship, UtensilsCrossed, Shirt, Layers,
  Mug, Activity, type LucideIcon
} from 'lucide-react';

export const BRANCH_ICONS: Record<string, LucideIcon> = {
  Cpu, Network, CircuitBoard, Zap, Plug, Cog, Building2, FlaskConical,
  Dna, HeartPulse, Plane, Car, Factory, BarChart3, Hammer, Pickaxe,
  Sprout, Fuel, Gauge, Bot, Leaf, Ship, UtensilsCrossed, Shirt, Layers,
  Mug, Activity,
};

export function getBranchIcon(code?: string | null): LucideIcon {
  if (!code) return Cpu;
  return BRANCH_ICONS[code] || Cpu;
}
