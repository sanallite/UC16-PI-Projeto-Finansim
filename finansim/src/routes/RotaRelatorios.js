/* Rota de navegação das telas de cada categoria que exibem os relatórios */

import React from 'react';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
/* Função da biblioteca instalada para criar a estrutura de navegação por guias */

import Empresa from '../screens/Empresa';
import Vendas from '../screens/Vendas';
import Compras from '../screens/Compras';
import Pagamentos from '../screens/Pagamentos';
/* Telas que fazem parte dessa rota */

import { corFundoSecundaria, estiloPrincipal } from '../styles/principal';
/* Importando a folha de estilos principal */

import Icon from 'react-native-vector-icons/FontAwesome6';
/* Importando um componente de ícones, usando especificamente os icones do Font Awesome  */

export default function RotaRelatorios() {
    const Guia = createBottomTabNavigator();
    /* Instânciando a função de navegação entre telas por guias */

    return (
        <Guia.Navigator initialRouteName='Empresa' screenOptions={{ tabBarActiveTintColor: corFundoSecundaria, tabBarStyle: { height: 66, paddingBottom: 10, paddingTop: 10 }, tabBarLabelStyle: { fontSize: 12 } }}>
            
            <Guia.Screen name='Empresa' component={ Empresa } options={{ 
                    headerStyle: estiloPrincipal.stackHeader, 
                    headerTitleAlign: 'center', 
                    headerTitleStyle: { fontWeight: 'bold' },
                    tabBarIcon: ({ size, color }) => (
                        <Icon name="stamp" color={ color } size={ size } />
                    ) 
                }}
            />

            <Guia.Screen name='Vendas' component={ Vendas } options={{ 
                    headerStyle: estiloPrincipal.stackHeaderRelatorios, 
                    headerTitleAlign: 'center', 
                    headerTitleStyle: { color: 'white', fontWeight: 'bold' },
                    tabBarIcon: ({ size, color }) => (
                        <Icon name="money-bill-trend-up" color={ color } size={ size } />
                    ) 
                }} 
            />

            <Guia.Screen name='Compras' component={ Compras } options={{ 
                    headerStyle: estiloPrincipal.stackHeaderRelatorios, 
                    headerTitleAlign: 'center', 
                    headerTitleStyle: { color: 'white', fontWeight: 'bold' },
                    tabBarIcon: ({ size, color }) => (
                        <Icon name="cash-register" color={ color } size={ size } />
                    )
                }} 
            />

            <Guia.Screen name='Pagamentos' component={ Pagamentos } options={{ 
                    headerStyle: estiloPrincipal.stackHeaderRelatorios, 
                    headerTitleAlign: 'center', 
                    headerTitleStyle: { color: 'white', fontWeight: 'bold' },
                    tabBarIcon: ({ size, color }) => (
                        <Icon name="sack-dollar" color={ color } size={ size } />
                    ) 
                }} 
            />
        </Guia.Navigator>
    )
}