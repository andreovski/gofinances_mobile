import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import { useTheme } from "styled-components";
import { HighlightCard } from "../../components/HighlightCard";
import {
  TransactionCard,
  TransactionCardProps,
} from "../../components/TransactionCard";

import {
  Container,
  Header,
  UserWrapper,
  UserInfo,
  Photo,
  User,
  UserGreeting,
  UserName,
  LogoutButton,
  Icon,
  HighlightCards,
  Transactions,
  Title,
  TransactionsList,
  LoadContainer,
} from "./styles";

export interface DataListProps extends TransactionCardProps {
  id: string;
}

interface HighlightProps {
  amount: string;
  lastTransaction: string;
}

interface HighlightData {
  entries: HighlightProps;
  expansive: HighlightProps;
  total: HighlightProps;
}

export function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<DataListProps[]>();
  const [highlightData, setHighlightData] = useState<HighlightData>(
    {} as HighlightData
  );

  const theme = useTheme();

  function getLastTransactionDate(
    collection: DataListProps[],
    type: "positive" | "negative"
  ) {
    if (collection.length < 1) {
      return "";
    }

    const lastTransaction = new Date(
      Math.max.apply(
        Math,
        collection
          .filter((transaction) => transaction.type === type)
          .map((transaction) => new Date(transaction.date).getTime())
      )
    );

    return `${lastTransaction.getDate()} de ${lastTransaction.toLocaleString(
      "pt-BR",
      { month: "long" }
    )}`;
  }

  async function loadTransactions() {
    const dataKey = "@gofinances:transactions";
    const response = await AsyncStorage.getItem(dataKey);
    const transactions = response ? JSON.parse(response) : [];

    let entriesTotal = 0;
    let expensiveTotal = 0;

    const transactionsFormatted: DataListProps[] = transactions.map(
      (item: DataListProps) => {
        if (item.type === "positive") {
          entriesTotal += Number(item.amount);
        } else {
          expensiveTotal += Number(item.amount);
        }

        const amount = Number(item.amount).toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        });

        const date = Intl.DateTimeFormat("pt-BR", {
          day: "2-digit",
          month: "2-digit",
          year: "2-digit",
        }).format(new Date(item.date));

        return {
          ...item,
          amount,
          date,
        };
      }
    );

    const total = entriesTotal - expensiveTotal;

    const lastTransactionEntries = getLastTransactionDate(
      transactions,
      "positive"
    );
    const lastTransactionExpensive = getLastTransactionDate(
      transactions,
      "negative"
    );

    setData(transactionsFormatted);
    setHighlightData({
      entries: {
        amount: entriesTotal.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        }),
        lastTransaction: `Última entrada dia ${lastTransactionEntries}`,
      },
      expansive: {
        amount: expensiveTotal.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        }),
        lastTransaction: `Última saída dia ${lastTransactionExpensive}`,
      },
      total: {
        amount: total.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        }),
        lastTransaction: "",
      },
    });

    setIsLoading(false);
  }

  useEffect(() => {
    loadTransactions();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadTransactions();
    }, [])
  );

  return (
    <Container>
      {isLoading ? (
        <LoadContainer>
          <ActivityIndicator color={theme.colors.secondary} size="large" />
        </LoadContainer>
      ) : (
        <>
          <Header>
            <UserWrapper>
              <UserInfo>
                <Photo
                  source={{
                    uri: "https://avatars.githubusercontent.com/u/62680019?v=4",
                  }}
                />

                <User>
                  <UserGreeting>Olá</UserGreeting>
                  <UserName>André Luiz</UserName>
                </User>
              </UserInfo>

              <LogoutButton onPress={() => {}}>
                <Icon name="power" />
              </LogoutButton>
            </UserWrapper>
          </Header>

          <HighlightCards>
            <HighlightCard
              title="Entradas"
              amount={highlightData?.entries?.amount}
              lastTransaction={highlightData.entries.lastTransaction}
              type="up"
            />
            <HighlightCard
              title="Saídas"
              amount={highlightData?.expansive?.amount}
              lastTransaction={highlightData.expansive.lastTransaction}
              type="down"
            />
            <HighlightCard
              title="Total"
              amount={highlightData?.total?.amount}
              lastTransaction={highlightData.total.lastTransaction}
              type="total"
            />
          </HighlightCards>

          <Transactions>
            <Title>Listagem</Title>

            <TransactionsList
              data={data}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <TransactionCard data={item} />}
            />
          </Transactions>
        </>
      )}
    </Container>
  );
}
