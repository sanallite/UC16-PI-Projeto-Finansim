/* Função que irá formatar número em valores monetários do Brasil. */

export const valorReais = new Intl.NumberFormat('pt-br', {
    style: 'currency',
    currency: 'BRL'
})