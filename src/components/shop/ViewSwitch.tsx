import { useNavigate } from '@tanstack/react-router';
import { UserRound, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ViewSwitch({ view }: { view: 'user' | 'admin' }) {
  const navigate = useNavigate();
  return <div className="view-switch" role="group" aria-label="User / Admin">
    <Button variant={view === 'user' ? 'default' : 'ghost'} aria-pressed={view === 'user'} onClick={() => { if (view !== 'user') void navigate({ to: '/' }); }}><UserRound />User</Button>
    <Button variant={view === 'admin' ? 'default' : 'ghost'} aria-pressed={view === 'admin'} title="Admin preview" onClick={() => { if (view !== 'admin') void navigate({ to: '/admin-preview', search: {} }); }}><LayoutDashboard />Admin</Button>
  </div>;
}