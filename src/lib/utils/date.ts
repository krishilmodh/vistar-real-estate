import { format, parseISO, startOfMonth, endOfMonth, addMonths, subMonths, isBefore, isAfter, isEqual } from "date-fns";

export const DATE_FORMAT = "yyyy-MM-dd";
export const DISPLAY_DATE_FORMAT = "dd MMM yyyy";
export const MONTH_FORMAT = "yyyy-MM";

export function formatDate(date: Date | string, pattern = DISPLAY_DATE_FORMAT): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, pattern);
}

export function formatMonth(date: Date | string): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, "MMM yyyy");
}

export function getMonthKey(date: Date | string): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, MONTH_FORMAT);
}

export function getCurrentMonthKey(): string {
  return format(new Date(), MONTH_FORMAT);
}

export function getNextMonthKey(): string {
  return format(addMonths(new Date(), 1), MONTH_FORMAT);
}

export function getPreviousMonthKey(): string {
  return format(subMonths(new Date(), 1), MONTH_FORMAT);
}

export function getMonthStart(date: Date | string): Date {
  const d = typeof date === "string" ? parseISO(date) : date;
  return startOfMonth(d);
}

export function getMonthEnd(date: Date | string): Date {
  const d = typeof date === "string" ? parseISO(date) : date;
  return endOfMonth(d);
}

export function isOverdue(dueDate: Date | string): boolean {
  const due = typeof dueDate === "string" ? parseISO(dueDate) : dueDate;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return isBefore(due, today);
}

export function isDueToday(dueDate: Date | string): boolean {
  const due = typeof dueDate === "string" ? parseISO(dueDate) : dueDate;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return isEqual(due, today);
}

export function daysUntilDue(dueDate: Date | string): number {
  const due = typeof dueDate === "string" ? parseISO(dueDate) : dueDate;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffTime = due.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function calculateDueDate(billingMonth: string, dueDay: number): Date {
  const date = new Date(billingMonth + "-01");
  date.setDate(dueDay);
  return date;
}

export function generateMonths(count: number, start: Date = new Date()): string[] {
  const months: string[] = [];
  for (let i = 0; i < count; i++) {
    months.push(format(addMonths(start, i), MONTH_FORMAT));
  }
  return months;
}