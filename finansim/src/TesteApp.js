/* Arquivo App.js usando para testar as bibliotecas do firebase e do async storage */

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Pressable, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import './initializeFirebase';
import { db } from './initializeFirebase';
import { collection, addDoc } from 'firebase/firestore';

export default function App() {
  const armazenar = async () => {
    try {
      await AsyncStorage.setItem('teste', 'item');
    }

    catch ( error ) {
      console.log('Resultado: '+error)
    }
  }

  const pegar = async () => {
    try {
      const valor = await AsyncStorage.getItem('teste');
      console.log(valor);
    }

    catch (erro) {
      console.log('Resultado:'+erro)
    }
  }

  const remover = async () => {
    try {
      await AsyncStorage.removeItem('teste');
      const valor = await AsyncStorage.getItem('teste');
      console.log(valor);
    }

    catch ( erro ) {
      console.log('Resultado: '+erro)
    }
  }

  const adicionarDoc = async () => {
    try {
      const docReferencia = await addDoc( collection(db, 'teste'), {
          texto: 'Olá firebase',
          dia: 20
      });
      /* A função addDoc vai primeiro pegar o banco de dados que está na variável db, que foi importada, e vai criar uma coleção com o nome 'teste' e nessa coleção criará um documento com dois campos, tanto a coleção quanto o documento foram criados com ids gerados automaticamente */

      console.log('Documento adicionado com o id: '+docReferencia.id);
    }

    catch ( erro ) {
      console.error('Erro ao adicionar documento no banco: ', erro)
    }
  }

  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>

      <Pressable onPress={ armazenar }>
        <Text>Armazenar</Text>
      </Pressable>

      <Pressable onPress={ pegar }>
        <Text>Pegar</Text>
      </Pressable>

      <Pressable onPress={ () => { Alert.alert('Oi') } }>
        <Text>Alerta</Text>
      </Pressable>

      <Pressable onPress={ remover }>
        <Text>Remover</Text>
      </Pressable>

      <Pressable onPress={ adicionarDoc }>
        <Text>Adicionar no banco</Text>
      </Pressable>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
