import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import FadeInOnScroll from '@/components/ui/FadeInOnScroll';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'about' });
  return {
    title: `${t('title')} | iShyne`,
    description: t('mission_text'),
  };
}

const VALUES = [
  { icon: '✦', color: 'text-champagne' },
  { icon: '◈', color: 'text-rose-gold' },
  { icon: '◆', color: 'text-champagne' },
  { icon: '◇', color: 'text-rose-gold' },
];

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'about' });

  // Values and steps come from the i18n dictionary
  const values = t.raw('values') as Array<{ title: string; desc: string }>;
  const steps = t.raw('steps') as Array<{ step: string; title: string; desc: string }>;

  return (
    <div className="min-h-screen pt-24 pb-20">
      {/* ── Hero Banner ── */}
      <section className="relative overflow-hidden py-28 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-b from-onyx via-onyx-light to-onyx" />
        {/* Decorative circles */}
        <div className="absolute top-10 right-10 w-64 h-64 rounded-full border border-champagne/5 pointer-events-none" />
        <div className="absolute top-16 right-16 w-48 h-48 rounded-full border border-rose-gold/10 pointer-events-none" />
        <div className="absolute -bottom-10 left-10 w-80 h-80 rounded-full border border-champagne/5 pointer-events-none" />

        <div className="relative max-w-3xl mx-auto text-center">
          <FadeInOnScroll>
            <p className="text-rose-gold text-xs tracking-[0.4em] uppercase mb-4">iShyne</p>
            <h1 className="font-playfair text-5xl md:text-6xl font-bold text-cream mb-6 leading-tight">
              {t('title')}
            </h1>
            <p className="text-cream/50 text-lg leading-relaxed">{t('subtitle')}</p>
            <div className="w-20 h-px bg-gradient-to-r from-transparent via-champagne to-transparent mx-auto mt-8" />
          </FadeInOnScroll>
        </div>
      </section>

      {/* ── Mission & Vision ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Mission */}
          <FadeInOnScroll direction="left">
            <div className="relative p-8 rounded-3xl bg-onyx-light border border-onyx-border overflow-hidden group hover:border-champagne/20 transition-all duration-500">
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-champagne/60 to-transparent rounded-tl-3xl rounded-bl-3xl" />
              <div className="absolute top-4 right-4 text-6xl font-playfair text-champagne/5 select-none">M</div>
              <span className="inline-block text-champagne text-xs tracking-[0.3em] uppercase mb-4 font-medium">
                Misión
              </span>
              <h2 className="font-playfair text-2xl text-cream mb-4">{t('mission_title')}</h2>
              <p className="text-cream/55 leading-relaxed">{t('mission_text')}</p>
            </div>
          </FadeInOnScroll>

          {/* Vision */}
          <FadeInOnScroll direction="right">
            <div className="relative p-8 rounded-3xl bg-onyx-light border border-onyx-border overflow-hidden group hover:border-rose-gold/20 transition-all duration-500">
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-rose-gold/60 to-transparent rounded-tl-3xl rounded-bl-3xl" />
              <div className="absolute top-4 right-4 text-6xl font-playfair text-rose-gold/5 select-none">V</div>
              <span className="inline-block text-rose-gold text-xs tracking-[0.3em] uppercase mb-4 font-medium">
                Visión
              </span>
              <h2 className="font-playfair text-2xl text-cream mb-4">{t('vision_title')}</h2>
              <p className="text-cream/55 leading-relaxed">{t('vision_text')}</p>
            </div>
          </FadeInOnScroll>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-onyx-light border-y border-onyx-border">
        <div className="max-w-6xl mx-auto">
          <FadeInOnScroll>
            <div className="text-center mb-14">
              <p className="text-rose-gold text-xs tracking-[0.3em] uppercase mb-3">Lo que nos define</p>
              <h2 className="font-playfair text-4xl text-cream">{t('values_title')}</h2>
              <div className="w-12 h-px bg-champagne/50 mx-auto mt-5" />
            </div>
          </FadeInOnScroll>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((val, i) => (
              <FadeInOnScroll key={i} delay={i * 100} direction="up">
                <div className="p-6 rounded-2xl border border-onyx-border bg-onyx hover:border-champagne/30 transition-all duration-300 group text-center">
                  <div className={`text-3xl mb-4 ${VALUES[i]?.color ?? 'text-champagne'} group-hover:scale-110 transition-transform duration-300`}>
                    {VALUES[i]?.icon ?? '✦'}
                  </div>
                  <h3 className="font-playfair text-lg text-cream mb-2">{val.title}</h3>
                  <p className="text-cream/45 text-sm leading-relaxed">{val.desc}</p>
                </div>
              </FadeInOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ── Steps: Buy in 3 Steps ── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <FadeInOnScroll>
          <div className="text-center mb-16">
            <p className="text-rose-gold text-xs tracking-[0.3em] uppercase mb-3">Simple y elegante</p>
            <h2 className="font-playfair text-4xl text-cream">{t('steps_title')}</h2>
            <div className="w-12 h-px bg-champagne/50 mx-auto mt-5" />
          </div>
        </FadeInOnScroll>

        <div className="relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-10 left-[calc(16.67%+1.5rem)] right-[calc(16.67%+1.5rem)] h-px bg-gradient-to-r from-champagne/20 via-champagne/40 to-champagne/20" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {steps.map((step, i) => (
              <FadeInOnScroll key={i} delay={i * 150} direction="up">
                <div className="flex flex-col items-center text-center group">
                  {/* Step number */}
                  <div className="relative w-20 h-20 mb-6">
                    <div className="w-full h-full rounded-full border-2 border-champagne/30 bg-onyx-light flex items-center justify-center group-hover:border-champagne transition-all duration-400">
                      <span className="font-playfair text-2xl font-bold gradient-text">{step.step}</span>
                    </div>
                    {/* Glow */}
                    <div className="absolute inset-0 rounded-full bg-champagne/5 group-hover:bg-champagne/10 transition-all duration-400 blur-xl" />
                  </div>
                  <h3 className="font-playfair text-xl text-cream mb-3">{step.title}</h3>
                  <p className="text-cream/50 text-sm leading-relaxed max-w-[200px]">{step.desc}</p>
                </div>
              </FadeInOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <FadeInOnScroll>
        <section className="py-16 px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <p className="font-playfair text-3xl text-cream mb-3">
              ¿Lista para brillar? ✦
            </p>
            <p className="text-cream/40 mb-8">Descubre nuestra colección y encuentra tu look perfecto.</p>
            <a
              href={`/${locale}#catalogo`}
              className="inline-flex items-center gap-2 bg-champagne text-onyx px-8 py-4 rounded-full font-semibold hover:bg-rose-gold transition-all duration-300 shadow-lg shadow-champagne/20"
            >
              Ver Colección →
            </a>
          </div>
        </section>
      </FadeInOnScroll>
    </div>
  );
}
