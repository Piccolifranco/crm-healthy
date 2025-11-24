export function getCookieValue(name: string): string | null {
  if (typeof document === "undefined") return null; // seguridad SSR

  const cookieString = document.cookie;
  const cookies = cookieString.split("; ");

  for (const cookie of cookies) {
    const [key, value] = cookie.split("=");

    if (key === name) {
      return decodeURIComponent(value);
    }
  }

  return null;
}