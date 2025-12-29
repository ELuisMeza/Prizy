import { Container, Flex, VStack, Text, HStack, Button, SimpleGrid, Card, Badge } from "@chakra-ui/react";
import { Box } from "@chakra-ui/react";
import { Heading } from "@chakra-ui/react";
import { useDynamicColors } from "@/utils/dinamicColors";
import { useTranslation } from "react-i18next";
import type { TypeProduct } from "@/types/product.types";
import { FiExternalLink } from "react-icons/fi";
import { useGetAllCategories } from "@/hooks/useGetAllCategories";
import { useNavigate } from "react-router-dom";

interface Props {
  isLoading: boolean;
  products: TypeProduct[];
  setIsFilterDrawerOpen: (isFilterDrawerOpen: boolean) => void;
  hasSearched: boolean;
  searchTerm: string;
  selectedCategory: {
    category: string | null;
    subcategory: string | null;
  };
}

export const ResultSection = ({ isLoading, products, setIsFilterDrawerOpen, hasSearched, searchTerm, selectedCategory }: Props) => {
  const DYNAMIC_COLORS = useDynamicColors();
  const { t, i18n } = useTranslation();
  const { categories } = useGetAllCategories();
  const navigate = useNavigate();

  // Obtener el nombre de la categoría y subcategoría seleccionada
  const getCategoryDisplayName = () => {
    if (!selectedCategory.category) return null;
    
    const category = categories.find((cat) => {
      const catNameEs = cat.name.es;
      const catNameEn = cat.name.en;
      return catNameEs === selectedCategory.category || catNameEn === selectedCategory.category;
    });
    
    if (!category) return selectedCategory.category;
    
    const categoryName = category.name[i18n.language as "es" | "en"] || category.name.es;
    
    if (selectedCategory.subcategory) {
      return `${categoryName} > ${selectedCategory.subcategory}`;
    }
    
    return categoryName;
  };

  const categoryDisplayName = getCategoryDisplayName();

  return (
    <Container maxW="7xl" py={12}>
      <VStack align="stretch" gap={8}>
        <Flex justify="space-between" align="center" flexWrap="wrap" gap={4}>
          <Box>
            <Heading size="xl" mb={2} color={DYNAMIC_COLORS.headingColor}>
              {hasSearched
                ? t("results.title", { searchTerm })
                : t("results.bestDeals")}
            </Heading>
            {categoryDisplayName && (
              <Text color={DYNAMIC_COLORS.textMuted} fontSize="sm" mb={1}>
                {t("results.filteredBy")}: <Text as="span" fontWeight="semibold">{categoryDisplayName}</Text>
              </Text>
            )}
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
                _hover={{ shadow: "xl", transform: "translateY(-4px)", cursor: "pointer" }}
                transition="all 0.3s"
                onClick={() => navigate(`/product/${product.id}`)}
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
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/product/${product.id}`);
                      }}
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
  );
};