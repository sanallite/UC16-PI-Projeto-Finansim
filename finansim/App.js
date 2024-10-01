/* Projeto Integrador - Finansim */

import React, { useState, useEffect } from 'react';
import { StatusBar, ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AsyncStorage from '@react-native-async-storage/async-storage';

import './initializeFirebase';
import { getAuth } from 'firebase/auth';

import RotaEntrada from './src/routes/RotaEntrada';
import RotaPrincipal from './src/routes/RotaPrincipal';
import { corDestaqueSecundaria, estiloPrincipal } from './src/styles/principal';
import { estiloBoasVindas } from './src/styles/boasvindas';

function App() {
  const [ rotaInicial, setRotaInicial ] = useState(null);
  const Pilha = createNativeStackNavigator();

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

  useEffect( () => {
    verificarUsuario();
  }, [] );

  if ( !rotaInicial ) {
    return (
      <View style={[ estiloPrincipal.fundo, estiloBoasVindas.alinhamentoCentral ]}>
        <ActivityIndicator size="large" color={ corDestaqueSecundaria } />
      </View>
    )
  }

  return (
    <NavigationContainer>
      <StatusBar />

      <Pilha.Navigator initialRouteName={ rotaInicial }>
          <Pilha.Screen name='Rota Entrada' component={ RotaEntrada } options={{ headerShown: false }} />
          <Pilha.Screen name='Rota Principal' component={ RotaPrincipal } options={{ headerShown: false }} />
      </Pilha.Navigator>
    </NavigationContainer>
  )
}

export default App;