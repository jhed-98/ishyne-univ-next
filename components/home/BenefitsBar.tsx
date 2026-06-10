import { useTranslations } from 'next-intl';
import FadeInOnScroll from '@/components/ui/FadeInOnScroll';

const BENEFIT_ICONS = ['🚚', '🔒', '🔄', '💬'];

export default function BenefitsBar() {
  const t = useTranslations('benefits');

  const benefits = [
    { icon: BENEFIT_ICONS[0], label: t('item1') },
    { icon: BENEFIT_ICONS[1], label: t('item2') },
    { icon: BENEFIT_ICONS[2], label: t('item3') },
    { icon: BENEFIT_ICONS[3], label: t('item4') },
  ];

  return (
    <section className="relative bg-onyx-light border-y border-onyx-border py-5" aria-label="Beneficios de iShyne">
      {/* Gold accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-champagne/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-0 md:divide-x md:divide-onyx-border">
          {benefits.map((benefit, i) => (
            <FadeInOnScroll key={i} delay={i * 80} direction="none">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 px-4 py-2 group">
                <span className="text-2xl sm:text-xl group-hover:scale-110 transition-transform duration-300">
                  {benefit.icon}
                </span>
                <span className="text-xs sm:text-sm text-cream/60 font-medium text-center sm:text-left group-hover:text-cream/90 transition-colors">
                  {benefit.label}
                </span>
              </div>
            </FadeInOnScroll>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-champagne/30 to-transparent" />
    </section>
  );
}
