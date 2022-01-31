import React, { useEffect, useState } from "react";
import uuid from "react-native-uuid";
import { Keyboard, Modal, TouchableWithoutFeedback, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useForm } from "react-hook-form";
import { Button } from "../../components/Form/Button";
import { CategorySelectButton } from "../../components/Form/CategorySelectButton";
import { TransactionTypeButton } from "../../components/Form/TransactionTypeButton";
import {
  Container,
  Header,
  Title,
  Form,
  Fields,
  TransactionTypes,
} from "./styles";

import { CategorySelect } from "../CategorySelect";
import { InputForm } from "../../components/Form/InputForm";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../../hooks/auth";

interface FormData {
  [name: string]: any;
}

type NavigationProps = {
  navigate: (screen: string, params?: never) => void;
};

const schema = Yup.object({
  name: Yup.string().required("Nome é obrigatório"),
  amount: Yup.number()
    .typeError("Informe um valor númerico")
    .positive("Valor deve ser positivo.")
    .required("Valor obrigatório"),
});

export function Register() {
  const [transactionType, setTransactionType] = useState("");
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);

  const { user } = useAuth();

  const dataKey = `@gofinances:transactions_user:${user?.id}`;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [category, setCategory] = useState({
    key: "category",
    name: "Categoria",
  });

  const navigation = useNavigation<NavigationProps>();

  function handleSelectTypeTransaction(type: "positive" | "negative") {
    setTransactionType(type);
  }

  function handleOpenModal() {
    setCategoryModalOpen(true);
  }
  function handleCloseModal() {
    setCategoryModalOpen(false);
  }

  async function onSubmit(form: FormData) {
    if (!transactionType) {
      return Alert.alert("Selecione o tipo da transação");
    }

    if (category.key === "category") {
      return Alert.alert("Selecione a categoria");
    }

    const transaction = {
      id: String(uuid.v4()),
      name: form.name,
      amount: form.amount,
      type: transactionType,
      category: category.key,
      date: new Date(),
    };

    try {
      const data = await AsyncStorage.getItem(dataKey).then((data) =>
        data ? JSON.parse(data) : []
      );
      const dataFormatted = [...data, transaction];

      await AsyncStorage.setItem(dataKey, JSON.stringify(dataFormatted));

      reset();
      setTransactionType("");
      setCategory({
        key: "category",
        name: "Categoria",
      });

      navigation.navigate("Listagem");
    } catch (err) {
      console.log(err);
      Alert.alert("Não foi possível salvar");
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Container>
        <Header>
          <Title>Cadastro</Title>
        </Header>

        <Form>
          <Fields>
            <InputForm
              control={control}
              name="name"
              placeholder="Nome"
              autoCapitalize="sentences"
              autoCorrect={false}
              error={errors.name && errors.name.message}
            />
            <InputForm
              control={control}
              name="amount"
              placeholder="Preço"
              keyboardType="numeric"
              error={errors.amount && errors.amount.message}
            />
            <TransactionTypes>
              <TransactionTypeButton
                type="up"
                title="Entrada"
                onPress={() => handleSelectTypeTransaction("positive")}
                isActive={transactionType === "positive"}
              />
              <TransactionTypeButton
                type="down"
                title="Saída"
                onPress={() => handleSelectTypeTransaction("negative")}
                isActive={transactionType === "negative"}
              />
            </TransactionTypes>

            <CategorySelectButton
              title={category.name}
              onPress={handleOpenModal}
            />
          </Fields>

          <Modal statusBarTranslucent visible={categoryModalOpen}>
            <CategorySelect
              category={category}
              setCategory={setCategory}
              closeSelectCategory={handleCloseModal}
            />
          </Modal>

          <Button title="Enviar" onPress={handleSubmit(onSubmit)} />
        </Form>
      </Container>
    </TouchableWithoutFeedback>
  );
}
