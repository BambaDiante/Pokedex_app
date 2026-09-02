import { useColorScheme } from "react-native";
import { Colors } from "../constants/Colors";

type Theme = "dark" | "light";

export function useThemeColors() {
  const theme = useColorScheme() as Theme;

  return Colors[theme];
}