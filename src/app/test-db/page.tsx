import { createClient } from '@/lib/supabase/server';
import { ButtonLink } from '@/components/ui/button-link';

export default async function TestPage() {
  const supabase = await createClient();

  // Query usando Supabase Client
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('*')
    .limit(5);

  if (error) {
    return (
      <div className="p-8 min-h-screen" style={{ backgroundColor: '#fafafa' }}>
        <h1 className="text-2xl font-bold mb-4" style={{ color: '#e43157' }}>Error conectando a la DB</h1>
        <pre className="p-4 rounded" style={{ backgroundColor: '#ffe4e6', color: '#0b0d0e' }}>{JSON.stringify(error, null, 2)}</pre>
      </div>
    );
  }

  return (
    <div className="p-8 min-h-screen" style={{ backgroundColor: '#fafafa' }}>
      <h1 className="text-2xl font-bold mb-4" style={{ color: '#19a44b' }}>✅ Conexión a Supabase exitosa</h1>
      <p className="mb-4" style={{ color: '#5c5f6e' }}>Perfiles encontrados: {profiles?.length || 0}</p>
      
      {profiles && profiles.length > 0 ? (
        <pre className="p-4 rounded overflow-auto" style={{ backgroundColor: '#f9f7f0', color: '#0b0d0e' }}>
          {JSON.stringify(profiles, null, 2)}
        </pre>
      ) : (
        <p style={{ color: '#5c5f6e' }}>No hay perfiles aún. La tabla está vacía (pero existe ✓)</p>
      )}
      
      <div className="mt-6">
        <ButtonLink href="/" variant="primary" size="md">
          ← Volver al inicio
        </ButtonLink>
      </div>
    </div>
  );
}
