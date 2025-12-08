export const lightTheme = {
  background: "#f8fafc",
  backgroundSoft: "#ffffff",
  header: "#ffffff",

  text: "#0f172a",
  textSoft: "#64748b",

  colors: {
    border: "#e2e8f0",
    borderHover: "#cbd5e1",

    bgSoft: "#f8fafc",
    bgHover: "#f1f5f9",

    card: "#ffffff",
    cardBorder: "#e2e8f0",
    cardBorderHover: "#cbd5e1",
    cardHover: "#f8fafc",

    textSoft: "#64748b",

    success: "#16a34a",
    successHover: "#22c55e",

    danger: "#dc2626",
    dangerHover: "#ef4444",

    accent: "#2563eb",
    accentHover: "#3b82f6",

    shadowSoft: "rgba(0,0,0,0.05)",
    accentAlpha: "rgba(37, 99, 235, 0.15)",
    green: "#16a34a",
    greenSoft: "rgba(34, 197, 94, 0.12)",
    greenBorder: "#16a34a",
    greenFocus: "rgba(34, 197, 94, 0.2)",
  },

  shadow: {
    sm: "0 1px 3px rgba(0,0,0,0.1)",
    md: "0 4px 6px -1px rgba(0,0,0,0.1)",
  },
};

export const darkTheme = {
  background: "#0f172a",
  backgroundSoft: "#1e293b",
  header: "#1e293b",

  text: "#f1f5f9",
  textSoft: "#cbd5e1",

  colors: {
    border: "#334155",
    borderHover: "#475569",

    bgSoft: "#1e293b",
    bgHover: "#334155",

    card: "#1e293b",
    cardBorder: "#334155",
    cardBorderHover: "#475569",
    cardHover: "#273449",

    textSoft: "#cbd5e1",

    success: "#22c55e",
    successHover: "#16a34a",

    danger: "#ef4444",
    dangerHover: "#dc2626",

    accent: "#3b82f6",
    accentHover: "#60a5fa",

    shadowSoft: "rgba(0,0,0,0.3)",
    accentAlpha: "rgba(59, 130, 246, 0.2)",
    green: "#22c55e",
    greenSoft: "rgba(34, 197, 94, 0.2)",
    greenBorder: "#22c55e",
    greenFocus: "rgba(34, 197, 94, 0.3)",
  },

  shadow: {
    sm: "0 1px 3px rgba(0,0,0,0.4)",
    md: "0 4px 6px -1px rgba(0,0,0,0.5)",
  },
};

export type AppTheme = typeof lightTheme;
