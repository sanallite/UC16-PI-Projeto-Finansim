/* Rota de navegação principal, que contém a rota com as telas das categorias e as telas para adicionar e editar os documentos. */

import React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
/* Função da biblioteca instalada para criar a estrutura de navegação por pilha */

import RotaRelatorios from './RotaRelatorios';
import AddDados from '../screens/AddDados';
import EditarDados from '../screens/EditarDados';
/* Telas que fazem parte dessa rota */

import { corFundoPrimaria } from '../styles/principal';
/* Importando uma cor definida na folha de estilos principal */

export default function RotaPrincipal() {
    const Pilha = createNativeStackNavigator();
    /* Instânciando a função de navegação por pilha de telas */

    return (
        <Pilha.Navigator>
            <Pilha.Screen name='Rota Relatórios' component={ RotaRelatorios } options={{ headerShown: false }} />

            <Pilha.Screen name='Adicionar Dados' component={ AddDados } options={{ headerStyle: { backgroundColor: corFundoPrimaria }, headerShadowVisible: false, headerTitleStyle: { fontWeight: 'bold' } }} />
            
            <Pilha.Screen name='Atualizar Dados' component={ EditarDados } options={{ headerStyle: { backgroundColor: corFundoPrimaria }, headerShadowVisible: false, headerTitleStyle: { fontWeight: 'bold' } }} />
        </Pilha.Navigator>
    )
}