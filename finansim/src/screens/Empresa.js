import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, Alert, ActivityIndicator } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { getAuth, signOut } from 'firebase/auth';

import { useNavigation } from '@react-navigation/native';

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
            Alert.alert('Sair', 'Usuário saiu da sessão.', [ { text: 'Voltar para o início', onPress: () => nav.navigate('Boas Vindas') } ]);

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
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        )
    }

    return (
        <View>
            <View>
                <Text>{ usuario.nomeEmpresa }</Text>
            </View>

            <View>
                <Text>Responsável:</Text>
                <Text>{ usuario.nomeUsuario }</Text>
            </View>

            <View>
                <Pressable onPress={ () => nav.navigate('Adicionar Dados') }>
                    <Text>Adicionar registro de dados</Text>
                </Pressable>

                <Pressable onPress={ sair }>
                    <Text>Encerrar Sessão</Text>
                </Pressable>
            </View>
        </View>
    )
}

