import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Card,
  VStack,
} from "@chakra-ui/react";
import {
  FiTrendingDown,
  FiShoppingCart,
  FiStar,
} from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { useDynamicColors } from "@/utils/dinamicColors";
import { SideBarFilters } from "../components/SideBarFilters";
import { HeaderBar } from "../components/HeaderBar";
import { useGetBestProducts } from "../hooks/useGetBestProducts";
import type { TypeProduct } from "../types/product.types";
import { useGetSearchProduct } from "../hooks/useGetSearchProduct";
import { HeroSection } from "../components/HeroSection";
import { ResultSection } from "../components/ResultSection";

export const Home = () => {
  const { t } = useTranslation();
  const DYNAMIC_COLORS = useDynamicColors();
  const [searchTerm, setSearchTerm] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [products, setProducts] = useState<TypeProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<{
    category: string | null;
    subcategory: string | null;
  }>({
    category: null,
    subcategory: null,
  });

  useGetBestProducts({ selectedCategory, setProducts, setIsLoading, hasSearched });

  const { searchProducts } = useGetSearchProduct({ searchTerm, setHasSearched, setProducts, setIsLoading, selectedCategory });

  useEffect(() => {
    if (!searchTerm.trim() && hasSearched) {
      setHasSearched(false);
    }
  }, [searchTerm, hasSearched, setHasSearched]);

  return (
    <Box minH="100vh" bg={DYNAMIC_COLORS.sectionBg}>
      {/* Header */}
      <HeaderBar setIsFilterDrawerOpen={setIsFilterDrawerOpen} />

      {/* Hero Section */}
      <HeroSection isLoading={isLoading} searchTerm={searchTerm} setSearchTerm={setSearchTerm} onSearch={searchProducts} />

      {/* Results Section */}
      <ResultSection isLoading={isLoading} products={products} setIsFilterDrawerOpen={setIsFilterDrawerOpen} hasSearched={hasSearched} searchTerm={searchTerm} selectedCategory={selectedCategory} />

      {/* Features Section */}
      <Container maxW="7xl" py={20}>
        <VStack gap={16}>
          <VStack textAlign="center" gap={4}>
            <Heading size="2xl" color={DYNAMIC_COLORS.headingColor}>
              {t("features.title")}
            </Heading>
            <Text color={DYNAMIC_COLORS.textMuted} fontSize="xl" maxW="3xl">
              {t("features.subtitle")}
            </Text>
          </VStack>

          <SimpleGrid columns={{ base: 1, md: 3 }} gap={8}>
            {[
              {
                icon: FiTrendingDown,
                title: t("features.saveMoney.title"),
                description: t("features.saveMoney.description"),
              },
              {
                icon: FiStar,
                title: t("features.verifiedData.title"),
                description: t("features.verifiedData.description"),
              },
              {
                icon: FiShoppingCart,
                title: t("features.safePurchase.title"),
                description: t("features.safePurchase.description"),
              },
            ].map((feature, idx) => {
              const IconComponent = feature.icon;
              return (
                <Card.Root
                  key={idx}
                  textAlign="center"
                  p={8}
                  bg={DYNAMIC_COLORS.featureCardBg}
                  _hover={{ shadow: "lg" }}
                  transition="all 0.3s"
                >
                  <Card.Body>
                    <VStack gap={5}>
                      <Box
                        p={5}
                        bg={DYNAMIC_COLORS.featureIconBg}
                        borderRadius="full"
                      >
                        <IconComponent
                          size={36}
                          color={DYNAMIC_COLORS.featureIconColor}
                        />
                      </Box>
                      <Heading size="lg" color={DYNAMIC_COLORS.headingColor}>
                        {feature.title}
                      </Heading>
                      <Text
                        color={DYNAMIC_COLORS.textMuted}
                        fontSize="md"
                        lineHeight="tall"
                      >
                        {feature.description}
                      </Text>
                    </VStack>
                  </Card.Body>
                </Card.Root>
              );
            })}
          </SimpleGrid>
        </VStack>
      </Container>

      {/* Footer */}
      <Box bg={DYNAMIC_COLORS.footerBg} color="white" py={16} mt={20}>
        <Container maxW="7xl">
          <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} gap={10}>
            <VStack align="start" gap={3}>
              <Heading size="lg" color="blue.300">
                {t("header.title")}
              </Heading>
              <Text fontSize="sm" color="gray.400">
                {t("footer.tagline")}
              </Text>
            </VStack>
            <VStack align="start" gap={3}>
              <Text fontWeight="bold" fontSize="md">
                {t("footer.products")}
              </Text>
              <Text
                fontSize="sm"
                color="gray.400"
                _hover={{ color: "white", cursor: "pointer" }}
              >
                {t("footer.electronics")}
              </Text>
              <Text
                fontSize="sm"
                color="gray.400"
                _hover={{ color: "white", cursor: "pointer" }}
              >
                {t("footer.home")}
              </Text>
              <Text
                fontSize="sm"
                color="gray.400"
                _hover={{ color: "white", cursor: "pointer" }}
              >
                {t("footer.fashion")}
              </Text>
            </VStack>
            <VStack align="start" gap={3}>
              <Text fontWeight="bold" fontSize="md">
                {t("footer.company")}
              </Text>
              <Text
                fontSize="sm"
                color="gray.400"
                _hover={{ color: "white", cursor: "pointer" }}
              >
                {t("footer.about")}
              </Text>
              <Text
                fontSize="sm"
                color="gray.400"
                _hover={{ color: "white", cursor: "pointer" }}
              >
                {t("footer.blog")}
              </Text>
              <Text
                fontSize="sm"
                color="gray.400"
                _hover={{ color: "white", cursor: "pointer" }}
              >
                {t("footer.contact")}
              </Text>
            </VStack>
            <VStack align="start" gap={3}>
              <Text fontWeight="bold" fontSize="md">
                {t("footer.legal")}
              </Text>
              <Text
                fontSize="sm"
                color="gray.400"
                _hover={{ color: "white", cursor: "pointer" }}
              >
                {t("footer.privacy")}
              </Text>
              <Text
                fontSize="sm"
                color="gray.400"
                _hover={{ color: "white", cursor: "pointer" }}
              >
                {t("footer.terms")}
              </Text>
              <Text
                fontSize="sm"
                color="gray.400"
                _hover={{ color: "white", cursor: "pointer" }}
              >
                {t("footer.cookies")}
              </Text>
            </VStack>
          </SimpleGrid>
          <Box mt={12} pt={8} borderTop="1px" borderColor="gray.700">
            <Text textAlign="center" fontSize="sm" color="gray.400">
              {t("footer.copyright")}
            </Text>
          </Box>
        </Container>
      </Box>

      {/* Filter Drawer */}
      <SideBarFilters
        isFilterDrawerOpen={isFilterDrawerOpen}
        setIsFilterDrawerOpen={setIsFilterDrawerOpen}
        setSelectedCategory={setSelectedCategory}
        selectedCategory={selectedCategory}
        setSearchTerm={setSearchTerm}
        setHasSearched={setHasSearched}
      />
    </Box>
  );
};

