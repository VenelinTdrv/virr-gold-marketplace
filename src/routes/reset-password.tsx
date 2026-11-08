import { createFileRoute, Link } from '@tanstack/react-router';
import { useEffect, useState, type FormEvent } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { credentialsSchema } from '@/lib/shop/account';
export const Route = createFileRoute('/reset-password')({
  head: () => ({ meta: [{ title: 'Нова парола | Virr Gold' }, { name: 'description', content: 'Задайте нова парола за Вашия профил във Virr Gold.' }, { property: 'og:title', content: 'Възстановяване на парола | Virr Gold' }, { property: 'og:description', content: 'Сигурно възстановяване на достъпа до Вашия профил.' }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary' }] }),
  component: ResetPassword,
});
function ResetPassword() {
  const [valid, setValid] = useState(false); const [message, setMessage] = useState(''); const [busy, setBusy] = useState(false);
  useEffect(() => {
    const recovery = new URLSearchParams(window.location.hash.slice(1)).get('type') === 'recovery';
    if (!recovery) return;
    supabase.auth.getUser().then(({ data }) => setValid(Boolean(data.user)));
  }, []);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); const data = new FormData(e.currentTarget);
    const parsed = credentialsSchema.shape.password.safeParse(data.get('password'));
    if (!parsed.success) { setMessage('Паролата трябва да съдържа поне 8 символа.'); return; }
    if (data.get('confirm') !== parsed.data) { setMessage('Паролите не съвпадат.'); return; }
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password: parsed.data });
    setBusy(false); setMessage(error ? 'Връзката е невалидна или изтекла. Поискайте нова.' : 'Паролата е сменена.');
    if (!error) setValid(false);
  }
  return <main className="account-page"><section className="account-panel"><div className="account-brand">VIRR GOLD</div><h1>Нова парола</h1>{valid ? <form className="account-form" onSubmit={submit}><label>Нова парола<input name="password" type="password" minLength={8} maxLength={128} autoComplete="new-password" required /></label><label>Повторете паролата<input name="confirm" type="password" minLength={8} maxLength={128} autoComplete="new-password" required /></label><Button type="submit" disabled={busy}>Запази паролата</Button></form> : <p>{message || 'Отворете валидна връзка от имейла за възстановяване.'}</p>}{valid && message && <p role="status">{message}</p>}<Link to="/auth">Към входа</Link></section></main>;
}