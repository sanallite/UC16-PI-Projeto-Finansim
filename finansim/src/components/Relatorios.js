import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Alert, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../initializeFirebase';

import Icon from 'react-native-vector-icons/FontAwesome6';

export default function Relatorios(props) {
    const [ dadosConsulta, setDados ] = useState([]);
    const [ carregando, setLoading ] = useState(true);

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
        <View>
            <View>
                <Text>{ item.setor }</Text>

                <Pressable onPress={ () => nav.navigate('Atualizar Dados', { id: item.id, categoria: props.categoria }) }>
                    <Icon name='pencil' size={ 15 }></Icon>
                </Pressable>
            </View>

            <View>
                <Text>{ textoValor }</Text>
                <Text>{ item.valor }</Text>
            </View>

            <View>
                <Text>{ textoNumero }</Text>
                <Text>{ item.numero }</Text>
            </View>
        </View>
    )

    if ( carregando ) {
        return (
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Text>Carregando...</Text>
            </View>
        )
    }

    return (
        <View>
            <View>
                { props.categoria !== 'pagamentos' && (
                    <View>
                        <Text>{ props.mes }</Text>
                    </View>  
                )}

                <View>
                    { dadosConsulta.length === 0 && (
                        <Text>Nenhum registro encontrado. Adicione registros para vê-los aqui.</Text>
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