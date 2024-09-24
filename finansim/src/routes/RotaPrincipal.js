import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { View, Text, Pressable } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import RotaRelatorios from './RotaRelatorios';
import AddDados from '../screens/AddDados';

export default function RotaPrincipal() {
    const Pilha = createNativeStackNavigator();

    return (
        <Pilha.Navigator>
            <Pilha.Screen name='Rota Relatórios' component={ RotaRelatorios } />
            <Pilha.Screen name='Adicionar Dados' component={ AddDados } />
        </Pilha.Navigator>
    )
}