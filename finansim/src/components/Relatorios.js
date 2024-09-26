import React, { useState, useEffect } from 'react';

import { View, Text, FlatList, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../initializeFirebase';

import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Relatorios(props) {
    const [ usuario, setUsuario ] = useState(null);
    const [ dadosConsulta, setDados ] = useState([]);
    const [ carregando, setLoading ] = useState(true);

    const nav = useNavigation();
    
    const pegarUsuario = async () => {
        try {
            const usuarioArmazenado = await AsyncStorage.getItem('usuario');
            const usuarioObjeto = JSON.parse(usuarioArmazenado);

            console.log(usuarioObjeto);
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
        if ( usuario && props.categoria !== 'pagamentos' ) {
            let textoDestaque, textoValor, textoNumero;

            if ( props.categoria === 'vendas' ) {
                textoDestaque = 'Maior rendimento:';
                textoValor = 'Resultados:';
                textoNumero = 'Número de vendas';
            }

            else if ( props.categoria === 'compras' ) {
                textoDestaque = 'Maior gasto:';
                textoValor = 'Valores investidos:';
                textoNumero = 'Número de compras';
            }

            const refCategoria = collection(db, props.categoria);

            const consulta_vendas_compras = query( 
                refCategoria, 
                where('mes', '==', props.mes), 
                where('usuario', '==', usuario.uid), 
                where('empresa', '==', usuario.nomeEmpresa) 
            );

            const unsubscribe = onSnapshot( consulta_vendas_compras, (querySnapshot) => {
                const resultado = [];

                querySnapshot.forEach( (doc) => {
                    resultado.push( { id: doc.id, ...doc.data() } )
                })

                setDados(resultado);
                console.log(dadosConsulta);
                console.log(usuario.nomeEmpresa)
                /* setLoading(false); */
            })

            return () => unsubscribe();
        }
    }, [usuario, props.categoria, props.mes] );

    if ( carregando ) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Carregando...</Text>
            </View>
        )
    }

    return (
        <View>
            <View>{ props.mes }</View>

            <View>
                {/* <Text>{ textoDestaque }</Text> */}
                <Text>A</Text>
            </View>

            <View>
                <FlatList 
                    data={ dadosConsulta }
                    keyExtractor={ (item) => item.id }
                    renderItem={ ({item}) => (
                        <View>
                            <View>
                                <Text>Setor</Text>
                            </View>

                            <View>
                                
                                <Text>{ item.valor }</Text>
                            </View>

                            <View>
                                
                                <Text>{ item.numero }</Text>
                            </View>
                        </View>
                    ) }
                />
            </View>
        </View>
    )
}