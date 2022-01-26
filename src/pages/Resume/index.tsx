import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { HistoryCard } from "../../components/HIstoryCard";
import { categories } from "../../utils/categories";
import { VictoryPie } from "victory-native";

import { Container, Header, Title, Content, ChartContainer } from "./style";
import { RFValue } from "react-native-responsive-fontsize";
import { useTheme } from "styled-components";

export interface TransactionProps {
  type: "positive" | "negative";
  name: string;
  amount: string;
  category: string;
  date: string;
}

interface CategoryProps {
  name: string;
  total: number;
  totalFormatted: string;
  color: string;
  percent: string;
}

export function Resume() {
  const [totalByCategories, setTotalByCategories] = useState<CategoryProps[]>(
    []
  );

  const theme = useTheme();

  async function loadData() {
    const dataKey = "@gofinances:transactions";
    const response = await AsyncStorage.getItem(dataKey);
    const transactions = response ? JSON.parse(response) : [];

    const expensives = transactions.filter(
      (item: TransactionProps) => item.type === "negative"
    );

    const expensivesTotal = expensives.reduce(
      (acc: number, curr: TransactionProps) => {
        return acc + Number(curr.amount);
      },
      0
    );

    const totalByCategory: CategoryProps[] = [];

    categories.forEach((category) => {
      let categorySum = 0;

      expensives.forEach((expensive: TransactionProps) => {
        if (expensive.category === category.key) {
          categorySum += Number(expensive.amount);
        }
      });

      if (categorySum) {
        const totalFormatted = categorySum.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        });

        const percent = `${((categorySum / expensivesTotal) * 100).toFixed(
          0
        )}%`;

        totalByCategory.push({
          name: category.name,
          color: category.color,
          totalFormatted,
          total: categorySum,
          percent,
        });
      }
    });

    setTotalByCategories(totalByCategory);
  }

  useEffect(() => {
    loadData();
  }, []);

  return (
    <Container>
      <Header>
        <Title>Resumo por categoria</Title>
      </Header>

      <Content>
        <ChartContainer>
          <VictoryPie
            data={totalByCategories}
            colorScale={totalByCategories.map((item) => item.color)}
            style={{
              labels: {
                fontSize: RFValue(18),
                fontWeight: "bold",
                fill: theme.colors.shape,
              },
            }}
            labelRadius={60}
            x="percent"
            y="total"
          />
        </ChartContainer>

        {totalByCategories.map((item, i) => {
          return (
            <HistoryCard
              key={i}
              title={item.name}
              amount={item.totalFormatted}
              color={item.color}
            />
          );
        })}
      </Content>
    </Container>
  );
}
