import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import RotaRelatorios from './RotaRelatorios';
import AddDados from '../screens/AddDados';
import EditarDados from '../screens/EditarDados';

import { corFundoPrimaria } from '../styles/principal';

export default function RotaPrincipal() {
    const Pilha = createNativeStackNavigator();

    return (
        <Pilha.Navigator>
            <Pilha.Screen name='Rota Relatórios' component={ RotaRelatorios } options={{ headerShown: false }} />

            <Pilha.Screen name='Adicionar Dados' component={ AddDados } options={{ headerStyle: { backgroundColor: corFundoPrimaria }, headerShadowVisible: false, headerTitleStyle: { fontWeight: 'bold' } }} />
            
            <Pilha.Screen name='Atualizar Dados' component={ EditarDados } options={{ headerStyle: { backgroundColor: corFundoPrimaria }, headerShadowVisible: false, headerTitleStyle: { fontWeight: 'bold' } }} />
        </Pilha.Navigator>
    )
}