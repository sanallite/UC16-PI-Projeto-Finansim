import React, { useEffect, useState } from 'react';
import { View, Text, Alert } from 'react-native';

import Relatorios from '../components/Relatorios';

import { collection, query, where, orderBy, limit, onSnapshot, getAggregateFromServer, sum } from 'firebase/firestore';
import { db } from '../../initializeFirebase';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { estiloPrincipal } from '../styles/principal';

export default function Pagamentos() {
    const [ usuario, setUsuario ] = useState(null);
    const [ carregando, setCarregando ] = useState(true);
    const [ maiorValor, setMaiorValor ] = useState(null);
    const [ somaValor, setSomaValor ] = useState(null);
    const [ somaNumero, setSomaNumero ] = useState(null);

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

                console.log('Resultado da soma:', snapshot.data().valorTotal);

                setSomaValor(snapshot.data().valorTotal);

                const consultaSomaNumero = query( refCategoria,
                    where('usuario', '==', usuario.uid),
                    where('empresa', '==', usuario.nomeEmpresa),
                )

                const snapshotNumero = await getAggregateFromServer( consultaSomaNumero, {
                    valorTotal: sum('numero')
                } );

                console.log('Resultado da soma do número:', snapshotNumero.data().valorTotal);

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

                querySnapshot.forEach( (doc) => {
                    resultado.push( { id: doc.id, ...doc.data() } )
                } );

                console.log('Doc com maior valor:', resultado);

                setMaiorValor(resultado);

                pegarSoma();

                setCarregando(false);
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
        <View style={ estiloPrincipal.fundoRelatorios }>
            <View>
                <Text>Número total de colaboradores:</Text>
                { somaNumero && ( <Text>{ somaNumero }</Text> ) }
            </View>

            <View>
                <Text>Valor total pago em salários:</Text>
                { somaValor && ( <Text>{ somaValor }</Text> ) }
            </View>

            <View>
                <Text>Setor com mais colaboradores:</Text>
                <Text>{ maiorValor[0].setor }</Text>
            </View>

            <Relatorios categoria='pagamentos' uid={ usuario.uid } nomeEmpresa={ usuario.nomeEmpresa } />
        </View>
    )
}