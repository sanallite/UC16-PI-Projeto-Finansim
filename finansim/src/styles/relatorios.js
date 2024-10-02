import { StyleSheet } from "react-native";
import { corBranca, corCinzaClaro, corCinzaMaisClaro, corDestaqueSecundaria, corFundoTercearia } from "./principal";

export const estiloRelatorios = StyleSheet.create({
    textoDestaque: {
        color: corBranca,
        fontWeight: 'bold',
        fontSize: 18
    },

    scrollViewRelatorios: {
        flex: 1
    },

    relatorios: {
        marginVertical: 20,
        marginRight: 20,
        padding: 15,
        backgroundColor: corBranca,
        width: 300,
        borderColor: corFundoTercearia,
        borderWidth: 1,
        borderRadius: 10
    },

    mes: {
        fontWeight: 'bold',
        color: corDestaqueSecundaria,
        fontSize: 18,
    },

    setor: {
        fontWeight: 'bold',
        color: corCinzaClaro
    },

    bordaItens: {
        borderBottomWidth: 2,
        borderBottomColor: corCinzaMaisClaro
    },

    setorDestaque: {
        borderColor: corFundoTercearia,
        borderWidth: 1,
        borderRadius: 6,
        backgroundColor: corDestaqueSecundaria,
        paddingVertical: 10,
        paddingHorizontal: 15
    }
})