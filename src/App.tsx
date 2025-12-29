import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { Home } from "./pages/Home";
import { Box, Text, Spinner, VStack } from "@chakra-ui/react";

// Lazy load ProductDetail para code-splitting (Chart.js solo se carga cuando se necesita)
const ProductDetail = lazy(() => 
  import("./pages/ProductDetail").then(module => ({ default: module.ProductDetail }))
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route 
          path="/product/:id" 
          element={
            <Suspense 
              fallback={
                <Box minH="100vh" bg="gray.50" _dark={{ bg: "gray.900" }} display="flex" alignItems="center" justifyContent="center">
                  <VStack gap={4}>
                    <Spinner size="xl" color="blue.500" />
                    <Text color="gray.600" _dark={{ color: "gray.400" }}>Cargando producto...</Text>
                  </VStack>
                </Box>
              }
            >
              <ProductDetail />
            </Suspense>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
