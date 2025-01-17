import React, { useState } from 'react';
import { View, Text, Pressable, TextInput, Alert, ScrollView, ActivityIndicator } from 'react-native';
/* Componentes e hooks do React */

import { useNavigation } from '@react-navigation/native';
/* Biblioteca de navegação entre telas */

import AsyncStorage from '@react-native-async-storage/async-storage';
/* Biblioteca de armazenamento assíncrono */

import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../initializeFirebase';
import { collection, getDocs, limit, query, where } from 'firebase/firestore';
import { db } from '../../initializeFirebase';
/* Funções do Firebase Auth e Firestore */

import { estiloPrincipal,corDestaqueSecundaria } from '../styles/principal';
import { estiloBoasVindas } from '../styles/boasvindas';
import { estiloForms } from '../styles/formularios';
/* Folhas de estilo */

export default function Entrada() {
    const nav = useNavigation();
    /* Instânciando a função de uso da navegação entre telas */

    const [ email_digitado, setEmail ] = useState('');
    const [ senha_digitada, setSenha ] = useState('');
    /* Variáveis de estado para armazenar os valores digitados nas caixas de textos */

    const [ carregando, setCarregando ] = useState(false);

    const entrada = async () => {
        if ( email_digitado.trim() && senha_digitada.trim() ) {
            setCarregando(true);

            try {
                const SignIn = await signInWithEmailAndPassword(auth, email_digitado, senha_digitada);
                const usuario = SignIn.user;
                /* Entrada do usuário pelo Firebase Auth */

                const docRef = collection(db, 'empresas');
                const consultaUsuario = query(docRef, where('usuario', '==', usuario.uid), limit(1));
                const querySnapshot = await getDocs(consultaUsuario);
                /* Pegando os documentos no banco de dados que contém os dados da empresa cadastrada por aquele usuário, com o limite de um usuário. */

                if ( !querySnapshot.empty ) {
                    const docEmpresa = querySnapshot.docs[0].id;
                    /* Pegando o id do documento que contém os dados da empresa cadastrada e o salvando no armazenamento assíncrono, abaixo. */

                    const dadosEmpresa = querySnapshot.docs[0].data();
                    /* Pegando os dados do documento, para salvar o nome da empresa no armazenamento assíncrono */

                    const dadosUsuario = {
                        uid: usuario.uid,
                        email: usuario.email,
                        docEmpresa: docEmpresa,
                        nomeEmpresa: dadosEmpresa.nomeEmpresa
                    }

                    await AsyncStorage.setItem( 'usuario', JSON.stringify(dadosUsuario) );
                    /* Adicionando o item, que tem que ser uma string, por isso é transformado em uma. */

                    console.log('Usuário entrou: '+JSON.stringify(dadosUsuario) );

                    setEmail('');
                    setSenha('');
                    /* Limpando as caixas de texto após a entrada ter êxito. */

                    Alert.alert('Entrada', 'Entrada realizada com sucesso.', 
                        [
                            { text: 'Continuar', 
                                onPress: () => 
                                    nav.reset({ index: 0, routes: [{name: 'Rota Principal'}] }) 
                            }
                            /* Quando o botão do alerta for pressionado será feito o reset da navegação, para que o usuário não volte para as telas da rota de entrada, com a navegação sendo feita para a rota principal. */
                        ]
                    );
                }
                /* Caso o resultado da consulta na coleção empresas não estiver vazio, os dados do usuário serão armazenados no armazenamento assíncrono */

                else {
                    console.error('A consulta não obteve resultados.')
                }
            }
    
            catch (erro) {
                console.error('Erro na entrada: '+erro);

                if ( erro.code === "auth/invalid-credential" ) {
                    Alert.alert('Erro na entrada', 'Credenciais inválidas, tente novamente.');
                }
                /* Exibindo uma mensagem de erro personalizada, caso o email e a senha não coincidam com os que estão salvos no banco de dados. Todos os outros erros serão exibidos pelo alerta abaixo. */

                else {
                    Alert.alert('Erro na entrada', erro.message)
                }
            }

            finally {
                setCarregando(false);
            }
        }
        /* Primeiro é feita a verificação se os campos digitados estão vazios */

        else {
            Alert.alert('Erro', 'Preencha todos os campos e tente novamente.');
        }        
    }
    /* Função assíncrona que faz a autenticação do usuário e adiciona os dados do usuário no armazenamento assíncrono */

    if ( carregando ) {
            return (
                <View style={[ estiloPrincipal.fundo, estiloBoasVindas.alinhamentoCentral ]}>
                    <ActivityIndicator size="large" color={ corDestaqueSecundaria } />
                </View>
            )
        }
        /* Caso o variável de estado sejá verdadeira será renderizado o indicador de atividade, usado enquanto a função assíncrona de entrada é executada. */

    return (
        <ScrollView style={ estiloPrincipal.fundo } contentContainerStyle={[ estiloBoasVindas.alinhamentoCentral ]}>
            <View style={[ estiloForms.fundo ]}>
                <Text style={ estiloForms.rotuloCaixasTexto }>Email</Text>

                <TextInput keyboardType='email-address' value={ email_digitado } onChangeText={ (novo_valor) => setEmail(novo_valor) } style={ estiloForms.caixasTexto } />

                <Text style={ estiloForms.rotuloCaixasTexto }>Senha</Text>

                <TextInput secureTextEntry value={ senha_digitada } onChangeText={ (novo_valor) => setSenha(novo_valor) } style={ estiloForms.caixasTexto }/>
            </View>

            <View style={ estiloForms.viewPressionaveis }>
                <Pressable onPress={ entrada } style={[ estiloPrincipal.pressionaveisLaranjas, estiloPrincipal.margemVertical ]}>
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