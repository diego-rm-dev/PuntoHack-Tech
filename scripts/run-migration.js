/**
 * Script para ejecutar migraciones usando Supabase Management API
 * 
 * Este script lee el archivo migration.sql y lo ejecuta en Supabase
 * usando el API de Management.
 * 
 * Uso: node scripts/run-migration.js
 */

import { readFileSync } from 'fs';
import { join } from 'path';
import 'dotenv/config';

const SUPABASE_PROJECT_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const PROJECT_REF = SUPABASE_PROJECT_URL?.split('//')[1]?.split('.')[0];

if (!SUPABASE_PROJECT_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Faltan variables de entorno:');
  console.error('   - NEXT_PUBLIC_SUPABASE_URL');
  console.error('   - SUPABASE_SERVICE_ROLE_KEY');
  console.error('\n💡 Obtén el Service Role Key desde: https://supabase.com/dashboard/project/_/settings/api');
  process.exit(1);
}

async function runMigration() {
  try {
    console.log('📖 Leyendo archivo de migración...');
    const migrationSQL = readFileSync(join(process.cwd(), 'migration.sql'), 'utf-8');

    console.log('🚀 Ejecutando migración en Supabase...');
    console.log(`📡 Project: ${PROJECT_REF}`);
    
    // Usar la Management API de Supabase para ejecutar SQL
    const response = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      },
      body: JSON.stringify({ 
        query: migrationSQL 
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Error HTTP ${response.status}: ${error}`);
    }

    const result = await response.json();
    console.log('✅ Migración ejecutada exitosamente');
    console.log('📊 Resultado:', result);
    console.log('🎉 Tu base de datos está lista');
    
  } catch (error) {
    console.error('❌ Error ejecutando migración:', error.message);
    console.log('\n💡 La API de Management no está disponible aún.');
    console.log('   Por favor, ejecuta la migración manualmente:');
    console.log('   1. Ve a: https://supabase.com/dashboard/project/cqpstzagmxiigvkehxcz/sql/new');
    console.log('   2. Copia todo el contenido de migration.sql');
    console.log('   3. Pégalo en el editor y haz clic en "Run"');
    process.exit(1);
  }
}

runMigration();
