/* Tela de cadastro de usuários */

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, Alert, ActivityIndicator, ScrollView } from 'react-native';
/* Componentes e hooks do React */

import { useNavigation } from '@react-navigation/native';
/* Função para usar os comandos de navegação de tela */

import AsyncStorage from '@react-native-async-storage/async-storage';
/* Biblioteca de armazenamento assíncrono */

import { createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../../initializeFirebase';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../initializeFirebase';
/* Banco de dados e autenticação configurados e funções do Firebase para criar usuários autenticados e adicionar documentos no Firestore */

import { estiloForms } from '../styles/formularios';
import { corCinzaClaro, estiloPrincipal } from '../styles/principal';
import { estiloBoasVindas } from '../styles/boasvindas';
import { corFundoTercearia } from '../styles/principal';
/* Folhas de estilo */

export default function Cadastro() {
    const nav = useNavigation();
    /* Instânciando a função de uso da navegação de telas */

    const [ email_digitado, setEmail ] = useState('');
    const [ senha_digitada, setSenha ] = useState('');
    const [ senha_confirmada, setSenhaConf ] = useState('');
    const [ nome_empresa, setEmpresa ] = useState('');
    const [ nome_usuario, setNome ] = useState('');
    const [ cep_digitado, setCEP ] = useState('');
    const [ numero_estabelecimento, setNumeroEst ] = useState('');
    const [ dados_api, setApiData ] = useState({ cep: '', rua: '', bairro: '', cidade: '', estado: '' });
    /* Variáveis de estado para armazenar os valores do formulário */

    const [ carregando, setCarregando ] = useState(false);
    const [ erros, setErros ] = useState(null);
    /* Variáveis de estado para definir se a tela estará em estado de carregamento e armazenar uma mensagem de erro que é exibida no formulário */

    useEffect( () => {
        const delayDebounceFn = setTimeout( () => {
            if ( cep_digitado.length === 8 ) {
                pegarCEP();
            }

            else if ( cep_digitado.length > 8 ){
                setErros('CEP digitado incorretamente')
            }

            else if ( cep_digitado.length < 8 ) {
                setErros(null);
            }
        }, 500 );

        return () => clearTimeout(delayDebounceFn);
    }, [cep_digitado] );
    /* Usando o hook useEffect, que permite que componente seja sincronizado com um sistema externo para chamar a função arrow que tem uma espera de tempo conforme o usuário digitar no campo "cep", somente se o total de números for 8 será chamada a função que pega os dados daquele cep por uma API externa, se for mais um erro será exibido no formulário e se for menos nenhum erro será exibido. Se o usuário digitar antes da contagem acabar a contagem será reiniciada pelo clearTimeout */

    const pegarCEP = async () => {
        setCarregando(true);
        setErros(null);

        try {
            const resposta = await fetch(`https://viacep.com.br/ws/${cep_digitado}/json/`);

            const dados = await resposta.json();

            if ( dados.erro === "true" ) {
                setErros('Endereço não encontrado, verifique o CEP digitado e tente novamente.');
            }
            /* Se a resposta tiver um atributo erro com o valor "true". será exibido um erro no formulário. caso contrário os valores referentes a aquele cep serão armazenados na variável de estado. */

            else {
                setApiData({
                    cep: dados.cep,
                    rua: dados.logradouro,
                    bairro: dados.bairro,
                    cidade: dados.localidade,
                    estado: dados.estado
                })
            }

            console.log(dados_api)
        }

        catch (erro) {
            setErros('Erro ao encontrar endereço, verifique o CEP digitado e tente novamente.');

            console.error('Erro ao encontrar CEP:', erro);
        }

        finally {
            setCarregando(false);
        }
        /* Se não tiver nenhum erro em pegar os dados, o estado de carregamento será alterado novamente para falso. */
    }
    /* Função assíncrona que acessa a API Via CEP para preencher campos do formulário conforme o CEP digitado. */

    const cadastro = async () => {
        if ( nome_empresa.trim() && nome_usuario.trim() ) {
            if ( senha_digitada === senha_confirmada ) {
                try {
                    const criarUsuario = await createUserWithEmailAndPassword(auth, email_digitado, senha_confirmada);
                    const usuario = criarUsuario.user;
                    /* Criando o usuário utilizando autenticação por email e senha e armazenando todos os dados na variável "usuario". */

                    const docRef = await addDoc( collection(db, 'empresas'), {
                        nomeEmpresa: nome_empresa,
                        nomeUsuario: nome_usuario,
                        usuario: usuario.uid,
                        cep: dados_api.cep,
                        rua: dados_api.rua,
                        numeroEst: numero_estabelecimento,
                        bairro: dados_api.bairro,
                        cidade: dados_api.cidade,
                        estado: dados_api.estado

                    } );
                    /* Adicionando um documento na coleção empresas, com os dados digitados no formulário e o uid do usuário que acabou de ser criado na autenticação */

                    const dadosUsuario = {
                        uid: usuario.uid,
                        email: usuario.email,
                        docEmpresa: docRef.id,
                        nomeEmpresa: nome_empresa
                    }
                    /* Objeto que contém os dados que serão salvos no armazenamento assíncrono na linha abaixo. */

                    await AsyncStorage.setItem('usuario', JSON.stringify(dadosUsuario));
                    /* Adicionando o item, que tem que ser uma string, por isso é transformado em uma. */

                    console.log('Usuário cadastrado no Firebase Auth: '+JSON.stringify(usuario));
                    
                    console.log('Usuário criado no armazenamento assíncrono:', JSON.stringify(dadosUsuario) );

                    console.log('Empresa adicionada no banco de dados com o id:', docRef.id);

                    try {
                        await AsyncStorage.removeItem('usuario');
                        await signOut(auth);
                        /* Removendo os dados após o cadastro, para que o usuário não entre diretamente. */

                        setCEP('');
                        setEmail('');
                        setNome('');
                        setSenha('');
                        setSenhaConf('');
                        setEmpresa('');
                        setNumeroEst('');
                        setApiData({ cep: '', rua: '', bairro: '', cidade: '', estado: '' });
                        /* Limpando as caixas de texto, exceto a do CEP por algum motivo... */

                        console.log('Dados removidos', auth);
                        /* Mostrando que não tem nenhum usuário ativo na autenticação */

                        Alert.alert(
                            'Cadastro',
                            'Usuário cadastrado com sucesso! Entre agora para começar a usar o app.',
                            [ {text: 'Continuar', onPress: () => nav.navigate('Entrada') }]
                        )
                        /* Se tudo ocorrer corretamente será exibido um alerta que faz a navegação para a tela de entrada. */
                    }

                    catch (erro) {
                        console.error('Erro na remoção dos dados após o cadastro', erro);

                        Alert.alert(
                            'Erro',
                            erro.message
                        )
                    }
                }

                catch (erro) {
                    console.error('Erro ao criar usuário: ', erro.message);
                    Alert.alert('Erro ao criar usuário', erro.message)
                }
            }
            /* Segundo é verificado se a senha digitada coincide com a senha digitida para confirmação */

            else {
                Alert.alert('Erro', 'As senhas não coincidem, tente novamente.')
            }
        }
        /* Primeiro é verificado se o nome do usuário e da empresa não estão vazios. */

        else {
            Alert.alert('Erro', 'Preencha todos os campos e tente novamente.');
        }
    }
    /* Função assíncrona para adicionar o usuário na autenticação e a empresa no banco de dados */

    return (
        <ScrollView style={ estiloPrincipal.fundo } contentContainerStyle={[ estiloBoasVindas.alinhamentoCentral ]}>
            <View style={ estiloForms.fundo }>
                <Text style={ estiloForms.rotuloCaixasTexto }>Nome da Empresa</Text>

                <TextInput value={ nome_empresa } onChangeText={ (novo_valor) => setEmpresa(novo_valor) } style={[ estiloForms.caixasTexto ]} />

                <Text style={ estiloForms.rotuloCaixasTexto }>Nome do Usuário</Text>

                <TextInput value={ nome_usuario } onChangeText={ (novo_valor) => setNome(novo_valor) } style={[ estiloForms.caixasTexto ]} />

                <Text style={ estiloForms.rotuloCaixasTexto }>Endereço da Empresa</Text>

                <TextInput placeholder='CEP' keyboardType='numeric' onChangeText={ (novo_valor) => setCEP(novo_valor) } style={[ estiloForms.caixasTexto ]} />

                { carregando && <ActivityIndicator color= { corFundoTercearia } /> }
                { erros && <Text style={{ color: corCinzaClaro }}>{erros}</Text> }
                {/* Renderização condicional do indicador de atividade e das mensagens de erro. */}

                <TextInput placeholder='Rua' editable={ false } value={ dados_api.rua } style={[ estiloForms.caixasTexto ]} />

                <TextInput placeholder='Número' keyboardType='numeric' value={ numero_estabelecimento } onChangeText={ (novo_valor) => setNumeroEst(novo_valor) } style={[ estiloForms.caixasTexto ]} />

                <TextInput placeholder='Bairro' editable={ false } value={ dados_api.bairro } style={[ estiloForms.caixasTexto ]}/>

                <TextInput placeholder='Cidade' editable={ false } value={ dados_api.cidade } style={[ estiloForms.caixasTexto ]} />

                <TextInput placeholder='Estado' editable={ false } value={ dados_api.estado } style={[ estiloForms.caixasTexto ]} />

                <Text style={ estiloForms.rotuloCaixasTexto }>E-mail</Text>

                <TextInput keyboardType='email-address' value={ email_digitado } onChangeText={ (novo_valor) => setEmail(novo_valor) } style={[ estiloForms.caixasTexto ]} />

                <Text style={ estiloForms.rotuloCaixasTexto }>Senha</Text>

                <TextInput secureTextEntry value={ senha_digitada } onChangeText={ (novo_valor) => setSenha(novo_valor) } style={[ estiloForms.caixasTexto ]} />

                <Text style={ estiloForms.rotuloCaixasTexto }>Confirme a Senha</Text>

                <TextInput secureTextEntry value={ senha_confirmada } onChangeText={ (novo_valor) => setSenhaConf(novo_valor) } style={[ estiloForms.caixasTexto ]} />
            </View>

            <View style={[ estiloForms.viewPressionaveis ]}>
                <Pressable onPress={ cadastro } style={[ estiloPrincipal.margemVertical, estiloPrincipal.pressionaveisLaranjas ]}>
                    <Text style={ estiloPrincipal.textoPressionaveis }>Cadastrar</Text>
                </Pressable>
                {/* Quando o componente for pressionado será chamada a função de cadastro, enviando os dados armazenados nas variáveis de estado. */}

                <Pressable onPress={ () => nav.navigate('Entrada') } style={[ estiloPrincipal.pressionaveisVerdes, estiloPrincipal.margemVertical ]} >
                    <Text style={ estiloPrincipal.textoPressionaveis }>Já é cadastrado? Entre</Text>
                </Pressable>
            </View>
        </ScrollView>
    )
}