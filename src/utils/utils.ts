import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: any) {
  const date = new Date(dateString)

  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, "0")
  const day = date.getDate().toString().padStart(2, "0")

  let hours = date.getHours()
  const minutes = date.getMinutes().toString().padStart(2, "0")

  // Determine AM/PM and adjust hours accordingly
  const ampm = hours >= 12 ? "PM" : "AM"
  hours = hours % 12 || 12 // Convert to 12-hour format
  const formattedHours = hours.toString().padStart(2, "0")

  return `${year}-${month}-${day} ${formattedHours}:${minutes} ${ampm}`
}
