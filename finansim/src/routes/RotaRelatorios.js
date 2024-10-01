import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Empresa from '../screens/Empresa';
import Vendas from '../screens/Vendas';
import Compras from '../screens/Compras';
import Pagamentos from '../screens/Pagamentos';

import { corFundoSecundaria, estiloPrincipal } from '../styles/principal';
import Icon from 'react-native-vector-icons/FontAwesome6';

export default function RotaRelatorios() {
    const Guia = createBottomTabNavigator();

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