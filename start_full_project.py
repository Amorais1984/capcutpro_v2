#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script para iniciar o projeto completo (Backend + Frontend)
Executa o servidor Flask que serve tanto a API quanto os arquivos estáticos
"""

import os
import sys
import subprocess
import threading
import time
from pathlib import Path

def check_dependencies():
    """Verifica se as dependências estão instaladas"""
    try:
        import flask
        import spacy
        import language_tool_python
        print("✅ Todas as dependências estão instaladas")
        return True
    except ImportError as e:
        print(f"❌ Dependência faltando: {e}")
        print("Execute: pip install -r requirements.txt")
        return False

def check_spacy_model():
    """Verifica se o modelo do spaCy está instalado"""
    try:
        import spacy
        nlp = spacy.load("pt_core_news_sm")
        print("✅ Modelo spaCy português encontrado")
        return True
    except OSError:
        print("❌ Modelo spaCy português não encontrado")
        print("Instalando modelo spaCy...")
        try:
            subprocess.run([sys.executable, "-m", "spacy", "download", "pt_core_news_sm"], check=True)
            print("✅ Modelo spaCy instalado com sucesso")
            return True
        except subprocess.CalledProcessError:
            print("❌ Erro ao instalar modelo spaCy")
            return False

def start_backend():
    """Inicia o servidor backend Flask"""
    print("🚀 Iniciando servidor backend...")
    
    # Importa e executa o backend
    try:
        from backend import app
        app.run(
            host='127.0.0.1',
            port=5000,
            debug=True,
            use_reloader=False,  # Evita reinicialização dupla
            threaded=True
        )
    except Exception as e:
        print(f"❌ Erro ao iniciar backend: {e}")
        sys.exit(1)

def main():
    """Função principal"""
    print("="*60)
    print("🎬 CAPCUT PRO V2 - GERADOR DE LEGENDAS")
    print("="*60)
    
    # Verifica se estamos no diretório correto
    if not os.path.exists('backend.py'):
        print("❌ Arquivo backend.py não encontrado!")
        print("Execute este script no diretório raiz do projeto.")
        sys.exit(1)
    
    # Verifica dependências
    if not check_dependencies():
        sys.exit(1)
    
    # Verifica modelo spaCy
    if not check_spacy_model():
        sys.exit(1)
    
    # Cria diretório de uploads se não existir
    uploads_dir = Path('uploads')
    uploads_dir.mkdir(exist_ok=True)
    
    print("\n🌐 Iniciando servidor completo...")
    print("📍 Frontend: http://127.0.0.1:5000")
    print("🔧 API Backend: http://127.0.0.1:5000/api")
    print("\n⚡ Funcionalidades disponíveis:")
    print("   • Upload de áudio/vídeo")
    print("   • Transcrição automática")
    print("   • Validação de texto")
    print("   • Correção ortográfica")
    print("   • Preview com sincronização")
    print("   • Exportação de legendas")
    print("\n🛑 Para parar: Ctrl+C")
    print("="*60)
    
    try:
        # Inicia o backend (que também serve o frontend)
        start_backend()
    except KeyboardInterrupt:
        print("\n\n🛑 Servidor interrompido pelo usuário")
        print("👋 Até logo!")
        sys.exit(0)
    except Exception as e:
        print(f"\n❌ Erro inesperado: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()