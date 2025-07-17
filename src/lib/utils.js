import { clsx } from "clsx";
import { twMerge } from 'tailwind-merge';

/**
 * Combina clases condicionales con soporte para merge de Tailwind.
 * Ejemplo:
 *   cn("bg-white", isActive && "text-blue-500")
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
