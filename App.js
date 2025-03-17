import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ListOperators from './Page/ListOperators';
import OperatorData from './Page/OperatorData';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="ListOperators" component={ListOperators} />
        <Stack.Screen name="OperatorData" component={OperatorData} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
