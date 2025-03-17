import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ListOperators from './Page/ListOperators';
import OperatorData from './Page/OperatorData';
import Login from './Page/Login';
import Registar from './Page/Registar';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#1F1F1F',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 18,
            userSelect: 'none',
          },
          headerTitleAlign: 'center',
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen name="ListOperators" component={ListOperators} options={{ title: "Operadores" }} />
        <Stack.Screen name="OperatorData" component={OperatorData} options={({ route }) => ({ title: route.params.operator.name })} />
        <Stack.Screen name="LoginPage" component={Login} options={{ title: "Login" }} />
        <Stack.Screen name="RegisterPage" component={Registar} options={{ title: "Registar" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
