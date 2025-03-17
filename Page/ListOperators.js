import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity } from 'react-native';
import { getOperators } from '../Actions/OperatorsActions';

const ListOperators = ({ navigation }) => {
  const [operators, setOperators] = useState([]);

  useEffect(() => {
    // navigation.setOptions({ title: "Lista de operadores" });
    const fetchOperators = async () => {
      try {
        const data = await getOperators();
        setOperators(data);
      } catch (error) {
        console.error('Erro ao carregar operadores:', error);
      }
    };

    fetchOperators();
  }, []);

  const handleOperatorPress = (operator) => {
    navigation.navigate('OperatorData', { operator });
  };

  const handleLogin = () => {
    navigation.navigate('LoginPage');
  };

  return (
    <ScrollView style={styles.scrollContainer} contentContainerStyle={{ flexGrow: 1 }}>
      {/* Botão de Login */}
      <View style={styles.loginContainer}>
        <TouchableOpacity onPress={handleLogin} style={styles.loginButton}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.container}>
        {operators.map((operator, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleOperatorPress(operator)}
            style={styles.operatorCardWrapper}
          >
            <View style={styles.operatorCard}>
              <View style={styles.imageContainer}>
                {operator.images_background && (
                  <Image
                    source={{ uri: operator.images_background }}
                    style={styles.operatorBackground}
                  />
                )}
                {operator.images_logo && (
                  <Image
                    source={{ uri: operator.images_logo }}
                    style={styles.operatorIcon}
                  />
                )}
              </View>
              <View style={styles.operatorNameContainer}>
                <Text style={styles.operatorName}>
                  {operator.name ? operator.name.toUpperCase() : ''}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    backgroundColor: '#1a1a1a',
  },
  loginContainer: {
    alignItems: 'center',
    marginVertical: 15,
  },
  loginButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 5,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    padding: 15,
  },
  operatorCardWrapper: {
    elevation: 5,
  },
  operatorCard: {
    width: 150,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#444',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#555',
  },
  imageContainer: {
    height: 200,
    position: 'relative',
  },
  operatorBackground: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  operatorIcon: {
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
  operatorNameContainer: {
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingVertical: 8,
    alignItems: 'center',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  operatorName: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    textTransform: 'uppercase',
  },
});

export default ListOperators;
