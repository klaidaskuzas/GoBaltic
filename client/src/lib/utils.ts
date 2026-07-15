import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = "EUR") {
  return new Intl.NumberFormat("lt-LT", {
    style: "currency",
    currency,
  }).format(amount);
}

export function formatDate(date: Date | string) {
  if (!date) return "";
  
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("lt-LT", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
}

export function formatShortDate(date: Date | string) {
  if (!date) return "";
  
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("lt-LT", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  }).format(d);
}

export function formatDateTime(date: Date | string) {
  if (!date) return "";
  
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("lt-LT", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
  }).format(d);
}

export function getInitials(name?: string) {
  if (!name) return "";
  
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function truncate(str: string, length: number) {
  if (!str) return "";
  return str.length > length ? `${str.substring(0, length)}...` : str;
}

export function generateTrackingNumber() {
  const prefix = "GOBAL";
  const randomDigits = Math.floor(10000 + Math.random() * 90000);
  return `${prefix}-${randomDigits}`;
}