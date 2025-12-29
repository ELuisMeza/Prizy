import { Box, Heading, Text } from "@chakra-ui/react";
import { useDynamicColors } from "@/utils/dinamicColors";
import { HeaderBar } from "./HeaderBar";
import { Container } from "@chakra-ui/react";
import { VStack } from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";
import { HStack } from "@chakra-ui/react";
import { FiArrowLeft } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export const NotFoundProduct = () => {
  
  const DYNAMIC_COLORS = useDynamicColors();
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Box minH="100vh" bg={DYNAMIC_COLORS.sectionBg}>
      <HeaderBar setIsFilterDrawerOpen={() => {}} />
      <Container maxW="7xl" py={12}>
        <VStack gap={4} align="start">
          <Button onClick={() => navigate(-1)} variant="ghost">
            <HStack gap={2}>
              <FiArrowLeft />
              <Text>{t("productDetail.back")}</Text>
            </HStack>
          </Button>
          <Heading color={DYNAMIC_COLORS.headingColor}>
            {t("productDetail.notFound")}
          </Heading>
          <Text color={DYNAMIC_COLORS.textMuted}>
            {t("productDetail.notFoundDescription")}
          </Text>
        </VStack>
      </Container>
    </Box>
  );
};
