/* Tela da categoria Vendas */

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
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

export default function Vendas() {
    const [ usuario, setUsuario ] = useState(null);
    const [ carregando, setCarregando ] = useState(true);
    const [ maiorValor, setMaiorValor ] = useState(null);
    const [ soma, setSoma ] = useState(null);
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

    const pegarSoma = async () => {
        if ( usuario ) {
            const refCategoria = collection(db, 'vendas');

            try {
                const consultaSomaValor = query( refCategoria,
                    where('usuario', '==', usuario.uid),
                    where('empresa', '==', usuario.nomeEmpresa),
                )

                const snapshot = await getAggregateFromServer( consultaSomaValor, {
                    valorTotal: sum('valor')
                } );

                setSoma(snapshot.data().valorTotal); 
            }

            catch (erro) {
                console.error('Erro em fazer a soma:', erro);
            }
        }
    }
    /* Função assíncrona para fazer consultas no banco de dados com a soma dos valores do campo "valor" */

    useEffect( () => {
        pegarUsuario();
    }, [] );
    /* Usando o hook useEffect, que permite que componente seja sincronizado com um sistema externo para chamar a função que pega os dados do usuário enquanto o app roda. */

    useEffect( () => {
        if ( usuario ) {
            const refCategoria = collection(db, 'vendas');

            const consultaMaiorValor = query(
                refCategoria,
                where('usuario', '==', usuario.uid), 
                where('empresa', '==', usuario.nomeEmpresa),
                orderBy('valor', 'desc'),
                limit(1)
            );

            const unsubscribeMaiorValor = onSnapshot( consultaMaiorValor, (querySnapshot) => {
                const resultado = [];

                if ( !querySnapshot.empty ) {
                    querySnapshot.forEach( (doc) => {
                        resultado.push( { id: doc.id, ...doc.data() } )
                    } );

                    console.log('Doc com maior valor:', resultado);

                    setMaiorValor(resultado);

                    pegarSoma();
                    /* Chamando a função que faz a consulta com a soma */

                    setCarregando(false);
                    /* "Desligando" o estado de carregamento. */
                }

                else {
                    Alert.alert('Relatórios', 'Nenhum registro foi adicionado ainda, adicione um na tela da Empresa', [{ text: 'Voltar', onPress: () => nav.navigate('Empresa') }])
                }
            });

            return () => unsubscribeMaiorValor(); 
        }
    }, [usuario] );
    /* Usando o hook useEffect, que permite que componente seja sincronizado com um sistema externo para chamar uma função arrow que faz uma consulta no banco de dados enquanto o app roda. */

    if ( carregando ) {
        return (
            <View style={[ estiloPrincipal.fundoRelatorios,  ]}>
                <Text style={ estiloPrincipal.textoCarregamento }>Carregando...</Text>
            </View>
        )
    }
    /* Se o estado de carregamento for true será renderizado esse componente */
    
    return (
        <View style={[ estiloPrincipal.fundoRelatorios, estiloPrincipal.espacamentoHorizontal ]}>
            <View style={[ estiloPrincipal.linhaDoisItens, estiloPrincipal.margemVertical ]}>
                <Text style={[ estiloRelatorios.textoDestaque, estiloPrincipal.flexibilidade ]}>Resultado total do ano:</Text>

                { soma && <Text style={ estiloRelatorios.textoDestaque }>{ valorReais.format(soma) }</Text> }
            </View>

            <View style={[ estiloPrincipal.linhaDoisItens, estiloPrincipal.margemVertical ]}>
                <Text style={[ estiloRelatorios.textoDestaque, estiloPrincipal.flexibilidade ]}>Setor com melhores resultados:</Text>

                { maiorValor && 
                    <Text style={[ estiloRelatorios.setorDestaque ]}>{ maiorValor[0].setor }</Text> 
                }
            </View>

            <ScrollView horizontal={ true } style={ estiloRelatorios.scrollViewRelatorios }>
                <Relatorios categoria='vendas' mes='Janeiro' uid={ usuario.uid } nomeEmpresa={ usuario.nomeEmpresa } />
                <Relatorios categoria='vendas' mes='Fevereiro' uid={ usuario.uid } nomeEmpresa={ usuario.nomeEmpresa } />
                <Relatorios categoria='vendas' mes='Março' uid={ usuario.uid } nomeEmpresa={ usuario.nomeEmpresa } />
                <Relatorios categoria='vendas' mes='Abril' uid={ usuario.uid } nomeEmpresa={ usuario.nomeEmpresa } />
                <Relatorios categoria='vendas' mes='Maio' uid={ usuario.uid } nomeEmpresa={ usuario.nomeEmpresa } />
                <Relatorios categoria='vendas' mes='Junho' uid={ usuario.uid } nomeEmpresa={ usuario.nomeEmpresa } />
                <Relatorios categoria='vendas' mes='Julho' uid={ usuario.uid } nomeEmpresa={ usuario.nomeEmpresa } />
                <Relatorios categoria='vendas' mes='Agosto' uid={ usuario.uid } nomeEmpresa={ usuario.nomeEmpresa } />
                <Relatorios categoria='vendas' mes='Setembro' uid={ usuario.uid } nomeEmpresa={ usuario.nomeEmpresa } />
                <Relatorios categoria='vendas' mes='Outubro' uid={ usuario.uid } nomeEmpresa={ usuario.nomeEmpresa } />
                <Relatorios categoria='vendas' mes='Novembro' uid={ usuario.uid } nomeEmpresa={ usuario.nomeEmpresa } />
                <Relatorios categoria='vendas' mes='Dezembro' uid={ usuario.uid } nomeEmpresa={ usuario.nomeEmpresa } />
                {/* Chamando doze componentes de relatórios enviando por props os dados necessários para fazer a consulta no banco de dados, com um componente para cada mês do ano */}
            </ScrollView>
        </View>
    )
}