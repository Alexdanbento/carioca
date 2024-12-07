# Sistema de Orçamentos

Sistema web para processamento e comparação de orçamentos.

## Funcionalidades

- Importação de catálogo base
- Processamento de orçamentos
- Comparação automática de produtos
- Exportação de resultados
- Interface responsiva

## Instalação

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Construir para produção
npm run build
```

## Uso

1. Importe o catálogo base (.xlsx)
2. Importe o arquivo de orçamento (.xlsx)
3. Verifique os resultados
4. Exporte o arquivo processado

## Deploy

Este projeto está configurado para deploy no GitHub Pages.

1. Fork este repositório
2. Ative GitHub Pages nas configurações do repositório
3. Configure a branch de deploy (geralmente `gh-pages`)
4. Execute `npm run build` e faça commit das alterações

## Tecnologias

- React
- Vite
- TailwindCSS
- XLSX
