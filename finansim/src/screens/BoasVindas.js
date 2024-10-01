import React from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { estiloPrincipal } from '../styles/principal';
import { estiloBoasVindas } from '../styles/boasvindas';

export default function BoasVindas() {
    let logo = require('../assets/logo.png');

    const nav = useNavigation();

    return (
        <View style={[ estiloPrincipal.fundo, estiloBoasVindas.alinhamentoCentral ]}>
            <View>
                <Image source={ logo } style={ estiloBoasVindas.logo } />
            </View>

            <View style={[ estiloPrincipal.espacamentoHorizontal, estiloBoasVindas.viewTitulo ]}>
                <Text style={ estiloBoasVindas.titulo }>Finansim</Text>
            </View>

            <View style={[ estiloPrincipal.espacamentoHorizontal, estiloBoasVindas.viewDescricao ]}>
                <Text style={ estiloBoasVindas.descricao }>Administre as finanças da sua empresa facilmente com a ajuda da Finansim, aqui você terá relatórios mensais de resultados e investimentos internos, além da sua folha de pagamentos.</Text>
            </View>

            <View style={[ estiloBoasVindas.fundoPressionaveis ]}>
                <Pressable onPress={ () => nav.navigate('Cadastro') } style={[ estiloPrincipal.pressionaveisVerdes, estiloBoasVindas.pressionaveis ]}>
                    <Text style={[ estiloPrincipal.textoPressionaveis ]}>Cadastre-se agora</Text>
                </Pressable>

                <Pressable onPress={ () => nav.navigate('Entrada') } style={[ estiloPrincipal.pressionaveisVerdes, estiloBoasVindas.pressionaveis ]}>
                    <Text style={[ estiloPrincipal.textoPressionaveis ]}>Entrar</Text>
                </Pressable>
            </View>
        </View>
    )
}