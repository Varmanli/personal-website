/**
 * Project-request status values. Kept in a plain (non-"use server") module so
 * client components can import the array at runtime — a "use server" file may
 * only export async functions, which would strip this constant.
 */
export const REQUEST_STATUSES = [
  "new",
  "reviewed",
  "contacted",
  "in_progress",
  "converted",
  "rejected",
  "archived",
] as const;

export type RequestStatus = (typeof REQUEST_STATUSES)[number];
