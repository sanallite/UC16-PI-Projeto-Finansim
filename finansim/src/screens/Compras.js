import React from 'react';

import { View, Text, ScrollView } from 'react-native';

import Relatorios from '../components/Relatorios';

export default function Compras() {
    return (
        <View>
            <View>
                <Text>Aqui ficará o relatório de compras</Text>
            </View>

            <ScrollView horizontal={ true }>
                <Relatorios categoria='compras' mes='Janeiro' />
                <Relatorios categoria='compras' mes='Fevereiro' />
                <Relatorios categoria='compras' mes='Março' />
                <Relatorios categoria='compras' mes='Abril' />
                <Relatorios categoria='compras' mes='Maio' />
                <Relatorios categoria='compras' mes='Junho' />
                <Relatorios categoria='compras' mes='Julho' />
                <Relatorios categoria='compras' mes='Agosto' />
                <Relatorios categoria='compras' mes='Setembro' />
                <Relatorios categoria='compras' mes='Outubro' />
                <Relatorios categoria='compras' mes='Novembro' />
                <Relatorios categoria='compras' mes='Dezembro' />
            </ScrollView>
        </View>
    )
}