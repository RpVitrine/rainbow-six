import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { getOperators } from '../Actions/OperatorsActions';

const ListOperators = ({ navigation }) => {
  const [operators, setOperators] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const email = localStorage.getItem('email');

  const ordenarOperadoresPorFavorito = (listaOperadores, listaFavoritos) => {
    return [...listaOperadores].sort((a, b) => {
      const aFavorito = listaFavoritos.includes(a.name);
      const bFavorito = listaFavoritos.includes(b.name);
      return aFavorito === bFavorito ? 0 : aFavorito ? -1 : 1;
    });
  };

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!email) {
        setFavorites([]);
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/favorites/${email}`);
        const data = await response.json();
        setFavorites(data);
      } catch (error) {
        console.error('Erro ao buscar favoritos:', error);
      }
    };

    fetchFavorites();
  }, [email]);

  useEffect(() => {
    const fetchOperators = async () => {
      try {
        const data = await getOperators();
        const ordenados = ordenarOperadoresPorFavorito(data, favorites);
        setOperators(ordenados);
      } catch (error) {
        console.error('Erro ao carregar operadores:', error);
      }
    };

    fetchOperators();
  }, [favorites]);

  const handleOperatorPress = (operator) => {
    navigation.navigate('OperatorData', { operator });
  };

  const handleLogin = () => {
    navigation.navigate('LoginPage');
  };

  const handleLogoff = () => {
    localStorage.removeItem('email');
    setFavorites([]);
    setOperators([]);
    navigation.navigate('LoginPage');
  };

  const toggleFavorite = async (operatorName) => {
    if (!email) return;

    try {
      await fetch('http://localhost:5000/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, operator_name: operatorName }),
      });

      setFavorites((prev) => {
        const atualizados = prev.includes(operatorName)
          ? prev.filter((name) => name !== operatorName)
          : [...prev, operatorName];

        const novaOrdem = ordenarOperadoresPorFavorito(operators, atualizados);
        setOperators(novaOrdem);

        return atualizados;
      });
    } catch (error) {
      console.error('Erro ao alterar favorito:', error);
    }
  };

  const filteredOperators = operators.filter((op) =>
    op.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ScrollView style={styles.scrollContainer} contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.authContainer}>
        {!email ? (
          <TouchableOpacity onPress={handleLogin} style={styles.loginButton}>
            <Text style={styles.authButtonText}>Login</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={handleLogoff} style={styles.logoffButton}>
            <Text style={styles.authButtonText}>Logoff</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Pesquisar operador..."
          placeholderTextColor="#aaa"
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
      </View>

      <View style={styles.container}>
        {filteredOperators.map((operator, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleOperatorPress(operator)}
            style={styles.operatorCardWrapper}
          >
            <View style={styles.operatorCard}>
              {email && (
                <TouchableOpacity
                  style={styles.starButton}
                  onPress={() => toggleFavorite(operator.name)}
                >
                  <Text style={styles.starIcon}>
                    {favorites.includes(operator.name) ? '★' : '☆'}
                  </Text>
                </TouchableOpacity>
              )}
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
  authContainer: {
    alignItems: 'center',
    marginVertical: 15,
  },
  loginButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 5,
  },
  logoffButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 5,
  },
  authButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  searchInput: {
    backgroundColor: '#333',
    color: '#fff',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    padding: 15,
  },
  operatorCardWrapper: {
    elevation: 5,
    marginBottom: 15,
  },
  operatorCard: {
    width: 150,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#444',
    borderWidth: 1,
    borderColor: '#555',
    position: 'relative',
  },
  starButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    zIndex: 2,
    padding: 5,
  },
  starIcon: {
    fontSize: 24,
    color: 'gold',
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
