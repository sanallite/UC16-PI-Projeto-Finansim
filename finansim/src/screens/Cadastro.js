import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../initializeFirebase';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../initializeFirebase';

export default function Cadastro() {
    const nav = useNavigation();

    const [ email_digitado, setEmail ] = useState('');
    const [ senha_digitada, setSenha ] = useState('');
    const [ senha_confirmada, setSenhaConf ] = useState('');
    const [ nome_empresa, setEmpresa ] = useState('');
    const [ nome_usuario, setNome ] = useState('');
    const [ cep_digitado, setCEP ] = useState('');
    const [ numero_estabelecimento, setNumeroEst ] = useState('');
    const [ dados_api, setApiData ] = useState({ cep: '', rua: '', bairro: '', cidade: '', estado: '' });

    const [ carregando, setCarregando ] = useState(false);
    const [ erros, setErros ] = useState(null);

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

    const pegarCEP = async () => {
        setCarregando(true);
        setErros(null);

        try {
            const resposta = await fetch(`https://viacep.com.br/ws/${cep_digitado}/json/`);

            const dados = await resposta.json();

            if ( dados.erro === "true" ) {
                setErros('Erro ao encontrar endereço, verifique o CEP digitado e tente novamente.');
            }

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
    }

    const cadastro = async (nome_empresa, nome_usuario, email, senha, senha_confirmada) => {
        if ( nome_empresa.trim() && nome_usuario.trim() ) {
            if ( senha === senha_confirmada ) {
                try {
                    const criarUsuario = await createUserWithEmailAndPassword(auth, email, senha);
                    const usuario = criarUsuario.user;

                    const dadosUsuario = {
                        uid: usuario.uid,
                        email: usuario.email,
                        nomeEmpresa: nome_empresa,
                        nomeUsuario: nome_usuario,
                        cep: dados_api.cep,
                        rua: dados_api.rua,
                        numeroEst: numero_estabelecimento,
                        bairro: dados_api.bairro,
                        cidade: dados_api.cidade,
                        estado: dados_api.estado
                    }

                    await AsyncStorage.setItem('usuario', JSON.stringify(dadosUsuario));

                    const docRef = await addDoc( collection(db, 'empresas'), {
                        nomeEmpresa: nome_empresa,
                        nomeUsuario: nome_usuario,
                        idUsuario: usuario.uid,
                        cep: dados_api.cep,
                        rua: dados_api.rua,
                        numeroEst: numero_estabelecimento,
                        bairro: dados_api.bairro,
                        cidade: dados_api.cidade,
                        estado: dados_api.estado

                    } );

                    console.log( 'Usuário cadastrado no Firebase Auth: '+JSON.stringify(usuario));
                    
                    console.log('Usuário criado no armazenamento assíncrono:', JSON.stringify(dadosUsuario) );

                    console.log('Empresa adicionada no banco de dados com o id:', docRef.id)

                    Alert.alert(
                        'Cadastro',
                        'Usuário cadastrado com sucesso!',
                        [ {text: 'Continuar', onPress: () => nav.navigate('Rota Principal') }]
                    )
                }

                catch (erro) {
                    console.error('Erro ao criar usuário: ', erro.message);
                    Alert.alert('Erro ao criar usuário', 'Verifique os dados e tente novamente')
                }
            }

            else {
                Alert.alert('Erro', 'As senhas não coincidem, tente novamente.')
            }
        }

        else {
            Alert.alert('Erro', 'Preencha todos os campos e tente novamente.');
        }
    }

    return (
        <View>
            <View>
                <Text>Nome da Empresa</Text>
                <TextInput value={ nome_empresa } onChangeText={ (novo_valor) => setEmpresa(novo_valor) } />

                <Text>Nome do Usuário</Text>
                <TextInput value={ nome_usuario } onChangeText={ (novo_valor) => setNome(novo_valor) } />

                <Text>Endereço da Empresa</Text>
                <TextInput placeholder='CEP' keyboardType='numeric' onChangeText={ (novo_valor) => setCEP(novo_valor) } />

                { carregando && <ActivityIndicator /> }

                { erros && <Text>{erros}</Text> }

                <TextInput placeholder='Rua' editable={ false } value={ dados_api.rua } />

                <TextInput placeholder='Número' keyboardType='numeric' value={ numero_estabelecimento } onChangeText={ (novo_valor) => setNumeroEst(novo_valor) } />

                <TextInput placeholder='Bairro' editable={ false } value={ dados_api.bairro }/>

                <TextInput placeholder='Cidade' editable={ false } value={ dados_api.cidade } />

                <TextInput placeholder='Estado' editable={ false } value={ dados_api.estado } />

                <Text>E-mail</Text>
                <TextInput keyboardType='email-address' value={ email_digitado } onChangeText={ (novo_valor) => setEmail(novo_valor) } />

                <Text>Senha</Text>
                <TextInput secureTextEntry value={ senha_digitada } onChangeText={ (novo_valor) => setSenha(novo_valor) } />

                <Text>Confirme a Senha</Text>
                <TextInput secureTextEntry value={ senha_confirmada } onChangeText={ (novo_valor) => setSenhaConf(novo_valor) } />
            </View>

            <View>
                <Pressable onPress={ () => cadastro(nome_empresa, nome_usuario, email_digitado, senha_digitada, senha_confirmada) }>
                    <Text>Cadastrar</Text>
                </Pressable>

                <Pressable onPress={ () => nav.navigate('Entrada') } >
                    <Text>Já é cadastrado? Entre</Text>
                </Pressable>
            </View>
        </View>
    )
}