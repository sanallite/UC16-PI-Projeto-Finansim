# Projeto Integrador Desenvolvimento Móvel - Finansim

## Objetivo da aplicação:

Facilitar o controle de gastos e resultados de uma empresa, que irá cadastrar seus setores, registrar seus números e ver relatórios sobre o estado financeiro atual da empresa, com o foco em três categorias: Vendas, Compras e Pagamentos.

## Ícone:
![screenshot](logo.png)

## Capturas de tela:
<img src="tela_boas_vindas.png" width="32%">  <img src="tela_empresa.png" width="32%">  <img src="tela_compras.png" width="32%">

## Descrição Técnica:

Aplicativo Expo React Native para a plataforma Android que usa JavaScript como sua linguagem principal e os serviços de banco de dados e autenticação do Firebase, podendo fazer operações de criação, leitura em tempo real, edição e exclusão de documentos no Firestore e criação, entrada e saída de usuários pela autenticação.

Feito como projeto final do meu curso técnico de Informática para Internet no Senac em 2024, com partes da documentação não sendo relevantes fora desse contexto.

Esse aplicativo está considerado completo para seu escopo atual, sem atualizações previstas após a 1.1.0, mas talvez eu retorne pra ele no futuro.

>[!IMPORTANT]
> Não é possível rodar o app pela web, pois ele usa funções nativas do sistema, como a persistência de dados do React Native na inicialização do autenticador do Firebase e o componente Alert do React Native.
>
> Esse aplicativo não funciona offline.
>
> Última atualização da documentação: 17/01/2025

## Versão 1.0.0 (Apresentada no curso)

Resumo: App quase completamente finalizado, ainda tem alguns bugs. Do projeto falta terminar a documentação e revisar e comentar o código.

Documentação e protótipo do Figma inicialmente prontos, sendo necessário atualizar a documentação para refletir o estado atual do app e colocá-la em linguagem técnica.

Navegação de telas por stack e tab navigation

Passagem de parâmetros entre telas e componentes próprios

Autenticação por email e senha pelo Firebase

CRUD completo pelo Firebase Firestore, com a exibição condicionada para usuários autenticados

Conexão com a API Via CEP para complementar o cadastro

Estilização total das telas

## Versão 1.0.1 (Feita após o término do curso)
Na tela da empresa os dados de endereço são pegos do banco de dados e não mais do armazenamento assíncrono.

Após ser feito um cadastro, o usuário é levado para tela de entrada, não mais para os relatórios.

Após ser feita a entrada ou a saída da sessão, a navegação é reinicializada, o que impede o usuário de voltar as telas exibidas anteriormente.

Correção do bug em que os dados da empresa do usuário anterior continuavam a ser exibidos se um usuário saísse da sessão e imediatamente entrasse em outra, agora os dados atuais da empresa são pegos cada vez que o componente for renderizado.

## Versão 1.1.0 (Janeiro de 2025)
Atualização para o SDK 52 do Expo, com o React Native 0.76.

Correção dos problemas de renderização nos componentes Vendas, Compras e Pagamentos, colocando um valor padrão para ser renderizado, utilizando optional chaining e tirando o uso de renderização condicional.

As consultas de soma e do documento com o maior número no campo "valor" agora são feitos em tempo real, com o onSnapshot.

As somas agora são feitas pelo método reduce do JavaScript, não mais através da consulta de soma do Cloud Firestore.

Foram definidas propriedades de estilo e cor de fundo da barra de status, para corrigir o bug da barra completamente branca, mas não descobri o que causou isso.

Indicadores de atividade para telas de cadastro e entrada de usuários e adição e edição dos registros.

## Protótipo no Figma
[Figma](https://www.figma.com/design/s2pnA0seBIVWfZWlOaJChV/App-de-Finan%C3%A7as?node-id=0-1&t=19tIYorPdagTO9BV-1)

<!-- ## Link de Download da Versão Preview
Expirado
-->

## Executando uma build de desenvolvimento

1. Para clonar o repositório clique no botão ```fork``` ou ```code``` e siga as instruções na tela.

2. Instale, caso já não tenha feito o [Node.js (LTS) ^20.18.0](https://nodejs.org/pt) que também inclui o npm (Node Package Manager).

3. Apague o arquivo ```eas.json``` e o objeto ```"eas"``` dentro do objeto ```"extra"``` no arquivo ```app.json```. Eles fazem referência ao projeto em outra conta do Expo.

4. Instale globalmente o [eas-cli](https://docs.expo.dev/get-started/set-up-your-environment/?platform=android&device=physical&mode=development-build) seguindo as instruções para fazer login ou criar uma conta no Expo Application Services, apenas configurando um projeto seu sem fazer uma build de Desenvolvimento ainda.

5. Na pasta do projeto, utilize o comando ```npm install``` para instalar todas as dependências do projeto, que estão listadas no arquivo ```package.json```.

6. Siga as instruções da [documentação do Expo](https://docs.expo.dev/get-started/set-up-your-environment/?platform=android&device=physical&mode=development-build) para configurar um ambiente de desenvolvimento Android.
Você pode instalar a build em um dispositivo físico ou no emulador de dispositivo do Android Studio, o Virtual Device.

7. Inicie um servidor de desenvolvimento para começar a rodar o projeto com ```npx expo start```

## License
    Finansim, Expo React Native app project using Firebase tools.
    Copyright (C) 2024, Márcio Rodriguês Teodoro

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, using version 3 of the License.
    
    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
