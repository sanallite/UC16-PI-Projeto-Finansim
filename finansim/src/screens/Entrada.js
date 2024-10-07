import React, { useState } from 'react';
import { View, Text, Pressable, TextInput, Alert, ScrollView } from 'react-native';
/* Componentes e hooks do React */

import { useNavigation } from '@react-navigation/native';
/* Biblioteca de navegação entre telas */

import AsyncStorage from '@react-native-async-storage/async-storage';
/* Biblioteca de armazenamento assíncrono */

import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../initializeFirebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../initializeFirebase';
/* Funções do Firebase Auth e Firestore */

import { estiloPrincipal } from '../styles/principal';
import { estiloBoasVindas } from '../styles/boasvindas';
import { estiloForms } from '../styles/formularios';
/* Folhas de estilo */

export default function Entrada() {
    const nav = useNavigation();
    /* Instânciando a função de uso da navegação entre telas */

    const [ email_digitado, setEmail ] = useState('');
    const [ senha_digitada, setSenha ] = useState('');
    /* Variáveis de estado para armazenar os valores digitados nas caixas de textos */

    const entrada = async (email, senha) => {
        if ( email.trim() && senha.trim() ) {
            try {
                const SignIn = await signInWithEmailAndPassword(auth, email, senha);
                const usuario = SignIn.user;
                /* Entrada do usuário pelo Firebase Auth */

                const docRef = collection(db, 'empresas');
                const consultaUsuario = query(docRef, where('idUsuario', '==', usuario.uid));
                const querySnapshot = await getDocs(consultaUsuario);
                /* Pegando o documento no banco de dados que contém os dados da empresa cadastrada por aquele usuário */

                const resultado = [];
                querySnapshot.forEach( (doc) => {
                    resultado.push({ id: doc.id, ...doc.data() });
                })
                /* O resultado da consulta é armazenado num array, que são armazenados junto com o uid e o email do usuário no ojeto abaixo, que adicionado no armazenamewnto assíncrono. */
        
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
        /* Primeiro é feita a verificação se os campos digitados estão vazios */

        else {
            Alert.alert('Erro', 'Preencha todos os campos e tente novamente.');
        }        
    }
    /* Função assíncrona que faz a autenticação do usuário e adiciona os dados do usuário no armazenamento assíncrono */

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
                {/* Quando for pressionado será chamada a função de entrada. */}

                <Pressable onPress={ () => nav.navigate('Cadastro') } style={[ estiloPrincipal.pressionaveisVerdes, estiloPrincipal.margemVertical ]}>
                    <Text style={ estiloPrincipal.textoPressionaveis }>Não é cadastrado? Comece agora</Text>
                </Pressable>
            </View>
        </ScrollView>
    )
}