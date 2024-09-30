import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Empresa from '../screens/Empresa';
import Vendas from '../screens/Vendas';
import Compras from '../screens/Compras';
import Pagamentos from '../screens/Pagamentos';
import { corFundoSecundaria, estiloPrincipal } from '../styles/principal';

export default function RotaRelatorios() {
    const Guia = createBottomTabNavigator();

    return (
        <Guia.Navigator initialRouteName='Empresa'>
            <Guia.Screen name='Empresa' component={ Empresa } options={{ headerStyle: estiloPrincipal.stackHeader, headerTitleAlign: 'center' }} />

            <Guia.Screen name='Vendas' component={ Vendas } options={{ headerStyle: estiloPrincipal.stackHeaderRelatorios, headerTitleAlign: 'center' }} />

            <Guia.Screen name='Compras' component={ Compras } options={{ headerStyle: estiloPrincipal.stackHeaderRelatorios, headerTitleAlign: 'center' }} />

            <Guia.Screen name='Pagamentos' component={ Pagamentos } options={{ headerStyle: estiloPrincipal.stackHeaderRelatorios, headerTitleAlign: 'center' }} />
        </Guia.Navigator>
    )
}