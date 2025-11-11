#!/bin/bash

echo "🚀 Preparando deploy para Render..."
echo ""

# Colores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Añadir todos los cambios
echo -e "${BLUE}📦 Añadiendo archivos al commit...${NC}"
git add .

# Commit
echo -e "${BLUE}💾 Creando commit...${NC}"
git commit -m "Configure for Render deployment - Ready to deploy"

# Push
echo -e "${BLUE}📤 Subiendo a GitHub...${NC}"
git push

echo ""
echo -e "${GREEN}✅ ¡Listo!${NC}"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${YELLOW}📋 PRÓXIMOS PASOS:${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1. Ve a: ${BLUE}https://render.com${NC}"
echo "2. Haz clic en ${YELLOW}'New +'${NC} → ${YELLOW}'Web Service'${NC}"
echo "3. Conecta tu repositorio: ${GREEN}PCSYSTEM${NC}"
echo "4. Render detectará automáticamente ${GREEN}render.yaml${NC}"
echo "5. Haz clic en ${YELLOW}'Create Web Service'${NC}"
echo "6. ${GREEN}¡Espera 5 minutos!${NC} 🚀"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Tu app estará disponible en:"
echo "${GREEN}https://pcsystem.onrender.com${NC}"
echo ""
echo "📖 Guía completa: ${BLUE}DEPLOY_RENDER.md${NC}"
echo ""
