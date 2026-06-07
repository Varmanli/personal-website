import type { ReactNode } from "react";
import { FiEdit3, FiGlobe, FiArchive, FiBriefcase, FiUser, FiZap } from "react-icons/fi";
import type { Dictionary } from "@/lib/i18n/dictionaries";

/** Option shape consumed by the reusable admin CustomSelect. */
export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
  icon?: ReactNode;
  description?: string;
}

/**
 * Centralised, localized option sets for admin selects — labels live in one
 * place (never hardcoded in forms). Values match the DB enums exactly.
 */

export function getStatusOptions(dict: Dictionary): SelectOption[] {
  const s = dict.admin.status;
  return [
    { value: "draft", label: s.draft, icon: <FiEdit3 /> },
    { value: "published", label: s.published, icon: <FiGlobe /> },
    { value: "archived", label: s.archived, icon: <FiArchive /> },
  ];
}

export function getPortfolioTypeOptions(dict: Dictionary): SelectOption[] {
  const c = dict.card.types;
  return [
    { value: "personal", label: c.personal, icon: <FiUser /> },
    { value: "commercial", label: c.commercial, icon: <FiBriefcase /> },
    { value: "freelance", label: c.freelance, icon: <FiZap /> },
  ];
}

const CURRENCIES = ["USD", "EUR", "GBP", "AED", "IRR"] as const;

export function getCurrencyOptions(): SelectOption[] {
  return CURRENCIES.map((c) => ({ value: c, label: c }));
}
