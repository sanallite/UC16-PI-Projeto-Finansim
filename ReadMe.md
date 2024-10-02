# Projeto Integrador Desenvolvimento Móvel - Finansim

## Objetivo da aplicação:

Facilitar o controle de gastos e resultados de uma empresa, que irá cadastrar seus setores, registrar seus números e ver relatórios sobre o estado financeiro atual da empresa, com o foco em três categorias: Vendas, Compras e Pagamentos.

## Descrição Técnica:

Aplicativo Expo React Native que usa JavaScript como sua linguagem principal e os serviços de banco de dados e autenticação do Firebase, podendo fazer operações de criação, leitura em tempo real, edição e exclusão de documentos no Firestore e criação, entrada e saída de usuários pela autenticação.

Feito como projeto final do meu curso técnico de Informática para Internet.

>[!IMPORTANT]
> Consulte o arquivo ```requirements.txt``` para saber as bibliotecas e dependencias usadas.
>
> Não é possível rodar o app pela web, pois ele usa funções nativas do sistema, como a persistência de dados do React Native na inicialização do autenticador do Firebase e o componente Alert do React Native.

## Estado atual:

Resumo: App quase completamente finalizado, ainda tem alguns bugs. Do projeto falta terminar a documentação e revisar e comentar o código.

Documentação e protótipo do Figma inicialmente prontos, sendo necessário atualizar a documentação para refletir o estado atual do app e colocá-la em linguagem técnica.

Navegação de telas por stack e tab navigation

Passagem de parâmetros entre telas e componentes próprios

Autenticação por email e senha pelo Firebase

CRUD completo pelo Firebase Firestore, com a exibição condicionada para usuários autenticados

Conexão com a API Via CEP para complementar o cadastro

Estilização total das telas

Última atualização da documentação: 22/09

## O que falta implementar:

Construir uma versão de produção

>[!WARNING]
> Dois bugs foram identicados atualmente:
>
> As vezes na hora de criar um registro no banco ou exibir uma tela de relatórios surge um erro dizendo que strings tem que ser exibidas dentro de um componente text, mesmo não tendo uma string visivelmente solta no código.
>
> Se o usuário encerrar sua sessão e entrar com outra conta, ainda poderá ver os dados da sessão anterior nas telas dos relatórios, inclusive podendo alterá-los, com isso provavelmente sendo um problema de cache.

## Protótipo no Figma
[Figma](https://www.figma.com/design/s2pnA0seBIVWfZWlOaJChV/App-de-Finan%C3%A7as?node-id=0-1&t=19tIYorPdagTO9BV-1)
