import React from 'react';

import { View, Text } from 'react-native';

import Relatorios from '../components/Relatorios';

export default function Vendas() {
    return (
        <View>
            <View>
                <Text>Aqui ficará o relatório de vendas</Text>
            </View>

            <View>
                <Relatorios categoria='compras' mes='Abril' />
            </View>
        </View>
    )
}