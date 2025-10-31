#!/bin/bash

echo "🔐 Generando Secrets Seguros para Render.com"
echo "==========================================="
echo ""

JWT_ACCESS_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
JWT_REFRESH_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")

echo "📋 Copia estos valores a Render.com Environment Variables:"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "JWT_ACCESS_SECRET:"
echo "$JWT_ACCESS_SECRET"
echo ""
echo "JWT_REFRESH_SECRET:"
echo "$JWT_REFRESH_SECRET"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✅ Secrets generados correctamente"
