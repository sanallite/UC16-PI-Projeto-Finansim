import React from 'react';
import { View, Text, TextInput, Pressable, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';

import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AddDados() {
    return (
        <View>
            <View>
                <Picker>
                    <Picker.Item label='Categoria' value='' />
                    <Picker.Item label='Vendas' value='Vendas' />
                </Picker>

                <Text>Setor</Text>
                <TextInput />

                <Text>Resultados ou valores investidos</Text>
                <TextInput placeholder='Digite apenas números' />

                <Text>Número de vendas</Text>
                <TextInput placeholder='Digite apenas números' />
            </View>

            <View>
                <Pressable>
                    <Text>Adicionar registro</Text>
                </Pressable>

                <Pressable>
                    <Text>Limpar dados</Text>
                </Pressable>
            </View>
        </View>
    )
}