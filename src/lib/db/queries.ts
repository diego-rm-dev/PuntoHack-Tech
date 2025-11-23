/**
 * Helper functions para interactuar con la base de datos
 * usando Supabase Client
 * 
 * Estos ejemplos muestran cómo hacer queries comunes
 * sin necesidad de conexión directa a Postgres
 */

import { createClient } from '@/core/supabase/server';

export async function getProfiles() {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('createdAt', { ascending: false });
  
  if (error) throw error;
  return data;
}

export async function getProfileByUserId(userId: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('userId', userId)
    .single();
  
  if (error) throw error;
  return data;
}

export async function createProfile(profile: {
  userId: string;
  name: string;
  email?: string;
}) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('profiles')
    .insert(profile)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function getHackathons(status?: 'DRAFT' | 'REGISTRATION' | 'RUNNING' | 'JUDGING' | 'FINISHED') {
  const supabase = await createClient();
  
  let query = supabase
    .from('hackathons')
    .select('*')
    .order('startsAt', { ascending: true });
  
  if (status) {
    query = query.eq('status', status);
  }
  
  const { data, error } = await query;
  
  if (error) throw error;
  return data;
}

export async function getHackathonBySlug(slug: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('hackathons')
    .select(`
      *,
      participations:hackathon_participations(count),
      teams(count)
    `)
    .eq('slug', slug)
    .single();
  
  if (error) throw error;
  return data;
}

export async function getTeamsByHackathon(hackathonId: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('teams')
    .select(`
      *,
      members:team_members(
        profile:profiles(*)
      )
    `)
    .eq('hackathonId', hackathonId);
  
  if (error) throw error;
  return data;
}

export async function getSubmissionsByHackathon(hackathonId: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('submissions')
    .select(`
      *,
      team:teams(*),
      scores(*)
    `)
    .eq('hackathonId', hackathonId);
  
  if (error) throw error;
  return data;
}
