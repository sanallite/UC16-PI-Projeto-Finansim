/* Rota de navegação de entrada, exibida inicialmente caso não tenha nenhum usuário autenticado */

import React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
/* Função da biblioteca instalada para criar a estrutura de navegação por pilha */

import BoasVindas from '../screens/BoasVindas';
import Cadastro from '../screens/Cadastro';
import Entrada from '../screens/Entrada';
/* Telas que fazem parte dessa rota */

import { corFundoPrimaria } from '../styles/principal';
/* Importando uma cor definida na folha de estilos principal */

export default function RotaEntrada() {
    const Pilha = createNativeStackNavigator();
    /* Instânciando a função de navegação por pilha de telas */

    return (
        <Pilha.Navigator initialRouteName='Boas Vindas'>
            <Pilha.Screen name='Boas Vindas' component={ BoasVindas } options={{ headerShown: false }} />
            <Pilha.Screen name='Cadastro' component={ Cadastro } options={{ headerStyle: { backgroundColor: corFundoPrimaria }, headerShadowVisible: false }}/>
            <Pilha.Screen name='Entrada' component={ Entrada } options={{ headerStyle: { backgroundColor: corFundoPrimaria }, headerShadowVisible: false }}/>
        </Pilha.Navigator>
    )
}