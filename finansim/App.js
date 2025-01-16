/* Projeto Integrador - Finansim */

import React, { useState, useEffect } from 'react';
import { StatusBar, ActivityIndicator, View } from 'react-native';
/* Componentes e hooks do React */

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
/* Bibliotecas do React Navigation */

import AsyncStorage from '@react-native-async-storage/async-storage';
/* Biblioteca de Armazenamento Assíncrono */

import './initializeFirebase';
import { getAuth } from 'firebase/auth';
/* Iniciando o Firebase e o importando o componente de autenticação */

import RotaEntrada from './src/routes/RotaEntrada';
import RotaPrincipal from './src/routes/RotaPrincipal';
/* Rotas de navegação de telas */

import { corDestaqueSecundaria, estiloPrincipal } from './src/styles/principal';
import { estiloBoasVindas } from './src/styles/boasvindas';
/* Estilização */

function App() {
  const [ rotaInicial, setRotaInicial ] = useState(null);
  /* Variável de estado para armazenar qual rota de navegação será a inicial, caso tenha um usuário autenticado ou não */

  const Pilha = createNativeStackNavigator();
  /* Instânciando a navegação por pilha */

  const verificarUsuario = async () => {
    try {
      const usuario = await AsyncStorage.getItem('usuario');
      const authFirebase = getAuth();
      console.log('Autenticação Firebase: ',authFirebase);

      if ( usuario && authFirebase ) {
        setRotaInicial('Rota Principal');
        
        console.log('Usuário autenticado: ', usuario )
      }

      else {
        setRotaInicial('Rota Entrada');
      }
    }
    
    catch (erro) {
      console.error('Erro ao verificar usuário no AsyncStorage: ', erro);
      setRotaInicial('Rota Entrada')
    }
  }
  /* Buscando no armazenamento assíncrono se tem um item que armazena os dados do usuário, e no Firebase os dados de autenticação e com base no resultado escolhendo a rota inicial. */

  useEffect( () => {
    verificarUsuario();
  }, [] );
  /* Usando o hook useEffect, que permite que componente seja sincronizado com um sistema externo para chamar a função que verifica a existência de um usuário enquanto o app roda. */

  if ( !rotaInicial ) {
    return (
      <View style={[ estiloPrincipal.fundo, estiloBoasVindas.alinhamentoCentral ]}>
        <ActivityIndicator size="large" color={ corDestaqueSecundaria } />
      </View>
    )
  }
  /* Se a rotaInicial não for definida, que é seu valor inicial, será exibido um componente que indica o carregamento do conteúdo. */

  return (
    <NavigationContainer >
      <StatusBar barStyle={ 'light-content' } backgroundColor={ 'black' } />
      {/* Definindo explicitamente uma cor e um estilo para a barra de status, pois os valores padrões do sistema não foram aplicados por algum motivo. */}

      <Pilha.Navigator initialRouteName={ rotaInicial }>
          <Pilha.Screen name='Rota Entrada' component={ RotaEntrada } options={{ headerShown: false }} />
          <Pilha.Screen name='Rota Principal' component={ RotaPrincipal } options={{ headerShown: false }} />
      </Pilha.Navigator>
    </NavigationContainer>
  )
  /* Contâiner de navegação com o componente que reconhece a barra de status e com o primeira rota de navegação do app, que contém duas outras rotas. */
}

export default App;