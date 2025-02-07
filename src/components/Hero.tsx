
import { ScrollReveal } from "./ScrollReveal";

export const Hero = () => {
  return (
    <div className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-accent-light to-white">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      <div className="container relative z-10 px-4 py-32">
        <ScrollReveal>
          <p className="text-center text-sm font-medium uppercase tracking-wider text-neutral-600">
            Welcome to Your Project
          </p>
        </ScrollReveal>
        <ScrollReveal delay={200}>
          <h1 className="mt-6 text-center text-5xl font-bold tracking-tight text-neutral-800 md:text-7xl">
            Create Something{" "}
            <span className="relative">
              <span className="relative z-10">Beautiful</span>
              <div className="absolute bottom-0 left-0 right-0 h-3 bg-accent-dark/30" />
            </span>
          </h1>
        </ScrollReveal>
        <ScrollReveal delay={400}>
          <p className="mx-auto mt-6 max-w-2xl text-center text-lg text-neutral-600">
            Start building your next great idea with our beautifully crafted and highly customizable components.
          </p>
        </ScrollReveal>
      </div>
    </div>
  );
};
