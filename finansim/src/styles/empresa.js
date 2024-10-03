/* Folha de estilos focada na tela Empresa */

import { StyleSheet } from "react-native";

import { corDestaqueSecundaria } from "./principal";
/* Importando as cores definidas na folha de estilo principal */

export const estiloEmpresa = StyleSheet.create({
    nomeEmpresa: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10
    },

    nomeUsuario: {
        color: corDestaqueSecundaria,
        fontWeight: 'bold'
    },

    espacoEntreLinhas: {
        marginBottom: 10
    },
})