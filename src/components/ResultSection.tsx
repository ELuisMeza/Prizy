import { Container, Flex, VStack, Text, HStack, Button, SimpleGrid, Card, Badge } from "@chakra-ui/react";
import { Box } from "@chakra-ui/react";
import { Heading } from "@chakra-ui/react";
import { useDynamicColors } from "@/utils/dinamicColors";
import { useTranslation } from "react-i18next";
import type { TypeProduct } from "@/types/product.types";
import { FiExternalLink, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useGetAllCategories } from "@/hooks/useGetAllCategories";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";

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
  
  // Configuración de paginación
  const PRODUCTS_PER_PAGE = 12;
  const [currentPage, setCurrentPage] = useState(1);

  // Resetear a la primera página cuando cambien los productos o filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [products.length, searchTerm, selectedCategory.category, selectedCategory.subcategory]);

  // Calcular productos paginados
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
    const endIndex = startIndex + PRODUCTS_PER_PAGE;
    return products.slice(startIndex, endIndex);
  }, [products, currentPage]);

  // Calcular número total de páginas
  const totalPages = useMemo(() => {
    return Math.ceil(products.length / PRODUCTS_PER_PAGE);
  }, [products.length]);

  // Calcular rango de productos mostrados
  const startItem = (currentPage - 1) * PRODUCTS_PER_PAGE + 1;
  const endItem = Math.min(currentPage * PRODUCTS_PER_PAGE, products.length);

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

  // Función para generar números de página a mostrar
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      // Mostrar todas las páginas si son pocas
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Mostrar primera página
      pages.push(1);
      
      if (currentPage > 3) {
        pages.push('...');
      }
      
      // Mostrar páginas alrededor de la actual
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (currentPage < totalPages - 2) {
        pages.push('...');
      }
      
      // Mostrar última página
      pages.push(totalPages);
    }
    
    return pages;
  };

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
        <>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} gap={6}>
            {paginatedProducts.map((product: TypeProduct) => {
            const latestPrice =
              product.price_history[product.price_history.length - 1]
                ?.price || 0;
            const lowestPrice = Math.min(
              ...product.price_history.map((entry: any) => entry.price)
            );

            return (
              <Card.Root
                key={product.id}
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
                  position="relative"
                >
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                      onError={(e: any) => {
                        // Si la imagen falla al cargar, mostrar placeholder
                        e.target.style.display = 'none';
                        const placeholder = e.target.parentElement?.querySelector('div[data-placeholder]') as HTMLElement;
                        if (placeholder) {
                          placeholder.style.display = 'flex';
                        }
                      }}
                    />
                  ) : null}
                  <Box
                    data-placeholder
                    display={product.image ? "none" : "flex"}
                    position={product.image ? "absolute" : "relative"}
                    top={0}
                    left={0}
                    alignItems="center"
                    justifyContent="center"
                    w="100%"
                    h="100%"
                  >
                    <Text color={DYNAMIC_COLORS.textMuted} fontSize="sm">
                      {t("results.noImage")}
                    </Text>
                  </Box>
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

          {/* Paginación */}
          {totalPages > 1 && (
            <Flex
              direction={{ base: "column", sm: "row" }}
              align="center"
              justify="space-between"
              gap={4}
              mt={8}
              pt={6}
              borderTop="1px"
              borderColor={DYNAMIC_COLORS.buttonBorderColor}
            >
              {/* Información de productos mostrados */}
              <Text color={DYNAMIC_COLORS.textMuted} fontSize="sm">
                {t("results.showing")} {startItem} {t("results.to")} {endItem} {t("results.of")} {products.length} {t("results.products")}
              </Text>

              {/* Controles de paginación */}
              <HStack gap={2} flexWrap="wrap" justify="center">
                {/* Botón Anterior */}
                <Button
                  variant="outline"
                  size="sm"
                  borderColor={DYNAMIC_COLORS.buttonBorderColor}
                  color={DYNAMIC_COLORS.headingColor}
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  _hover={{
                    bg: DYNAMIC_COLORS.buttonHoverBg,
                    borderColor: DYNAMIC_COLORS.buttonHoverBorder,
                  }}
                  _disabled={{
                    opacity: 0.5,
                    cursor: "not-allowed",
                  }}
                >
                  <FiChevronLeft />
                  {t("results.previous")}
                </Button>

                {/* Números de página */}
                <HStack gap={1}>
                  {getPageNumbers().map((page, idx) => {
                    if (page === '...') {
                      return (
                        <Text
                          key={`ellipsis-${idx}`}
                          color={DYNAMIC_COLORS.textMuted}
                          px={2}
                        >
                          ...
                        </Text>
                      );
                    }

                    const pageNum = page as number;
                    const isActive = pageNum === currentPage;

                    return (
                      <Button
                        key={pageNum}
                        variant={isActive ? "solid" : "outline"}
                        size="sm"
                        colorScheme={isActive ? "blue" : undefined}
                        borderColor={!isActive ? DYNAMIC_COLORS.buttonBorderColor : undefined}
                        color={!isActive ? DYNAMIC_COLORS.headingColor : undefined}
                        onClick={() => setCurrentPage(pageNum)}
                        _hover={{
                          bg: !isActive ? DYNAMIC_COLORS.buttonHoverBg : undefined,
                          borderColor: !isActive ? DYNAMIC_COLORS.buttonHoverBorder : undefined,
                        }}
                        minW="40px"
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </HStack>

                {/* Botón Siguiente */}
                <Button
                  variant="outline"
                  size="sm"
                  borderColor={DYNAMIC_COLORS.buttonBorderColor}
                  color={DYNAMIC_COLORS.headingColor}
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  _hover={{
                    bg: DYNAMIC_COLORS.buttonHoverBg,
                    borderColor: DYNAMIC_COLORS.buttonHoverBorder,
                  }}
                  _disabled={{
                    opacity: 0.5,
                    cursor: "not-allowed",
                  }}
                >
                  {t("results.next")}
                  <FiChevronRight />
                </Button>
              </HStack>
            </Flex>
          )}
        </>
      )}
    </VStack>
  </Container>
  );
};