import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, ActivityIndicator, TouchableOpacity, ImageBackground } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { getOperatorData } from '../Actions/OperatorsActions';

const OperatorData = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { operator } = route.params;
    const [operatorData, setOperatorData] = useState(null);
    const [loading, setLoading] = useState(true);

    const [flippedCards, setFlippedCards] = useState({});
    const [weaponDetails, setWeaponDetails] = useState({});

    useEffect(() => {
        navigation.setOptions({ title: operator.name });
        async function fetchData() {
            const data = await getOperatorData(operator.name);
            setOperatorData(data);
            setLoading(false);
        }
        fetchData();
    }, [operator.name]);

    const fetchWeaponData = async (weaponName) => {
        if (weaponDetails[weaponName] !== undefined) return;
        try {
            const proxyUrl = 'https://thingproxy.freeboard.io/fetch/';
            const targetUrl = 'https://r6dle.net/assets/json/weapon/weapons.json';
            const response = await fetch(proxyUrl + targetUrl);
            const allWeapons = await response.json();
            const weaponInfo = allWeapons.find(item => item.name.toUpperCase() === weaponName);
            if (weaponInfo) {
                setWeaponDetails(prev => ({ ...prev, [weaponName]: weaponInfo }));
            } else {
                setWeaponDetails(prev => ({ ...prev, [weaponName]: false }));
            }
        } catch (error) {
            console.error("Erro ao buscar os dados da arma", error);
            setWeaponDetails(prev => ({ ...prev, [weaponName]: false }));
        }
    };

    const toggleFlip = (weaponName) => {
        setFlippedCards(prev => {
            const newValue = !prev[weaponName];
            if (newValue && weaponDetails[weaponName] === undefined) {
                fetchWeaponData(weaponName);
            }
            return { ...prev, [weaponName]: newValue };
        });
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#fff" />
            </View>
        );
    }

    if (!operatorData) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={{ color: '#fff' }}>Operador não encontrado</Text>
            </View>
        );
    }

    const renderWeaponCard = (weapon, clickable) => (
        <TouchableOpacity
            key={weapon.nome}
            style={styles.weaponItem}
            onPress={clickable ? () => toggleFlip(weapon.nome) : null}
            activeOpacity={0.9}
        >
            {flippedCards[weapon.nome] ? (
                weaponDetails[weapon.nome] === false ? (
                    <View style={styles.weaponBack}>
                        <Text style={styles.weaponStats}>Não foi possível obter os dados da arma</Text>
                    </View>
                ) : weaponDetails[weapon.nome] ? (
                    <View style={styles.weaponBack}>
                        <Text style={styles.weaponName}>{weaponDetails[weapon.nome].name.toUpperCase()}</Text>
                        <Text style={styles.weaponStats}>Dano: {weaponDetails[weapon.nome].damage}</Text>
                        <Text style={styles.weaponStats}>Taxa de Fogo: {weaponDetails[weapon.nome].fireRate} RPM</Text>
                        <Text style={styles.weaponStats}>Mobilidade: {weaponDetails[weapon.nome].mobility}</Text>
                        <Text style={styles.weaponStats}>Capacidade: {weaponDetails[weapon.nome].magsize}</Text>
                    </View>
                ) : (
                    <ActivityIndicator size="small" color="#fff" />
                )
            ) : (
                <View style={styles.weaponFront}>
                    <Text style={styles.weaponName}>{weapon.nome}</Text>
                    <Image source={{ uri: weapon.img }} style={styles.weaponImage} resizeMode="contain" />
                    <Text style={styles.weaponType}>{weapon.tipo}</Text>
                </View>
            )}
        </TouchableOpacity>
    );

    return (
        <ImageBackground
            source={{ uri: 'https://static-dm.ubisoft.com/siege/prod/7907369fa863844fc1ae432a9ca0e610.jpg' }}
            style={styles.backgroundImage}
        >
            <View style={styles.overlay} />
            <ScrollView contentContainerStyle={styles.container}>
                {/* Cabeçalho */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Text style={styles.backButtonText}>← Voltar</Text>
                    </TouchableOpacity>
                    <Image
                        source={{ uri: operatorData.images_logo || '' }}
                        style={styles.operatorIcon}
                        resizeMode="contain"
                    />
                    <Text style={styles.operatorName}>{operatorData.name}</Text>
                </View>

                {/* Informações Básicas */}
                <View style={styles.infoSection}>
                    <Text style={styles.infoText}>
                        <Text style={styles.infoLabel}>Side: </Text>{operatorData.side}
                    </Text>
                    <Text style={styles.infoText}>
                        <Text style={styles.infoLabel}>Squad: </Text>{operatorData.squad}
                    </Text>
                    <Text style={styles.infoText}>
                        <Text style={styles.infoLabel}>Specialities: </Text>{operatorData.specialities}
                    </Text>
                    <Text style={styles.infoText}>
                        <Text style={styles.infoLabel}>Health: </Text>{'★'.repeat(operatorData.health)}
                    </Text>
                    <Text style={styles.infoText}>
                        <Text style={styles.infoLabel}>Speed: </Text>{'★'.repeat(operatorData.speed)}
                    </Text>
                </View>

                {/* Loadout */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Loadout</Text>
                    <View style={styles.loadoutContainer}>
                        {/* Primary Weapon */}
                        <View style={styles.loadoutColumn}>
                            <Text style={styles.loadoutTitle}>Primary Weapon</Text>
                            {operatorData.primary_weapon.map(weapon => renderWeaponCard(weapon, true))}
                        </View>

                        {/* Secondary Weapon */}
                        <View style={styles.loadoutColumn}>
                            <Text style={styles.loadoutTitle}>Secondary Weapon</Text>
                            {operatorData.secundary_weapon.map(weapon => renderWeaponCard(weapon, true))}
                        </View>

                        {/* Gadgets */}
                        <View style={styles.loadoutColumn}>
                            <Text style={styles.loadoutTitle}>Gadget</Text>
                            {operatorData.gadget.map(weapon => renderWeaponCard(weapon, false))}
                        </View>

                        {/* Unique Ability */}
                        <View style={styles.loadoutColumn}>
                            <Text style={styles.loadoutTitle}>Unique Ability</Text>
                            {operatorData.unique_ability.map(weapon => renderWeaponCard(weapon, false))}
                        </View>
                    </View>
                </View>
            </ScrollView>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    container: {
        padding: 20,
        paddingBottom: 40,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#121212',
    },
    header: {
        alignItems: 'center',
        marginBottom: 30,
    },
    backButton: {
        position: 'absolute',
        top: 20,
        left: 15,
        backgroundColor: 'rgba(68, 68, 68, 0.8)',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 25,
        zIndex: 1,
    },
    backButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    operatorIcon: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 3,
        borderColor: '#fff',
        marginBottom: 10,
    },
    operatorName: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        textShadowColor: '#000',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 5,
    },
    infoSection: {
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        borderRadius: 10,
        padding: 15,
        marginBottom: 20,
    },
    infoText: {
        color: '#ddd',
        fontSize: 16,
        marginVertical: 4,
    },
    infoLabel: {
        fontWeight: 'bold',
        color: '#fff',
    },
    section: {
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        borderRadius: 10,
        padding: 15,
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 15,
        textAlign: 'center',
        textShadowColor: '#000',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 5,
    },
    loadoutContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    loadoutColumn: {
        width: '48%',
        marginBottom: 15,
    },
    loadoutTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#fff',
        marginBottom: 10,
        textAlign: 'center',
    },
    weaponItem: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 10,
        padding: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 5,
    },
    weaponFront: {
        alignItems: 'center',
    },
    weaponBack: {
        alignItems: 'center',
    },
    weaponName: {
        color: '#fff',
        fontSize: 14,
        marginTop: 8,
        fontWeight: '600',
        textAlign: 'center',
    },
    weaponImage: {
        width: 300,
        height: 300,
        borderRadius: 8,
        marginBottom: 8,
    },
    weaponType: {
        color: '#ccc',
        fontSize: 14,
    },
    weaponStats: {
        color: '#ccc',
        fontSize: 12,
        textAlign: 'center',
        marginVertical: 2,
    },
});

export default OperatorData;
