import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Empresa from '../screens/Empresa';
import Vendas from '../screens/Vendas';

export default function RotaRelatorios() {
    const Guia = createBottomTabNavigator();

    return (
        <Guia.Navigator initialRouteName='Empresa'>
            <Guia.Screen name='Empresa' component={ Empresa } />
            <Guia.Screen name='Vendas' component={ Vendas } />
        </Guia.Navigator>
    )
}