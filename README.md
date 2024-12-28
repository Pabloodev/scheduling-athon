# Reschedule Athon Documentation


### Description

**Reschedule Athon** é uma aplicação web criada com o objetivo de resolver um problema do meu setor, neste caso trabalhamos com ordens de serviço, no final do dia precisamos analisar cliente por cliente para verificar qual faltou, sabendo que é uma quantidade enorme de clientes, queria automatizar isso.

Isso permite:

- Importar um arquivo XLS ou XLSX.

- Filtrar OS de acordo com regiões ou status específico.

- Exibir e copiar informações formatadas para a área de tranferência.

Esse projeto é voltado para os meus colegas de trabalho que utilizam para realizar o reagendamento de OS de forma mais simples e prática.

### Funcionalidades

- Upload de Arquivos Excel: Suporta arquivos .xlsx e .xls.
Filtro por Região: Permite selecionar e visualizar dados de "SBC", "GRAJAÚ" ou "FRANCO".

- Visualização de Dados: Exibe os dados filtrados em uma lista com cores diferenciadas para cada diagnóstico.
Cópia para Área de Transferência: Formata e copia os dados para uso externo.

- Mensagens Dinâmicas: Confirmações e feedbacks ao usuário (ex.: "Copiado!").

### Requisitos

#### Técnologias necessárias

- Node.js (Versão 16 ou superior)

- React (Versão 17 ou superor)

#### Dependências do projeto

- react-dropzone: Para upload e manipulação de arquivos.

- xlsx: Para processar arquivos Excel.

- classnames: Para gerenciamento de estilos (opcional).

Instale as dependências com:

```
npm install react-dropzone xlsx
```

### Como usar

```
npm install
```

#### Estrutura do excel

O componente espera um arquivo Excel com as seguintes colunas:

- Diagnóstico: Valores esperados são "CLIENTE AUSENTE" ou "ENDEREÇO NÃO LOCALIZADO ".

- Setor: Indica a região (ex.: "SBC", "GRAJAÚ").

- Cliente: Nome do cliente.

- Assunto: Detalhes da OS.

### Erros comuns e soluções

- Erro ao Processar o Arquivo: Verifique se o arquivo possui as colunas esperadas.

- Arquivo Inválido: Certifique-se de que o arquivo possui a extensão .xlsx ou .xls.

- Dados Não Filtrados: Garanta que o nome da região corresponde exatamente ao esperado (case-sensitive).

## Contribuição

1. Faça um fork do repositório.

2. Crie uma branch para suas alterações:
bash
```
git checkout -b minha-feature
```

3. Commit suas alterações:
```
git commit -m "Minha nova feature"
```

4. Envie para o repositório principal:
```
git push origin minha-feature
```

Aqui trago mais um projeto e dessa vez tudo parece diferente, parece que de alguma forma trouxe algo que mudou a rotina alguém, mudou para melhor!

Me sinto mais perto da programação cada vez mais e espero melhorar bastante!

Pablodev (Pablo Teixeira), 2024.
