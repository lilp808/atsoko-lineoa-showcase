import { EXAMPLES } from "@/lib/examples";
import type { ExampleContext } from "@/lib/examples/types";
import { UI, type Lang } from "@/lib/site-text";
import ChatMock, { SimTapToast } from "@/components/ChatMock";
import CopyButton from "@/components/CopyButton";

/**
 * ทั้งหน้าพึ่ง searchParams (lang) จึง render เป็น dynamic route
 * ตามคู่มือ cache-components ของ Next 16: instant=false อนุญาต blocking route
 * https://nextjs.org/docs/messages/blocking-prerender-dynamic
 */
export const instant = false;

export default async function Page(props: PageProps<"/">) {
  const query = await props.searchParams;
  const lang: Lang = query.lang === "en" ? "en" : "th";
  const t = UI[lang];
  const other: Lang = lang === "th" ? "en" : "th";

  const ctx: ExampleContext = { baseUrl: "https://<app>.vercel.app" };
  const categories = [...new Set(EXAMPLES.map((e) => e.category))];

  return (
    <main className="mx-auto w-full max-w-6xl px-5 pb-24">
      {/* Header */}
      <header className="border-b-4 border-[var(--gold-400)] py-14 text-center">
        <p className="font-en text-xs font-semibold tracking-[0.35em] text-[var(--gold-600)] uppercase">
          ATSOKO · LINE OA SHOWCASE
        </p>
        <h1 className="mt-3 text-3xl font-bold text-[#111827] sm:text-4xl">{t.h1}</h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-[#374151]">{t.sub}</p>
        {t.langNote && (
          <p className="mx-auto mt-3 max-w-xl rounded-lg bg-[var(--gold-50)] px-4 py-2 text-xs text-[var(--gold-700)]">
            {t.langNote}
          </p>
        )}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <CopyButton text="help" label={t.startBtn} className="!px-4 !py-2 !text-sm" />
          <a
            href="/api/examples"
            target="_blank"
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-[#374151] hover:bg-slate-50"
          >
            {t.jsonLink} →
          </a>
          <a
            href="/api/webhook"
            target="_blank"
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-[#374151] hover:bg-slate-50"
          >
            {t.webhookLink} →
          </a>
          <a
            href={other === "en" ? "?lang=en" : "/"}
            className="rounded-full bg-[var(--gold-400)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--gold-500)]"
          >
            🌐 {t.langSwitch}
          </a>
        </div>
      </header>

      {/* Setup */}
      <section className="mt-10 rounded-2xl border border-[var(--gold-200)] bg-[var(--gold-50)] p-6">
        <h2 className="text-lg font-semibold text-[var(--gold-700)]">{t.setupTitle}</h2>
        <ol className="mt-3 grid gap-2 text-sm text-[var(--gold-900)] sm:grid-cols-2">
          {t.steps.map((s, i) => (
            <li key={i}>
              <b>{i + 1}.</b>{" "}
              {s.split(/(LINE_CHANNEL_ACCESS_TOKEN|LINE_CHANNEL_SECRET|https:\/\/<app>\.vercel\.app\/api\/webhook|NEXT_PUBLIC_BASE_URL|"help"|Use webhook)/).map((part, j) =>
                /^(LINE_CHANNEL_\w+|https:\/\/.+|NEXT_PUBLIC_BASE_URL)$/.test(part) ? (
                  <code key={j} className="rounded bg-white px-1.5 py-0.5 font-en text-xs">
                    {part}
                  </code>
                ) : part === "Use webhook" ? (
                  <b key={j}>{part}</b>
                ) : (
                  <span key={j}>{part}</span>
                ),
              )}
            </li>
          ))}
        </ol>
      </section>

      {/* Catalog */}
      {categories.map((cat) => (
        <section key={cat} className="mt-14">
          <h2 className="font-en text-xs font-semibold tracking-[0.3em] text-[var(--gold-600)] uppercase">
            ◆ {t.categories[cat] ?? cat}
          </h2>
          <div className="mt-4 space-y-8">
            {EXAMPLES.filter((e) => e.category === cat).map((ex) => {
              const messages = ex.build(ctx);
              const json = JSON.stringify(messages, null, 2);
              const meta = lang === "en" ? t.examples[ex.id] : undefined;
              const title = meta?.title ?? ex.title;
              const description = meta?.description ?? ex.description;
              const note = meta ? (meta.note ?? null) : ex.note ?? null;
              return (
                <article
                  key={ex.id}
                  id={ex.id}
                  className="grid gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:grid-cols-[360px_1fr]"
                >
                  <div className="flex justify-center lg:justify-start">
                    <ChatMock kind={ex.preview} lang={lang} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-xl font-bold text-[#111827]">{title}</h3>
                      <CopyButton text={ex.keyword} label={t.typeLabel(ex.keyword)} />
                    </div>
                    <p className="mt-1 text-sm leading-relaxed text-[#374151]">{description}</p>
                    {note && (
                      <p className="mt-2 rounded-lg bg-[var(--gold-50)] px-3 py-2 text-xs text-[var(--gold-700)]">
                        ⚠️ {note}
                      </p>
                    )}
                    {ex.aliases.length > 0 && (
                      <p className="mt-2 text-xs text-[#6B7280]">
                        {t.alsoLabel}{" "}
                        {ex.aliases.map((a) => (
                          <code key={a} className="mr-1 rounded bg-slate-100 px-1.5 py-0.5 font-en text-[11px]">
                            {a}
                          </code>
                        ))}
                      </p>
                    )}
                    <details className="group mt-4">
                      <summary className="cursor-pointer list-none rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-[#374151] hover:bg-slate-50 group-open:border-[var(--gold-200)] group-open:bg-[var(--gold-50)]">
                        {t.rawLabel(Array.isArray(messages) ? messages.length : 1)}{" "}
                        <span className="float-right text-xs text-[var(--gold-600)] opacity-0 group-open:opacity-100">
                          {t.closeLabel}
                        </span>
                      </summary>
                      <div className="relative mt-2">
                        <CopyButton
                          text={json}
                          label={t.copyJsonLabel}
                          className="absolute top-2 right-2 z-10 !bg-white"
                        />
                        <pre className="max-h-96 overflow-auto rounded-xl bg-[#111827] p-4 text-[11px] leading-relaxed text-[#FDF6E3]">
                          <code>{json}</code>
                        </pre>
                      </div>
                    </details>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      ))}

      <footer className="mt-20 border-t border-slate-200 pt-6 text-center text-xs text-[#6B7280]">
        {t.footer}{" "}
        <a className="text-[var(--gold-600)] underline" href="https://developers.line.biz/en/reference/messaging-api/">
          LINE Messaging API
        </a>
      </footer>

      <SimTapToast />
    </main>
  );
}
