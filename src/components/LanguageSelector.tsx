import { Button, Popover, Portal } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { FiGlobe } from "react-icons/fi";
import { HStack, VStack, Text } from "@chakra-ui/react";

const languages = [
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "en", name: "English", flag: "🇺🇸" },
];

export function LanguageSelector() {
  const { i18n } = useTranslation();

  const currentLanguage = languages.find((lang) => lang.code === i18n.language) || languages[0];

  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode);
  };

  return (
    <Popover.Root positioning={{ strategy: "absolute" }}>
      <Popover.Trigger asChild>
        <Button variant="ghost" size="sm" aria-label="Change language">
          <FiGlobe style={{ marginRight: "6px" }} />
          {currentLanguage.flag}
        </Button>
      </Popover.Trigger>
      <Portal>
        <Popover.Positioner>
          <Popover.Content zIndex={1000}>
            <VStack align="stretch" gap={1} p={2}>
              {languages.map((lang) => (
                <Button
                  key={lang.code}
                  variant={i18n.language === lang.code ? "solid" : "ghost"}
                  size="sm"
                  onClick={() => handleLanguageChange(lang.code)}
                  justifyContent="flex-start"
                >
                  <HStack gap={2}>
                    <Text>{lang.flag}</Text>
                    <Text>{lang.name}</Text>
                  </HStack>
                </Button>
              ))}
            </VStack>
          </Popover.Content>
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
  );
}
