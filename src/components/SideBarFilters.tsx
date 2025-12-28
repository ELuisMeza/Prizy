import {
  Box,
  Button,
  Drawer,
  Flex,
  Heading,
  HStack,
  Separator,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useDynamicColors } from "@/utils/dinamicColors";
import { useEffect, useState } from "react";
import type { Category } from "@/types/product.types";
import { categoriesService } from "@/services/categories.service";
import { FiChevronLeft, FiChevronRight, FiX } from "react-icons/fi";
import { useTranslation } from "react-i18next";

interface Props {
  isFilterDrawerOpen: boolean;
  setIsFilterDrawerOpen: (open: boolean) => void;
  setSelectedCategory: (category: {
    category: string | null;
    subcategory: string | null;
  }) => void;
  selectedCategory?: {
    category: string | null;
    subcategory: string | null;
  };
}

export const SideBarFilters: React.FC<Props> = ({
  isFilterDrawerOpen,
  setIsFilterDrawerOpen,
  setSelectedCategory,
  selectedCategory,
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const { t, i18n } = useTranslation();
  const DYNAMIC_COLORS = useDynamicColors();
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);

  useEffect(() => {
    const loadCategories = async () => {
      setIsLoadingCategories(true);
      try {
        const response = await categoriesService.getCategories();
        setCategories(response || []);
      } catch (error) {
        setCategories([]);
      } finally {
        setIsLoadingCategories(false);
      }
    };

    loadCategories();
  }, []);

  return (
    <Drawer.Root
      open={isFilterDrawerOpen}
      onOpenChange={(e) => {
        setIsFilterDrawerOpen(e.open);
        setCurrentCategory(null);
      }}
      placement="start"
      size="md"
    >
      <Drawer.Backdrop />
      <Drawer.Positioner>
        <Drawer.Content bg={DYNAMIC_COLORS.drawerBg}>
          <Drawer.Header
            borderBottomWidth="1px"
            borderColor={DYNAMIC_COLORS.drawerBorder}
            py={4}
          >
            <Flex justify="space-between" align="center" w={"100%"}>
              <Heading
                size="lg"
                color={DYNAMIC_COLORS.headingColor}
                fontWeight="bold"
              >
                {currentCategory
                  ? currentCategory?.name[i18n.language as "es" | "en"] ||
                    currentCategory?.name.es
                  : t("results.filters")}
              </Heading>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsFilterDrawerOpen(false);
                  setCurrentCategory(null);
                }}
                aria-label={
                  currentCategory
                    ? t("results.backToAllCategories")
                    : t("results.closeMenu")
                }
                borderRadius="md"
                _hover={{ bg: DYNAMIC_COLORS.menuItemHoverBg }}
              >
                <FiX size={20} />
              </Button>
            </Flex>
          </Drawer.Header>
          <Drawer.Body p={0} overflowY="auto">
            <VStack align="stretch" gap={0}>
              {!currentCategory ? (
                <>
                  <Box p={4} pb={2}>
                    <Text
                      fontSize="sm"
                      color={DYNAMIC_COLORS.textMuted}
                      mb={3}
                      fontWeight="medium"
                    >
                      {t("results.allCategories")}
                    </Text>
                  </Box>
                  {isLoadingCategories ? (
                    <Box p={4} textAlign="center">
                      <Text color={DYNAMIC_COLORS.textMuted}>
                        {t("results.loading")}
                      </Text>
                    </Box>
                  ) : categories.length === 0 ? (
                    <Box p={4} textAlign="center">
                      <Text color={DYNAMIC_COLORS.textMuted}>
                        No hay categorías disponibles
                      </Text>
                    </Box>
                  ) : (
                    <>
                      {categories.map((category, index) => (
                        <Box key={category.id}>
                          <Box px={4} py={2}>
                            <Button
                              variant="ghost"
                              size="md"
                              w="100%"
                              justifyContent="space-between"
                              onClick={() => {
                                setCurrentCategory(category);
                              }}
                              _hover={{ bg: DYNAMIC_COLORS.menuItemHoverBg }}
                              py={3}
                            >
                              <Text
                                fontWeight="medium"
                                color={DYNAMIC_COLORS.headingColor}
                                fontSize="md"
                              >
                                {category.name[i18n.language as "es" | "en"] ||
                                  category.name.es}
                              </Text>
                              {category.subcategories.length > 0 && (
                                <FiChevronRight size={18} />
                              )}
                            </Button>
                          </Box>
                          {index < categories.length - 1 && <Separator />}
                        </Box>
                      ))}
                    </>
                  )}
                </>
              ) : (
                // Vista de subcategorías
                currentCategory && (
                  <>
                    <Box
                      px={4}
                      py={3}
                      borderBottomWidth="1px"
                      borderColor={DYNAMIC_COLORS.drawerBorder}
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        _hover={{ bg: DYNAMIC_COLORS.menuItemHoverBg }}
                        px={0}
                        onClick={() => setCurrentCategory(null)}
                      >
                        <HStack gap={2}>
                          <FiChevronLeft size={18} />
                          <Text
                            color={DYNAMIC_COLORS.headingColor}
                            fontWeight="medium"
                          >
                            {t("results.allCategories")}
                          </Text>
                        </HStack>
                      </Button>
                      <Button
                        variant={
                          selectedCategory?.category ===
                            (currentCategory.name[
                              i18n.language as "es" | "en"
                            ] ||
                              currentCategory.name.es) &&
                          selectedCategory?.subcategory === null
                            ? "solid"
                            : "outline"
                        }
                        size="sm"
                        onClick={() =>
                          setSelectedCategory({
                            category:
                              currentCategory.name[
                                i18n.language as "es" | "en"
                              ] || currentCategory.name.es,
                            subcategory: null,
                          })
                        }
                        px={2}
                        bg={
                          selectedCategory?.category ===
                            (currentCategory.name[
                              i18n.language as "es" | "en"
                            ] ||
                              currentCategory.name.es) &&
                          selectedCategory?.subcategory === null
                            ? "blue.500"
                            : undefined
                        }
                        color={
                          selectedCategory?.category ===
                            (currentCategory.name[
                              i18n.language as "es" | "en"
                            ] ||
                              currentCategory.name.es) &&
                          selectedCategory?.subcategory === null
                            ? "white"
                            : undefined
                        }
                        borderColor={
                          selectedCategory?.category ===
                            (currentCategory.name[
                              i18n.language as "es" | "en"
                            ] ||
                              currentCategory.name.es) &&
                          selectedCategory?.subcategory === null
                            ? "blue.500"
                            : undefined
                        }
                        _hover={{
                          bg:
                            selectedCategory?.category ===
                              (currentCategory.name[
                                i18n.language as "es" | "en"
                              ] ||
                                currentCategory.name.es) &&
                            selectedCategory?.subcategory === null
                              ? "blue.600"
                              : undefined,
                        }}
                      >
                        <HStack gap={2}>
                          <Text
                            color={
                              selectedCategory?.category ===
                                (currentCategory.name[
                                  i18n.language as "es" | "en"
                                ] ||
                                  currentCategory.name.es) &&
                              selectedCategory?.subcategory === null
                                ? "white"
                                : DYNAMIC_COLORS.headingColor
                            }
                            fontWeight="medium"
                          >
                            {t("results.selectedAllSubcategories")}
                          </Text>
                        </HStack>
                      </Button>
                    </Box>
                    <Box p={4}>
                      {currentCategory.subcategories.length > 0 ? (
                        <VStack align="stretch" gap={0}>
                          {currentCategory.subcategories.map(
                            (subcat: any, index: number) => {
                              const subcatName =
                                subcat.name[i18n.language as "es" | "en"] ||
                                subcat.name.es;
                              const isSelected =
                                selectedCategory?.category ===
                                  (currentCategory.name[
                                    i18n.language as "es" | "en"
                                  ] ||
                                    currentCategory.name.es) &&
                                selectedCategory?.subcategory === subcatName;
                              return (
                                <Box key={subcat.id}>
                                  <Button
                                    variant={isSelected ? "solid" : "ghost"}
                                    size="md"
                                    w="100%"
                                    justifyContent="space-between"
                                    onClick={() => {
                                      setSelectedCategory({
                                        category:
                                          currentCategory.name[
                                            i18n.language as "es" | "en"
                                          ] || currentCategory.name.es,
                                        subcategory: subcatName,
                                      });
                                    }}
                                    bg={isSelected ? "blue.500" : undefined}
                                    color={isSelected ? "white" : undefined}
                                    _hover={{
                                      bg: isSelected
                                        ? "blue.600"
                                        : DYNAMIC_COLORS.menuItemHoverBg,
                                    }}
                                    py={3}
                                  >
                                    <Text
                                      color={
                                        isSelected
                                          ? "white"
                                          : DYNAMIC_COLORS.headingColor
                                      }
                                      fontWeight="medium"
                                      fontSize="md"
                                    >
                                      {subcatName}
                                    </Text>
                                    {!isSelected && (
                                      <FiChevronRight size={18} />
                                    )}
                                  </Button>
                                  {index <
                                    currentCategory.subcategories.length - 1 && (
                                    <Separator />
                                  )}
                                </Box>
                              );
                            }
                          )}
                        </VStack>
                      ) : (
                        <Box py={8} textAlign="center">
                          <Text color={DYNAMIC_COLORS.textMuted}>
                            {t("results.noProductsAvailable")}
                          </Text>
                        </Box>
                      )}
                    </Box>
                  </>
                )
              )}
            </VStack>
          </Drawer.Body>
        </Drawer.Content>
      </Drawer.Positioner>
    </Drawer.Root>
  );
};
