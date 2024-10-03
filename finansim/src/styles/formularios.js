/* Folha de estilos focada nos componentes que contém formulários */

import { StyleSheet } from "react-native";

import { corBranca } from "./principal";
import { corFundoTercearia } from "./principal";
import { corCinzaClaro } from "./principal";
/* Importando as cores definidas na folha de estilo principal */

export const estiloForms = StyleSheet.create({
    fundo: {
        backgroundColor: corBranca,
        width: '90%',
        borderRadius: 10,
        paddingVertical: 30,
        paddingHorizontal: 20,
        borderColor: corFundoTercearia,
        borderWidth: 1
    },

    caixasTexto: {
        borderColor: corFundoTercearia,
        borderWidth: 1,
        borderRadius: 6,
        padding: 8,
        marginVertical: 10,
        color: corCinzaClaro
    },

    rotuloCaixasTexto: {
        color: corCinzaClaro,
        fontWeight: 'bold',
        fontSize: 16
    },

    viewPressionaveis: {
        padding: 20
    }
})