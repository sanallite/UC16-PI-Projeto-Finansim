import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import BoasVindas from '../screens/BoasVindas';
import Cadastro from '../screens/Cadastro';
import Entrada from '../screens/Entrada';

import { corFundoPrimaria } from '../styles/principal';

export default function RotaEntrada() {
    const Pilha = createNativeStackNavigator();

    return (
        <Pilha.Navigator initialRouteName='Boas Vindas'>
            <Pilha.Screen name='Boas Vindas' component={ BoasVindas } options={{ headerShown: false }} />
            <Pilha.Screen name='Cadastro' component={ Cadastro } options={{ headerStyle: { backgroundColor: corFundoPrimaria }, headerShadowVisible: false }}/>
            <Pilha.Screen name='Entrada' component={ Entrada } options={{ headerStyle: { backgroundColor: corFundoPrimaria }, headerShadowVisible: false }}/>
        </Pilha.Navigator>
    )
}