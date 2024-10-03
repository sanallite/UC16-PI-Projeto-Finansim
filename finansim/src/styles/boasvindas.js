/* Folha de estilos focada na tela Boas Vindas */

import { StyleSheet } from "react-native";

import { corFundoTercearia } from "./principal";
/* Importando as cores definidas na folha de estilos principal */

export const estiloBoasVindas = StyleSheet.create({
    viewTitulo: {
        paddingTop: 10,
        paddingBottom: 5
    },

    titulo: {
        fontWeight: 'bold',
        fontSize: 20
    },

    alinhamentoCentral: {
        justifyContent: 'center',
        alignItems: 'center'
    },

    logo: {
        width: 180,
        height: 180,
        borderRadius: 25
    },

    viewDescricao: {
        paddingTop: 5,
        paddingBottom: 15
    },

    descricao: {
        textAlign: 'center',
    },

    fundoPressionaveis: {
        backgroundColor: corFundoTercearia,
        width: '85%',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30,
        borderRadius: 15
    },

    pressionaveis: {
        width: '80%',
        alignItems: 'center',
        marginVertical: 10
    }
})