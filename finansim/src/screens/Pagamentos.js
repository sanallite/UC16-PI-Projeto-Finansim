/* Tela da categoria Pagamentos */

import React, { useEffect, useState } from 'react';
import { View, Text, Alert } from 'react-native';
/* Componentes e hooks do React */

import { useNavigation } from '@react-navigation/native';
/* Biblioteca de navegação entre telas */

import Relatorios from '../components/Relatorios';
/* Componente que exibe relatórios com os documentos no banco de dados */

import { collection, query, where, orderBy, limit, onSnapshot, getAggregateFromServer, sum } from 'firebase/firestore';
import { db } from '../../initializeFirebase';
/* Funções do Firebase Firestore */

import AsyncStorage from '@react-native-async-storage/async-storage';
/* Biblioteca de armazenamento assíncrono */

import { estiloPrincipal } from '../styles/principal';
import { estiloRelatorios } from '../styles/relatorios';
/* Folhas de estilo */

import { valorReais } from '../numberFormat';
/* Função que formata números em valores monetários brasileiros. */

export default function Pagamentos() {
    const [ usuario, setUsuario ] = useState(null);
    const [ carregando, setCarregando ] = useState(true);
    const [ maiorValor, setMaiorValor ] = useState(null);
    const [ somaValor, setSomaValor ] = useState(0);
    const [ somaNumero, setSomaNumero ] = useState(0);
    /* Variáveis de estado para armazenar o usuário autenticado, estado de carregamento o resultado das consultas no banco de dados */

    const nav = useNavigation();
    /* Instânciando a função de uso da navegação entre telas */

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
            const refCategoria = collection(db, 'pagamentos');

            const consultaMaiorValor = query(
                refCategoria,
                where('usuario', '==', usuario.uid), 
                where('empresa', '==', usuario.nomeEmpresa),
                orderBy('valor', 'desc'),
                limit(1)
            );

            const consultaSomaNumero = query( refCategoria,
                where('usuario', '==', usuario.uid),
                where('empresa', '==', usuario.nomeEmpresa),
            );

            const consultaSomaValor = query( refCategoria,
                where('usuario', '==', usuario.uid),
                where('empresa', '==', usuario.nomeEmpresa),
            );
            /* Consultas para fazer a soma dos números dos campos valor e número e também descobrir qual é o documento com o maior número no campo valor. */

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

            const unsubscribeSomaNumero = onSnapshot( consultaSomaNumero, (querySnapshot) => {
                const totalSomaN = querySnapshot.docs.reduce( (acc, doc) => {
                    return acc + ( doc.data().numero || 0 )
                }, 0);

                console.log('Número de colaboradores: ', totalSomaN);

                setSomaNumero(totalSomaN);
            });

            const unsubscribeSomaValor = onSnapshot( consultaSomaValor, (querySnapshot) => {
                const totalSomaV = querySnapshot.docs.reduce( (acc, doc) => {
                    return acc + ( doc.data().valor || 0 )
                }, 0);

                console.log('Valor pago em salários: ', totalSomaV);

                setSomaValor(totalSomaV);
            });
            /* Utilizando o método reduce para fazer a soma dos valores do campo valor de todos os documentos encontrados, com o valor inicial de 0 que é armazenado em acc. O valor daquele campo ou o número zero, se não tiver nenhum valor válido, será adicionado com acc */

            return () => {
                unsubscribeMaiorValor();
                unsubscribeSomaNumero();
                unsubscribeSomaValor();
            }
        }
    }, [usuario] );
    /* Usando o hook useEffect, que permite que componente seja sincronizado com um sistema externo para chamar uma função arrow que faz uma consulta no banco de dados enquanto o app roda. */

    if ( carregando ) {
        return (
            <View style={[ estiloPrincipal.fundoRelatorios ]}>
                <Text style={ estiloPrincipal.textoCarregamento }>Carregando...</Text>
            </View>
        )
    }
    /* Se o estado de carregamento for true será renderizado esse componente */

    return (
        <View style={[ estiloPrincipal.fundoRelatorios, estiloPrincipal.espacamentoHorizontal ]}>
            <View style={[ estiloPrincipal.linhaDoisItens, estiloPrincipal.margemVertical ]}>
                <Text style={[ estiloRelatorios.textoDestaque, estiloPrincipal.flexibilidade ]}>Número total de colaboradores:</Text>

                <Text style={ estiloRelatorios.textoDestaque }>{ somaNumero || 0 }</Text>
            </View>

            <View style={[ estiloPrincipal.linhaDoisItens, estiloPrincipal.margemVertical ]}>
                <Text style={[ estiloRelatorios.textoDestaque, estiloPrincipal.flexibilidade ]}>Valor total pago em salários:</Text>

                <Text style={[ estiloRelatorios.textoDestaque ]}>{ valorReais.format(somaValor) || valorReais.format(0) }</Text>
            </View>

            <View style={[ estiloPrincipal.linhaDoisItens, estiloPrincipal.margemVertical ]}>
                <Text style={[ estiloRelatorios.textoDestaque, estiloPrincipal.flexibilidade ]}>Setor com mais colaboradores:</Text>

                <Text style={[ estiloRelatorios.setorDestaque ]}>{ maiorValor?.[0]?.setor || 'Nenhum Setor' }</Text>
            </View>

            <View style={[ estiloPrincipal.alinhamentoLinhaCentralizada, estiloPrincipal.flexibilidade ]}>
                <Relatorios categoria='pagamentos' uid={ usuario.uid } nomeEmpresa={ usuario.nomeEmpresa } />
                {/* Chamando o componente de relatórios enviando por props os dados necessários para fazer a consulta no banco de dados */}
            </View>
        </View>
    )
}