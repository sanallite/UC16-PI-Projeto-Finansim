import { StyleSheet } from "react-native";

export const corFundoPrimaria = 'rgb(244, 238, 199)';
export const corFundoSecundaria = 'rgb(254, 152, 1)';

export const estiloPrincipal = StyleSheet.create({
    fundo: {
        flex: 1,
        backgroundColor: corFundoPrimaria
    },

    stackHeader: {
        backgroundColor: corFundoPrimaria
    },

    fundoRelatorios: {
        flex: 1,
        backgroundColor: corFundoSecundaria
    },

    stackHeaderRelatorios: {
        backgroundColor: corFundoSecundaria
    }
})