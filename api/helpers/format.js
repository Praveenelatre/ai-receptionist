import * as chrono from "chrono-node";

export function parseToIST(text) {
  const parsed = chrono.parseDate(text, { forwardDate: true });
  if (!parsed) return null;
  const utc = parsed.getTime();
  const istMs = utc + 5.5 * 60 * 60 * 1000;
  return new Date(istMs);
}

export function speakableIST(dateObj) {
  const opts = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
  const datePart = dateObj.toLocaleDateString("en-IN", opts);
  const timePart = dateObj.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" });
  return `${datePart} at ${timePart}`;
}

export function bodyToParams(req) {
  return req.text().then(t => Object.fromEntries(new URLSearchParams(t)));
}

export function escapeXml(s) {
  return String(s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
