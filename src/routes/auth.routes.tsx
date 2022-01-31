import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { SignIn } from "../pages/auth/SignIn";

const { Navigator, Screen } = createStackNavigator();

export function AuthRoutes() {
  return (
    <Navigator screenOptions={{ headerShown: false }}>
      <Screen name="signIn" component={SignIn} />
    </Navigator>
  );
}
