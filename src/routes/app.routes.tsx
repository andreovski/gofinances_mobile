import React from "react";
import { useTheme } from "styled-components";
import { MaterialIcons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Dashboard } from "../pages/Dashboard";
import { Register } from "../pages/Register";
import { Platform } from "react-native";
import { Resume } from "../pages/Resume";

const { Navigator, Screen } = createBottomTabNavigator();

export function AppRoutes() {
  const theme = useTheme();

  return (
    <Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.secondary,
        tabBarInactiveTintColor: theme.colors.text,
        tabBarLabelPosition: "beside-icon",
        tabBarStyle: {
          height: 60,
          paddingVertical: Platform.OS === "ios" ? 20 : 0,
        },
      }}
    >
      <Screen
        name="Listagem"
        component={Dashboard}
        options={{
          tabBarIcon: ({ size, color }) => (
            <MaterialIcons
              size={size}
              name="format-list-bulleted"
              color={color}
            />
          ),
        }}
      />
      <Screen
        name="Cadastrar"
        component={Register}
        options={{
          tabBarIcon: ({ size, color }) => (
            <MaterialIcons size={size} name="attach-money" color={color} />
          ),
        }}
      />
      <Screen
        name="Resumo"
        component={Resume}
        options={{
          tabBarIcon: ({ size, color }) => (
            <MaterialIcons size={size} name="pie-chart" color={color} />
          ),
        }}
      />
    </Navigator>
  );
}
