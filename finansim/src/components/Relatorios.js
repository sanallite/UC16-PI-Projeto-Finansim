import React, { useState, useEffect } from 'react';

import { View, Text, FlatList, Alert, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { collection, query, where, onSnapshot, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../../initializeFirebase';

import AsyncStorage from '@react-native-async-storage/async-storage';

import Icon from 'react-native-vector-icons/FontAwesome6';

export default function Relatorios(props) {
    const [ usuario, setUsuario ] = useState(null);
    const [ dadosConsulta, setDados ] = useState([]);
    const [ carregando, setLoading ] = useState(true);
    const [ maiorValor, setMaiorValor ] = useState(null);

    let textoDestaque, textoValor, textoNumero;

    if ( props.categoria === 'vendas' ) {
        textoDestaque = 'Maior rendimento:';
        textoValor = 'Resultados:';
        textoNumero = 'Número de vendas:';
    }

    else if ( props.categoria === 'compras' ) {
        textoDestaque = 'Maior gasto:';
        textoValor = 'Valores investidos:';
        textoNumero = 'Número de compras:';
    }

    else if ( props.categoria === 'pagamentos' ) {
        textoDestaque = 'Maior nº de colaboradores:';
        textoValor = 'Valor pago em salários:';
        textoNumero = 'Número de colaboradores:'
    }

    const nav = useNavigation();
    
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

    useEffect( () => {
        pegarUsuario();
    }, [] );

    useEffect( () => {
        const refCategoria = collection(db, props.categoria);

        if ( usuario && props.categoria !== 'pagamentos' ) {
            const consulta_vendas_compras = query( 
                refCategoria, 
                where('mes', '==', props.mes), 
                where('usuario', '==', usuario.uid), 
                where('empresa', '==', usuario.nomeEmpresa) 
            );

            const consulta_maior_valor_mensal = query(
                refCategoria,
                where('mes', '==', props.mes),
                where('usuario', '==', usuario.uid), 
                where('empresa', '==', usuario.nomeEmpresa),
                orderBy('valor', 'desc'),
                limit(1)
            );

            const unsubscribeVendasCompras = onSnapshot( consulta_vendas_compras, (querySnapshot) => {
                const resultado = [];

                querySnapshot.forEach( (doc) => {
                    resultado.push( { id: doc.id, ...doc.data() } )
                })

                setDados(resultado);
                
                setLoading(false);
            });

            const unsubscribeMaiorValor = onSnapshot( consulta_maior_valor_mensal, (querySnapshot) => {
                if ( !querySnapshot.empty ) {
                    const docComMaiorValor = querySnapshot.docs[0];

                    setMaiorValor({ id: docComMaiorValor.id, ...docComMaiorValor.data() });
                }

                else {
                    console.log('Nada encontrado na consulta');
                }
            })

            return () => { 
                unsubscribeVendasCompras(); 
                unsubscribeMaiorValor();
            }
        }

        else if ( usuario && props.categoria === 'pagamentos' ) {
            const consulta_pagamentos = query( 
                refCategoria, 
                where('usuario', '==', usuario.uid), 
                where('empresa', '==', usuario.nomeEmpresa) 
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
    }, [usuario, props.categoria, props.mes] );

    if ( carregando ) {
        return (
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Text>Carregando...</Text>
            </View>
        )
    }

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

    return (
        <View>
            <View>
                { props.categoria !== 'pagamentos' && (
                    <View>
                        <Text>{ props.mes }</Text>
                    </View>  
                )}

                <View>
                    { dadosConsulta.length > 0 ? (
                        <View>
                            <Text>{ textoDestaque }</Text>
                            <Text>{ maiorValor.setor }</Text>
                        </View>
                    ) : (
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