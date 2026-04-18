// Estado global da aplicação
let currentSRT = '';
let currentStats = {};
let currentMedia = null;
let subtitleBlocks = [];
let currentSubtitleIndex = -1;
let mediaPlayer = null;
let isPlaying = false;

// Elementos DOM
const elements = {
  textoInput: document.getElementById('textoInput'),
  arquivoInput: document.getElementById('arquivoInput'),
  pdfInput: document.getElementById('pdfInput'),
  mediaInput: document.getElementById('mediaInput'),
  mediaInfo: document.getElementById('mediaInfo'),
  duracao: document.getElementById('duracao'),
  intervalo: document.getElementById('intervalo'),
  maxCharsPerLine: document.getElementById('maxCharsPerLine'),
  maxLinesPerBlock: document.getElementById('maxLinesPerBlock'),
  validarBtn: document.getElementById('validarBtn'),
  corrigirBtn: document.getElementById('corrigirBtn'),
  convertBtn: document.getElementById('convertBtn'),
  clearBtn: document.getElementById('clearBtn'),
  srtPreview: document.getElementById('srtPreview'),
  exportOptions: document.getElementById('exportOptions'),
  progressBar: document.getElementById('progressBar'),
  progressFill: document.getElementById('progressFill'),
  wordCount: document.getElementById('wordCount'),
  charCount: document.getElementById('charCount'),
  estimatedBlocks: document.getElementById('estimatedBlocks'),
  totalDuration: document.getElementById('totalDuration'),
  splitParts: document.getElementById('splitParts'),
  splitBtn: document.getElementById('splitBtn'),
  validationResults: document.getElementById('validationResults'),
    validationContent: document.getElementById('validationContent'),
  mediaPlayer: document.getElementById('mediaPlayer'),
  videoPlayer: document.getElementById('videoPlayer'),
  audioPlayer: document.getElementById('audioPlayer'),
  subtitleOverlay: document.getElementById('subtitleOverlay'),
  playBtn: document.getElementById('playBtn'),
  pauseBtn: document.getElementById('pauseBtn'),
  stopBtn: document.getElementById('stopBtn'),
  progressSlider: document.getElementById('progressSlider'),
  speedControl: document.getElementById('speedControl'),
  themeToggle: document.getElementById('themeToggle')
};

// Função principal de conversão melhorada
function converterParaSRTAvancado(texto, config) {
  const { duracao, intervalo, maxCharsPerLine, maxLinesPerBlock } = config;
  
  // Quebra o texto em sentenças respeitando pontuação
  const sentences = texto.match(/[^.!?]+[.!?]+/g) || [texto];
  const blocks = [];
  let currentSentences = [];
  let currentBlockText = '';
  
  for (let sentence of sentences) {
    sentence = sentence.trim();
    if (!sentence) continue;
    
    // Testa se adicionar esta sentença ultrapassa os limites
    const testBlock = currentBlockText ? `${currentBlockText} ${sentence}` : sentence;
    const testLines = formatarTextoEmLinhas(testBlock, maxCharsPerLine);
    
    // Se cabe no bloco atual (respeitando limites de linhas e caracteres)
    if (testLines.length <= maxLinesPerBlock) {
      currentSentences.push(sentence);
      currentBlockText = testBlock;
    } else {
      // Se o bloco atual não está vazio, finaliza ele
      if (currentBlockText) {
        blocks.push(currentBlockText);
      }
      
      // Inicia novo bloco com a sentença atual
      currentSentences = [sentence];
      currentBlockText = sentence;
      
      // Se mesmo uma única sentença não cabe, força a quebra
      const singleSentenceLines = formatarTextoEmLinhas(sentence, maxCharsPerLine);
      if (singleSentenceLines.length > maxLinesPerBlock) {
        // Quebra a sentença em partes menores mantendo pontuação
        const parts = quebrarSentencaLonga(sentence, maxCharsPerLine, maxLinesPerBlock);
        for (let i = 0; i < parts.length; i++) {
          blocks.push(parts[i]);
        }
        currentSentences = [];
        currentBlockText = '';
      }
    }
  }
  
  // Adiciona o último bloco se houver
  if (currentBlockText) {
    blocks.push(currentBlockText);
  }
  
  // Gera o SRT
  let srt = '';
  let tempoAcumulado = 0;
  
  blocks.forEach((block, index) => {
    const tempoInicio = tempoAcumulado;
    const tempoFim = tempoInicio + duracao;
    
    // Formata o bloco em linhas para exibição
    const linhas = formatarTextoEmLinhas(block, maxCharsPerLine);
    const textoFormatado = linhas.join('\n');
    
    srt += `${index + 1}\n`;
    srt += `${formatarTempo(tempoInicio)} --> ${formatarTempo(tempoFim)}\n`;
    srt += `${textoFormatado}\n\n`;
    
    tempoAcumulado = tempoFim + intervalo;
  });
  
  return { srt: srt.trim(), blocks: blocks.length, totalTime: tempoAcumulado };
}

// Função auxiliar para formatar texto em linhas
function formatarTextoEmLinhas(texto, maxCharsPerLine) {
  const palavras = texto.split(/\s+/);
  const linhas = [];
  let linhaAtual = '';
  
  for (let palavra of palavras) {
    const testeLinhaAtual = linhaAtual ? `${linhaAtual} ${palavra}` : palavra;
    
    if (testeLinhaAtual.length <= maxCharsPerLine) {
      linhaAtual = testeLinhaAtual;
    } else {
      if (linhaAtual) {
        linhas.push(linhaAtual);
        linhaAtual = palavra;
      } else {
        // Palavra muito longa, força a inclusão
        linhas.push(palavra);
      }
    }
  }
  
  if (linhaAtual) {
    linhas.push(linhaAtual);
  }
  
  return linhas;
}

// Função auxiliar para quebrar sentenças muito longas
function quebrarSentencaLonga(sentenca, maxCharsPerLine, maxLinesPerBlock) {
  const palavras = sentenca.split(/\s+/);
  const partes = [];
  let parteAtual = '';
  let linhasParteAtual = 0;
  
  for (let i = 0; i < palavras.length; i++) {
    const palavra = palavras[i];
    const testeParteAtual = parteAtual ? `${parteAtual} ${palavra}` : palavra;
    const linhasTeste = formatarTextoEmLinhas(testeParteAtual, maxCharsPerLine);
    
    if (linhasTeste.length <= maxLinesPerBlock) {
      parteAtual = testeParteAtual;
      linhasParteAtual = linhasTeste.length;
    } else {
      // Se a parte atual não está vazia, adiciona ela
      if (parteAtual) {
        // Adiciona pontuação se não terminar com uma
        if (!/[.!?]$/.test(parteAtual)) {
          parteAtual += '...';
        }
        partes.push(parteAtual);
      }
      
      parteAtual = palavra;
      linhasParteAtual = 1;
    }
  }
  
  // Adiciona a última parte
  if (parteAtual) {
    partes.push(parteAtual);
  }
  
  return partes;
}

// Formatação de tempo melhorada
function formatarTempo(segundos) {
  const horas = Math.floor(segundos / 3600);
  const minutos = Math.floor((segundos % 3600) / 60);
  const segs = Math.floor(segundos % 60);
  const milissegundos = Math.floor((segundos % 1) * 1000);
  
  return `${pad(horas)}:${pad(minutos)}:${pad(segs)},${pad(milissegundos, 3)}`;
}

function pad(numero, tamanho = 2) {
  return numero.toString().padStart(tamanho, '0');
}

// Atualização de estatísticas em tempo real
function updateStats() {
  const texto = elements.textoInput.value.trim();
  const words = texto ? texto.split(/\s+/).filter(Boolean).length : 0;
  const chars = texto.length;
  
  const config = {
    duracao: parseInt(elements.duracao.value),
    intervalo: parseInt(elements.intervalo.value),
    maxCharsPerLine: parseInt(elements.maxCharsPerLine.value),
    maxLinesPerBlock: parseInt(elements.maxLinesPerBlock.value)
  };
  
  // Estimativa de blocos
  const estimatedBlocks = texto ? Math.ceil(chars / (config.maxCharsPerLine * config.maxLinesPerBlock)) : 0;
  const totalDuration = estimatedBlocks * (config.duracao + config.intervalo);
  
  elements.wordCount.textContent = words;
  elements.charCount.textContent = chars;
  elements.estimatedBlocks.textContent = estimatedBlocks;
  elements.totalDuration.textContent = `${Math.floor(totalDuration / 60)}:${pad(totalDuration % 60)}`;
}

// Presets de timing (delegação de eventos)
const presetsContainer = document.querySelector('.presets');
if (presetsContainer) {
  presetsContainer.addEventListener('click', (e) => {
    const btn = e.target.closest('.preset-btn');
    if (!btn || !presetsContainer.contains(btn)) return;

    presetsContainer.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const duration = btn.dataset.duration;
    const interval = btn.dataset.interval;

    if (duration === 'auto') {
      // Modo automático baseado na velocidade de leitura
      const words = elements.textoInput.value.trim().split(/\s+/).filter(Boolean).length;
      const readingSpeed = 200; // palavras por minuto
      const autoDuration = Math.max(3, Math.min(8, Math.ceil(words / readingSpeed * 60 / 10)));
      elements.duracao.value = autoDuration;
      elements.intervalo.value = Math.ceil(autoDuration * 0.3);
    } else {
      elements.duracao.value = duration;
      elements.intervalo.value = interval;
    }

    updateStats();
  });
}

// Event listeners
elements.textoInput.addEventListener('input', updateStats);
// Delegação para controles de timing
const timingControls = document.querySelector('.timing-controls');
if (timingControls) {
  timingControls.addEventListener('input', (e) => {
    const id = e.target && e.target.id;
    if (id && (id === 'duracao' || id === 'intervalo' || id === 'maxCharsPerLine' || id === 'maxLinesPerBlock')) {
      updateStats();
    }
  });
}

// Event listeners para validação e correção já estão definidos mais abaixo no código

// Event listener para fechar resultados de validação
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('close-validation')) {
    elements.validationResults.classList.add('hidden');
  }
});

// Importação de arquivos
elements.arquivoInput.addEventListener('change', async function() {
  const files = Array.from(this.files).sort((a, b) => a.name.localeCompare(b.name));
  let content = '';
  
  for (const file of files) {
    const text = await file.text();
    content += text.trim() + '\n\n';
  }
  
  elements.textoInput.value = content.trim();
  updateStats();
});

// Importação de PDFs
elements.pdfInput.addEventListener('change', async function() {
  const files = Array.from(this.files).sort((a, b) => a.name.localeCompare(b.name));
  let content = '';
  
  for (const file of files) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const resp = await fetch('/extract_pdf_text', {
        method: 'POST',
        body: formData
      });
      
      if (!resp.ok) {
        const errorData = await resp.json();
        throw new Error(errorData.error || 'Erro ao processar PDF');
      }
      
      const data = await resp.json();
      content += data.text.trim() + '\n\n';
    } catch (e) {
      alert(`Erro ao processar o arquivo ${file.name}: ${e.message}`);
      return;
    }
  }
  
  elements.textoInput.value = content.trim();
  updateStats();
});

// Botão para tratar números por extenso
let tratarBtn = document.getElementById('tratarBtn');
if (!tratarBtn) {
  tratarBtn = document.createElement('button');
  tratarBtn.id = 'tratarBtn';
  tratarBtn.textContent = '🔢 Números por extenso';
  tratarBtn.style.marginRight = '10px';
  const btnGroup = elements.convertBtn.parentElement;
  btnGroup.insertBefore(tratarBtn, elements.convertBtn);
}

tratarBtn.addEventListener('click', async function() {
  const texto = elements.textoInput.value.trim();
  if (!texto) {
    alert('Por favor, insira algum texto para tratar.');
    return;
  }
  tratarBtn.disabled = true;
  tratarBtn.textContent = 'Processando...';
  try {
    const resp = await fetch('/tratar_texto', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ texto })
    });
    if (!resp.ok) throw new Error('Erro ao processar texto');
    const data = await resp.json();
    elements.textoInput.value = data.texto_tratado;
    updateStats();
  } catch (e) {
    alert('Erro ao conectar com o backend: ' + e.message);
  } finally {
    tratarBtn.disabled = false;
    tratarBtn.textContent = '🔢 Números por extenso';
  }
});

// Validação de texto
elements.validarBtn.addEventListener('click', async function() {
  const texto = elements.textoInput.value.trim();
  if (!texto) {
    alert('Por favor, insira algum texto para validar.');
    return;
  }
  
  elements.validarBtn.disabled = true;
  elements.validarBtn.textContent = 'Validando...';
  
  try {
    const resp = await fetch('/validar_texto', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ texto })
    });
    
    if (!resp.ok) throw new Error('Erro ao validar texto');
    
    const data = await resp.json();
    mostrarResultadosValidacao(data);
    
  } catch (e) {
    alert('Erro ao conectar com o backend: ' + e.message);
  } finally {
    elements.validarBtn.disabled = false;
    elements.validarBtn.textContent = '✅ Validar Texto';
  }
});

// Correção de texto
elements.corrigirBtn.addEventListener('click', async function() {
  const texto = elements.textoInput.value.trim();
  if (!texto) {
    alert('Por favor, insira algum texto para corrigir.');
    return;
  }
  
  elements.corrigirBtn.disabled = true;
  elements.corrigirBtn.textContent = 'Corrigindo...';
  
  try {
    const resp = await fetch('/corrigir_texto', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ texto })
    });
    
    if (!resp.ok) throw new Error('Erro ao corrigir texto');
    
    const data = await resp.json();
    
    if (data.total_correcoes > 0) {
      const confirmar = confirm(`Foram encontradas ${data.total_correcoes} correções. Deseja aplicá-las?`);
      if (confirmar) {
        elements.textoInput.value = data.texto_corrigido;
        updateStats();
        mostrarCorrecoes(data.correcoes_aplicadas);
      }
    } else {
      alert('Nenhuma correção necessária foi encontrada!');
    }
    
  } catch (e) {
    alert('Erro ao conectar com o backend: ' + e.message);
  } finally {
    elements.corrigirBtn.disabled = false;
    elements.corrigirBtn.textContent = '🔧 Corrigir Texto';
  }
});

// Upload de mídia
elements.mediaInput.addEventListener('change', async function() {
  const file = this.files[0];
  if (!file) return;
  
  const formData = new FormData();
  formData.append('file', file);
  
  try {
    const resp = await fetch('/upload_media', {
      method: 'POST',
      body: formData
    });
    
    if (!resp.ok) throw new Error('Erro ao fazer upload');
    
    const data = await resp.json();
    currentMedia = data;
    
    // Mostrar informações do arquivo
    elements.mediaInfo.innerHTML = `
      <strong>📁 ${file.name}</strong><br>
      Tipo: ${data.media_type}<br>
      Tamanho: ${(data.size / 1024 / 1024).toFixed(2)} MB
    `;
    elements.mediaInfo.classList.remove('hidden');
    
    // Configurar player
    setupMediaPlayer(data);
    
  } catch (e) {
    alert('Erro ao fazer upload: ' + e.message);
  }
});

// Conversão
elements.convertBtn.addEventListener('click', function() {
  const texto = elements.textoInput.value.trim();
  if (!texto) {
    alert('Por favor, insira algum texto para converter.');
    return;
  }
  
  // Mostra barra de progresso
  elements.progressBar.classList.remove('hidden');
  elements.progressFill.style.width = '0%';
  
  // Simula progresso
  let progress = 0;
  const progressInterval = setInterval(() => {
    progress += 10;
    elements.progressFill.style.width = progress + '%';
    
    if (progress >= 100) {
      clearInterval(progressInterval);
      
      // Realiza a conversão
      const config = {
        duracao: parseInt(elements.duracao.value),
        intervalo: parseInt(elements.intervalo.value),
        maxCharsPerLine: parseInt(elements.maxCharsPerLine.value),
        maxLinesPerBlock: parseInt(elements.maxLinesPerBlock.value)
      };
      
      const result = converterParaSRTAvancado(texto, config);
      currentSRT = result.srt;
      currentStats = result;
      
      elements.srtPreview.textContent = currentSRT;
      elements.exportOptions.classList.remove('hidden');
      elements.progressBar.classList.add('hidden');
      
      // Animação de fade-in
      elements.srtPreview.classList.add('fade-in');
    }
  }, 100);
});

// Limpar
elements.clearBtn.addEventListener('click', function() {
  elements.textoInput.value = '';
  elements.arquivoInput.value = '';
  elements.pdfInput.value = '';
  elements.srtPreview.textContent = 'Seu arquivo SRT aparecerá aqui após a conversão...';
  elements.exportOptions.classList.add('hidden');
  elements.progressBar.classList.add('hidden');
  currentSRT = '';
  updateStats();
});

// Botões de exportação (delegação de eventos)
if (elements.exportOptions) {
  elements.exportOptions.addEventListener('click', (e) => {
    const btn = e.target.closest('.format-btn');
    if (!btn || !elements.exportOptions.contains(btn)) return;
    const format = btn.dataset.format;
    if (format) downloadFile(format);
  });
}

// Funções de download
function downloadFile(format) {
  if (!currentSRT) return;
  
  let content = currentSRT;
  let filename = `legendas_${new Date().toISOString().slice(0,19).replace(/[:T]/g,'-')}`;
  let mimeType = 'text/plain';
  
  switch (format) {
    case 'srt':
      filename += '.srt';
      break;
    case 'vtt':
      content = convertToVTT(currentSRT);
      filename += '.vtt';
      mimeType = 'text/vtt';
      break;
    case 'ass':
      content = convertToASS(currentSRT);
      filename += '.ass';
      break;
    case 'zip':
      downloadZip();
      return;
  }
  
  const blob = new Blob(['\ufeff' + content], { type: mimeType + ';charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Conversão para VTT
function convertToVTT(srt) {
  let vtt = 'WEBVTT\n\n';
  vtt += srt.replace(/(\d+)\n(\d{2}:\d{2}:\d{2}),(\d{3}) --> (\d{2}:\d{2}:\d{2}),(\d{3})/g, 
    '$2.$3 --> $4.$5');
  return vtt;
}

// Conversão para ASS
function convertToASS(srt) {
  let ass = `[Script Info]
Title: CapCut SRT Pro
ScriptType: v4.00+

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,Arial,20,&H00FFFFFF,&H000000FF,&H00000000,&H80000000,0,0,0,0,100,100,0,0,1,2,0,2,10,10,10,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
`;
  
  const lines = srt.split('\n\n');
  lines.forEach(block => {
    const parts = block.split('\n');
    if (parts.length >= 3) {
      const timeMatch = parts[1].match(/(\d{2}:\d{2}:\d{2}),(\d{3}) --> (\d{2}:\d{2}:\d{2}),(\d{3})/);
      if (timeMatch) {
        const startTime = `${timeMatch[1]}.${timeMatch[2].substring(0,2)}`;
        const endTime = `${timeMatch[3]}.${timeMatch[4].substring(0,2)}`;
        const text = parts.slice(2).join('\\N');
        ass += `Dialogue: 0,${startTime},${endTime},Default,,0,0,0,,${text}\n`;
      }
    }
  });
  
  return ass;
}

// Download em ZIP
function downloadZip() {
  // Implementação simplificada - em produção usaria JSZip
  alert('Funcionalidade ZIP será implementada com JSZip library');
}

// Função para dividir SRT em partes sem cortar texto
function splitSRT(srt, parts) {
  if (!srt || parts < 2) return [srt];
  
  // Divide o SRT em blocos individuais
  const blocks = srt.split('\n\n').filter(block => block.trim());
  const totalBlocks = blocks.length;
  
  if (totalBlocks === 0) return [srt];
  
  // Calcula quantos blocos cada parte deve ter
  const blocksPerPart = Math.ceil(totalBlocks / parts);
  const splitSRTs = [];
  
  for (let i = 0; i < parts; i++) {
    const startIndex = i * blocksPerPart;
    const endIndex = Math.min(startIndex + blocksPerPart, totalBlocks);
    
    if (startIndex >= totalBlocks) break;
    
    // Reconstroi o SRT para esta parte
    let partSRT = '';
    let blockCounter = 1;
    
    for (let j = startIndex; j < endIndex; j++) {
      const block = blocks[j];
      const lines = block.split('\n');
      
      // Atualiza o número do bloco
      lines[0] = blockCounter.toString();
      partSRT += lines.join('\n') + '\n\n';
      blockCounter++;
    }
    
    splitSRTs.push(partSRT.trim());
  }
  
  return splitSRTs;
}

// Função para fazer download de múltiplos arquivos SRT
function downloadSplitSRTs(splitSRTs) {
  if (!splitSRTs || splitSRTs.length === 0) return;
  
  const timestamp = new Date().toISOString().slice(0,19).replace(/[:T]/g,'-');
  
  splitSRTs.forEach((srt, index) => {
    const filename = `legendas_${timestamp}_parte_${index + 1}_de_${splitSRTs.length}.srt`;
    const blob = new Blob(['\ufeff' + srt], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });
}

// Event listener para o botão de dividir SRT
if (elements.splitBtn) {
  elements.splitBtn.addEventListener('click', function() {
    if (!currentSRT) {
      alert('Por favor, gere um arquivo SRT primeiro.');
      return;
    }
    
    const parts = parseInt(elements.splitParts.value);
    if (isNaN(parts) || parts < 2 || parts > 50) {
      alert('Por favor, insira um número válido de partes (entre 2 e 50).');
      return;
    }
    
    // Divide o SRT
    const splitSRTs = splitSRT(currentSRT, parts);
    
    if (splitSRTs.length === 1) {
      alert('Não foi possível dividir o SRT. O arquivo pode ser muito pequeno.');
      return;
    }
    
    // Faz download das partes
    downloadSplitSRTs(splitSRTs);
    alert(`SRT dividido em ${splitSRTs.length} partes com sucesso!`);
  });
}

// Tema: carregar preferência e alternar
// Inicialização do tema
function initTheme() {
  const stored = localStorage.getItem('theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = stored || (prefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', theme);
  
  // Configurar botão de tema se existir
  if (elements.themeToggle) {
    elements.themeToggle.textContent = theme === 'dark' ? '☀️ Modo claro' : '🌙 Modo escuro';
    
    // Remover event listeners anteriores para evitar duplicação
    elements.themeToggle.replaceWith(elements.themeToggle.cloneNode(true));
    elements.themeToggle = document.getElementById('themeToggle');
    
    elements.themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      elements.themeToggle.textContent = next === 'dark' ? '☀️ Modo claro' : '🌙 Modo escuro';
    });
  }
}

// Chamar inicialização do tema após DOM estar pronto
document.addEventListener('DOMContentLoaded', initTheme);

// Também chamar imediatamente caso DOM já esteja pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initTheme);
} else {
  initTheme();
}

// Funções auxiliares para validação e correção
function mostrarResultadosValidacao(data) {
  let html = '<div class="validation-grid">';
  
  // Estatísticas
  html += '<div class="validation-item validation-success">';
  html += '<h5>📊 Estatísticas do Texto</h5>';
  html += `<p>Palavras: ${data.estatisticas.total_palavras}</p>`;
  html += `<p>Caracteres: ${data.estatisticas.total_caracteres}</p>`;
  html += `<p>Frases: ${data.estatisticas.total_frases}</p>`;
  html += `<p>Palavras por frase: ${data.estatisticas.palavras_por_frase}</p>`;
  html += '</div>';
  
  // Legibilidade
  html += '<div class="validation-item">';
  html += '<h5>📖 Análise de Legibilidade</h5>';
  html += `<p>Flesch Reading Ease: ${data.legibilidade.flesch_reading_ease.toFixed(1)}</p>`;
  html += `<p>Flesch-Kincaid Grade: ${data.legibilidade.flesch_kincaid_grade.toFixed(1)}</p>`;
  html += '</div>';
  
  // Ortografia
  if (data.ortografia.palavras_incorretas.length > 0) {
    html += '<div class="validation-item validation-warning">';
    html += '<h5>⚠️ Possíveis Erros Ortográficos</h5>';
    data.ortografia.palavras_incorretas.forEach(palavra => {
      const sugestoes = data.ortografia.sugestoes[palavra] || [];
      html += `<p><strong>${palavra}</strong>`;
      if (sugestoes.length > 0) {
        html += ` → Sugestões: ${sugestoes.join(', ')}`;
      }
      html += '</p>';
    });
    html += '</div>';
  } else {
    html += '<div class="validation-item validation-success">';
    html += '<h5>✅ Ortografia</h5>';
    html += '<p>Nenhum erro ortográfico encontrado!</p>';
    html += '</div>';
  }
  
  html += '</div>';
  
  elements.validationContent.innerHTML = html;
  elements.validationResults.classList.remove('hidden');
}

function mostrarCorrecoes(correcoes) {
  let html = '<div class="validation-item validation-success">';
  html += '<h5>✅ Correções Aplicadas</h5>';
  
  correcoes.forEach(correcao => {
    html += `<p><strong>${correcao.erro}</strong> → <strong>${correcao.correcao}</strong></p>`;
    html += `<small>${correcao.mensagem}</small><br><br>`;
  });
  
  html += '</div>';
  
  elements.validationContent.innerHTML = html;
  elements.validationResults.classList.remove('hidden');
}

// Configuração do player de mídia
function setupMediaPlayer(mediaData) {
  const mediaUrl = `/media/${mediaData.filename}`;
  
  if (mediaData.media_type === 'video') {
    elements.videoPlayer.src = mediaUrl;
    elements.videoPlayer.classList.remove('hidden');
    elements.audioPlayer.classList.add('hidden');
    mediaPlayer = elements.videoPlayer;
  } else {
    elements.audioPlayer.src = mediaUrl;
    elements.audioPlayer.classList.remove('hidden');
    elements.videoPlayer.classList.add('hidden');
    mediaPlayer = elements.audioPlayer;
  }
  
  elements.mediaPlayer.classList.remove('hidden');
  setupMediaControls();
}

// Configuração dos controles de mídia
function setupMediaControls() {
  // Play button
  elements.playBtn.addEventListener('click', () => {
    if (mediaPlayer) {
      mediaPlayer.play();
      isPlaying = true;
      startSubtitleSync();
    }
  });
  
  // Pause button
  elements.pauseBtn.addEventListener('click', () => {
    if (mediaPlayer) {
      mediaPlayer.pause();
      isPlaying = false;
    }
  });
  
  // Stop button
  elements.stopBtn.addEventListener('click', () => {
    if (mediaPlayer) {
      mediaPlayer.pause();
      mediaPlayer.currentTime = 0;
      isPlaying = false;
      elements.subtitleOverlay.style.display = 'none';
      currentSubtitleIndex = -1;
    }
  });
  
  // Progress slider
  elements.progressSlider.addEventListener('input', () => {
    if (mediaPlayer) {
      const time = (elements.progressSlider.value / 100) * mediaPlayer.duration;
      mediaPlayer.currentTime = time;
    }
  });
  
  // Speed control
  elements.speedControl.addEventListener('change', () => {
    if (mediaPlayer) {
      mediaPlayer.playbackRate = parseFloat(elements.speedControl.value);
    }
  });
  
  // Update progress
  if (mediaPlayer) {
    mediaPlayer.addEventListener('timeupdate', () => {
      if (mediaPlayer.duration) {
        const progress = (mediaPlayer.currentTime / mediaPlayer.duration) * 100;
        elements.progressSlider.value = progress;
        
        // Sincronizar legendas
        if (isPlaying && subtitleBlocks.length > 0) {
          syncSubtitles(mediaPlayer.currentTime);
        }
      }
    });
  }
}

// Sincronização de legendas
function startSubtitleSync() {
  if (currentSRT) {
    parseSubtitles(currentSRT);
  }
}

function parseSubtitles(srtContent) {
  subtitleBlocks = [];
  const blocks = srtContent.split('\n\n').filter(block => block.trim());
  
  blocks.forEach(block => {
    const lines = block.split('\n');
    if (lines.length >= 3) {
      const timeMatch = lines[1].match(/(\d{2}:\d{2}:\d{2},\d{3}) --> (\d{2}:\d{2}:\d{2},\d{3})/);
      if (timeMatch) {
        const startTime = parseTime(timeMatch[1]);
        const endTime = parseTime(timeMatch[2]);
        const text = lines.slice(2).join('\n');
        
        subtitleBlocks.push({
          start: startTime,
          end: endTime,
          text: text
        });
      }
    }
  });
}

function parseTime(timeString) {
  const [time, ms] = timeString.split(',');
  const [hours, minutes, seconds] = time.split(':').map(Number);
  return hours * 3600 + minutes * 60 + seconds + parseInt(ms) / 1000;
}

function syncSubtitles(currentTime) {
  let activeSubtitle = null;
  
  for (let i = 0; i < subtitleBlocks.length; i++) {
    const subtitle = subtitleBlocks[i];
    if (currentTime >= subtitle.start && currentTime <= subtitle.end) {
      activeSubtitle = subtitle;
      currentSubtitleIndex = i;
      break;
    }
  }
  
  if (activeSubtitle) {
    elements.subtitleOverlay.textContent = activeSubtitle.text;
    elements.subtitleOverlay.style.display = 'block';
  } else {
    elements.subtitleOverlay.style.display = 'none';
  }
}

// Inicialização geral
updateStats();
