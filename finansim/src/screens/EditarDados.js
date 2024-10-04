/* Tela para editar os registros no banco de dados */

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, Alert, ScrollView } from 'react-native';
/* Componentes e Hooks do React */

import { useNavigation, useRoute } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
/* Componente de selecionador e funções de navegação */

import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../initializeFirebase';
/* Banco de dados configurado e funções para pegar, atualizar e excluir um documento no Firestore. */

import { estiloPrincipal } from '../styles/principal';
import { estiloForms } from '../styles/formularios';
import { estiloRelatorios } from '../styles/relatorios';
/* Folhas de estilo */

import { valorReais } from '../numberFormat';
/* Função para formatar números em valores monetários */

export default function EditarDados() {
    const nav = useNavigation();
    const rota = useRoute();
    /* Instânciando o uso da navegação de telas e o recebimento de parâmetros entre telas */

    const parametros = rota.params;

    const [ documento, setDocumento ] = useState(null);
    const [ iniciando, setInicializacao ] = useState(true);
    /* Variáveis de estado para armazenar o documento selecionado e o estado de carregamento da tela */

    const [ valorDigitado, setValor ] = useState('');
    const [ numeroDigitado, setNumero ] = useState('');
    const [ mesSelecionado, setMes ] = useState('');
    /* Variáveis de estado para armazenar os valores do formulário */

    let pickerAtivo;
    if ( parametros.categoria !== 'pagamentos' ) {
        pickerAtivo = true;
    }
    /* Variável que é usada para condicionar a exibição do selecionador de mẽs */

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
    /* Os textos que serão exibidos na tela são definidos conforme a categoria recebida por parâmetro. */

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
    /* Função assíncrona para pegar o documento pelo id recebido por parâmetro, na coleção que é a categoria recebida por parâmetro, no banco de dados configurado que foi importado. */

    useEffect( () => {
        pegarDocumento();
    }, []);
    /* Usando o hook useEffect, que permite que componente seja sincronizado com um sistema externo para chamar a função que pega o documento escolhido enquanto o app roda. */

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
        /* Pegando os valores recebidos por parâmetros e verificando se os campos estão vazios, se estiverem o valor dos atributos será o valor do documento pego, ou seja o valor no banco de dados não será alterado. */

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
        /* Atualizando os documentos com o campo mês */

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
        /* Atualizando os documentos em campo mês */
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
    /* Função assíncrona para remover o documento escolhido, com um alerta com confirmação */

    if ( iniciando ) {
        return (
            <View style={[ estiloPrincipal.fundo, estiloPrincipal.espacamentoHorizontal ]}>
                <Text>Carregando...</Text>
            </View>
        )
    }
    /* Estado de carregamento da tela, se for "true" será renderizado esse componente. */

    return (
        <ScrollView style={[ estiloPrincipal.espacamentoHorizontal, estiloPrincipal.fundo ]} contentContainerStyle={ estiloPrincipal.alinhamentoLinhaCentralizada } >
            <View style={[ estiloPrincipal.margemVertical ]}>
                <Text style={ estiloRelatorios.mes } >{ titulo }</Text>
            </View>

            <View style={[ estiloForms.fundo, { width: '100%' } ]}>
                <View style={[ estiloPrincipal.linhaDoisItens ]}>
                    <Text style={ estiloForms.rotuloCaixasTexto } >{ documento.setor }</Text>

                    { pickerAtivo && ( <Text style={ estiloForms.rotuloCaixasTexto } >{ documento.mes }</Text> )}
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
                    {/* Renderização condicional que depende da categoria do documento */}

                    <View style={ estiloPrincipal.linhaDoisItens }>
                        <Text style={ estiloForms.rotuloCaixasTexto }>{ textoValor }</Text>
                        <Text style={ estiloPrincipal.textos }>{ valorReais.format(documento.valor) }</Text>
                    </View>

                    <TextInput value={ valorDigitado } onChangeText={ (novo) => setValor(novo) } placeholder='Deixe em branco para não alterar' style={ estiloForms.caixasTexto } />
                    
                    <View style={ estiloPrincipal.linhaDoisItens }>
                        <Text style={ estiloForms.rotuloCaixasTexto }>{ textoNumero }</Text>
                        <Text style={ estiloPrincipal.textos }>{ documento.numero } </Text>
                    </View>

                    <TextInput value={ numeroDigitado } onChangeText={ (novo) => setNumero(novo) } placeholder='Deixe em branco para não alterar' style={ estiloForms.caixasTexto } />
                </View>
            </View>

            <View style={ estiloForms.viewPressionaveis }>
                <Pressable onPress={ () => atualizarDocumento(mesSelecionado, valorDigitado, numeroDigitado) } style={[ estiloPrincipal.pressionaveisLaranjas, estiloPrincipal.margemVertical ]} >
                {/* Quando for pressionado o documento será atualizado */}
                    
                    <Text style={ estiloPrincipal.textoPressionaveis }>Atualizar Registro</Text>
                </Pressable>

                <Pressable 
                    onPress={ () => ( Alert.alert('Remover Registro', 'Tem certeza que deseja removê-lo?', [{ onPress: removerDocumento, text: 'Sim' }, { text: 'Não' }]) ) }

                    style={[ estiloPrincipal.pressionaveisVerdes, estiloPrincipal.margemVertical ]}>

                    <Text style={ estiloPrincipal.textoPressionaveis }>Remover Registro</Text>
                </Pressable>
                {/* Quando for pressionado um alerta pedirá por confirmação do usuário e se ele apertar em "Sim" o documento será excluido do banco de dados */}
            </View>
        </ScrollView>
    )
}