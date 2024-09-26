import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Empresa from '../screens/Empresa';
import Vendas from '../screens/Vendas';
import Compras from '../screens/Compras';
import Pagamentos from '../screens/Pagamentos';

export default function RotaRelatorios() {
    const Guia = createBottomTabNavigator();

    return (
        <Guia.Navigator initialRouteName='Empresa'>
            <Guia.Screen name='Empresa' component={ Empresa } />
            <Guia.Screen name='Vendas' component={ Vendas } />
            <Guia.Screen name='Compras' component={ Compras } />
            <Guia.Screen name='Pagamentos' component={ Pagamentos } />
        </Guia.Navigator>
    )
}