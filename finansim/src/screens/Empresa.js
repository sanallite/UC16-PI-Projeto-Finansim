import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, Alert, ActivityIndicator } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { getAuth, signOut } from 'firebase/auth';

import { useNavigation } from '@react-navigation/native';
import { corDestaqueSecundaria, estiloPrincipal } from '../styles/principal';
import { estiloBoasVindas } from '../styles/boasvindas';
import { estiloForms } from '../styles/formularios';
import { estiloEmpresa } from '../styles/empresa';

export default function Empresa() {
    const [ usuario, setUsuario ] = useState(null);

    const nav = useNavigation();

    const auth = getAuth();

    console.log(auth)

    const pegarUsuario = async () => {
        try {
            const usuarioArmazenado = await AsyncStorage.getItem('usuario');
            const usuarioObjeto = JSON.parse(usuarioArmazenado);

            console.log(usuarioObjeto);
            setUsuario(usuarioObjeto);
        }

        catch ( erro ) {
            console.log('Erro ao obter item: ', erro);
            Alert.alert('Erro', 'Erro ao encontrar usuário, tente novamente', [ { text: 'Voltar', onPress: () => nav.navigate('Rota Relatórios') } ])
        }
    }

    useEffect( () => {
        pegarUsuario();
    }, [] );

    const sair = async () => {
        try {
            await AsyncStorage.removeItem('usuario');
            console.log('Usuário saiu da sessão.');
            Alert.alert('Sair', 'Usuário saiu da sessão.', [ { text: 'Voltar para o início', onPress: () => nav.navigate('Rota Entrada') } ]);

            try {
                await signOut(auth);

                console.log('Autenticação: ', auth)
            }

            catch (erroF) {
                console.error('Erro ao remover autenticação do usuário no Firebase: '+erroF)
            }
        }

        catch ( erro ) {
            console.error('Erro na hora de remover o item: ', erro);
            Alert.alert('Erro', 'Erro ao sair da sessão, tente novamente');
        }
    }
    
    if ( !usuario ) {
        return (
          <View style={[ estiloPrincipal.fundo, estiloBoasVindas.alinhamentoCentral ]}>
            <ActivityIndicator size="large" color={ corDestaqueSecundaria } />
          </View>
        )
    }

    return (
        <View style={[ estiloPrincipal.fundo, estiloPrincipal.espacamentoHorizontal, estiloPrincipal.alinhamentoLinhaCentralizada ]}>
            <View style={ estiloForms.fundo }>
                <View style={ estiloPrincipal.alinhamentoLinhaCentralizada }>
                    <Text style={ estiloEmpresa.nomeEmpresa }>{ usuario.nomeEmpresa }</Text>
                </View>

                <View style={[ estiloPrincipal.linhaDoisItens, estiloEmpresa.espacoEntreLinhas ]}>
                    <Text style={ estiloPrincipal.textos }>Responsável:</Text>

                    <Text style={ estiloEmpresa.nomeUsuario }>{ usuario.nomeUsuario }</Text>
                </View>

                <View>
                    <Text style={[ estiloEmpresa.espacoEntreLinhas, estiloPrincipal.textos ]}>Endereço:</Text>

                    <View style={ estiloPrincipal.linhaDoisItens }>
                        <Text style={ estiloPrincipal.textos }>{ usuario.rua }</Text>

                        <Text style={ estiloPrincipal.textos }>{ usuario.numeroEst }</Text>
                    </View>

                    <View style={ estiloPrincipal.linhaDoisItens }>
                        <Text style={ estiloPrincipal.textos }>{ usuario.cep }</Text>

                        <Text style={ estiloPrincipal.textos }>{ usuario.bairro }</Text>
                    </View>

                    <View style={ estiloPrincipal.linhaDoisItens }>
                        <Text style={ estiloPrincipal.textos }>{ usuario.cidade }</Text>

                        <Text style={ estiloPrincipal.textos }>{ usuario.estado }</Text>
                    </View>
                </View>
            </View>

            <View style={ estiloForms.viewPressionaveis }>
                <Pressable onPress={ () => nav.navigate('Adicionar Dados') } style={[ estiloPrincipal.margemVertical, estiloPrincipal.pressionaveisLaranjas ]} >
                    <Text style={ estiloPrincipal.textoPressionaveis }>Adicionar registro de dados</Text>
                </Pressable>

                <Pressable onPress={ sair } style={[ estiloPrincipal.margemVertical, estiloPrincipal.pressionaveisVerdes ]}>
                    <Text style={ estiloPrincipal.textoPressionaveis }>Encerrar Sessão</Text>
                </Pressable>
            </View>
        </View>
    )
}

