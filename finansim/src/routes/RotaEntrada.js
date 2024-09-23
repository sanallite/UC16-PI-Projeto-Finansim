import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import BoasVindas from '../screens/BoasVindas';
import Cadastro from '../screens/Cadastro';
import Entrada from '../screens/Entrada';

export default function RotaEntrada() {
    const Pilha = createNativeStackNavigator();

    return (
        <Pilha.Navigator initialRouteName='Boas Vindas'>
            <Pilha.Screen name='Boas Vindas' component={ BoasVindas } />
            <Pilha.Screen name='Cadastro' component={ Cadastro } />
            <Pilha.Screen name='Entrada' component={ Entrada } />
        </Pilha.Navigator>
    )
}