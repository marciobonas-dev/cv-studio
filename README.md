# CV Studio — MVP 3 com tradução integral

Esta versão traduz os textos preenchidos no currículo ao selecionar Português, Inglês ou Espanhol.

## Importante

A tradução usa um backend seguro. GitHub Pages sozinho não executa a pasta `api`. Para a tradução funcionar, importe este repositório na Vercel e configure as variáveis de ambiente abaixo.

## Variáveis na Vercel

- `AZURE_TRANSLATOR_KEY`
- `AZURE_TRANSLATOR_REGION`
- `AZURE_TRANSLATOR_ENDPOINT` (opcional; padrão: `https://api.cognitive.microsofttranslator.com`)

Nunca coloque a chave do Azure no `app.js`, no `index.html` ou em qualquer arquivo público.

## Publicação

1. Envie todos os arquivos e a pasta `api` para o repositório.
2. Importe o repositório na Vercel.
3. Adicione as variáveis de ambiente.
4. Faça o deploy.

## O que é traduzido

- Título profissional
- Resumo profissional
- Curso e instituição
- Competências
- Idiomas
- Cargo, empresa, período e descrição de cada experiência
- Títulos fixos das seções

Nome, e-mail, telefone, localização e LinkedIn não são traduzidos.

## Tradução completa

A versão 3 permite traduzir os campos do currículo para português, inglês ou espanhol. A pessoa escolhe o idioma original ou usa a detecção automática e depois seleciona o idioma final.

A tradução utiliza a API pública MyMemory. Portanto, ao acionar a tradução, o conteúdo textual é enviado ao serviço externo e deve ser revisado antes da exportação. A API pública possui limites de uso.

## Melhorias visuais

- Interface com formas mais arredondadas e composição visual mais leve
- Seção explicando por que é importante manter o currículo atualizado
- Área de benefícios e propósito da ferramenta
- Controles de modelo, idioma, tradução e exportação agrupados
