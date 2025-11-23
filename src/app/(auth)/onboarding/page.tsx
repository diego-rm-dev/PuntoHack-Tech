import { redirect } from 'next/navigation';
import { currentUser } from '@clerk/nextjs/server';
import { createClient } from '@/core/supabase/server';
import { completeOnboardingAction } from './actions';
import { InteractiveInput, InteractiveTextarea, InteractiveSubmitButton } from '@/components/ui/interactive-form';

export default async function OnboardingPage() {
  const user = await currentUser();
  if (!user) redirect('/sign-in');
  const supabase = await createClient();
  const { data: existingProfile } = await supabase.from('profiles').select('id').eq('userId', user.id).single();
  if (existingProfile) redirect('/dashboard');
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ backgroundColor: '#fafafa' }}>
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-8 border border-[#e2e4e9]">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#0b0d0e' }}>Welcome to PuntoHack! 🎉</h1>
          <p className="text-base" style={{ color: '#5c5f6e' }}>Complete your profile to get started with hackathons</p>
        </div>
        <form action={completeOnboardingAction} className="space-y-6">
          <InteractiveInput
            id="name"
            name="name"
            type="text"
            label="Full Name"
            placeholder="John Doe"
            defaultValue={user.fullName || user.username || ''}
            required
            minLength={2}
            maxLength={100}
          />
          
          <InteractiveTextarea
            id="bio"
            name="bio"
            label="Bio"
            placeholder="Tell us about yourself..."
            rows={4}
            maxLength={500}
            helperText="Optional: Share your background, interests, or what brings you to PuntoHack"
          />
          
          <InteractiveInput
            id="techStack"
            name="techStack"
            type="text"
            label="Tech Stack"
            placeholder="React, Node.js, Python, PostgreSQL..."
            maxLength={200}
          />

          {/* Role Selection */}
          <div className="space-y-2">
            <label htmlFor="role" className="block text-sm font-semibold" style={{ color: '#0b0d0e' }}>
              I want to join as *
            </label>
            <select
              id="role"
              name="role"
              required
              className="w-full px-4 py-3 border-2 rounded-lg transition-all focus:outline-none focus:border-[#606fe5] focus:bg-white"
              style={{ 
                borderColor: '#e2e4e9',
                backgroundColor: '#fafafa',
                color: '#0b0d0e'
              }}
            >
              <option value="PARTICIPANT">Participant - Join hackathons and build projects</option>
              <option value="JUDGE">Judge - Evaluate submissions and provide feedback</option>
              <option value="SPONSOR">Sponsor - Support hackathons and offer challenges</option>
              <option value="ORGANIZER">Organizer - Create and manage hackathons</option>
            </select>
            <p className="text-xs" style={{ color: '#838696' }}>
              You can change this later or have multiple roles
            </p>
          </div>
          
          <input type="hidden" name="userId" value={user.id}/>
          <input type="hidden" name="email" value={user.emailAddresses[0]?.emailAddress || ''}/>
          <input type="hidden" name="avatarUrl" value={user.imageUrl || ''}/>
          
          <div className="flex justify-end pt-4">
            <InteractiveSubmitButton>
              Complete Setup →
            </InteractiveSubmitButton>
          </div>
        </form>
      </div>
    </div>
  );
}
