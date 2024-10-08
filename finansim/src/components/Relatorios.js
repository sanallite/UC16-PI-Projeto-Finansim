/* Componente que exibe todos os resultados da consulta conforme a categoria recebida */

import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Pressable } from 'react-native';
/* Componentes e hooks do React */

import { useNavigation } from '@react-navigation/native';
/* Biblioteca de navegação entre telas */

import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../initializeFirebase';
/* Funções do Firebase Firestore e o meu banco de dados configurado na inicialização do Firebase */

import Icon from 'react-native-vector-icons/FontAwesome6';
/* Importando um componente de ícones, usando especificamente os icones do Font Awesome  */

import { corDestaqueSecundaria, estiloPrincipal } from '../styles/principal';
import { estiloRelatorios } from '../styles/relatorios';
/* Folhas de estilo */

import { valorReais } from '../numberFormat';
/* Função que formata números em valores monetários brasileiros. */

export default function Relatorios(props) {
    const [ dadosConsulta, setDados ] = useState([]);
    const [ carregando, setLoading ] = useState(true);
    const [ estiloAtual, setEstilo ] = useState(null);
    /* Variáveis de estado para armazenar os resultados da consulta, estado de carregamento e uma estilazação que muda conforme a categoria recebida */

    let textoValor, textoNumero;
    /* Variáveis para armazenar os textos ou rótulos que descrevem o contexto dos números exibidos e abaixo as condicionais que atribuem valor para essas variáveis */

    if ( props.categoria === 'vendas' ) {
        textoValor = 'Resultados:';
        textoNumero = 'Número de vendas:';
    }

    else if ( props.categoria === 'compras' ) {
        textoValor = 'Valores investidos:';
        textoNumero = 'Número de compras:';
    }

    else if ( props.categoria === 'pagamentos' ) {
        textoValor = 'Valor pago em salários:';
        textoNumero = 'Número de colaboradores:'
    }

    const nav = useNavigation();
    /* Instânciando a função de uso da navegação de telas */

    useEffect( () => {
        const refCategoria = collection(db, props.categoria);

        if ( props.uid && props.categoria !== 'pagamentos' ) {
            setEstilo(estiloRelatorios.relatoriosVendasCompras);
            /* Estilização do componente de fundo para as categorias vendas e compras */

            const consulta_vendas_compras = query( 
                refCategoria, 
                where('mes', '==', props.mes), 
                where('usuario', '==', props.uid), 
                where('empresa', '==', props.nomeEmpresa),
            );

            const unsubscribeVendasCompras = onSnapshot( consulta_vendas_compras, (querySnapshot) => {
                const resultado = [];

                querySnapshot.forEach( (doc) => {
                    resultado.push( { id: doc.id, ...doc.data() } )
                });

                setDados(resultado);
                
                setLoading(false);
                /* Depois da consulta ter sido feita o estado de carregamento é "desligado" para os resultados serem renderizados na tela */
            });

            return () => { 
                unsubscribeVendasCompras(); 
            }
        }

        else if ( props.uid && props.categoria === 'pagamentos' ) {
            setEstilo( estiloRelatorios.relatorioPagamentos );
            /* Estilização do componente de fundo para a categoria de pagamentos */
            
            const consulta_pagamentos = query( 
                refCategoria, 
                where('usuario', '==', props.uid), 
                where('empresa', '==', props.nomeEmpresa) 
            );

            const unsubscribe = onSnapshot( consulta_pagamentos, (querySnapshot) => {
                const resultado = [];

                querySnapshot.forEach( (doc) => {
                    resultado.push( { id: doc.id, ...doc.data() } )
                })

                setDados(resultado);
                
                setLoading(false);
                /* Depois da consulta ter sido feita o estado de carregamento é "desligado" para os resultados serem renderizados na tela */
            })

            return () => unsubscribe();
        }
        /* Primeiro é feita verificação se foi enviado por parâmetro um uid do usuário e qual foi a categoria recebida */

    }, [props.uid, props.nomeEmpresa, props.categoria, props.mes] );
    /* Usando o hook useEffect, que permite que componente seja sincronizado com um sistema externo para chamar uma função arrow que faz as consultas no banco de dados, com escutador de mudanças em tempo real enquanto o app roda. */

    const renderizarLista = ({item}) => (
        <View style={[ estiloPrincipal.margemVertical, estiloRelatorios.bordaItens ]}>
            <View style={[ estiloPrincipal.linhaDoisItens, estiloPrincipal.margemVertical ]}>
                <Text style={ estiloRelatorios.setor }>{ item.setor }</Text>

                <Pressable onPress={ () => nav.navigate('Atualizar Dados', { id: item.id, categoria: props.categoria }) }>
                    <Icon name='pencil' size={ 15 } color={ corDestaqueSecundaria }></Icon>
                </Pressable>
            </View>

            <View style={[ estiloPrincipal.linhaDoisItens ]}>
                <Text style={ estiloPrincipal.textos }>{ textoValor }</Text>
                <Text style={ estiloPrincipal.textos }>{ valorReais.format(item.valor) }</Text>
            </View>

            <View style={[ estiloPrincipal.linhaDoisItens, estiloPrincipal.margemVertical ]}>
                <Text style={ estiloPrincipal.textos }>{ textoNumero }</Text>
                <Text style={ estiloPrincipal.textos }>{ item.numero }</Text>
            </View>
        </View>
    )
    /* Função que retorna a exibição dos itens da lista no Flatlist */

    if ( carregando ) {
        return (
            <View style={ estiloPrincipal.alinhamentoLinhaCentralizada }>
                <Text style={ estiloPrincipal.textoCarregamento }>Carregando...</Text>
            </View>
        )
    }
    /* Se o estado de carregamento for "true" esse componente será renderizado */

    return (
        <View style={ estiloAtual }>
            <View>
                { props.categoria !== 'pagamentos' ? (
                    <View style={ estiloPrincipal.alinhamentoLinhaCentralizada }>
                        <Text style={ estiloRelatorios.mes }>{ props.mes }</Text>
                    </View>  
                ) : (
                    <View style={ estiloPrincipal.alinhamentoLinhaCentralizada } >
                        <Text style={ estiloRelatorios.mes }>Relatório</Text>
                    </View>
                )}

                <View style={ estiloPrincipal.alinhamentoLinhaCentralizada }>
                    { dadosConsulta.length === 0 && (
                        <Text style={[ estiloPrincipal.textos, estiloPrincipal.margemVertical, estiloPrincipal.alinhamentoTextoCentro ]}>Nenhum registro encontrado. Adicione registros para vê-los aqui.</Text>
                    ) }
                    {/* Renderização condicional que exibe esse texto se o resultado da consulta estiver vazio */}
                </View>

                <FlatList
                    data={ dadosConsulta }
                    keyExtractor={ (item) => item.id }
                    renderItem={ renderizarLista }
                />
            </View>
        </View>
    )
}
