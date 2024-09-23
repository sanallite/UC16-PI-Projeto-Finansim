import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../initializeFirebase';

export default function Cadastro() {
    const nav = useNavigation();

    const [ email_digitado, setEmail ] = useState('');
    const [ senha_digitada, setSenha ] = useState('');
    const [ senha_confirmada, setSenhaConf ] = useState('');
    const [ nome_empresa, setEmpresa ] = useState('');
    const [ nome_usuario, setNome ] = useState('');

    const cadastro = async (nome_empresa, nome_usuario, email, senha, senha_confirmada) => {
        if ( nome_empresa.trim() && nome_usuario.trim() ) {
            if ( senha === senha_confirmada ) {
                try {
                    const criarUsuario = await createUserWithEmailAndPassword(auth, email, senha);
                    const usuario = criarUsuario.user;

                    const dadosUsuario = {
                        uid: usuario.uid,
                        email: usuario.email,
                        nomeEmpresa: nome_empresa,
                        nomeUsuario: nome_usuario
                    }

                    await AsyncStorage.setItem('usuario', JSON.stringify(dadosUsuario));

                    console.log( 'Usuário cadastrado, Firebase: '+JSON.stringify(usuario)+'Armazenamento assíncrono: '+JSON.stringify(dadosUsuario) );

                    Alert.alert(
                        'Cadastro',
                        'Usuário cadastrado com sucesso!',
                        [ {text: 'Continuar', onPress: () => nav.navigate('Rota Principal') }]
                    )
                }

                catch (erro) {
                    console.error('Erro ao criar usuário: ', erro.message);
                    Alert.alert('Erro ao criar usuário', 'Verifique os dados e tente novamente')
                }
            }

            else {
                Alert.alert('Erro', 'As senhas não coincidem, tente novamente.')
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

                <Text>Nome do Usuário</Text>
                <TextInput value={ nome_usuario } onChangeText={ (novo_valor) => setNome(novo_valor) } />

                <Text>E-mail</Text>
                <TextInput keyboardType='email-address' value={ email_digitado } onChangeText={ (novo_valor) => setEmail(novo_valor) } />

                <Text>Senha</Text>
                <TextInput secureTextEntry value={ senha_digitada } onChangeText={ (novo_valor) => setSenha(novo_valor) } />

                <Text>Confirme a Senha</Text>
                <TextInput secureTextEntry value={ senha_confirmada } onChangeText={ (novo_valor) => setSenhaConf(novo_valor) } />
            </View>

            <View>
                <Pressable onPress={ () => cadastro(nome_empresa, nome_usuario, email_digitado, senha_digitada, senha_confirmada) }>
                    <Text>Cadastrar</Text>
                </Pressable>

                <Pressable onPress={ () => nav.navigate('Entrada') } >
                    <Text>Já é cadastrado? Entre</Text>
                </Pressable>
            </View>
        </View>
    )
}