import { Box, Button, Container, Heading, HStack, Input, InputGroup, Stack, Text } from "@chakra-ui/react";
import { useDynamicColors } from "@/utils/dinamicColors";
import { useTranslation } from "react-i18next";
import { FiSearch, FiTrendingDown, FiShoppingCart, FiStar } from "react-icons/fi";

interface Props {
  isLoading: boolean;
  searchTerm: string;
  setSearchTerm: (searchTerm: string) => void;
  onSearch: () => void;
}

export const HeroSection = ({ isLoading, searchTerm, setSearchTerm, onSearch }: Props) => {
  const DYNAMIC_COLORS = useDynamicColors();
  const { t } = useTranslation();

  const handleSearch = () => {
    if (searchTerm.trim()) {
      onSearch();
    }
  };

  return (
    <Box
    bgGradient={DYNAMIC_COLORS.heroGradient}
    bg={DYNAMIC_COLORS.heroBg}
    py={20}
  >
    <Container maxW="7xl">
      <Stack align="center" textAlign="center" gap={6}>
        <Heading
          size="2xl"
          color={DYNAMIC_COLORS.heroTitleColor}
          maxW="4xl"
        >
          {t("hero.title")}
        </Heading>

        <Text
          fontSize="xl"
          color={DYNAMIC_COLORS.heroSubtitleColor}
          maxW="3xl"
        >
          {t("hero.subtitle")}
        </Text>

        <Box w="100%" maxW="3xl" position="relative">
          <Box
            position="absolute"
            left="20px"
            top="50%"
            transform="translateY(-50%)"
            zIndex={2}
            pointerEvents="none"
          >
            <FiSearch
              color={DYNAMIC_COLORS.searchIconColor}
              size={22}
            />
          </Box>
          <InputGroup>
            <Input
              size="xl"
              placeholder={t("hero.searchPlaceholder")}
              bg={DYNAMIC_COLORS.inputBg}
              color={DYNAMIC_COLORS.inputColor}
              borderColor={DYNAMIC_COLORS.inputBorderColor}
              _placeholder={{
                color: DYNAMIC_COLORS.inputPlaceholderColor,
              }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              borderRadius="full"
              pl="60px"
              pr="160px"
              fontSize="md"
              _focus={{
                borderColor: DYNAMIC_COLORS.inputFocusBorder,
                boxShadow: DYNAMIC_COLORS.inputFocusShadow,
              }}
            />
          </InputGroup>
          <Button
            position="absolute"
            right="6px"
            top="6px"
            colorScheme="blue"
            borderRadius="full"
            px={10}
            h="calc(100% - 12px)"
            onClick={handleSearch}
            loading={isLoading}
            fontSize="md"
            fontWeight="semibold"
          >
            {t("hero.searchButton")}
          </Button>
        </Box>

        <HStack gap={10} pt={6} flexWrap="wrap" justify="center">
          <HStack gap={2}>
            <FiTrendingDown
              color={DYNAMIC_COLORS.badgeColor}
              size={22}
            />
            <Text
              color={DYNAMIC_COLORS.badgeTextColor}
              fontSize="md"
              fontWeight="medium"
            >
              {t("hero.saveUpTo")}
            </Text>
          </HStack>
          <HStack gap={2}>
            <FiShoppingCart
              color={DYNAMIC_COLORS.badgeColor}
              size={22}
            />
            <Text
              color={DYNAMIC_COLORS.badgeTextColor}
              fontSize="md"
              fontWeight="medium"
            >
              {t("hero.stores")}
            </Text>
          </HStack>
          <HStack gap={2}>
            <FiStar
              color={DYNAMIC_COLORS.badgeColor}
              size={22}
            />
            <Text
              color={DYNAMIC_COLORS.badgeTextColor}
              fontSize="md"
              fontWeight="medium"
            >
              {t("hero.realTime")}
            </Text>
          </HStack>
        </HStack>
      </Stack>
    </Container>
  </Box>
  );
};