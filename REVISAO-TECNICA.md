# Correção estrutural do formulário — 21/10/2026

## Diagnóstico
- O HTML da página é renderizado no servidor, mas os eventos dos botões da pré-seleção dependiam da hidratação do React no navegador.
- Quando essa inicialização falha, a primeira etapa continua visível, porém `Continuar`, `Voltar` e as escolhas não respondem. A validação já existia dentro do bundle, então alterar apenas as mensagens não resolvia o problema estrutural.
- A rota original e o endpoint Google Apps Script foram identificados no código compilado e preservados.

## O que foi mudado
1. `api/index.mjs` passa a entregar a página com um controlador de formulário nativo, removendo a dependência de hidratação do React para essa tela. A estrutura SSR restante e o CSS do site são preservados.
2. `client/form-controller-v2.js` implementa as cinco etapas, botões de opção, navegação, validações por etapa, foco/rolagem até o primeiro erro, resumo, estados de envio e mensagens de sucesso/falha.
3. A chamada POST mantém exatamente a URL Google Apps Script existente e envia os mesmos campos (`nome`, `idade`, `sexo`, `peso`, `altura`, `objetivo`, `mudanca`, `treina`, `experiencia`, `dias`, `alimentacao`, `rotina`, `dificuldade`, `whatsapp`).
4. Links internos passam a rolar até as seções sem inserir fragmentos na barra de endereço. O fragmento recebido `#pre-selecao` é removido cedo no carregamento para que a página abra no topo.
5. O HTML é entregue sem cache para que a nova lógica de entrada não fique presa numa resposta antiga.

## Verificações realizadas
- `node --check` sem erros nos arquivos de servidor e controlador.
- Requisição local da página retorna HTTP 200 e inclui o controlador novo.
- O HTML entregue não contém `id="pre-selecao"`, `href="#pre-selecao"` nem o script de entrada React.
- O endpoint da integração está preservado no controlador.

## Limites
- O pacote corrigido foi testado localmente quanto à geração da resposta e sintaxe. Não tenho acesso para publicar diretamente no projeto Vercel do proprietário.
- A gravação final no Google Sheets precisa ser confirmada após o deploy enviando uma resposta de teste. O endpoint não foi trocado nem reconfigurado.
