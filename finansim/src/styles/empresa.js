import { StyleSheet } from "react-native";
import { corCinzaClaro, corDestaqueSecundaria, corFundoSecundaria } from "./principal";

export const estiloEmpresa = StyleSheet.create({
    nomeEmpresa: {
        fontSize: 20,
        fontWeight: 'bold',
        /* color: corFundoSecundaria, */
        marginBottom: 10
    },

    nomeUsuario: {
        color: corDestaqueSecundaria,
        fontWeight: 'bold'
    },

    espacoEntreLinhas: {
        marginBottom: 10
    },

    textos: {
        color: corCinzaClaro
    }
})