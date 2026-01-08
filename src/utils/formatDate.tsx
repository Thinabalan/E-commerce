export const formatDateOnly = (dateTime: string) => {
  if (!dateTime) return "—";

  // If it's already DD/MM/YYYY format, just return it
  if (dateTime.includes("/") && !dateTime.includes("-")) {
    return dateTime.split(" ")[0];
  }

  // Otherwise try to parse it as an ISO string
  try {
    const date = new Date(dateTime);
    if (isNaN(date.getTime())) return dateTime; // Fallback to raw string if invalid

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  } catch {
    return dateTime;
  }
};
