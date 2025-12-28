import { Box, HStack, Container, Heading, Flex, Button } from "@chakra-ui/react";
import { LanguageSelector } from "./LanguageSelector";
import { useDynamicColors } from "@/utils/dinamicColors";
import { ColorModeButton } from "./ui/color-mode";
import { useTranslation } from "react-i18next";
import { FiMenu } from "react-icons/fi";

interface Props {
  setIsFilterDrawerOpen: (open: boolean) => void;
}

export const HeaderBar = ({ setIsFilterDrawerOpen }: Props) => {

  const DYNAMIC_COLORS = useDynamicColors();
  const { t } = useTranslation();
  
  return (
    <Box
      bg={DYNAMIC_COLORS.headerBg}
      borderBottom="1px"
      borderColor={DYNAMIC_COLORS.headerBorder}
      py={4}
      position="sticky"
      top={0}
      zIndex={100}
      shadow="sm"
    >
      <Container maxW="7xl">
        <Flex justify="space-between" align="center">
          <HStack gap={3}>
            <Button
              variant="ghost"
              size="md"
              onClick={() => setIsFilterDrawerOpen(true)}
              aria-label={t("results.filters")}
              _hover={{ bg: DYNAMIC_COLORS.menuItemHoverBg }}
            >
              <FiMenu size={20} />
            </Button>
            <Heading size="lg" color={DYNAMIC_COLORS.headerTitleColor}>
              {t("header.title")}
            </Heading>
          </HStack>
          <HStack gap={4}>
            <LanguageSelector />
            <ColorModeButton />
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
};
