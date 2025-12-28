import { useState } from 'react';
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
  Stat,
} from "@chakra-ui/react";
import { FiSearch, FiTrendingDown, FiShoppingCart, FiStar, FiExternalLink } from "react-icons/fi";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const mockProducts = [
    {
      id: 1,
      name: "iPhone 15 Pro 256GB",
      image: "https://images.unsplash.com/photo-1696446702183-cbd50b06550b?w=400&h=300&fit=crop",
      stores: [
        { name: "Amazon", price: 1199, discount: 15, rating: 4.8, stock: true },
        { name: "Best Buy", price: 1249, discount: 10, rating: 4.6, stock: true },
        { name: "Walmart", price: 1189, discount: 18, rating: 4.7, stock: false },
      ],
      lowestPrice: 1189,
    },
    {
      id: 2,
      name: "iPhone 15 128GB",
      image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=300&fit=crop",
      stores: [
        { name: "Amazon", price: 899, discount: 10, rating: 4.9, stock: true },
        { name: "Target", price: 929, discount: 5, rating: 4.5, stock: true },
        { name: "Best Buy", price: 899, discount: 10, rating: 4.7, stock: true },
      ],
      lowestPrice: 899,
    },
    {
      id: 3,
      name: "iPhone 14 Pro Max 512GB",
      image: "https://images.unsplash.com/photo-1678652197950-91e3da85d96a?w=400&h=300&fit=crop",
      stores: [
        { name: "Amazon", price: 1099, discount: 20, rating: 4.8, stock: true },
        { name: "Walmart", price: 1149, discount: 15, rating: 4.6, stock: true },
      ],
      lowestPrice: 1099,
    },
  ];

  const handleSearch = () => {
    if (searchTerm.trim()) {
      setHasSearched(true);
    }
  };

  return (
    <Box minH="100vh">
      {/* Header */}
      <Box bg="white" borderBottom="1px" borderColor="gray.200" py={4}>
        <Container maxW="6xl">
          <Flex justify="space-between" align="center">
            <Heading size="lg" color="blue.600">PriceCompare</Heading>
            <HStack gap={4}>
              <Button variant="ghost" size="sm">Categorías</Button>
              <Button variant="ghost" size="sm">Ofertas</Button>
              <Button variant="ghost" size="sm">Ayuda</Button>
            </HStack>
          </Flex>
        </Container>
      </Box>

      {/* Hero Section */}
      <Box bg="gradient-to-r" bgGradient="linear(to-r, blue.500, purple.600)" py={20}>
        <Container maxW="6xl">
            <Stack align="center" textAlign="center" gap={6}>
            <Badge colorScheme="green" fontSize="sm" px={3} py={1} borderRadius="full">
              Más de 1 millón de productos comparados
            </Badge>
            
            <Heading size="2xl" color="white" maxW="3xl">
              Encuentra los Mejores Precios en Segundos
            </Heading>

            <Text fontSize="xl" color="whiteAlpha.900" maxW="2xl">
              Compara precios de miles de tiendas online. Ahorra tiempo y dinero con decisiones inteligentes.
            </Text>

            <Box w="100%" maxW="2xl">
              {/* <InputGroup size="lg">
                <InputLeftElement pointerEvents="none">
                  <FiSearch color="rgb(156, 163, 175)" size={20} />
                </InputLeftElement>
                <Input
                  placeholder="Busca cualquier producto... (ej: iPhone 15, laptop gaming)"
                  bg="white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  borderRadius="full"
                  pr="140px"
                />
                <Button
                  position="absolute"
                  right="4px"
                  top="4px"
                  colorScheme="blue"
                  borderRadius="full"
                  px={8}
                  onClick={handleSearch}
                >
                  Comparar
                </Button>
              </InputGroup> */}
            </Box>

            <HStack gap={8} pt={4}>
              <HStack>
                <FiTrendingDown color="rgb(134, 239, 172)" size={20} />
                <Text color="whiteAlpha.900" fontSize="sm">Ahorra hasta 40%</Text>
              </HStack>
              <HStack>
                <FiShoppingCart color="rgb(134, 239, 172)" size={20} />
                <Text color="whiteAlpha.900" fontSize="sm">100+ Tiendas</Text>
              </HStack>
              <HStack>
                <FiStar color="rgb(134, 239, 172)" size={20} />
                <Text color="whiteAlpha.900" fontSize="sm">Datos en tiempo real</Text>
              </HStack>
            </HStack>
          </Stack>
        </Container>
      </Box>

      {/* Stats Section */}
      <Container maxW="6xl" py={12}>
        <SimpleGrid columns={{ base: 1, md: 3 }} gap={8}>
          <Card.Root>
            <Card.Body>
              <Stat.Root>
                <Stat.Label>Ahorro Promedio</Stat.Label>
                {/* <Stat.Number color="green.500">$187</Stat.Number> */}
                <Stat.HelpText>por compra comparada</Stat.HelpText>
              </Stat.Root>
            </Card.Body>
          </Card.Root>
          <Card.Root>
            <Card.Body>
              <Stat.Root>
                <Stat.Label>Productos Comparados</Stat.Label>
                {/* <Stat.Number color="blue.500">1.2M+</Stat.Number> */}
                <Stat.HelpText>actualizados diariamente</Stat.HelpText>
              </Stat.Root>
            </Card.Body>
          </Card.Root>
          <Card.Root>
            <Card.Body>
              <Stat.Root>
                <Stat.Label>Usuarios Activos</Stat.Label>
                {/* <Stat.Number color="purple.500">500K+</Stat.Number> */}
                <Stat.HelpText>comparando precios hoy</Stat.HelpText>
              </Stat.Root>
            </Card.Body>
          </Card.Root>
        </SimpleGrid>
      </Container>

      {/* Results Section */}
      {hasSearched && (
        <Container maxW="6xl" py={12}>
          <VStack align="stretch" gap={6}>
            <Flex justify="space-between" align="center">
              <Box>
                <Heading size="lg">Resultados para "{searchTerm || 'iPhone'}"</Heading>
                <Text color="gray.600" mt={1}>{mockProducts.length} productos encontrados</Text>
              </Box>
              <HStack>
                <Button variant="outline" size="sm">Precio: Menor a Mayor</Button>
                <Button variant="outline" size="sm">Filtros</Button>
              </HStack>
            </Flex>

            <SimpleGrid columns={{ base: 1, lg: 2, xl: 3 }} gap={6}>
              {mockProducts.map((product) => (
                <Card.Root key={product.id} overflow="hidden" _hover={{ shadow: "xl", transform: "translateY(-4px)" }} transition="all 0.3s">
                  <Box h="200px" w="100%" overflow="hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                    />
                  </Box>
                  <Card.Body>
                    <VStack align="stretch" gap={4}>
                      <Box>
                        <Heading size="md" mb={2}>{product.name}</Heading>
                        <HStack>
                          <Badge colorScheme="green">Desde ${product.lowestPrice}</Badge>
                          <Badge colorScheme="blue">{product.stores.length} tiendas</Badge>
                        </HStack>
                      </Box>


                      <VStack align="stretch" gap={3}>
                        {product.stores.slice(0, 2).map((store, idx) => (
                          <Flex key={idx} justify="space-between" align="center" p={3} bg="gray.50" borderRadius="md">
                            <VStack align="start" gap={1}>
                              <Text fontWeight="bold" fontSize="sm">{store.name}</Text>
                              <HStack>
                                <FiStar color="rgb(251, 191, 36)" size={12} />
                                <Text fontSize="xs" color="gray.600">{store.rating}</Text>
                              </HStack>
                            </VStack>
                            <VStack align="end" gap={0}>
                              <Text fontSize="xl" fontWeight="bold" color="blue.600">
                                ${store.price}
                              </Text>
                              {store.discount > 0 && (
                                <Badge colorScheme="red" fontSize="xs">-{store.discount}%</Badge>
                              )}
                            </VStack>
                          </Flex>
                        ))}
                      </VStack>

                      <Button
                        colorScheme="blue"
                        size="sm"
                        w="100%"
                      >
                        Ver todas las ofertas
                        <FiExternalLink size={16} style={{ marginLeft: '8px' }} />
                      </Button>
                    </VStack>
                  </Card.Body>
                </Card.Root>
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      )}

      {/* Features Section */}
      {!hasSearched && (
        <Container maxW="6xl" py={16}>
          <VStack gap={12}>
            <VStack textAlign="center" gap={4}>
              <Heading size="xl">¿Por qué usar PriceCompare?</Heading>
              <Text color="gray.600" fontSize="lg" maxW="2xl">
                La forma más inteligente de comprar online
              </Text>
            </VStack>

            <SimpleGrid columns={{ base: 1, md: 3 }} gap={8}>
              {[
                {
                  icon: FiTrendingDown,
                  title: "Ahorra Dinero",
                  description: "Encuentra automáticamente los precios más bajos de múltiples tiendas confiables."
                },
                {
                  icon: FiStar,
                  title: "Datos Verificados",
                  description: "Información actualizada en tiempo real con calificaciones y reseñas verificadas."
                },
                {
                  icon: FiShoppingCart,
                  title: "Compra Segura",
                  description: "Solo trabajamos con tiendas certificadas y de confianza para tu seguridad."
                }
              ].map((feature, idx) => {
                const IconComponent = feature.icon;
                return (
                  <Card.Root key={idx} textAlign="center" p={6}>
                    <Card.Body>
                      <VStack gap={4}>
                        <Box p={4} bg="blue.50" borderRadius="full">
                          <IconComponent size={32} color="rgb(59, 130, 246)" />
                        </Box>
                        <Heading size="md">{feature.title}</Heading>
                        <Text color="gray.600">{feature.description}</Text>
                      </VStack>
                    </Card.Body>
                  </Card.Root>
                );
              })}
            </SimpleGrid>
          </VStack>
        </Container>
      )}

      {/* Footer */}
      <Box bg="gray.800" color="white" py={12} mt={16}>
        <Container maxW="6xl">
          <SimpleGrid columns={{ base: 1, md: 4 }} gap={8}>
            <VStack align="start">
              <Heading size="md" color="blue.300">PriceCompare</Heading>
              <Text fontSize="sm" color="gray.400">
                Tu aliado para compras inteligentes
              </Text>
            </VStack>
            <VStack align="start">
              <Text fontWeight="bold">Productos</Text>
              <Text fontSize="sm" color="gray.400">Electrónicos</Text>
              <Text fontSize="sm" color="gray.400">Hogar</Text>
              <Text fontSize="sm" color="gray.400">Moda</Text>
            </VStack>
            <VStack align="start">
              <Text fontWeight="bold">Compañía</Text>
              <Text fontSize="sm" color="gray.400">Sobre Nosotros</Text>
              <Text fontSize="sm" color="gray.400">Blog</Text>
              <Text fontSize="sm" color="gray.400">Contacto</Text>
            </VStack>
            <VStack align="start">
              <Text fontWeight="bold">Legal</Text>
              <Text fontSize="sm" color="gray.400">Privacidad</Text>
              <Text fontSize="sm" color="gray.400">Términos</Text>
              <Text fontSize="sm" color="gray.400">Cookies</Text>
            </VStack>
          </SimpleGrid>
          {/* <Divider my={8} borderColor="gray.700" /> */}
          <Text textAlign="center" fontSize="sm" color="gray.400">
            © 2024 PriceCompare. Todos los derechos reservados.
          </Text>
        </Container>
      </Box>
    </Box>
  );
}

export default App;