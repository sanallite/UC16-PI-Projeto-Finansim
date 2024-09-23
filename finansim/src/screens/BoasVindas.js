import React from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function BoasVindas() {
    let logo = require('../assets/logo.png');

    const nav = useNavigation();

    return (
        <View>
            <View>
                <Image source={ logo } style={{ width: 225, height: 225 }} />
            </View>

            <View>
                <Text>Finansim</Text>
            </View>

            <View>
                <Text>Administre as finanças da sua empresa facilmente com a ajuda da Finansim, aqui você terá relatórios mensais de resultados e investimentos internos, além da sua folha de pagamentos.</Text>
            </View>

            <View>
                <Pressable onPress={ () => nav.navigate('Cadastro') }>
                    <Text>Cadastre-se agora</Text>
                </Pressable>

                <Pressable onPress={ () => nav.navigate('Entrada') }>
                    <Text>Entrar</Text>
                </Pressable>
            </View>
        </View>
    )
}