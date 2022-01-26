import React from "react";
import { TouchableOpacityProps } from "react-native";
import { Container, Title, Icon } from "./styles";

interface Props extends TouchableOpacityProps {
  title: string;
  type: "up" | "down";
  isActive: boolean;
}

const icons = {
  up: "arrow-up-circle",
  down: "arrow-down-circle",
};

export function TransactionTypeButton({
  title,
  isActive,
  type,
  ...rest
}: Props) {
  return (
    <Container isActive={isActive} type={type} {...rest}>
      <Icon name={icons[type]} type={type} />
      <Title>{title}</Title>
    </Container>
  );
}
