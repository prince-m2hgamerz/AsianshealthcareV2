interface PageHeroProps {
  eyebrow: string;
  title: string;
  description: string;
  children?: React.ReactNode;
}

export default function PageHero({ eyebrow, title, description, children }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="container-cinematic relative z-10 py-16 sm:py-20 lg:py-24">
        {children}
        <span className="pill-tag mb-4 inline-block">{eyebrow}</span>
        <h1 className="font-display text-3xl leading-tight sm:text-display-xl lg:text-display-lg text-text mb-4">
          {title}
        </h1>
        <p className="text-body-lg text-shade-50 max-w-2xl">{description}</p>
      </div>
    </section>
  );
}
