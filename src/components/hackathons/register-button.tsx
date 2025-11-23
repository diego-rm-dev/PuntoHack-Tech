'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { registerForHackathon } from '@/modules/hackathons';

interface RegisterButtonProps {
  hackathonId: string;
}

export function RegisterButton({ hackathonId }: RegisterButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async () => {
    setIsLoading(true);
    setError(null);

    const result = await registerForHackathon(hackathonId);

    if (result.success) {
      router.refresh();
    } else {
      setError(result.error || 'Error al registrarse');
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <Button 
        onClick={handleRegister} 
        disabled={isLoading}
        className="w-full"
        size="lg"
      >
        {isLoading ? 'Registrando...' : 'Registrarse'}
      </Button>
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}
