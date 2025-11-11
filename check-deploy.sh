#!/bin/bash

echo "🔍 Verificando configuración para Render..."
echo ""

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para verificar archivo
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✅${NC} $1 existe"
        return 0
    else
        echo -e "${RED}❌${NC} $1 NO existe"
        return 1
    fi
}

# Verificar archivos necesarios
echo "📁 Archivos de configuración:"
check_file "package.json"
check_file "next.config.ts"
check_file "render.yaml"
check_file ".nvmrc"
echo ""

# Verificar scripts en package.json
echo "🔧 Scripts de package.json:"
if grep -q '"start".*"next start -p' package.json; then
    echo -e "${GREEN}✅${NC} Script 'start' configurado correctamente"
else
    echo -e "${RED}❌${NC} Script 'start' necesita actualización"
fi

if grep -q '"build".*"next build"' package.json; then
    echo -e "${GREEN}✅${NC} Script 'build' configurado"
else
    echo -e "${RED}❌${NC} Script 'build' falta"
fi
echo ""

# Verificar node_modules
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✅${NC} node_modules existe"
else
    echo -e "${YELLOW}⚠️${NC}  node_modules no existe. Ejecuta: npm install"
fi
echo ""

# Intentar build
echo "🔨 Probando build..."
if npm run build 2>&1 | grep -q "Compiled successfully"; then
    echo -e "${GREEN}✅${NC} Build exitoso"
else
    echo -e "${YELLOW}⚠️${NC}  Ejecuta 'npm run build' para verificar"
fi
echo ""

# Verificar git
echo "📦 Estado de Git:"
if [ -d ".git" ]; then
    echo -e "${GREEN}✅${NC} Repositorio git inicializado"
    
    # Verificar remote
    if git remote -v | grep -q "origin"; then
        echo -e "${GREEN}✅${NC} Remote 'origin' configurado"
        git remote -v | head -1
    else
        echo -e "${YELLOW}⚠️${NC}  Remote 'origin' no configurado"
        echo "   Ejecuta: git remote add origin <URL>"
    fi
    
    # Verificar cambios sin commit
    if [[ -n $(git status -s) ]]; then
        echo -e "${YELLOW}⚠️${NC}  Tienes cambios sin commit"
        echo "   Ejecuta: git add . && git commit -m 'Ready for deploy'"
    else
        echo -e "${GREEN}✅${NC} No hay cambios sin commit"
    fi
else
    echo -e "${RED}❌${NC} Git no inicializado"
    echo "   Ejecuta: git init"
fi
echo ""

# Resumen final
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 RESUMEN"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Para deployar en Render:"
echo ""
echo "1. Asegúrate de que todos los checks estén en verde ✅"
echo "2. Sube tu código a GitHub:"
echo "   ${YELLOW}git add .${NC}"
echo "   ${YELLOW}git commit -m 'Ready for Render'${NC}"
echo "   ${YELLOW}git push${NC}"
echo ""
echo "3. Ve a https://render.com"
echo "4. New + → Web Service"
echo "5. Conecta tu repositorio PCSYSTEM"
echo "6. ¡Deploy automático! 🚀"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📖 Guía completa: DEPLOY_RENDER.md"
echo ""
