import React, { useEffect, useState } from 'react';
import { View, Text, Alert, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import Relatorios from '../components/Relatorios';

import { collection, query, where, orderBy, limit, onSnapshot, getAggregateFromServer, sum } from 'firebase/firestore';
import { db } from '../../initializeFirebase';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { estiloPrincipal } from '../styles/principal';
import { estiloRelatorios } from '../styles/relatorios';

import { valorReais } from '../numberFormat';

export default function Pagamentos() {
    const [ usuario, setUsuario ] = useState(null);
    const [ carregando, setCarregando ] = useState(true);
    const [ maiorValor, setMaiorValor ] = useState(null);
    const [ somaValor, setSomaValor ] = useState(null);
    const [ somaNumero, setSomaNumero ] = useState(null);

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

    const pegarSoma = async () => {
        if ( usuario ) {
            const refCategoria = collection(db, 'pagamentos');

            try {
                const consultaSomaValor = query( refCategoria,
                    where('usuario', '==', usuario.uid),
                    where('empresa', '==', usuario.nomeEmpresa),
                )

                const snapshot = await getAggregateFromServer( consultaSomaValor, {
                    valorTotal: sum('valor')
                } );

                setSomaValor(snapshot.data().valorTotal);

                const consultaSomaNumero = query( refCategoria,
                    where('usuario', '==', usuario.uid),
                    where('empresa', '==', usuario.nomeEmpresa),
                )

                const snapshotNumero = await getAggregateFromServer( consultaSomaNumero, {
                    valorTotal: sum('numero')
                } );

                setSomaNumero(snapshotNumero.data().valorTotal);
            }

            catch (erro) {
                console.error('Erro em fazer as somas:', erro);
            }
        }
    }

    useEffect( () => {
        pegarUsuario();
    }, [] );

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

            const unsubscribeMaiorValor = onSnapshot( consultaMaiorValor, (querySnapshot) => {
                const resultado = [];

                if ( !querySnapshot.empty ) {
                    querySnapshot.forEach( (doc) => {
                        resultado.push( { id: doc.id, ...doc.data() } )
                    } );

                    console.log('Doc com maior valor:', resultado);

                    setMaiorValor(resultado);

                    pegarSoma();

                    setCarregando(false);
                }

                else {
                    Alert.alert('Relatórios', 'Nenhum registro foi adicionado ainda, adicione um na tela da Empresa', [{ text: 'Voltar', onPress: () => nav.navigate('Empresa') }])
                }
            });

            return () => unsubscribeMaiorValor(); 
        }
    }, [usuario] );

    if ( carregando ) {
        return (
            <View style={[ estiloPrincipal.fundoRelatorios ]}>
                <Text style={ estiloPrincipal.textoCarregamento }>Carregando...</Text>
            </View>
        )
    }

    return (
        <View style={[ estiloPrincipal.fundoRelatorios, estiloPrincipal.espacamentoHorizontal ]}>
            <View style={[ estiloPrincipal.linhaDoisItens, estiloPrincipal.margemVertical ]}>
                <Text style={[ estiloRelatorios.textoDestaque, estiloPrincipal.flexibilidade ]}>Número total de colaboradores:</Text>

                { somaNumero && ( <Text style={ estiloRelatorios.textoDestaque }>{ somaNumero }</Text> ) }
            </View>

            <View style={[ estiloPrincipal.linhaDoisItens, estiloPrincipal.margemVertical ]}>
                <Text style={[ estiloRelatorios.textoDestaque, estiloPrincipal.flexibilidade ]}>Valor total pago em salários:</Text>

                { somaValor && ( <Text style={[ estiloRelatorios.textoDestaque ]}>{ valorReais.format(somaValor) }</Text> ) }
            </View>

            <View style={[ estiloPrincipal.linhaDoisItens, estiloPrincipal.margemVertical ]}>
                <Text style={[ estiloRelatorios.textoDestaque, estiloPrincipal.flexibilidade ]}>Setor com mais colaboradores:</Text>

                <Text style={[ estiloRelatorios.setorDestaque ]}>{ maiorValor[0].setor }</Text>
            </View>

            <View style={[ estiloPrincipal.alinhamentoLinhaCentralizada, estiloPrincipal.flexibilidade ]}>
                <Relatorios categoria='pagamentos' uid={ usuario.uid } nomeEmpresa={ usuario.nomeEmpresa } />
            </View>
        </View>
    )
}