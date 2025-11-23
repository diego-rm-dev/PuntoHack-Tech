import { redirect } from 'next/navigation';
import { currentUser } from '@clerk/nextjs/server';
import { createClient } from '@/core/supabase/server';
import { completeOnboardingAction } from './actions';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default async function OnboardingPage() {
  const user = await currentUser();
  if (!user) redirect('/sign-in');
  const supabase = await createClient();
  const { data: existingProfile } = await supabase.from('profiles').select('id').eq('userId', user.id).single();
  if (existingProfile) redirect('/dashboard');
  
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-slate-50 dark:bg-slate-900">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-3xl">Welcome to PuntoHack! 🎉</CardTitle>
          <CardDescription>
            Complete your profile to get started with hackathons
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={completeOnboardingAction} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="John Doe"
                defaultValue={user.fullName || user.username || ''}
                required
                minLength={2}
                maxLength={100}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                name="bio"
                placeholder="Tell us about yourself..."
                rows={4}
                maxLength={500}
              />
              <p className="text-xs text-slate-500">
                Optional: Share your background, interests, or what brings you to PuntoHack
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="techStack">Tech Stack</Label>
              <Input
                id="techStack"
                name="techStack"
                type="text"
                placeholder="React, Node.js, Python, PostgreSQL..."
                maxLength={200}
              />
            </div>

            {/* Role Selection */}
            <div className="space-y-2">
              <Label htmlFor="role">I want to join as *</Label>
              <select
                id="role"
                name="role"
                required
                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300"
              >
                <option value="PARTICIPANT">Participant - Join hackathons and build projects</option>
                <option value="JUDGE">Judge - Evaluate submissions and provide feedback</option>
                <option value="SPONSOR">Sponsor - Support hackathons and offer challenges</option>
                <option value="ORGANIZER">Organizer - Create and manage hackathons</option>
              </select>
              <p className="text-xs text-slate-500">
                You can change this later or have multiple roles
              </p>
            </div>
            
            <input type="hidden" name="userId" value={user.id}/>
            <input type="hidden" name="email" value={user.emailAddresses[0]?.emailAddress || ''}/>
            <input type="hidden" name="avatarUrl" value={user.imageUrl || ''}/>
            
            <div className="flex justify-end pt-4">
              <Button type="submit" size="lg">
                Complete Setup →
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
