import React, { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function FeatureCarousel({ items = [] }) {
  const scroller = useRef(null);

  const cardWidth = () => {
    const el = scroller.current?.querySelector("[data-card]");
    return el ? el.clientWidth + 24 : 320;
  };

  const scrollBy = (dir) => {
    if (scroller.current) {
      scroller.current.scrollBy({ left: dir * cardWidth(), behavior: "smooth" });
    }
  };

  return (
    <div className="relative">
      {/* Arrows */}
      <button
        onClick={() => scrollBy(-1)}
        className="hidden md:flex absolute -left-5 top-1/2 -translate-y-1/2 z-10 h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg hover:bg-gray-100 transition"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={() => scrollBy(1)}
        className="hidden md:flex absolute -right-5 top-1/2 -translate-y-1/2 z-10 h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg hover:bg-gray-100 transition"
      >
        <ChevronRight size={20} />
      </button>

      {/* Scroller */}
      <div
        ref={scroller}
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory px-2 pb-4 hide-scrollbar"
      >
        {items.map((it) => (
          <article
  key={it.id}
  data-card
  className={`snap-start min-w-[260px] sm:min-w-[300px] lg:min-w-[340px]
    rounded-3xl bg-gradient-to-br ${it.gradientFrom} ${it.gradientTo}
    shadow-lg ring-1 ${it.ring || "ring-black/10"}
    overflow-hidden relative
    transition-all duration-300 ease-out
    hover:-translate-y-2 hover:shadow-2xl hover:scale-105`}
>
  {/* Decoration */}
  <div className="absolute -right-8 -top-8 h-32 w-32 bg-white/30 rounded-full blur-2xl" />

  <div className="p-6 flex flex-col h-full justify-between">
    <div>
      {it.subtitle && (
        <span className="inline-block mb-3 text-xs font-semibold bg-red-600 text-white rounded-full px-2 py-0.5">
          {it.subtitle}
        </span>
      )}
      <div className="text-4xl mb-4">{it.icon}</div>
      <h3 className="text-xl font-bold text-gray-900">{it.title}</h3>
      <p className="mt-2 text-sm text-gray-700 leading-relaxed">
        {it.description}
      </p>
    </div>

    <div className="bg-white/90 backdrop-blur px-4 py-2 mt-6 text-center text-gray-900 text-sm font-semibold rounded-md">
      {it.footer}
    </div>
  </div>
</article>

        ))}
      </div>
    </div>
  );
}
