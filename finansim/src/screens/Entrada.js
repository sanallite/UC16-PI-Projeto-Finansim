import React, { useState } from 'react';
import { View, Text, Pressable, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../initializeFirebase';

export default function Entrada() {
    const nav = useNavigation();

    const [ email_digitado, setEmail ] = useState('');
    const [ senha_digitada, setSenha ] = useState('');

    return (
        <View>
            <View>
                <Text>Email</Text>
                <TextInput keyboardType='email-address' value={ email_digitado } onChangeText={ (novo_valor) => setEmail(novo_valor) } />

                <Text>Senha</Text>
                <TextInput secureTextEntry value={ senha_digitada } onChangeText={ (novo_valor) => setSenha(novo_valor) } />
            </View>

            <View>
                <Pressable>
                    <Text>Entrar</Text>
                </Pressable>

                <Pressable onPress={ () => nav.navigate('Cadastro') }>
                    <Text>Não é cadastrado? Comece agora</Text>
                </Pressable>
            </View>
        </View>
    )
}