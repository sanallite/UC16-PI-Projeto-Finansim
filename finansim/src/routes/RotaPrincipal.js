import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { View, Text, Pressable } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RotaPrincipal() {
    return (
        <View>
            <Text>Aqui ficará a rota principal do app</Text>

            <Pressable onPress={ async () => await AsyncStorage.removeItem('usuario') }>
                <Text>Sair</Text>
            </Pressable>
        </View>
    )
}