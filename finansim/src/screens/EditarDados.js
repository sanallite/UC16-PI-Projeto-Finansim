import React, { useEffect } from 'react';

import { View, Text, TextInput, Pressable } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../initializeFirebase';

export default function EditarDados() {
    const nav = useNavigation();
    const rota = useRoute();
    const parametros = rota.params;
    const idDoc = parametros.id;

    const pegarDocumento = async () => {
        const docReferencia = doc(db, parametros.categoria, parametros.id);
        const docSnap = await getDoc(docReferencia);

        if ( docSnap.exists() ) {
            const documento = docSnap.data();
            console.log('Documento encontrado:', docSnap.data);
        }

        else {
            console.error('Nenhum documento com esse id encontrado');
        }
    }

    useEffect( () => {
        pegarDocumento();
    }, []);

    return (
        <View>
            <Text></Text>
        </View>
    )
}