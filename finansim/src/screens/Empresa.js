/* Tela de exibição dos dados da empresa */

import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, Alert, ActivityIndicator } from 'react-native';
/* Componentes e hooks do React */

import AsyncStorage from '@react-native-async-storage/async-storage';
/* Biblioteca de armazenamento assíncrono */

import { getAuth, signOut } from 'firebase/auth';
/* Funções do Firebase Auth */

import { getDoc, doc } from 'firebase/firestore';
import { db } from '../../initializeFirebase';
/* Funções do Firestore */

import { useNavigation } from '@react-navigation/native';
/* Função de uso da navegação de telas */

import { corDestaqueSecundaria, estiloPrincipal } from '../styles/principal';
import { estiloBoasVindas } from '../styles/boasvindas';
import { estiloForms } from '../styles/formularios';
import { estiloEmpresa } from '../styles/empresa';
/* Folhas de estilo */

export default function Empresa() {
    const [ usuario, setUsuario ] = useState(null);
    const [ empresa, setEmpresa ] = useState(null);
    const [ carregando, setCarregando ] = useState(true);
    /* Variável de estado para armazenar os dados do usuário pego, da empresa cadastrada e o estado de carregamento. */

    const nav = useNavigation();
    /* Instânciando a função de uso da navegação de telas */

    const auth = getAuth();
    /* Pegando a autenticação salva no Firebase Auth */

    console.log(auth);

    const pegarUsuario = async () => {
        try {
            setCarregando(true);

            const usuarioArmazenado = await AsyncStorage.getItem('usuario');

            if ( !usuarioArmazenado ) {
                setUsuario(null);
                setEmpresa(null);
                return;
            }
            /* Se não for encontrado o item, as variáveis de estado serão definidas como nulas. */

            const usuarioObjeto = JSON.parse(usuarioArmazenado);

            console.log(usuarioObjeto);
            setUsuario(usuarioObjeto);
            /* Definindo o novo estado da variável usuário, esse estado só será atualizado completamente quando o componente for renderizado novamente, então não poderiam ser acessados imediatamente pelos códigos abaixo, por isso foi pego o atributo "docEmpresa" da constante "usuarioObjeto", não da constande de estado "usuario". */

            if ( usuarioObjeto?.docEmpresa ) {
                const docEmpresa = await getDoc( doc(db, 'empresas', usuarioObjeto.docEmpresa) );
                /* Pegando o documento com os dados da empresa pelo seu id, que foi salvo no armazenamento assíncrono. */

                if ( docEmpresa.exists() ) {
                    const dadosEmpresa = docEmpresa.data();

                    setEmpresa(dadosEmpresa);

                    console.log("Dados da empresa:", dadosEmpresa);
                }
                /* Se o documento for encontrado, seus dados serão armazenados na variável de estado referente a empresa. */

                else {
                    console.error('Nenhum documento com aquele id encontrado na coleção empresas!');
                }
            }
        }

        catch ( erro ) {
            console.log('Erro ao obter item: ', erro);
            Alert.alert('Erro', 'Erro ao encontrar usuário, tente novamente', [ { text: 'Voltar', onPress: () => nav.navigate('Rota Relatórios') } ]);
        }

        finally {
            setCarregando(false);
        }
    }
    /* Função assíncrona para pegar os dados do usuário no armazenamento assíncrono */

    useEffect( () => {
        const unsubscribe = nav.addListener('focus', () => {
            pegarUsuario();
        })

        pegarUsuario();

        return () => {
            unsubscribe();
        }
    }, [] );
    /* Usando o hook useEffect, que permite que componente seja sincronizado com um sistema externo para chamar a função que pega os dados do usuários enquanto o app roda. */

    const sair = async () => {
        try {
            setCarregando(true);
            setUsuario(null);
            setEmpresa(null);
            /* Ligando o estado de carregamento e definindo como nulos os valores das variáveis de estado. */

            await AsyncStorage.removeItem('usuario');
            /* Removendo o usuário do armazenamento assíncrono. */

            try {
                await signOut(auth);
                /* Encerrando a autenticação do usuário. */

                console.log('Autenticação: ', auth)
            }

            catch (erroF) {
                console.error('Erro ao remover autenticação do usuário no Firebase: '+erroF)
            }

            console.log('Usuário saiu da sessão.');
            Alert.alert('Sair', 'Usuário saiu da sessão.', [ 
                { text: 'Voltar para o início',
                    onPress: () => 
                    nav.reset({ index: 0, routes: [{ name: 'Rota Entrada'}] }) 
                    /* Quando o botão do alerta for pressionado será feito o reset da navegação, para que o usuário não volte para as telas da rota principal, com a navegação sendo feita para de entrada. */
                }
            ]);
        }

        catch ( erro ) {
            console.error('Erro na hora de remover o item: ', erro);
            Alert.alert('Erro', 'Erro ao sair da sessão, tente novamente');
        }

        finally {
            setCarregando(false);
        }
        /* Desligando o estado de carregamento. */
    }
    /* Função assíncrona para remover a autenticação e os dados do usuário no armazenamento assíncrono. */
    
    if ( carregando ) {
        return (
          <View style={[ estiloPrincipal.fundo, estiloBoasVindas.alinhamentoCentral ]}>
            <ActivityIndicator size="large" color={ corDestaqueSecundaria } />
          </View>
        )
    }
    /* Caso o variável de estado sejá verdadeira será renderizado o indicador de atividade. */

    return (
        <View style={[ estiloPrincipal.fundo, estiloPrincipal.espacamentoHorizontal, estiloPrincipal.alinhamentoLinhaCentralizada ]}>
            <View style={ estiloForms.fundo }>
                <View style={ estiloPrincipal.alinhamentoLinhaCentralizada }>
                    <Text style={ estiloEmpresa.nomeEmpresa }>{ empresa?.nomeEmpresa }</Text>
                </View>

                <View style={[ estiloPrincipal.linhaDoisItens, estiloEmpresa.espacoEntreLinhas ]}>
                    <Text style={ estiloPrincipal.textos }>Responsável:</Text>

                    <Text style={ estiloEmpresa.nomeUsuario }>{ empresa?.nomeUsuario }</Text>
                    {/* Utilizando a sintaxe optional chaining para não exibir erros caso aquelas propriedades que estão tentando ser acessadas forem nulas ou não definidas. */}
                </View>

                <View>
                    <Text style={[ estiloEmpresa.espacoEntreLinhas, estiloPrincipal.textos ]}>Endereço:</Text>

                    <View style={ estiloPrincipal.linhaDoisItens }>
                        <Text style={ estiloPrincipal.textos }>{ empresa?.rua }</Text>

                        <Text style={ estiloPrincipal.textos }>{ empresa?.numeroEst }</Text>
                    </View>

                    <View style={ estiloPrincipal.linhaDoisItens }>
                        <Text style={ estiloPrincipal.textos }>{ empresa?.cep }</Text>

                        <Text style={ estiloPrincipal.textos }>{ empresa?.bairro }</Text>
                    </View>

                    <View style={ estiloPrincipal.linhaDoisItens }>
                        <Text style={ estiloPrincipal.textos }>{ empresa?.cidade }</Text>

                        <Text style={ estiloPrincipal.textos }>{ empresa?.estado }</Text>
                    </View>
                </View>
            </View>

            <View style={ estiloForms.viewPressionaveis }>
                <Pressable onPress={ () => nav.navigate('Adicionar Dados') } style={[ estiloPrincipal.margemVertical, estiloPrincipal.pressionaveisLaranjas ]} >
                    <Text style={ estiloPrincipal.textoPressionaveis }>Adicionar registro de dados</Text>
                </Pressable>
                {/* Quando for pressionado será feita a navegação para a tela de adicionar o registro */}

                <Pressable 
                    onPress={ () => ( Alert.alert('Encerrar Sessão', 'Tem certeza que deseja sair?', [ { text: 'Sim', onPress: sair }, { text: 'Não' } ]) ) } 
                    style={[ estiloPrincipal.margemVertical, estiloPrincipal.pressionaveisVerdes ]}>

                    <Text style={ estiloPrincipal.textoPressionaveis }>Encerrar Sessão</Text>
                </Pressable>
                {/* Quando for pressionado um alerta pedirá por confirmação do usuário e se ele apertar em "Sim" a autenticação será removida do Firebase Auth e do armazenamento assíncrono. */}
            </View>
        </View>
    )
}

