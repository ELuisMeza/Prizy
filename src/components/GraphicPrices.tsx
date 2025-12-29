import { Box, Heading, VStack, HStack, Button } from "@chakra-ui/react";
import { Card } from "@chakra-ui/react";
import { Line } from "react-chartjs-2";
import { useDynamicColors } from "@/utils/dinamicColors";
import { useTranslation } from "react-i18next";

export type TimeRange = "all" | "2" | "3" | "6";

interface Props {
  timeRange: TimeRange;
  setTimeRange: (range: TimeRange) => void;
  getFilteredData: () => { month: string; price: number }[];
}

export const GraphicPrices = ({ timeRange, setTimeRange, getFilteredData }: Props) => {
  const DYNAMIC_COLORS = useDynamicColors();
  const { t, i18n } = useTranslation();

  const filteredHistory = getFilteredData();

  const chartData = {
    labels: filteredHistory.map((entry) => {
      const [year, month] = entry.month.split("-");
      return new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString(
        i18n.language,
        { month: "short", year: "numeric" }
      );
    }),
    datasets: [
      {
        label: t("productDetail.priceHistory"),
        data: filteredHistory.map((entry) => entry.price),
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => `$${context.parsed.y}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        ticks: {
          callback: (value: any) => `$${value}`,
        },
      },
    },
  };

  return (
    <Card.Root bg={DYNAMIC_COLORS.cardBg} p={6}>
      <Card.Body>
        <VStack align="stretch" gap={4}>
          <HStack justify="space-between" align="center" flexWrap="wrap" gap={4}>
            <Heading size="lg" color={DYNAMIC_COLORS.headingColor}>
              {t("productDetail.priceHistory")}
            </Heading>
            <HStack gap={2} flexWrap="wrap">
              <Button
                size="sm"
                variant={timeRange === "all" ? "solid" : "outline"}
                colorScheme="blue"
                onClick={() => setTimeRange("all")}
              >
                {t("productDetail.allTime")}
              </Button>
              <Button
                size="sm"
                variant={timeRange === "6" ? "solid" : "outline"}
                colorScheme="blue"
                onClick={() => setTimeRange("6")}
              >
                {t("productDetail.lastMonths", { count: 6 })}
              </Button>
              <Button
                size="sm"
                variant={timeRange === "3" ? "solid" : "outline"}
                colorScheme="blue"
                onClick={() => setTimeRange("3")}
              >
                {t("productDetail.lastMonths", { count: 3 })}
              </Button>
              <Button
                size="sm"
                variant={timeRange === "2" ? "solid" : "outline"}
                colorScheme="blue"
                onClick={() => setTimeRange("2")}
              >
                {t("productDetail.lastMonths", { count: 2 })}
              </Button>
            </HStack>
          </HStack>
          <Box w="100%" h="400px" position="relative">
            <Line data={chartData} options={chartOptions} />
          </Box>
        </VStack>
      </Card.Body>
    </Card.Root>
  );
};