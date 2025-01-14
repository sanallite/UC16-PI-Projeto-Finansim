/* Tela da categoria Compras */

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
/* Componentes e Hooks do React */

import { useNavigation } from '@react-navigation/native';
/* Função para usar os comandos de navegação de tela */

import Relatorios from '../components/Relatorios';
/* Componente que exibe os registros encontrados no banco de dados. */

import { collection, query, where, orderBy, limit, onSnapshot, getAggregateFromServer, sum } from 'firebase/firestore';
import { db } from '../../initializeFirebase';
/* Banco de dados configurado e funções do Firestore para consultas */

import AsyncStorage from '@react-native-async-storage/async-storage';
/* Biblioteca de armazenamento assíncrono */

import { estiloPrincipal } from '../styles/principal';
import { estiloRelatorios } from '../styles/relatorios';
/* Folhas de estilo */

import { valorReais } from '../numberFormat';
/* Função que formata número para valores monetários brasileiros */

export default function Compras() {
    const [ usuario, setUsuario ] = useState(null);
    const [ carregando, setCarregando ] = useState(true);
    const [ maiorValor, setMaiorValor ] = useState(null);
    const [ soma, setSoma ] = useState(0);
    /* Variáveis de estado para armazenar o usuário autenticado, estado de carregamento o resultado das consultas no banco de dados */

    const nav = useNavigation();
    /* Instânciando a função de uso da navegação de telas */

    const pegarUsuario = async () => {
        try {
            const usuarioArmazenado = await AsyncStorage.getItem('usuario');
            const usuarioObjeto = JSON.parse(usuarioArmazenado);

            setUsuario(usuarioObjeto);
        }

        catch ( erro ) {
            console.log('Erro ao obter item: ', erro);
            Alert.alert('Erro', 'Erro ao encontrar usuário, tente novamente', [ { text: 'Voltar', onPress: () => nav.navigate('Rota Relatórios') } ])
        }
    }
    /* Função assíncrona para pegar os dados do usuário autenticado no armazenamento assíncrono */  

    useEffect( () => {
        pegarUsuario();
    }, [] );
    /* Usando o hook useEffect, que permite que componente seja sincronizado com um sistema externo para chamar a função que pega os dados do usuário enquanto o app roda. */

    useEffect( () => {
        if ( usuario ) {
            const refCategoria = collection(db, 'compras');

            const consultaMaiorValor = query(
                refCategoria,
                where('usuario', '==', usuario.uid), 
                where('empresa', '==', usuario.nomeEmpresa),
                orderBy('valor', 'desc'),
                limit(1)
            );

            consultaSoma = query(
                refCategoria,
                where('usuario', '==', usuario.uid),
                where('empresa', '==', usuario.nomeEmpresa)
            );
            /* Consultas para fazer a soma dos números do campo valor e descobrir qual é o documento com o maior número no campo valor. */

            const unsubscribeMaiorValor = onSnapshot( consultaMaiorValor, (querySnapshot) => {
                const resultado = [];

                if ( !querySnapshot.empty ) {
                    querySnapshot.forEach( (doc) => {
                        resultado.push( { id: doc.id, ...doc.data() } )
                    } );

                    console.log('Doc com maior valor:', resultado);

                    setMaiorValor(resultado);

                    setCarregando(false);
                    /* "Desligando" o estado de carregamento. */
                }

                else {
                    setMaiorValor(null);
                    /* Se o resultado da consulta for vazio, a variável de estado será definida como nula. */
                    
                    Alert.alert('Relatórios', 'Nenhum registro foi adicionado ainda, adicione um na tela da Empresa', [{ text: 'Voltar', onPress: () => nav.navigate('Empresa') }])
                }
            });

            const unsubscribeSoma = onSnapshot(consultaSoma, (querySnapshot) => {
                const totalSoma = querySnapshot.docs.reduce((acc, doc) => {
                    return acc + ( doc.data().valor || 0 )
                }, 0)

                console.log('Resultados: ',totalSoma);
                setSoma(totalSoma);
            });
            /* Utilizando o método reduce para fazer a soma dos valores do campo valor de todos os documentos encontrados, com o valor inicial de 0 que é armazenado em acc. O valor daquele campo ou o número zero, se não tiver nenhum valor válido, será adicionado com acc */

            return () => {
                unsubscribeMaiorValor();
                unsubscribeSoma();
            }
        }
    }, [usuario] );
    /* Usando o hook useEffect, que permite que componente seja sincronizado com um sistema externo para chamar uma função que encontra o documento com o maior número no campo "valor", caso nenhum registro seja encontrado será exibido um alerta que ao ser confirmado faz a navegação para a tela "Empresa" */

    if ( carregando ) {
        return (
            <View style={[ estiloPrincipal.fundoRelatorios ]}>
                <Text style={ estiloPrincipal.textoCarregamento }>Carregando...</Text>
            </View>
        )
    }
    /* Se o valor da variável de estado for "true" esse será o componente renderizado. */
    
    return (
        <View style={[ estiloPrincipal.fundoRelatorios, estiloPrincipal.espacamentoHorizontal ]}>
            <View style={[ estiloPrincipal.linhaDoisItens, estiloPrincipal.margemVertical ]}>
                <Text style={[ estiloRelatorios.textoDestaque, estiloPrincipal.flexibilidade ]}>Valor total investido:</Text>

                <Text style={ estiloRelatorios.textoDestaque }>{ valorReais.format(soma) || valorReais.format(0) }</Text>
                {/* Utilizando o operador "ou" para definir um valor padrão a ser renderizado, caso o valor desejado não exista */}
            </View>

            <View style={[ estiloPrincipal.linhaDoisItens, estiloPrincipal.margemVertical ]}>

                <Text style={[ estiloRelatorios.textoDestaque, estiloPrincipal.flexibilidade ]}>Setor com maior investimento:</Text>

                <Text style={[ estiloRelatorios.setorDestaque ]}>{ maiorValor?.[0]?.setor || 'Nenhum Setor' }</Text>                 
            </View>
            
            <ScrollView horizontal={ true } style={ estiloRelatorios.scrollViewRelatorios }>
                <Relatorios categoria='compras' mes='Janeiro' uid={ usuario.uid } nomeEmpresa={ usuario.nomeEmpresa } />
                <Relatorios categoria='compras' mes='Fevereiro' uid={ usuario.uid } nomeEmpresa={ usuario.nomeEmpresa } />
                <Relatorios categoria='compras' mes='Março' uid={ usuario.uid } nomeEmpresa={ usuario.nomeEmpresa } />
                <Relatorios categoria='compras' mes='Abril' uid={ usuario.uid } nomeEmpresa={ usuario.nomeEmpresa } />
                <Relatorios categoria='compras' mes='Maio' uid={ usuario.uid } nomeEmpresa={ usuario.nomeEmpresa } />
                <Relatorios categoria='compras' mes='Junho' uid={ usuario.uid } nomeEmpresa={ usuario.nomeEmpresa } />
                <Relatorios categoria='compras' mes='Julho' uid={ usuario.uid } nomeEmpresa={ usuario.nomeEmpresa } />
                <Relatorios categoria='compras' mes='Agosto' uid={ usuario.uid } nomeEmpresa={ usuario.nomeEmpresa } />
                <Relatorios categoria='compras' mes='Setembro' uid={ usuario.uid } nomeEmpresa={ usuario.nomeEmpresa } />
                <Relatorios categoria='compras' mes='Outubro' uid={ usuario.uid } nomeEmpresa={ usuario.nomeEmpresa } />
                <Relatorios categoria='compras' mes='Novembro' uid={ usuario.uid } nomeEmpresa={ usuario.nomeEmpresa } />
                <Relatorios categoria='compras' mes='Dezembro' uid={ usuario.uid } nomeEmpresa={ usuario.nomeEmpresa } />
                {/* Chamando o componente de relatórios doze vezes, e enviando por props os dados relevantes para a exibição deles. */}
            </ScrollView>
        </View>
    )
}