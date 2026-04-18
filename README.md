# 🎬 CapCut SRT Pro

**Conversor Avançado de Legendas para CapCut**

Uma aplicação web completa para criação, validação, correção e preview de legendas SRT com sincronização de mídia. Desenvolvida especificamente para otimizar o workflow de criação de legendas para o CapCut e outros editores de vídeo.

## 📋 Índice
- [Funcionalidades](#-funcionalidades-principais)
- [Tecnologias](#-tecnologias-utilizadas)
- [Instalação](#-instalação)
- [Como Usar](#-como-usar)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [API REST](#-endpoints-da-api-rest)
- [Troubleshooting](#-troubleshooting)
- [Contribuições](#-contribuições)

## ✨ Funcionalidades Principais

### 📝 **Processamento de Texto**
- **Conversão para SRT**: Converte texto em legendas SRT com timing automático
- **Validação de texto**: Verificação ortográfica, gramatical e análise de legibilidade
- **Correção automática**: Sugestões inteligentes para melhorar o texto
- **Números por extenso**: Converte números para formato por extenso em português
  - Converte números arábicos (123 → cento e vinte e três)
  - Números romanos (XIV → quatorze)
  - Datas (15/03/2024 → quinze de março de dois mil e vinte e quatro)
  - Horas (14:30 → quatorze horas e trinta minutos)
  - Unidades (50km → cinquenta quilômetros)
  - Símbolos matemáticos (2 + 3 → dois mais três)
- **Importação de PDF**: Extrai texto de arquivos PDF para conversão

### 🎥 **Preview com Mídia**
- **Upload de vídeo/áudio**: Suporte para MP4, AVI, MOV, MKV, MP3, WAV
- **Sincronização em tempo real**: Preview das legendas sincronizadas com a mídia
- **Controles de reprodução**: Play, pause, stop e controle de velocidade
- **Overlay de legendas**: Visualização das legendas sobrepostas ao vídeo

### 🎨 **Interface e Usabilidade**
- **Tema claro/escuro**: Alternância entre modos de visualização
- **Interface responsiva**: Design moderno e intuitivo
- **Estatísticas em tempo real**: Contagem de palavras, caracteres e blocos
- **Presets de configuração**: Presets de timing (Rápido 3s, Normal 5s, Lento 8s, Auto)
- **Importação em lote**: Suporte para múltiplos arquivos TXT e PDF

### 📤 **Exportação**
- **Formato SRT**: Padrão de legendas compatível com CapCut e maioria dos players
- **Texto Simples**: Exportação em formato texto puro sem tempos (apenas o conteúdo da legenda)

## 🛠️ Tecnologias Utilizadas

### Backend (Python/Flask)
- **Flask 2.x**: Framework web para API REST
- **Flask-CORS**: Habilitação de requisições cross-origin
- **PyPDF2**: Extração de texto de arquivos PDF
- **Num2Words**: Conversão de números para extenso em português
- **Werkzeug**: Validação e manipulação de uploads de arquivo

### Frontend (HTML/CSS/JavaScript)
- **HTML5**: Estrutura semântica moderna
- **CSS3**: Estilização responsiva com sistema de temas (claro/escuro)
- **JavaScript ES6+**: Interatividade, fetch API e comunicação com backend
- **Media API**: Controle de reprodução de vídeo/áudio nativos do navegador

## 📦 Requisitos do Sistema
- Python 3.8 ou superior
- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Mínimo 512MB RAM
- 100MB de espaço em disco (mais se guardar uploads)

## 🔧 Instalação

### 1. Clone o Repositório
```bash
git clone https://github.com/Amorais1984/capcutpro_v2.git
cd capcutpro_v2
```

### 2. Crie um Ambiente Virtual (Recomendado)
```bash
# Windows
python -m venv .venv
.venv\Scripts\activate

# macOS/Linux
python3 -m venv .venv
source .venv/bin/activate
```

### 3. Instale as Dependências
```bash
pip install -r requirements.txt
```

### 4. Inicie a Aplicação

#### Opção A: Script Python (Recomendado)
```bash
python start_full_project.py
```

#### Opção B: Script Batch (Windows)
```bash
start_project_full.bat
```

#### Opção C: Comando Shell (Manual)
```bash
python backend.py
```

### 5. Acesse a Aplicação
Abra seu navegador em: `http://localhost:5000`

## 📖 Como Usar

### Fluxo Básico

1. **Inserir Texto**
   - Cole seu roteiro/legenda no campo de texto, OU
   - Importe um arquivo TXT, OU
   - Extraia texto de um arquivo PDF

2. **Configurar Timing**
   - Use um dos presets (Rápido, Normal, Lento) OU
   - Defina manualmente a duração de cada bloco de legenda
   - Configure o intervalo entre blocos

3. **Processar Texto**
   - Clique em "Converter Números" para converter números para extenso
   - Clique em "Validar Texto" para verificar ortografia e legibilidade
   - Clique em "Corrigir Texto" para obter sugestões de melhoria

4. **Preview (Opcional)**
   - Importe um vídeo/áudio para sincronizar as legendas
   - Visualize em tempo real como as legendas ficarão no vídeo

5. **Exportar**
   - **SRT**: Clique em "Download SRT" para baixar o arquivo de legendas sincronizado com timecode
   - **Texto Simples**: Clique em "Texto Simples" para exportar apenas o conteúdo sem tempos (perfeito para scripts, roteiros ou documentação)
   - **VTT/ASS**: Importe em outros editores que suportam esses formatos
   - Importe o arquivo no CapCut ou outro editor de vídeo

### Exemplos de Conversão

#### Números
- Entrada: "O vídeo tem 1500 visualizações"
- Saída: "O vídeo tem mil e quinhentas visualizações"

#### Datas
- Entrada: "Publicado em 15/03/2024"
- Saída: "Publicado em quinze de março de dois mil e vinte e quatro"

#### Unidades
- Entrada: "Distância de 50km e peso de 25kg"
- Saída: "Distância de cinquenta quilômetros e peso de vinte e cinco quilogramas"

#### Exportação em Formatos

**SRT (com timecode):**
```
1
00:00:00,000 --> 00:00:05,000
O vídeo tem mil e quinhentas visualizações

2
00:00:07,000 --> 00:00:12,000
Publicado em quinze de março
de dois mil e vinte e quatro
```

**Texto Simples (sem timecode):**
```
O vídeo tem mil e quinhentas visualizações

Publicado em quinze de março
de dois mil e vinte e quatro
```

## 📁 Estrutura do Projeto

```
capcutpro_v2/
├── backend.py                  # Servidor Flask e API REST
├── requirements.txt            # Dependências Python
├── start_full_project.py      # Script para iniciar a aplicação
├── start_project_full.bat     # Script batch para Windows
├── Iniciar_CapCut_Pro.cmd    # Atalho rápido (Windows)
├── README.md                  # Esta documentação
├── frontend/
│   ├── index_enhanced.html    # Interface principal
│   ├── styles.css             # Estilização responsiva
│   ├── script.js              # Lógica frontend e interatividade
│   ├── test_validation.html   # Página de testes (opcional)
│   └── MANUAL_USUARIO.md      # Manual de uso em português
└── uploads/                   # Pasta para uploads temporários
```

## 🔌 Endpoints da API REST

### POST `/tratar_texto`
Converte números para extenso em português.

**Request:**
```json
{
  "texto": "O vídeo tem 1500 visualizações em 15/03/2024"
}
```

**Response:**
```json
{
  "texto_tratado": "O vídeo tem mil e quinhentas visualizações em quinze de março de dois mil e vinte e quatro"
}
```

### POST `/validar_texto`
Valida ortografia, legibilidade e retorna estatísticas.

**Request:**
```json
{
  "texto": "Este é um texto de exemplo"
}
```

**Response:**
```json
{
  "legibilidade": {
    "flesch_reading_ease": 60.0,
    "flesch_kincaid_grade": 8.0,
    "automated_readability_index": 5.0,
    "coleman_liau_index": 7.0
  },
  "ortografia": {
    "palavras_incorretas": [],
    "sugestoes": {}
  },
  "estatisticas": {
    "total_palavras": 6,
    "total_caracteres": 30,
    "total_frases": 1,
    "palavras_por_frase": 6.0,
    "silabas_por_palavra": 2.5
  }
}
```

### POST `/corrigir_texto`
Retorna sugestões de melhoria para o texto.

**Request:**
```json
{
  "texto": "Este texto tem alguns erros"
}
```

### POST `/extract_pdf_text`
Extrai texto de arquivo PDF.

**Request:** (multipart/form-data)
```
file: [PDF file]
```

**Response:**
```json
{
  "text": "Texto extraído do PDF..."
}
```

### POST `/gerar_srt`
Gera arquivo SRT a partir do texto.

**Request:**
```json
{
  "texto": "Bloco 1\nBloco 2\nBloco 3",
  "duracao": 5,
  "intervalo": 2
}
```

**Response:**
```
1
00:00:00,000 --> 00:00:05,000
Bloco 1

2
00:00:07,000 --> 00:00:12,000
Bloco 2

...
```

## 🐛 Troubleshooting

### Erro: "ModuleNotFoundError: No module named 'flask'"
**Solução:** Instale as dependências
```bash
pip install -r requirements.txt
```

### Erro: "Address already in use"
A porta 5000 já está em uso. Você pode:
- Fechar outras aplicações que usam a porta 5000
- Modificar a porta no arquivo `backend.py`:
  ```python
  app.run(debug=True, port=5001)  # Mude para outra porta
  ```

### Arquivo PDF não é extraído
- Verifique se o PDF não está protegido por senha
- Tente com outro arquivo PDF
- Alguns PDFs com imagens/gráficos podem não extrair texto bem

### Vídeo/Áudio não reproduz no preview
- Verifique se o arquivo está em formato compatível (MP4, MP3, WAV)
- Tente converter o arquivo para um formato suportado
- Verifique a integridade do arquivo

### Interface não carrega
- Limpe o cache do navegador (Ctrl+Shift+Delete)
- Tente em outro navegador
- Verifique se o servidor está rodando em http://localhost:5000

## 📝 Notas Importantes

1. **Privacidade**: Todos os arquivos processados são mantidos na sessão do navegador. Nada é armazenado permanentemente.

2. **Limite de Upload**: Máximo de 100MB por arquivo (configurável em `backend.py`)

3. **Compatibilidade**: Testado em Chrome, Firefox, Safari e Edge em Windows, macOS e Linux

4. **Formato SRT**: O arquivo gerado segue o padrão SubRip que é compatível com:
   - CapCut (Desktop e Mobile)
   - Adobe Premiere Pro
   - Final Cut Pro
   - DaVinci Resolve
   - Subtitle Edit
   - E praticamente todos os players de vídeo

## 🤝 Contribuições

Contribuições são bem-vindas! Para contribuir:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/melhoria`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/melhoria`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está disponível sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

## 👨‍💻 Autor

Desenvolvido com ❤️ para criadores de conteúdo

## 📞 Suporte

Para reportar bugs ou sugerir melhorias, abra uma issue no repositório.

---

**Última atualização:** Abril de 2026

### Método 1: Arquivo Python (Recomendado)
```bash
python start_full_project.py
```

### Método 2: Arquivo Batch (Windows)
```bash
# Clique duplo no arquivo ou execute:
start_project_full.bat
```

### Método 3: Manual
```bash
# Ative o ambiente virtual
.venv\Scripts\activate

# Instale dependências
pip install -r requirements.txt

# Execute o backend
python backend.py
```

**🌐 Acesse:** http://127.0.0.1:5000

## 📋 Pré-requisitos

- **Python 3.10+**
- **Navegador moderno** (Chrome, Firefox, Safari, Edge)
- **Conexão com internet** (para ferramentas de correção)

## 🚀 Instalação e Configuração

### 1. Clone ou baixe o projeto
```bash
git clone <repository-url>
cd capcutpro_v2
```

### 2. Crie e ative o ambiente virtual
```powershell
python -m venv .venv
.venv\Scripts\activate
```

### 3. Instale as dependências
```powershell
pip install -r requirements.txt
```

### 4. Inicie o servidor
```powershell
python backend.py
```

### 5. Acesse a aplicação
Abra seu navegador e acesse: **http://127.0.0.1:5000**

## 📖 Como Usar

### **Conversão Básica de Texto para SRT**
1. Digite ou cole seu texto na área de entrada
2. Configure duração e intervalo entre legendas
3. Ajuste caracteres por linha e linhas por bloco
4. Clique em "🎬 Converter para SRT"
5. Visualize o resultado e faça download

### **Validação e Correção**
1. Insira seu texto na área de entrada
2. Clique em "✅ Validar Texto" para análise completa
3. Use "🔧 Corrigir Texto" para sugestões automáticas
4. Revise e aplique as correções sugeridas

### **Preview com Mídia**
1. Faça upload de um arquivo de vídeo ou áudio
2. Converta seu texto para SRT
3. Use os controles de reprodução para testar sincronização
4. Ajuste timing conforme necessário

### **Importação de PDF**
1. Clique em "📄 Importar PDF"
2. Selecione seu arquivo PDF
3. O texto será extraído automaticamente
4. Continue com o processo normal de conversão

## 📁 Estrutura do Projeto

```
capcutpro_v2/
├── backend.py              # Servidor Flask e API
├── requirements.txt        # Dependências Python
├── frontend/              # Interface web
│   ├── index_enhanced.html # Página principal
│   ├── script.js          # Lógica JavaScript
│   ├── styles.css         # Estilos CSS
│   └── MANUAL_USUARIO.md  # Manual detalhado
├── uploads/               # Arquivos de mídia enviados
├── entrada_txt/           # Arquivos de entrada (modo batch)
├── saida_txt/            # Arquivos processados (modo batch)
└── .venv/                # Ambiente virtual Python
```

## ⚙️ Configurações Avançadas

### **Presets Disponíveis**
- **CapCut Padrão**: 42 caracteres, 2 linhas, 3s duração
- **YouTube**: 32 caracteres, 2 linhas, 4s duração  
- **Instagram**: 25 caracteres, 1 linha, 2s duração
- **TikTok**: 20 caracteres, 1 linha, 1.5s duração

### **Formatos de Exportação**
- **SRT**: Formato padrão para a maioria dos editores
- **VTT**: Para reprodução web (HTML5)
- **ASS/SSA**: Para estilos avançados no Aegisub

## 🔧 Solução de Problemas

### **Erro de conexão com backend**
- Verifique se o servidor Python está rodando
- Confirme que a porta 5000 não está sendo usada
- Reinicie o servidor: `Ctrl+C` e `python backend.py`

### **Problemas com upload de mídia**
- Verifique se o arquivo está em formato suportado
- Limite máximo: 100MB por arquivo
- Formatos suportados: MP4, AVI, MOV, MKV, MP3, WAV

### **Validação não funciona**
- Primeira execução pode ser lenta (download de modelos)
- Verifique conexão com internet
- Reinicie o servidor se necessário

## 🤝 Contribuição

Contribuições são bem-vindas! Por favor:
1. Faça fork do projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Abra um Pull Request

## 📄 Licença

Este projeto está sob licença MIT. Veja o arquivo LICENSE para detalhes.

---

**Desenvolvido com ❤️ para criadores de conteúdo**

**Autor:**
- Desenvolvido com auxílio do GitHub Copilot
