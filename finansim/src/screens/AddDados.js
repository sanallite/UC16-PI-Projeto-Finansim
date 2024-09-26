import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { db } from '../../initializeFirebase';
import { collection, addDoc } from 'firebase/firestore';

export default function AddDados() {
    const [ usuario, setUsuario ] = useState(null);

    const [ categoriaSelec, setCategoria ] = useState('');
    const [ mesSelecionado, setMes ] = useState('');
    const [ setor, setSetor ] = useState('');
    const [ valor, setValor ] = useState('');
    const [ numero, setNumero ] = useState('');

    let pickerMes;
    if ( categoriaSelec === 'vendas' || categoriaSelec === 'compras' ) {
        pickerMes = true;
    }

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

    const limparCampos = () => {
        setCategoria('');
        setMes('');
        setSetor('');
        setValor('');
        setNumero('');
    }

    const adicionarDoc = async (categoria, mes, setor, valor, numero) => {
        if ( categoria.trim() && setor.trim() && valor.trim() && numero.trim() ) {
            if ( categoria !== 'pagamentos' && mes.trim() ) {
                try {
                    const docRef = await addDoc( collection(db, categoria), {
                        setor: setor,
                        mes: mes,
                        valor: parseFloat(valor),
                        numero: parseInt(numero),
                        usuario: usuario.uid,
                        empresa: usuario.nomeEmpresa
                    } );

                    Alert.alert('Registro', 'Registro adicionado com sucesso!');
                    console.log('Documento adicionado com o id:', docRef.id);
                }

                catch (erro) {
                    Alert.alert('Erro', 'Não foi possível adicionar o registro, tente novamente.');
                    console.error('Erro ao adicionar documento:', erro)
                }
            }

            else if ( categoria === 'pagamentos' ) {
                try {
                    const docRef = await addDoc( collection(db, categoria), {
                        setor: setor,
                        valor: parseFloat(valor),
                        numero: parseInt(numero),
                        usuario: usuario.uid,
                        empresa: usuario.nomeEmpresa
                    } );

                    Alert.alert('Registro', 'Registro adicionado com sucesso!');
                    console.log('Documento adicionado com o id:', docRef.id);
                }

                catch (erro) {
                    Alert.alert('Erro', 'Não foi possível adicionar o registro, tente novamente.');
                    console.error('Erro ao adicionar documento:', erro)
                }
            }

            else if ( mes === '' ) {
                Alert.alert('Erro', 'Selecione um mês e tente novamente.')
            }
        }

        else {
            Alert.alert('Erro', 'Preencha todos os campos e tente novamente')
        }
    }

    return (
        <View>
            <View>
                <Picker mode='dropdown' selectedValue={ categoriaSelec } onValueChange={ (nova) => setCategoria(nova) } >
                    <Picker.Item label='Selecione uma categoria' value='' />
                    <Picker.Item label='Vendas' value='vendas' />
                    <Picker.Item label='Compras' value='compras' />
                    <Picker.Item label= 'Pagamentos' value='pagamentos' />
                </Picker>

                { pickerMes && (
                    <Picker selectedValue={ mesSelecionado } onValueChange={ (novo) => setMes(novo) } >
                        <Picker.Item label='Selecione um mês' value='' />
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
                
                { categoriaSelec === 'vendas' && (
                    <View>
                        <Text>Setor</Text>
                        <TextInput placeholder='Exemplo: Doces' value={ setor } onChangeText={ (novo) => setSetor(novo) } />
        
                        <Text>Resultados</Text>
                        <TextInput placeholder='Exemplo: 124000.99' value={ valor } onChangeText={ (novo) => setValor(novo) } keyboardType='numeric' />
        
                        <Text>Número de vendas</Text>
                        <TextInput placeholder='Exemplo: 300' value={ numero } onChangeText={ (novo) => setNumero(novo) } keyboardType='numeric' />
                    </View>
                ) }
                
                { categoriaSelec === 'compras' && (
                    <View>
                        <Text>Setor</Text>
                        <TextInput placeholder='Exemplo: Equipamentos' value={ setor } onChangeText={ (novo) => setSetor(novo) } />
        
                        <Text>Valores Investidos</Text>
                        <TextInput placeholder='Exemplo: 125000.99' value={ valor } onChangeText={ (novo) => setValor(novo) } keyboardType='numeric' />
        
                        <Text>Número de compras</Text>
                        <TextInput placeholder='Exemplo: 400' value={ numero } onChangeText={ (novo) => setNumero(novo) } keyboardType='numeric' />
                    </View>
                ) }

                { categoriaSelec === 'pagamentos' && (
                    <View>
                        <Text>Setor</Text>
                        <TextInput placeholder='Exemplo: Recursos Humanos' value={ setor } onChangeText={ (novo) => setSetor(novo) } />

                        <Text>Valor pago em salários</Text>
                        <TextInput placeholder='Exemplo: 126000.99' value={ valor } onChangeText={ (novo) => setValor(novo) } keyboardType='numeric' />

                        <Text>Número de colaboradores</Text>
                        <TextInput placeholder='Exemplo: 500' value={ numero } onChangeText={ (novo) => setNumero(novo) } keyboardType='numeric' />
                    </View>
                ) }
            </View>

            <View>
                <Pressable onPress={ () => adicionarDoc(categoriaSelec, mesSelecionado, setor, valor, numero) }>
                    <Text>Adicionar registro</Text>
                </Pressable>

                <Pressable onPress={ limparCampos }>
                    <Text>Limpar dados</Text>
                </Pressable>
            </View>
        </View>
    )
}