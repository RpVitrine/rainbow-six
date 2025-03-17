import axios from 'axios';

const API_URL = 'http://localhost:5000';

export const getOperators = async () => {
  try {
    const response = await axios.get(`${API_URL}/operators`);
    return response.data;
  } catch (error) {
    console.error('Erro ao obter operadores:', error);
    throw error;
  }
};

export const getOperatorData = async (name) => {
  try {
    const response = await fetch(`${API_URL}/operators/${name}`);
    const data = await response.json();
    return {
      ...data,
      gadget: JSON.parse(data.gadget),
      primary_weapon: JSON.parse(data.primary_weapon),
      secundary_weapon: JSON.parse(data.secundary_weapon),
      unique_ability: JSON.parse(data.unique_ability),
    };
  } catch (error) {
    console.error('Erro ao buscar dados do operador:', error);
    return "";
  }
};
