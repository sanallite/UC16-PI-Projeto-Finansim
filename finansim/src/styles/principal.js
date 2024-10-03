/* Folha de estilos principal do aplicativo, que são usados em todas as telas. */

import { StyleSheet } from "react-native";

export const corFundoPrimaria = 'rgb(244, 238, 199)';
export const corFundoSecundaria = 'rgb(254, 152, 1)';
export const corFundoTercearia = 'rgb(204, 218, 70)';
export const corDestaqueSecundaria = 'rgb(105, 124, 55)';
export const corBranca = 'white';
export const corCinzaClaro = 'rgb(101, 101, 101)';
export const corCinzaMaisClaro = 'rgb(230, 230, 230)';
/* Definindo as cores principais do app, com a cor de fundo secundária também podendo ser considerada a cor de destaque primária. */

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
        backgroundColor: corFundoSecundaria,
    },

    espacamentoHorizontal: {
        paddingHorizontal: 20
    },

    alinhamentoLinhaCentralizada: {
        alignItems: 'center'
    },

    margemVertical: {
        marginVertical: 10
    },

    pressionaveisVerdes: {
        paddingVertical: 15,
        paddingHorizontal: 20,
        backgroundColor: corDestaqueSecundaria,
        borderRadius: 6,
        alignItems: 'center'
    },

    pressionaveisLaranjas: {
        paddingVertical: 15,
        paddingHorizontal: 20,
        backgroundColor: corFundoSecundaria,
        borderRadius: 6,
        alignItems: 'center'
    },

    textoPressionaveis: {
        color: corBranca,
        fontWeight: 'bold'
    },

    textoCarregamento: {
        color: corBranca,
        textAlign: 'center'
    },

    linhaDoisItens: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },

    textos: {
        color: corCinzaClaro
    },

    alinhamentoTextoCentro: {
        textAlign: 'center'
    },

    flexibilidade: {
        flex: 1
    }
})