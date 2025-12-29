import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Badge,
  Card,
  SimpleGrid,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useDynamicColors } from "@/utils/dinamicColors";
import { FiArrowLeft, FiExternalLink, FiTrendingDown } from "react-icons/fi";
import { HeaderBar } from "@/components/HeaderBar";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { useGetProductById } from "@/hooks/useGetProductById";
import { NotFoundProduct } from "@/components/NotFoundProduct";
import { GraphicPrices, type TimeRange } from "@/components/GraphicPrices";
import { useState } from "react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const DYNAMIC_COLORS = useDynamicColors();

  const { product, isLoading, similarProducts } = useGetProductById({ id });
  const [timeRange, setTimeRange] = useState<TimeRange>("all");

  if (isLoading) {
    return (
      <Box minH="100vh" bg={DYNAMIC_COLORS.sectionBg}>
        <HeaderBar setIsFilterDrawerOpen={() => {}} />
        <Container maxW="7xl" py={12}>
          <Text color={DYNAMIC_COLORS.textMuted}>{t("results.loading")}</Text>
        </Container>
      </Box>
    );
  }

  if (!product) {
    return <NotFoundProduct />
  }

  const latestPrice =
    product.price_history[product.price_history.length - 1]?.price || 0;
  
  const getFilteredData = () => {
    if (timeRange === "all") {
      return product.price_history;
    }
    const months = parseInt(timeRange);
    return product.price_history.slice(-months);
  };

  const filteredHistory = getFilteredData();
  const firstPriceInRange = filteredHistory[0]?.price || 0;
  const lastPriceInRange = filteredHistory[filteredHistory.length - 1]?.price || 0;
  
  const lowestPrice = Math.min(
    ...product.price_history.map((entry) => entry.price)
  );
  const highestPrice = Math.max(
    ...product.price_history.map((entry) => entry.price)
  );
  
  // Encontrar meses con menor y mayor precio
  const lowestPriceEntry = product.price_history.find(
    (entry) => entry.price === lowestPrice
  );
  const highestPriceEntry = product.price_history.find(
    (entry) => entry.price === highestPrice
  );
  
  // Calcular porcentaje de variación basado en el rango seleccionado
  const priceVariation = firstPriceInRange > 0 
    ? (((lastPriceInRange - firstPriceInRange) / firstPriceInRange) * 100).toFixed(1)
    : "0";
  
  // Formatear mes
  const formatMonth = (monthStr: string) => {
    const [year, month] = monthStr.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString(i18n.language, { month: "long", year: "numeric" });
  };

  return (
    <Box minH="100vh" bg={DYNAMIC_COLORS.sectionBg}>
      <HeaderBar setIsFilterDrawerOpen={() => {}} />
      <Container maxW="7xl" py={12}>
        <VStack align="stretch" gap={8}>
          {/* Botón de regreso */}
          <Button
            onClick={() => navigate(-1)}
            variant="ghost"
            alignSelf="flex-start"
            _hover={{ bg: DYNAMIC_COLORS.menuItemHoverBg }}
          >
            <HStack gap={2}>
              <FiArrowLeft />
              <Text>{t("productDetail.back")}</Text>
            </HStack>
          </Button>

          {/* Información principal del producto - Layout mejorado */}
          <SimpleGrid columns={{ base: 1, lg: 3 }} gap={6}>
            {/* Columna izquierda - Información del producto */}
            <Box gridColumn={{ base: "1", lg: "span 2" }}>
              <Card.Root bg={DYNAMIC_COLORS.cardBg} p={6}>
                <Card.Body>
                  <VStack align="stretch" gap={4}>
                    {/* Imagen del producto */}
                    {product.image && (
                      <Box
                        w="100%"
                        h="400px"
                        overflow="hidden"
                        borderRadius="lg"
                        bg={DYNAMIC_COLORS.noImageBg}
                        mb={4}
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                          onError={(e: any) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      </Box>
                    )}
                    <Box>
                      <Heading size="2xl" mb={3} color={DYNAMIC_COLORS.headingColor}>
                        {product.name}
                      </Heading>
                      <HStack gap={2} flexWrap="wrap" mb={3}>
                        <Badge colorScheme="blue" fontSize="md" px={3} py={1}>
                          {product.store}
                        </Badge>
                        <Badge colorScheme="green" fontSize="md" px={3} py={1}>
                          <HStack gap={1}>
                            <FiTrendingDown />
                            <Text>{t("results.from")} ${lowestPrice}</Text>
                          </HStack>
                        </Badge>
                      </HStack>
                      <HStack gap={4} flexWrap="wrap">
                        <Text color={DYNAMIC_COLORS.textMuted} fontSize="sm">
                          {t("productDetail.category")}:{" "}
                          <Text as="span" fontWeight="semibold">
                            {product.category[i18n.language as "es" | "en"] ||
                              product.category.es}
                          </Text>
                        </Text>
                        <Text color={DYNAMIC_COLORS.textMuted} fontSize="sm">
                          {t("productDetail.subcategory")}:{" "}
                          <Text as="span" fontWeight="semibold">
                            {product.subcategory[i18n.language as "es" | "en"] ||
                              product.subcategory.es}
                          </Text>
                        </Text>
                      </HStack>
                    </Box>
                  </VStack>
                </Card.Body>
              </Card.Root>
            </Box>

            {/* Columna derecha - Precio y botón de compra */}
            <Box>
              <Card.Root bg={DYNAMIC_COLORS.cardBg} p={6}>
                <Card.Body>
                  <VStack align="stretch" gap={4}>
                    {/* Precio actual */}
                    <Box
                      p={4}
                      bg={DYNAMIC_COLORS.cardHoverBg}
                      borderRadius="lg"
                      border="2px solid"
                      borderColor="blue.500"
                    >
                      <VStack align="start" gap={2}>
                        <Text
                          fontSize="xs"
                          color={DYNAMIC_COLORS.textMuted}
                          textTransform="uppercase"
                          letterSpacing="wide"
                        >
                          {t("productDetail.currentPrice")}
                        </Text>
                        <Text
                          fontSize="3xl"
                          fontWeight="bold"
                          color={DYNAMIC_COLORS.productPriceColor}
                        >
                          ${latestPrice}
                        </Text>
                        {parseFloat(priceVariation) !== 0 && (
                          <Badge
                            colorScheme={parseFloat(priceVariation) < 0 ? "green" : "red"}
                            fontSize="xs"
                          >
                            {parseFloat(priceVariation) > 0 ? "+" : ""}{priceVariation}%
                          </Badge>
                        )}
                      </VStack>
                    </Box>

                    {/* Botón de compra */}
                    <Button colorScheme="blue" size="lg" w="100%">
                      <HStack gap={2}>
                        <Text>{t("productDetail.buyNow")}</Text>
                        <FiExternalLink />
                      </HStack>
                    </Button>
                  </VStack>
                </Card.Body>
              </Card.Root>
            </Box>
          </SimpleGrid>

          {/* Estadísticas de precio */}
          <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
            <Card.Root bg={DYNAMIC_COLORS.cardBg} p={4}>
              <Card.Body>
                <VStack align="start" gap={2}>
                  <Text fontSize="xs" color={DYNAMIC_COLORS.textMuted} textTransform="uppercase">
                    {t("productDetail.lowestPrice")}
                  </Text>
                  <Text fontSize="2xl" fontWeight="bold" color="green.400">
                    ${lowestPrice}
                  </Text>
                  {lowestPriceEntry && (
                    <Text fontSize="xs" color={DYNAMIC_COLORS.textMuted}>
                      {formatMonth(lowestPriceEntry.month)}
                    </Text>
                  )}
                </VStack>
              </Card.Body>
            </Card.Root>

            <Card.Root bg={DYNAMIC_COLORS.cardBg} p={4}>
              <Card.Body>
                <VStack align="start" gap={2}>
                  <Text fontSize="xs" color={DYNAMIC_COLORS.textMuted} textTransform="uppercase">
                    {t("productDetail.highestPrice")}
                  </Text>
                  <Text fontSize="2xl" fontWeight="bold" color="red.400">
                    ${highestPrice}
                  </Text>
                  {highestPriceEntry && (
                    <Text fontSize="xs" color={DYNAMIC_COLORS.textMuted}>
                      {formatMonth(highestPriceEntry.month)}
                    </Text>
                  )}
                </VStack>
              </Card.Body>
            </Card.Root>

            <Card.Root bg={DYNAMIC_COLORS.cardBg} p={4}>
              <Card.Body>
                <VStack align="start" gap={2}>
                  <Text fontSize="xs" color={DYNAMIC_COLORS.textMuted} textTransform="uppercase">
                    {t("productDetail.priceVariation")}
                  </Text>
                  <Text
                    fontSize="2xl"
                    fontWeight="bold"
                    color={parseFloat(priceVariation) < 0 ? "green.400" : parseFloat(priceVariation) > 0 ? "red.400" : DYNAMIC_COLORS.textMuted}
                  >
                    {parseFloat(priceVariation) > 0 ? "+" : ""}{priceVariation}%
                  </Text>
                  <Text fontSize="xs" color={DYNAMIC_COLORS.textMuted}>
                    {t("productDetail.sinceStart")}
                  </Text>
                </VStack>
              </Card.Body>
            </Card.Root>
          </SimpleGrid>

          {/* Gráfico de historial de precios */}
          <GraphicPrices timeRange={timeRange} setTimeRange={setTimeRange} getFilteredData={getFilteredData} />

          {/* Productos similares */}
          {similarProducts.length > 0 && (
            <Box w="100%">
              <Heading size="lg" mb={8} color={DYNAMIC_COLORS.headingColor} textAlign="center">
                {t("productDetail.similarProducts")}
              </Heading>
              <SimpleGrid 
                columns={{ base: 1, md: 2, lg: 3 }} 
                gap={6}
                justifyItems="center"
                maxW="5xl"
                mx="auto"
              >
                {similarProducts.map((similarProduct) => {
                  const similarLatestPrice =
                    similarProduct.price_history[
                      similarProduct.price_history.length - 1
                    ]?.price || 0;
                  const similarLowestPrice = Math.min(
                    ...similarProduct.price_history.map((entry) => entry.price)
                  );

                  return (
                    <Card.Root
                      key={similarProduct.id}
                      bg={DYNAMIC_COLORS.cardBg}
                      _hover={{ shadow: "xl", cursor: "pointer", transform: "translateY(-4px)" }}
                      transition="all 0.3s"
                      onClick={() => {
                        navigate(`/product/${similarProduct.id}`);
                      }}
                      w="100%"
                      maxW="400px"
                      overflow="hidden"
                    >
                      {/* Imagen del producto similar */}
                      {similarProduct.image && (
                        <Box
                          h="200px"
                          w="100%"
                          overflow="hidden"
                          bg={DYNAMIC_COLORS.noImageBg}
                        >
                          <img
                            src={similarProduct.image}
                            alt={similarProduct.name}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover'
                            }}
                            onError={(e: any) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        </Box>
                      )}
                      <Card.Body p={6}>
                        <VStack align="stretch" gap={4}>
                          <Heading
                            size="md"
                            color={DYNAMIC_COLORS.headingColor}
                            style={{
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                            }}
                          >
                            {similarProduct.name}
                          </Heading>
                          <HStack gap={2} flexWrap="wrap">
                            <Badge colorScheme="blue" fontSize="sm" px={3} py={1}>
                              {similarProduct.store}
                            </Badge>
                            <Badge colorScheme="green" fontSize="sm" px={3} py={1}>
                              {t("results.from")} ${similarLowestPrice}
                            </Badge>
                          </HStack>
                          <Text
                            fontSize="2xl"
                            fontWeight="bold"
                            color={DYNAMIC_COLORS.productPriceColor}
                          >
                            ${similarLatestPrice}
                          </Text>
                        </VStack>
                      </Card.Body>
                    </Card.Root>
                  );
                })}
              </SimpleGrid>
            </Box>
          )}
        </VStack>
      </Container>
    </Box>
  );
};

