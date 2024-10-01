import React, { useState } from 'react';
import { View, Text, Pressable, TextInput, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../initializeFirebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../initializeFirebase';

import { corFundoTercearia, estiloPrincipal } from '../styles/principal';
import { estiloBoasVindas } from '../styles/boasvindas';
import { estiloForms } from '../styles/formularios';

export default function Entrada() {
    const nav = useNavigation();

    const [ email_digitado, setEmail ] = useState('');
    const [ senha_digitada, setSenha ] = useState('');

    const entrada = async (email, senha) => {
        if ( email.trim() && senha.trim() ) {
            try {
                const SignIn = await signInWithEmailAndPassword(auth, email, senha);
                const usuario = SignIn.user;

                const docRef = collection(db, 'empresas');
                const consultaUsuario = query(docRef, where('idUsuario', '==', usuario.uid));
                const querySnapshot = await getDocs(consultaUsuario);

                const resultado = [];

                querySnapshot.forEach( (doc) => {
                    resultado.push({ id: doc.id, ...doc.data() });
                })
        
                const dadosUsuario = {
                    uid: usuario.uid,
                    email: usuario.email,
                    nomeEmpresa: resultado[0].nomeEmpresa,
                    nomeUsuario: resultado[0].nomeUsuario,
                    cep: resultado[0].cep,
                    rua: resultado[0].rua,
                    bairro: resultado[0].bairro,
                    cidade: resultado[0].cidade,
                    estado: resultado[0].estado,
                    numeroEst: resultado[0].numeroEst
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
        <ScrollView style={ estiloPrincipal.fundo } contentContainerStyle={[ estiloBoasVindas.alinhamentoCentral ]}>
            <View style={[ estiloForms.fundo ]}>
                <Text style={ estiloForms.rotuloCaixasTexto }>Email</Text>

                <TextInput keyboardType='email-address' value={ email_digitado } onChangeText={ (novo_valor) => setEmail(novo_valor) } style={ estiloForms.caixasTexto } />

                <Text style={ estiloForms.rotuloCaixasTexto }>Senha</Text>

                <TextInput secureTextEntry value={ senha_digitada } onChangeText={ (novo_valor) => setSenha(novo_valor) } style={ estiloForms.caixasTexto }/>
            </View>

            <View style={ estiloForms.viewPressionaveis }>
                <Pressable onPress={ () => entrada(email_digitado, senha_digitada) } style={[ estiloPrincipal.pressionaveisLaranjas, estiloPrincipal.margemVertical ]}>
                    <Text style={ estiloPrincipal.textoPressionaveis }>Entrar</Text>
                </Pressable>

                <Pressable onPress={ () => nav.navigate('Cadastro') } style={[ estiloPrincipal.pressionaveisVerdes, estiloPrincipal.margemVertical ]}>
                    <Text style={ estiloPrincipal.textoPressionaveis }>Não é cadastrado? Comece agora</Text>
                </Pressable>
            </View>
        </ScrollView>
    )
}