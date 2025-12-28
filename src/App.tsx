import { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  Container,
  Heading,
  HStack,
  Input,
  Stack,
  Text,
  SimpleGrid,
  Card,
  Badge,
  VStack,
  Flex,
  InputGroup,
} from "@chakra-ui/react";
import {
  FiSearch,
  FiTrendingDown,
  FiShoppingCart,
  FiStar,
  FiExternalLink,
} from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { ColorModeButton } from "@/components/ui/color-mode";
import { LanguageSelector } from "./components/LanguageSelector";
import { productsService } from "./services/products.service";
import { useDynamicColors } from "@/utils/dinamicColors";
import { SideBarFilters } from "./components/SideBarFilters";

function App() {
  const { t, i18n } = useTranslation();
  const DYNAMIC_COLORS = useDynamicColors();
  const [searchTerm, setSearchTerm] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<{
    category: string | null;
    subcategory: string | null;
  }>({
    category: null,
    subcategory: null,
  });
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const loadBestProducts = async () => {
      setIsLoading(true);
      try {
        const response = await productsService.getBestProducts(
          selectedCategory.category,
          selectedCategory.subcategory
        );
        setProducts(response || []);
      } catch (error) {
        console.error("Error al cargar mejores productos:", error);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadBestProducts();
  }, [selectedCategory]);

  // Debounce effect para buscar productos
  useEffect(() => {
    // Limpiar el timer anterior si existe
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Si el término de búsqueda está vacío, cargar mejores productos
    if (!searchTerm.trim()) {
      setHasSearched(false);
      const loadBestProducts = async () => {
        setIsLoading(true);
        try {
          const response = await productsService.getBestProducts(
            selectedCategory.category,
            selectedCategory.subcategory
          );
          setProducts(response || []);
        } catch (error) {
          console.error("Error al cargar mejores productos:", error);
          setProducts([]);
        } finally {
          setIsLoading(false);
        }
      };
      loadBestProducts();
      return;
    }

    // Configurar un nuevo timer para el debounce (500ms)
    debounceTimerRef.current = setTimeout(async () => {
      setIsLoading(true);
      setHasSearched(true);

      try {
        const response = await productsService.getProducts(searchTerm, selectedCategory.category, selectedCategory.subcategory);
        setProducts(response || []);
      } catch (error) {
        console.error("Error al buscar productos:", error);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    }, 500);

    // Cleanup: limpiar el timer si el componente se desmonta o el searchTerm cambia
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchTerm, selectedCategory]);

  const handleSearch = () => {
    if (searchTerm.trim()) {
      setHasSearched(true);
    }
  };

  return (
    <Box minH="100vh" bg={DYNAMIC_COLORS.sectionBg}>
      {/* Header */}
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
            <Heading
              size="lg"
              color={DYNAMIC_COLORS.headerTitleColor}
            >
              {t("header.title")}
            </Heading>
            <HStack gap={4}>
              <LanguageSelector />
              <ColorModeButton />
            </HStack>
          </Flex>
        </Container>
      </Box>

      {/* Hero Section */}
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

      {/* Results Section */}
      <Container maxW="7xl" py={12}>
        <VStack align="stretch" gap={8}>
          <Flex justify="space-between" align="center" flexWrap="wrap" gap={4}>
            <Box>
              <Heading size="xl" mb={2} color={DYNAMIC_COLORS.headingColor}>
                {hasSearched
                  ? t("results.title", { searchTerm })
                  : t("results.bestDeals")}
              </Heading>
              <Text color={DYNAMIC_COLORS.textMuted} fontSize="md">
                {isLoading
                  ? t("results.loading")
                  : t("results.productsFound", { count: products.length })}
              </Text>
            </Box>
            <HStack gap={3}>
              <Button
                variant="outline"
                size="md"
                borderColor={DYNAMIC_COLORS.buttonBorderColor}
                color={DYNAMIC_COLORS.headingColor}
                onClick={() => {
                  setIsFilterDrawerOpen(true);
                }}
                _hover={{
                  bg: DYNAMIC_COLORS.buttonHoverBg,
                  borderColor: DYNAMIC_COLORS.buttonHoverBorder,
                }}
              >
                {t("results.filters")}
              </Button>
            </HStack>
          </Flex>

          {isLoading ? (
            <Box textAlign="center" py={16}>
              <Text color={DYNAMIC_COLORS.textMuted} fontSize="lg">
                {t("results.loading")}
              </Text>
            </Box>
          ) : products.length === 0 ? (
            <Box textAlign="center" py={16}>
              <Text color={DYNAMIC_COLORS.textMuted} fontSize="lg">
                {hasSearched
                  ? t("results.noProducts", { searchTerm })
                  : t("results.noProductsAvailable")}
              </Text>
            </Box>
          ) : (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} gap={6}>
              {products.map((product: any, index: number) => {
                const latestPrice =
                  product.price_history[product.price_history.length - 1]
                    ?.price || 0;
                const lowestPrice = Math.min(
                  ...product.price_history.map((entry: any) => entry.price)
                );

                return (
                  <Card.Root
                    key={`${product.name}-${index}`}
                    overflow="hidden"
                    bg={DYNAMIC_COLORS.cardBg}
                    _hover={{ shadow: "xl", transform: "translateY(-4px)" }}
                    transition="all 0.3s"
                  >
                    <Box
                      h="220px"
                      w="100%"
                      overflow="hidden"
                      bg={DYNAMIC_COLORS.noImageBg}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Text color={DYNAMIC_COLORS.textMuted} fontSize="sm">
                        {t("results.noImage")}
                      </Text>
                    </Box>
                    <Card.Body>
                      <VStack align="stretch" gap={4}>
                        <Box>
                          <Heading
                            size="md"
                            mb={3}
                            color={DYNAMIC_COLORS.headingColor}
                          >
                            {product.name}
                          </Heading>
                          <HStack gap={2} flexWrap="wrap">
                            <Badge
                              colorScheme="green"
                              fontSize="sm"
                              px={2}
                              py={1}
                            >
                              {t("results.from")} ${lowestPrice}
                            </Badge>
                            <Badge
                              colorScheme="blue"
                              fontSize="sm"
                              px={2}
                              py={1}
                            >
                              {product.store}
                            </Badge>
                          </HStack>
                        </Box>

                        <VStack align="stretch" gap={3}>
                          <Flex
                            justify="space-between"
                            align="center"
                            p={4}
                            bg={DYNAMIC_COLORS.cardHoverBg}
                            borderRadius="lg"
                          >
                            <VStack align="start" gap={1}>
                              <Text
                                fontWeight="bold"
                                fontSize="sm"
                                color={DYNAMIC_COLORS.headingColor}
                              >
                                {product.store}
                              </Text>
                              <Text
                                fontSize="xs"
                                color={DYNAMIC_COLORS.textMuted}
                              >
                                {product.category[
                                  i18n.language as "es" | "en"
                                ] || product.category.es}
                              </Text>
                            </VStack>
                            <VStack align="end" gap={1}>
                              <Text
                                fontSize="2xl"
                                fontWeight="bold"
                                color={DYNAMIC_COLORS.productPriceColor}
                              >
                                ${latestPrice}
                              </Text>
                              {lowestPrice < latestPrice && (
                                <Badge colorScheme="red" fontSize="xs" px={2}>
                                  {t("results.best")}: ${lowestPrice}
                                </Badge>
                              )}
                            </VStack>
                          </Flex>
                        </VStack>

                        <Button
                          colorScheme="blue"
                          size="md"
                          w="100%"
                          variant="solid"
                        >
                          {t("results.viewDetails")}
                          <FiExternalLink
                            size={16}
                            style={{ marginLeft: "8px" }}
                          />
                        </Button>
                      </VStack>
                    </Card.Body>
                  </Card.Root>
                );
              })}
            </SimpleGrid>
          )}
        </VStack>
      </Container>

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
      />
    </Box>
  );
}

export default App;
