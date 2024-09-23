import React, { useState } from 'react';
import { View, Text, Pressable, TextInput, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../initializeFirebase';

export default function Entrada() {
    const nav = useNavigation();

    const [ nome_empresa, setEmpresa ] = useState('');
    const [ nome_usuario, setNome ] = useState('');
    const [ email_digitado, setEmail ] = useState('');
    const [ senha_digitada, setSenha ] = useState('');

    const entrada = async (empresa, nome, email, senha) => {
        if ( empresa.trim() && nome.trim() ) {
            try {
                const SignIn = await signInWithEmailAndPassword(auth, email, senha);
                const usuario = SignIn.user;
        
                const dadosUsuario = {
                    uid: usuario.uid,
                    email: usuario.email,
                    nomeEmpresa: empresa,
                    nomeUsuario: nome
                }
        
                await AsyncStorage.setItem( 'usuario', JSON.stringify(dadosUsuario) );

                console.log('Usuário entrou: '+JSON.stringify(dadosUsuario) );
                Alert.alert('Entrada', 'Entrada realizada com sucesso.', 
                    [{ text: 'Continuar', onPress: () => nav.navigate('Rota Principal') }]
                );
            }
    
            catch (erro) {
                console.error('Erro na entrada: '+erro);
                Alert.alert('Erro na entrada', 'Verifique os dados e tente novamente.')
            }
        }

        else {
            Alert.alert('Erro', 'Preencha todos os campos e tente novamente.');
        }        
    }

    return (
        <View>
            <View>
                <Text>Nome da Empresa</Text>
                <TextInput value={ nome_empresa } onChangeText={ (novo_valor) => setEmpresa(novo_valor) } />

                <Text>Nome de Usuário</Text>
                <TextInput value={ nome_usuario } onChangeText={ (novo_valor) => setNome(novo_valor) } />

                <Text>Email</Text>
                <TextInput keyboardType='email-address' value={ email_digitado } onChangeText={ (novo_valor) => setEmail(novo_valor) } />

                <Text>Senha</Text>
                <TextInput secureTextEntry value={ senha_digitada } onChangeText={ (novo_valor) => setSenha(novo_valor) } />
            </View>

            <View>
                <Pressable onPress={ () => entrada(nome_empresa, nome_usuario, email_digitado, senha_digitada) }>
                    <Text>Entrar</Text>
                </Pressable>

                <Pressable onPress={ () => nav.navigate('Cadastro') }>
                    <Text>Não é cadastrado? Comece agora</Text>
                </Pressable>
            </View>
        </View>
    )
}