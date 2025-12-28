import { useColorModeValue } from "@/components/ui/color-mode";

export const useDynamicColors = () => {
  return {
    // Dynamic colors
    headerBg: useColorModeValue("white", "gray.800"),
    headerBorder: useColorModeValue("gray.200", "gray.700"),
    textMuted: useColorModeValue("gray.600", "gray.400"),
    cardBg: useColorModeValue("white", "gray.800"),
    cardHoverBg: useColorModeValue("gray.50", "gray.750"),
    noImageBg: useColorModeValue("gray.100", "gray.700"),
    footerBg: useColorModeValue("gray.800", "gray.900"),
    headingColor: useColorModeValue("gray.900", "gray.100"),
    sectionBg: useColorModeValue("gray.50", "gray.900"),
    featureCardBg: useColorModeValue("white", "gray.800"),
    drawerBg: useColorModeValue("white", "gray.800"),
    drawerBorder: useColorModeValue("gray.200", "gray.700"),
    menuItemHoverBg: useColorModeValue("gray.100", "gray.700"),
    // Hero section colors
    heroGradient: useColorModeValue(
      "linear(to-r, blue.100, purple.100)",
      "linear(to-r, blue.700, purple.800)"
    ),
    heroBg: useColorModeValue("blue.50", undefined),
    heroTitleColor: useColorModeValue("gray.900", "white"),
    heroSubtitleColor: useColorModeValue("gray.700", "whiteAlpha.900"),
    searchIconColor: useColorModeValue("rgb(107, 114, 128)", "rgb(156, 163, 175)"),
    inputBg: useColorModeValue("white", "gray.800"),
    inputColor: useColorModeValue("gray.900", "gray.100"),
    inputBorderColor: useColorModeValue("gray.300", "gray.600"),
    inputPlaceholderColor: useColorModeValue("gray.500", "gray.400"),
    inputFocusBorder: useColorModeValue("blue.500", "blue.400"),
    inputFocusShadow: useColorModeValue(
      "0 0 0 1px var(--chakra-colors-blue-500)",
      "0 0 0 1px var(--chakra-colors-blue-400)"
    ),
    // Feature colors
    featureIconBg: useColorModeValue("blue.50", "blue.900"),
    featureIconColor: useColorModeValue("rgb(59, 130, 246)", "rgb(147, 197, 253)"),
    // Button colors
    buttonBorderColor: useColorModeValue("gray.300", "gray.600"),
    buttonHoverBg: useColorModeValue("gray.50", "gray.700"),
    buttonHoverBorder: useColorModeValue("gray.400", "gray.500"),
    // Badge colors
    badgeColor: useColorModeValue("rgb(34, 197, 94)", "rgb(134, 239, 172)"),
    badgeTextColor: useColorModeValue("gray.700", "whiteAlpha.900"),
    // Header title color
    headerTitleColor: useColorModeValue("blue.600", "blue.400"),
    // Product price color
    productPriceColor: useColorModeValue("blue.600", "blue.400"),
  };
};