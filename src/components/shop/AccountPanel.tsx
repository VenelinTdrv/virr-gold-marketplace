import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useServerFn } from '@tanstack/react-start';
import { useQueryClient } from '@tanstack/react-query';
import { UserRound, ShieldCheck } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { lovable } from '@/integrations/lovable';
import { Button } from '@/components/ui/button';
import { useAccount } from './AccountProvider';
import { credentialsSchema, profileSchema, type CustomerProfile } from '@/lib/shop/account';
import { getCustomerProfile, saveCustomerProfile } from '@/lib/shop/account.functions';
import '@lovable.dev/cloud-auth-js/styles.css';

const emptyProfile: CustomerProfile = { full_name: '', phone: '', address: '', city: '' };
export function AccountPanel() {
  const { user, ready } = useAccount();
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [profile, setProfile] = useState<CustomerProfile>(emptyProfile);
  const [loaded, setLoaded] = useState(false);
  const fetchProfile = useServerFn(getCustomerProfile);
  const saveProfile = useServerFn(saveCustomerProfile);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  useEffect(() => {
    if (!user) { setLoaded(false); setProfile(emptyProfile); return; }
    let active = true;
    fetchProfile().then(data => { if (active) { setProfile(data); setLoaded(true); } }).catch(() => { if (active) setError('Профилът не може да бъде зареден. Опитайте отново.'); });
    return () => { active = false; };
  }, [user?.id, fetchProfile]);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(''); setMessage('');
    const fields = new FormData(event.currentTarget);
    setBusy(true);
    try {
      if (user) {
        const parsed = profileSchema.safeParse(Object.fromEntries(fields));
        if (!parsed.success) throw new Error(parsed.error.issues[0]?.message);
        setProfile(await saveProfile({ data: parsed.data }));
        setMessage('Данните са запазени.');
      } else if (mode === 'forgot') {
        const email = credentialsSchema.shape.email.parse(fields.get('email'));
        const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset-password` });
        if (error) throw new Error('Не успяхме да изпратим имейл. Опитайте отново.');
        setMessage('Ако има профил с този имейл, ще получите връзка за нова парола.');
      } else {
        const parsed = credentialsSchema.safeParse(Object.fromEntries(fields));
        if (!parsed.success) throw new Error(parsed.error.issues[0]?.message);
        if (mode === 'signup') {
          const name = profileSchema.shape.full_name.parse(fields.get('full_name'));
          if (fields.get('confirm') !== parsed.data.password) throw new Error('Паролите не съвпадат.');
          const { error } = await supabase.auth.signUp({ ...parsed.data, options: { emailRedirectTo: window.location.origin, data: { full_name: name } } });
          if (error) throw new Error('Регистрацията не бе успешна. Проверете данните или опитайте вход.');
          setMessage('Проверете имейла си и потвърдете регистрацията, преди да влезете.');
        } else {
          const { error } = await supabase.auth.signInWithPassword(parsed.data);
          if (error) throw new Error('Невалиден имейл или парола, или непотвърден имейл.');
        }
      }
    } catch (err) { setError(err instanceof Error ? err.message : 'Опитайте отново.'); }
    finally { setBusy(false); }
  }
  async function social(provider: 'google' | 'lovable') {
    setError(''); setBusy(true);
    try {
      const result = await lovable.auth.signInWithOAuth(provider, { redirect_uri: `${window.location.origin}/auth` });
      if (result.error) setError('Входът не бе успешен. Опитайте отново.');
    } catch { setError('Входът не бе успешен. Опитайте отново.'); }
    finally { setBusy(false); }
  }
  async function signOut() {
    setBusy(true); setError('');
    await queryClient.cancelQueries(); queryClient.clear();
    const { error } = await supabase.auth.signOut();
    setBusy(false);
    if (error) { setError('Изходът не бе успешен.'); return; }
    setProfile(emptyProfile); setMessage('');
    await navigate({ to: '/auth', replace: true });
  }
  if (!ready) return <p role="status">Зареждане…</p>;
  return <section className="account-panel">
    <div className="account-brand">VIRR <span>GOLD</span></div>
    <h1><ShieldCheck aria-hidden="true" />{user ? 'Моят профил' : mode === 'signup' ? 'Създайте профил' : mode === 'forgot' ? 'Нова парола' : 'Вход във Virr Gold'}</h1>
    {user ? <p className="account-email">{user.email}</p> : mode !== 'forgot' && <div className="account-tabs">
      <Button variant={mode === 'login' ? 'default' : 'ghost'} onClick={() => { setMode('login'); setMessage(''); setError(''); }}>Вход</Button>
      <Button variant={mode === 'signup' ? 'default' : 'ghost'} onClick={() => { setMode('signup'); setMessage(''); setError(''); }}>Регистрация</Button>
    </div>}
    <form onSubmit={submit} className="account-form" key={user ? user.id : mode}>
      {user ? loaded && <>
        {(['full_name', 'phone', 'city', 'address'] as const).map((key, i) => <label key={key}>{['Име и фамилия', 'Телефон', 'Град', 'Адрес'][i]}<input name={key} autoComplete={['name','tel','address-level2','street-address'][i]} defaultValue={profile[key]} required={key === 'full_name'} maxLength={key === 'address' ? 300 : key === 'phone' ? 30 : 100} /></label>)}
      </> : <>
        {mode === 'signup' && <label>Име и фамилия<input name="full_name" autoComplete="name" maxLength={100} required /></label>}
        <label>Имейл<input name="email" type="email" autoComplete="email" maxLength={255} required /></label>
        {mode !== 'forgot' && <label>Парола<input name="password" type="password" autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} minLength={8} maxLength={128} required /></label>}
        {mode === 'signup' && <label>Повторете паролата<input name="confirm" type="password" autoComplete="new-password" minLength={8} maxLength={128} required /></label>}
      </>}
      {error && <p role="alert" className="account-error">{error}</p>}
      {message && <p role="status" className="account-success">{message}</p>}
      <Button className="account-submit" type="submit" disabled={busy || (Boolean(user) && !loaded)}>{busy ? 'Моля, изчакайте…' : user ? 'Запази данните' : mode === 'signup' ? 'Регистрирай се' : mode === 'forgot' ? 'Изпрати връзка' : 'Вход'}</Button>
    </form>
    {user ? <Button variant="outline" className="account-submit" disabled={busy} onClick={signOut}>Изход</Button> : <>
      <Button variant="link" onClick={() => { setMode(mode === 'forgot' ? 'login' : 'forgot'); setError(''); setMessage(''); }}>{mode === 'forgot' ? 'Обратно към вход' : 'Забравена парола?'}</Button>
      {mode !== 'forgot' && <div className="account-social">
        <Button className="google-auth" disabled={busy} onClick={() => social('google')}><svg aria-hidden="true" viewBox="0 0 24 24"><path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"/><path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z"/><path fill="#FBBC05" d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z"/><path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"/></svg>Продължи с Google</Button>
        <Button className="lovable-auth-button" disabled={busy} onClick={() => social('lovable')}>Continue with Lovable</Button>
      </div>}
    </>}
  </section>;
}
export function AccountEntry({ onClick }: { onClick: () => void }) {
  const { user } = useAccount();
  return <Button variant="outline" className="account-entry" onClick={onClick}><UserRound aria-hidden="true"/><span>{user ? 'Моят профил' : 'Вход / Регистрация'}</span></Button>;
}