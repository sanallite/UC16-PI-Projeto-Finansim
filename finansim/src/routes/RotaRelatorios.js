import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Empresa from '../screens/Empresa';

export default function RotaRelatorios() {
    const Guia = createBottomTabNavigator();

    return (
        <Guia.Navigator>
            <Guia.Screen name='Empresa' component={ Empresa } />
        </Guia.Navigator>
    )
}