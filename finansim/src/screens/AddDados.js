import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';

import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AddDados() {
    const [ categoriaSelec, setCategoria ] = useState('');

    return (
        <View>
            <View>
                <Picker mode='dropdown' selectedValue={ categoriaSelec } onValueChange={ (nova) => setCategoria(nova) } >
                    <Picker.Item label='Categoria' value='' />
                    <Picker.Item label='Vendas' value='Vendas' />
                    <Picker.Item label='Compras' value='Compras' />
                </Picker>

                <Picker mode='dropdown'>
                    <Picker.Item label='Mês' value='' />
                    <Picker.Item label='Janeiro' value='' />
                    <Picker.Item label='Fevereiro' value='' />
                    <Picker.Item label='Março' value='' />
                    <Picker.Item label='Abril' value='' />
                    <Picker.Item label='Maio' value='' />
                    <Picker.Item label='Junho' value='' />
                    <Picker.Item label='Julho' value='' />
                    <Picker.Item label='Agosto' value='' />
                    <Picker.Item label='Setembro' value='' />
                    <Picker.Item label='Outubro' value='' />
                    <Picker.Item label='Novembro' value='' />
                    <Picker.Item label='Dezembro' value='' />
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