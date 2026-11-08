import { Link, createFileRoute } from "@tanstack/react-router";
import { Apple, ChevronDown, Globe, Play } from "lucide-react";

export const Route = createFileRoute("/p2p")({
  head: () => ({
    meta: [
      { title: "P2P инвестиции — VIRR" },
      {
        name: "description",
        content:
          "Инвестирайте в P2P заеми с Virr — до 20% годишна възвръщаемост и обратно изкупуване на инвестицията до 48 часа.",
      },
      { property: "og:title", content: "P2P инвестиции — VIRR" },
      {
        property: "og:description",
        content:
          "Инвестирайте в P2P заеми с Virr — до 20% годишна възвръщаемост и обратно изкупуване на инвестицията до 48 часа.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: P2pPage,
});

const navItems = ["Как работи", "Статистики", "Оригинатори", "Блог", "Новини"];

const media = ["КАПИТАЛ", "VAGABOND", "Bloomberg TV Bulgaria", "INVESTOR.BG", "КАПИТАЛ", "Forbes", "КАПИТАЛ"];

const news = [
  { title: "Премахваме двойната визуализация Евро/Лева", tag: "Продукт" },
  { title: "Свали Virr app", tag: "Мобилно приложение" },
  { title: "Постигнахме 1000 регистрирани инвеститори", tag: "Новина" },
  { title: "Инвестирайте автоматично по ваши правила", tag: "Авто-инвест" },
];

function P2pPage() {
  return (
    <div className="p2p">
      <header className="p2p-header">
        <div className="p2p-header-inner">
          <a className="p2p-logo" href="https://virr.io">
            VIRR
            <small>MONEY NEVER SLEEPS</small>
          </a>

          <div className="p2p-badges">
            <a className="p2p-badge" href="#" onClick={(e) => e.preventDefault()} aria-label="Изтеглете от App Store">
              <Apple className="size-5" />
              <span>
                <small>Download on the</small>
                App Store
              </span>
            </a>
            <a className="p2p-badge" href="#" onClick={(e) => e.preventDefault()} aria-label="Изтеглете от Google Play">
              <Play className="size-5" />
              <span>
                <small>Изтеглете от</small>
                Google Play
              </span>
            </a>
          </div>

          <nav className="p2p-nav" aria-label="Основна навигация">
            {navItems.map((item) => (
              <a key={item} href="#" onClick={(e) => e.preventDefault()}>
                {item}
                {item === "Как работи" && <ChevronDown className="size-3.5" />}
              </a>
            ))}
            <Link to="/" className="p2p-nav-gold">
              Инвестиционно злато
            </Link>
          </nav>

          <div className="p2p-actions">
            <a className="p2p-login" href="#" onClick={(e) => e.preventDefault()}>
              Вход
            </a>
            <a className="p2p-register" href="#" onClick={(e) => e.preventDefault()}>
              Регистрация
            </a>
            <button className="p2p-lang" type="button" aria-label="Избор на език">
              <Globe className="size-4" /> BG <ChevronDown className="size-3.5" />
            </button>
          </div>
        </div>
      </header>

      <main>
        <section className="p2p-hero">
          <div className="p2p-hero-inner">
            <div className="p2p-hero-copy">
              <h1>
                Спечелете до 20% годишна
                <br />
                възвръщаемост.
              </h1>
              <p>Максимизирайте спестяванията си с Virr – за инвеститори, търсещи висока възвръщаемост.</p>
              <a className="p2p-cta" href="#" onClick={(e) => e.preventDefault()}>
                Започнете да инвестирате
              </a>
            </div>

            <div className="p2p-hero-card">
              <span className="p2p-hero-card-logo">VIRR</span>
              <h2>Обратно изкупуване на инвестицията до 48 часа</h2>
              <p>Желаете да се изтеглите от платформата? Ще изкупим инвестицията ви в рамките на 48 часа.</p>
              <a className="p2p-hero-card-btn" href="#" onClick={(e) => e.preventDefault()}>
                Регистрация
              </a>
            </div>
          </div>
        </section>

        <section className="p2p-media" aria-label="В медиите">
          <h2>В медиите</h2>
          <div className="p2p-media-strip">
            {media.map((name, i) => (
              <span key={`${name}-${i}`} className="p2p-media-logo">
                {name}
              </span>
            ))}
          </div>
        </section>

        <section className="p2p-news">
          <div className="p2p-news-head">
            <h2>Последни новини</h2>
            <a href="#" onClick={(e) => e.preventDefault()}>
              Виж всички новини
            </a>
          </div>
          <div className="p2p-news-grid">
            {news.map((item) => (
              <article key={item.title} className="p2p-news-card">
                <div className="p2p-news-visual">
                  <span>{item.tag}</span>
                </div>
                <h3>{item.title}</h3>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer className="p2p-footer">
        <div className="p2p-logo">
          VIRR
          <small>MONEY NEVER SLEEPS</small>
        </div>
        <p>Демонстрационна страница · Част от концепцията за Virr платформата</p>
        <small>© 2026 Virr · Инвестиционните продукти носят риск от загуба на капитал.</small>
      </footer>
    </div>
  );
}
