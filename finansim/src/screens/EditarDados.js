import React, { useState, useEffect } from 'react';

import { View, Text, TextInput, Pressable, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';

import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../initializeFirebase';

export default function EditarDados() {
    const nav = useNavigation();
    const rota = useRoute();
    const parametros = rota.params;
    const [ documento, setDocumento ] = useState(null);
    const [ iniciando, setInicializacao ] = useState(true);

    const [ valorDigitado, setValor ] = useState('');
    const [ numeroDigitado, setNumero ] = useState('');
    const [ mesSelecionado, setMes ] = useState('');

    let pickerAtivo;
    if ( parametros.categoria !== 'pagamentos' ) {
        pickerAtivo = true;
    }

    let titulo, textoValor, textoNumero;

    if ( parametros.categoria === 'vendas' ) {
        titulo = 'Vendas';
        textoValor = 'Resultados';
        textoNumero = 'Número de vendas';
    }

    else if ( parametros.categoria === 'compras' ) {
        titulo = 'Compras';
        textoValor = 'Valores investidos';
        textoNumero = 'Número de compras';
    }

    else if ( parametros.categoria === 'pagamentos' ) {
        titulo = 'Pagamentos';
        textoValor = 'Valor pago em salários';
        textoNumero = 'Número de colaboradores';
    }

    const docReferencia = doc(db, parametros.categoria, parametros.id);

    const pegarDocumento = async () => {
        const docSnap = await getDoc(docReferencia);

        if ( docSnap.exists() ) {
            setDocumento( docSnap.data() );
            console.log('Documento encontrado:', docSnap.data());

            setInicializacao(false);
        }

        else {
            console.error('Nenhum documento com esse id encontrado');
        }
    }

    useEffect( () => {
        pegarDocumento();
    }, []);

    const atualizarDocumento = async (novoMes, novoValor, novoNumero) => {
        if ( !parametros.categoria || !parametros.id ) {
            Alert.alert('Erro', 'Parâmetros não foram definidos');
            console.error('Invalid document reference. categoria or id is missing.');
            return;
        }

        const atualizacao = {};
        if ( novoMes.trim() ) {
            atualizacao.mes = novoMes;
        }
        else {
            atualizacao.mes = documento.mes;
        }

        if ( novoValor.trim() ) {
            atualizacao.valor = novoValor;
        }
        else {
            atualizacao.valor = documento.valor;
        }

        if ( novoNumero.trim() ) {
            atualizacao.numero = novoNumero;
        }
        else {
            atualizacao.numero = documento.numero;
        }

        if ( parametros.categoria === 'vendas' || parametros.categoria === 'compras' ) {
            try {
                await updateDoc( docReferencia, {
                    mes: atualizacao.mes,
                    valor: atualizacao.valor,
                    numero: atualizacao.numero
                } )

                Alert.alert('Atualizar Dados', 'Os dados do registro foram atualizados!', [{ text: 'Continuar', onPress: () => nav.goBack() }])
            }

            catch (erro) {
                Alert.alert('Erro', 'Erro ao atualizar dados, tente novamente.');
                console.error('Erro ao atualizar dados:', erro)
            }
        }

        else if ( parametros.categoria === 'pagamentos' ) {
            try {
                await updateDoc( docReferencia, {
                    valor: atualizacao.valor,
                    numero: atualizacao.numero
                } )

                Alert.alert('Atualizar Dados', 'Os dados do registro foram atualizados!', [{ text: 'Voltar aos relatórios', onPress: () => nav.goBack() }])
            }

            catch (erro) {
                Alert.alert('Erro', 'Erro ao atualizar dados, tente novamente.');
                console.error('Erro ao atualizar dados:', erro)
            }
        }
    }

    const removerDocumento = async () => {
        try {
            await deleteDoc(docReferencia);

            Alert.alert('Remover Registro', 'Registro removido com sucesso!', [{ text: 'Voltar aos relatórios', onPress: () => nav.goBack() }]);
        }

        catch (erro) {
            Alert.alert('Erro', 'Erro ao remover registro, tente novamente.');

            console.error('Erro ao remover documento:', erro);
        }
    }

    if ( iniciando ) {
        return (
            <View style={{ alignItems: 'center' }}>
                <Text>Carregando...</Text>
            </View>
        )
    }

    return (
        <View>
            <View>
                <Text>{ titulo }</Text>
            </View>

            <View>
                <View>
                    <Text>{ documento.setor }</Text>
                    { pickerAtivo && ( <Text>{ documento.mes }</Text> )}
                </View>

                <View>
                    { pickerAtivo && (
                        <Picker selectedValue={ mesSelecionado } onValueChange={ (novo) => setMes(novo) } >
                            <Picker.Item label='Selecione um mês para alterar' value='' />
                            <Picker.Item label='Janeiro' value='Janeiro' />
                            <Picker.Item label='Fevereiro' value='Fevereiro' />
                            <Picker.Item label='Março' value='Março' />
                            <Picker.Item label='Abril' value='Abril' />
                            <Picker.Item label='Maio' value='Maio' />
                            <Picker.Item label='Junho' value='Junho' />
                            <Picker.Item label='Julho' value='Julho' />
                            <Picker.Item label='Agosto' value='Agosto' />
                            <Picker.Item label='Setembro' value='Setembro' />
                            <Picker.Item label='Outubro' value='Outubro' />
                            <Picker.Item label='Novembro' value='Novembro' />
                            <Picker.Item label='Dezembro' value='Dezembro' />
                        </Picker>
                    ) }

                    <Text>{ textoValor }</Text>

                    <Text>{ documento.valor }</Text>
                    <TextInput value={ valorDigitado } onChangeText={ (novo) => setValor(novo) } placeholder='Deixe em branco para não alterar' />
                    
                    <Text>{ textoNumero }</Text>
                    <Text>{ documento.numero } </Text>
                    <TextInput value={ numeroDigitado } onChangeText={ (novo) => setNumero(novo) } placeholder='Deixe em branco para não alterar' />
                </View>

                <View>
                    <Pressable onPress={ () => atualizarDocumento(mesSelecionado, valorDigitado, numeroDigitado) } >
                        <Text>Atualizar Registro</Text>
                    </Pressable>

                    <Pressable onPress={ removerDocumento } >
                        <Text>Remover Registro</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    )
}