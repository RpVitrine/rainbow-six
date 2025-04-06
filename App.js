import React, { useState, useEffect } from 'react';
import { Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ListOperators from './Page/ListOperators';
import OperatorData from './Page/OperatorData';
import Login from './Page/Login';
import Registar from './Page/Registar';
import { LinearGradient } from 'expo-linear-gradient';

const Stack = createNativeStackNavigator();

export default function App() {
  const [email, setEmail] = useState(localStorage.getItem('email'));

  const handleLogoff = (navigation) => {
    localStorage.removeItem('email');
    setEmail(null); // atualiza o estado global
    navigation.reset({
      index: 0,
      routes: [{ name: "Lista de operadores" }],
    });
  };

  useEffect(() => {
    const storedEmail = localStorage.getItem('email');
    setEmail(storedEmail);
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={({ navigation }) => ({
          headerStyle: {
            backgroundColor: '#1F1F1F',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: '600',
            fontSize: 20,
          },
          headerTitleAlign: 'center',
          headerShadowVisible: false,
          headerBackground: () => (
            <LinearGradient
              colors={['#1F1F1F', '#3F3F3F']}
              style={{ flex: 1 }}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            />
          ),
          // headerRight: () =>
          //   email ? (
          //     <Button
          //       title="Logoff"
          //       onPress={() => handleLogoff(navigation)}
          //       color="black"
          //     />
          //   ) : null,
        })}
      >
        <Stack.Screen
          name="Lista de operadores"
          options={{ headerShown: false }}
        >
          {props => <ListOperators {...props} email={email} />}
        </Stack.Screen>

        <Stack.Screen
          name="OperatorData"
          component={OperatorData}
          options={({ route }) => ({ title: route.params.operator.name })}
        />
        <Stack.Screen
          name="LoginPage"
          options={{ title: "Login" }}
        >
          {props => <Login {...props} setEmail={setEmail} />}
        </Stack.Screen>
        <Stack.Screen
          name="RegisterPage"
          component={Registar}
          options={{ title: "Registar" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
