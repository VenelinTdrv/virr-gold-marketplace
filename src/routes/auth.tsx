import { createFileRoute, Link } from '@tanstack/react-router';
import { AccountPanel } from '@/components/shop/AccountPanel';
export const Route = createFileRoute('/auth')({
  head: () => ({ meta: [{ title: 'Вход и регистрация | Virr Gold' }, { name: 'description', content: 'Влезте или създайте личен профил във Virr Gold.' }, { property: 'og:title', content: 'Вашият профил | Virr Gold' }, { property: 'og:description', content: 'Вход, регистрация и лични данни във Virr Gold.' }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary' }] }),
  component: () => <main className="account-page"><Link to="/">← Към магазина</Link><AccountPanel /></main>,
});