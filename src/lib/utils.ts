import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function fileToDataUri(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function formatDate(date: Date | string, dateFormat: string = "yyyy-MM-dd"): string {
  return format(new Date(date), dateFormat);
}

export function daysAgo(dateString: string): number {
  const date = new Date(dateString);
  const today = new Date();
  const differenceInTime = today.getTime() - date.getTime();
  const differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24));
  return differenceInDays;
}
