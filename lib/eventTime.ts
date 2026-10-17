export function eventDateTime(eventDate: string, eventTime: string): Date {
  const match = eventTime.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return new Date(`${eventDate}T${eventTime}+01:00`);
  let hour = Number(match[1]) % 12;
  if (match[3].toUpperCase() === "PM") hour += 12;
  return new Date(`${eventDate}T${String(hour).padStart(2, "0")}:${match[2]}:00+01:00`);
}
