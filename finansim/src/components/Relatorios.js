import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../initializeFirebase';

import Icon from 'react-native-vector-icons/FontAwesome6';
import { corDestaqueSecundaria, estiloPrincipal } from '../styles/principal';
import { estiloRelatorios } from '../styles/relatorios';

import { valorReais } from '../numberFormat';

export default function Relatorios(props) {
    const [ dadosConsulta, setDados ] = useState([]);
    const [ carregando, setLoading ] = useState(true);
    const [ estiloAtual, setEstilo ] = useState(null);

    let textoValor, textoNumero;

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

    useEffect( () => {
        const refCategoria = collection(db, props.categoria);

        if ( props.uid && props.categoria !== 'pagamentos' ) {
            setEstilo(estiloRelatorios.relatoriosVendasCompras);

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
            });

            return () => { 
                unsubscribeVendasCompras(); 
            }
        }

        else if ( props.uid && props.categoria === 'pagamentos' ) {
            setEstilo( estiloRelatorios.relatorioPagamentos );
            
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
            })

            return () => unsubscribe();
        }
    }, [props.uid, props.nomeEmpresa, props.categoria, props.mes] );

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

    if ( carregando ) {
        return (
            <View style={ estiloPrincipal.alinhamentoLinhaCentralizada }>
                <Text style={ estiloPrincipal.textoCarregamento }>Carregando...</Text>
            </View>
        )
    }

    return (
        <View style={ estiloAtual }>
            <View>
                { props.categoria !== 'pagamentos' ? (
                    <View style={ estiloPrincipal.alinhamentoLinhaCentralizada }>
                        <Text style={ estiloRelatorios.mes }>{ props.mes }</Text>
                    </View>  
                ) : (
                    <View style={ estiloPrincipal.alinhamentoLinhaCentralizada } >
                        <Text style={ estiloRelatorios.mes }>Relatório Anual</Text>
                    </View>
                )}

                <View style={ estiloPrincipal.alinhamentoLinhaCentralizada }>
                    { dadosConsulta.length === 0 && (
                        <Text style={[ estiloPrincipal.textos, estiloPrincipal.margemVertical, estiloPrincipal.alinhamentoTextoCentro ]}>Nenhum registro encontrado. Adicione registros para vê-los aqui.</Text>
                    ) }
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