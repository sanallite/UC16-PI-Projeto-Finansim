/* Tela para adicionar documentos no banco de dados */

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, Alert, ScrollView } from 'react-native';
/* Bibliotecas e componentes do React */

import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
/* Componente externo de lista selecionável e biblioteca de navegação */

import AsyncStorage from '@react-native-async-storage/async-storage';
/* Biblioteca de armazenamento assíncrono */

import { db } from '../../initializeFirebase';
import { collection, addDoc } from 'firebase/firestore';
/* Pegando o banco de dados definido na configuração do Firebase e as funções usadas para adicionar um documento no Firestore */

import { estiloPrincipal } from '../styles/principal';
import { estiloForms } from '../styles/formularios';
/* Folhas de estilo utilizadas */

export default function AddDados() {
    const [ usuario, setUsuario ] = useState(null);

    const [ categoriaSelec, setCategoria ] = useState('');
    const [ mesSelecionado, setMes ] = useState('');
    const [ setor, setSetor ] = useState('');
    const [ valor, setValor ] = useState('');
    const [ numero, setNumero ] = useState('');
    /* Varíaveis de estado para armazenar o usuário autenticado e os dados preenchidos no formulário */

    const nav = useNavigation();
    /* Instânciando a função de uso da navegação entre telas */

    let pickerMes;
    if ( categoriaSelec === 'vendas' || categoriaSelec === 'compras' ) {
        pickerMes = true;
    }
    /* Variável que define ser o Picker referente aos meses do ano será exibido conforme a categoria selecionada no outro Picker */

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
    /* Buscando no armazenamento assíncrono o usuário autenticado, e o armazenando ma variável de estado "usuario" */

    useEffect( () => {
        pegarUsuario();
    }, [] );
    /* Usando o hook useEffect, que permite que componente seja sincronizado com um sistema externo para chamar a função que pega o usuário armazenado enquanto o app roda. */

    const limparCampos = () => {
        setCategoria('');
        setMes('');
        setSetor('');
        setValor('');
        setNumero('');
    }
    /* Função para limpar os dados digitados nos campos de texto e restaurar os valores dos Pickers */

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

                    limparCampos();

                    Alert.alert('Registro', 'Registro adicionado com sucesso!', [{ text: 'Continuar', onPress: () => nav.goBack() }]);
                    console.log('Documento adicionado com o id:', docRef.id);
                }

                catch (erro) {
                    Alert.alert('Erro', 'Não foi possível adicionar o registro, tente novamente.');
                    console.error('Erro ao adicionar documento:', erro)
                }
            }
            /* Se a categoria não for "pagamentos", no caso se for "vendas" ou "compras" será feita a tentativa de adicionar o registro no Firestore, com os valores dos campos sendo pego dos parâmetros e dos dados do usuário autenticado. Se for adicionado com sucesso, será chamada a função para limpar os campos e um alerta que fará a navegação para a tela anterior. */

            else if ( categoria === 'pagamentos' ) {
                try {
                    const docRef = await addDoc( collection(db, categoria), {
                        setor: setor,
                        valor: parseFloat(valor),
                        numero: parseInt(numero),
                        usuario: usuario.uid,
                        empresa: usuario.nomeEmpresa
                    } );

                    limparCampos();

                    Alert.alert('Registro', 'Registro adicionado com sucesso!', [{ text: 'Continuar', onPress: () => nav.goBack() }]);
                    console.log('Documento adicionado com o id:', docRef.id);
                }

                catch (erro) {
                    Alert.alert('Erro', 'Não foi possível adicionar o registro, tente novamente.');
                    console.error('Erro ao adicionar documento:', erro)
                }
            }
            /* Se a categoria for "pagamentos" será feita a mesma tentativa de adcionar o registro no Firestore, com a maior diferença sendo a ausência do campo "mes" */

            else if ( mes === '' ) {
                Alert.alert('Erro', 'Selecione um mês e tente novamente.')
            }
            /* Segundo verificando se a categoria selecionada no Picker não foi "pagamentos" e se um mês foi selecionado. Se a categoria não for pagamentos mas o valor do mẽs estiver vazio, será exibido um alerta. */
        }
        /* Primeiro verificando se os campos necessários não estão vazios, utilizando a função trim */

        else {
            Alert.alert('Erro', 'Preencha todos os campos e tente novamente')
        }
    }

    return (
        <ScrollView style={[ estiloPrincipal.espacamentoHorizontal, estiloPrincipal.fundo, estiloPrincipal.flexibilidade ]}>
            <View style={[ estiloForms.fundo, { width: '100%' } ]}>
                <Picker mode='dropdown' selectedValue={ categoriaSelec } onValueChange={ (nova) => setCategoria(nova) }>
                    <Picker.Item label='Selecione uma categoria' value='' />
                    <Picker.Item label='Vendas' value='vendas' />
                    <Picker.Item label='Compras' value='compras' />
                    <Picker.Item label= 'Pagamentos' value='pagamentos' />
                </Picker>

                { pickerMes && (
                    <Picker mode='dropdown' selectedValue={ mesSelecionado } onValueChange={ (novo) => setMes(novo) }>
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
                        <Text style={[ estiloForms.rotuloCaixasTexto ]}>Setor</Text>

                        <TextInput placeholder='Exemplo: Doces' value={ setor } onChangeText={ (novo) => setSetor(novo) } style={ estiloForms.caixasTexto } />
        
                        <Text style={[ estiloForms.rotuloCaixasTexto ]}>Resultados</Text>

                        <TextInput placeholder='Exemplo: 124000.99' value={ valor } onChangeText={ (novo) => setValor(novo) } keyboardType='numeric' style={ estiloForms.caixasTexto } />
        
                        <Text style={[ estiloForms.rotuloCaixasTexto ]}>Número de vendas</Text>

                        <TextInput placeholder='Exemplo: 300' value={ numero } onChangeText={ (novo) => setNumero(novo) } keyboardType='numeric' style={ estiloForms.caixasTexto } />
                    </View>
                ) }
                
                { categoriaSelec === 'compras' && (
                    <View>
                        <Text style={[ estiloForms.rotuloCaixasTexto ]}>Setor</Text>

                        <TextInput placeholder='Exemplo: Equipamentos' value={ setor } onChangeText={ (novo) => setSetor(novo) } style={ estiloForms.caixasTexto }/>
        
                        <Text style={[ estiloForms.rotuloCaixasTexto ]}>Valores Investidos</Text>

                        <TextInput placeholder='Exemplo: 125000.99' value={ valor } onChangeText={ (novo) => setValor(novo) } keyboardType='numeric' style={ estiloForms.caixasTexto }/>
        
                        <Text style={[ estiloForms.rotuloCaixasTexto ]}>Número de compras</Text>

                        <TextInput placeholder='Exemplo: 400' value={ numero } onChangeText={ (novo) => setNumero(novo) } keyboardType='numeric' style={ estiloForms.caixasTexto }/>
                    </View>
                ) }

                { categoriaSelec === 'pagamentos' && (
                    <View>
                        <Text style={[ estiloForms.rotuloCaixasTexto ]}>Setor</Text>

                        <TextInput placeholder='Exemplo: Recursos Humanos' value={ setor } onChangeText={ (novo) => setSetor(novo) } style={ estiloForms.caixasTexto }/>

                        <Text style={[ estiloForms.rotuloCaixasTexto ]}>Valor pago em salários</Text>

                        <TextInput placeholder='Exemplo: 126000.99' value={ valor } onChangeText={ (novo) => setValor(novo) } keyboardType='numeric' style={ estiloForms.caixasTexto }/>

                        <Text style={[ estiloForms.rotuloCaixasTexto ]}>Número de colaboradores</Text>

                        <TextInput placeholder='Exemplo: 500' value={ numero } onChangeText={ (novo) => setNumero(novo) } keyboardType='numeric' style={ estiloForms.caixasTexto }/>
                    </View>
                ) }
            </View>

            <View style={ estiloForms.viewPressionaveis }>
                <Pressable onPress={ () => adicionarDoc(categoriaSelec, mesSelecionado, setor, valor, numero) } style={[ estiloPrincipal.pressionaveisLaranjas, estiloPrincipal.margemVertical ]} >
                    <Text style={ estiloPrincipal.textoPressionaveis }>Adicionar registro</Text>
                </Pressable>

                <Pressable onPress={ limparCampos } style={[ estiloPrincipal.pressionaveisVerdes, estiloPrincipal.margemVertical ]} >
                    <Text style={ estiloPrincipal.textoPressionaveis }>Limpar dados</Text>
                </Pressable>
            </View>
        </ScrollView>
    )
}