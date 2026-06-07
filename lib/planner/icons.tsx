import type { ReactNode } from "react";
import {
  FiLayout,
  FiGlobe,
  FiGrid,
  FiShoppingCart,
  FiServer,
  FiCpu,
  FiPenTool,
  FiTrendingUp,
  FiDollarSign,
  FiZap,
  FiFileText,
  FiLayers,
  FiLock,
  FiCreditCard,
  FiSliders,
  FiBookOpen,
  FiGlobe as FiGlobe2,
  FiLink,
  FiActivity,
  FiUploadCloud,
  FiSearch,
  FiStar,
  FiAward,
  FiEdit3,
  FiClock,
  FiCalendar,
  FiPhone,
  FiMail,
  FiMessageCircle,
  FiSend,
  FiPackage,
  FiHelpCircle,
} from "react-icons/fi";

/**
 * Safe, predefined icon registry for planner options. Option rows store a
 * string key; we resolve it here so admins can never inject arbitrary code.
 * Unknown keys fall back to a neutral help icon.
 */
const ICONS: Record<string, ReactNode> = {
  layout: <FiLayout />,
  globe: <FiGlobe />,
  grid: <FiGrid />,
  cart: <FiShoppingCart />,
  server: <FiServer />,
  cpu: <FiCpu />,
  pen: <FiPenTool />,
  trending: <FiTrendingUp />,
  dollar: <FiDollarSign />,
  zap: <FiZap />,
  file: <FiFileText />,
  layers: <FiLayers />,
  lock: <FiLock />,
  card: <FiCreditCard />,
  sliders: <FiSliders />,
  book: <FiBookOpen />,
  globe2: <FiGlobe2 />,
  link: <FiLink />,
  activity: <FiActivity />,
  upload: <FiUploadCloud />,
  search: <FiSearch />,
  star: <FiStar />,
  award: <FiAward />,
  edit: <FiEdit3 />,
  clock: <FiClock />,
  calendar: <FiCalendar />,
  phone: <FiPhone />,
  mail: <FiMail />,
  message: <FiMessageCircle />,
  send: <FiSend />,
  package: <FiPackage />,
};

/** All registry keys (for the admin icon picker). */
export const PLANNER_ICON_KEYS = Object.keys(ICONS);

/** Resolve an icon key to a node, with a safe fallback. */
export function plannerIcon(key?: string | null): ReactNode {
  if (key && key in ICONS) return ICONS[key];
  return <FiHelpCircle />;
}
