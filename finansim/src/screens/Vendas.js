import React from 'react';

import { View, Text, ScrollView } from 'react-native';

import Relatorios from '../components/Relatorios';

export default function Vendas() {
    return (
        <View>
            <View>
                <Text>Aqui ficará o relatório de vendas</Text>
            </View>

            <ScrollView horizontal={ true }>
                <Relatorios categoria='vendas' mes='Janeiro' />
                <Relatorios categoria='vendas' mes='Fevereiro' />
                <Relatorios categoria='vendas' mes='Março' />
                <Relatorios categoria='vendas' mes='Abril' />
                <Relatorios categoria='vendas' mes='Maio' />
                <Relatorios categoria='vendas' mes='Junho' />
                <Relatorios categoria='vendas' mes='Julho' />
                <Relatorios categoria='vendas' mes='Agosto' />
                <Relatorios categoria='vendas' mes='Setembro' />
                <Relatorios categoria='vendas' mes='Outubro' />
                <Relatorios categoria='vendas' mes='Novembro' />
                <Relatorios categoria='vendas' mes='Dezembro' />
            </ScrollView>
        </View>
    )
}