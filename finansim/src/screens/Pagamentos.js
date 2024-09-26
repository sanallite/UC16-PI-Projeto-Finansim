import React from 'react';
import { View, Text } from 'react-native';

import Relatorios from '../components/Relatorios';

export default function Pagamentos() {
    return (
        <View>
            <Text>Aqui ficará o relatório de pagamentos</Text>

            <Relatorios categoria='pagamentos' />
        </View>
    )
}