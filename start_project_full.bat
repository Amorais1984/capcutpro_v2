@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo ============================================================
echo CAPCUT PRO V2 - GERADOR DE LEGENDAS
echo ============================================================
echo.
echo Iniciando projeto completo...
echo.

REM Ativa o ambiente virtual se existir
if exist ".venv\Scripts\activate.bat" (
    echo Ativando ambiente virtual...
    call ".venv\Scripts\activate.bat"
) else (
    echo Ambiente virtual nao encontrado, usando Python global
)

REM Verifica se o Python esta disponivel
python --version >nul 2>&1
if errorlevel 1 (
    echo Python nao encontrado! Instale o Python 3.8+ primeiro.
    pause
    exit /b 1
)

REM Instala dependencias se necessario
if not exist "requirements.txt" (
    echo Arquivo requirements.txt nao encontrado!
    pause
    exit /b 1
)

echo Verificando dependencias...
pip install -r requirements.txt --quiet

REM Executa o script principal
echo.
echo Abrindo servidor em: http://127.0.0.1:5000
echo Para parar: Ctrl+C
echo ============================================================
echo.

REM Inicia o servidor em background e abre o navegador
start /B python start_full_project.py

REM Aguarda o servidor inicializar
timeout /t 8 /nobreak >nul

REM Abre o frontend no navegador padrao
echo Abrindo frontend no navegador...
start http://127.0.0.1:5000

REM Mantem o terminal aberto para mostrar logs
echo.
echo Servidor rodando! Feche esta janela para parar o servidor.
echo Pressione qualquer tecla para parar o servidor...
pause >nul

REM Para o servidor quando o usuario pressionar uma tecla
taskkill /f /im python.exe 2>nul

echo.
echo Servidor finalizado!
pause