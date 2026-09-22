export type ThemeName = "nature" | "dark" | "game";

export type AppTheme = {
  name: ThemeName;
  displayName: string;
  icon: string;
  description: string;

  colors: {
    background: string;
    card: string;
    cardAlt: string;

    primary: string;
    secondary: string;

    text: string;
    textSecondary: string;
    muted: string;

    border: string;

    xp: string;
    success: string;
    danger: string;

    input: string;
    tabBar: string;
  };
};

export const themes: Record<ThemeName, AppTheme> = {
  nature: {
    name: "nature",

    displayName: "Nature Mode",

    icon: "🌿",

    description: "Light, fresh and natural",

    colors: {
      background: "#F4F8F2",

      card: "#FFFFFF",

      cardAlt: "#EAF3E8",

      primary: "#55A66F",

      secondary: "#A8D5B5",

      text: "#173522",

      textSecondary: "#53695A",

      muted: "#819087",

      border: "#DCE8DA",

      xp: "#55A66F",

      success: "#4E9B67",

      danger: "#D9534F",

      input: "#FFFFFF",

      tabBar: "#FFFFFF",
    },
  },

  dark: {
    name: "dark",

    displayName: "Dark Mode",

    icon: "🌙",

    description: "Clean, dark and minimal",

    colors: {
      background: "#0B0D12",

      card: "#171A22",

      cardAlt: "#24202F",

      primary: "#8B5CF6",

      secondary: "#292D38",

      text: "#FFFFFF",

      textSecondary: "#A7ADBB",

      muted: "#777E90",

      border: "#2B303C",

      xp: "#A78BFA",

      success: "#58C780",

      danger: "#EF4444",

      input: "#171A22",

      tabBar: "#171A22",
    },
  },

  game: {
    name: "game",

    displayName: "Game Mode",

    icon: "🎮",

    description: "RPG-inspired experience",

    colors: {
      background: "#100B1C",

      card: "#211733",

      cardAlt: "#291D3D",

      primary: "#9B5DE5",

      secondary: "#5B3C88",

      text: "#FFF8FF",

      textSecondary: "#C9BDD3",

      muted: "#A99BB8",

      border: "#3A2952",

      xp: "#F2C94C",

      success: "#7ED957",

      danger: "#FF5C77",

      input: "#211733",

      tabBar: "#181024",
    },
  },
};

export const defaultTheme: ThemeName = "dark";
