import { HardHat, Code2, Smartphone, ShieldCheck } from 'lucide-react';
import initialClients from '@/data/clients.json';
import { getCloudinaryUrl } from '@/lib/cloudinary-helper';

interface ClientProject {
  id?: string;
  name: string;
  category: 'Construcción' | 'Desarrollo a Medida' | 'Apps Móviles';
  description: string;
  logoText: string;
  logoColor: string;
  badgeBg: string;
  badgeText: string;
  projectHighlights: string[];
  logoImage?: string;
}

export function ClientPanel() {
  const projects = initialClients as ClientProject[];

  const getCategoryIcon = (category: ClientProject['category']) => {
    switch (category) {
      case 'Construcción':
        return <HardHat className="h-3.5 w-3.5" />;
      case 'Desarrollo a Medida':
        return <Code2 className="h-3.5 w-3.5" />;
      case 'Apps Móviles':
        return <Smartphone className="h-3.5 w-3.5" />;
    }
  };

  // Triplicamos la lista para asegurar un scroll continuo sin saltos visuales
  const doubledProjects = [...projects, ...projects, ...projects];

  return (
    <div className="relative w-full overflow-hidden py-4">
      {/* Styles injected directly to bypass any Turbopack CSS cache issues */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marquee-custom-kf {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        .animate-marquee-custom-class {
          display: flex;
          width: max-content;
          gap: 1rem;
          animation: marquee-custom-kf 37s linear infinite !important;
        }
        @media (min-width: 640px) {
          .animate-marquee-custom-class {
            gap: 1.5rem;
          }
        }
        .animate-marquee-custom-class:hover {
          animation-play-state: paused !important;
        }
      `}} />

      {/* Degradados laterales para difuminar bordes del marquee */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white via-white/70 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white via-white/70 to-transparent z-10 pointer-events-none" />

      {/* Marquee Container */}
      <div className="overflow-hidden relative w-full">
        <div className="animate-marquee-custom-class py-2 cursor-grab active:cursor-grabbing">
          {doubledProjects.map((project, index) => (
            <div
              key={`${project.name}-${index}`}
              className="w-[240px] sm:w-[300px] flex-shrink-0 flex flex-col justify-between bg-white border border-slate-200/70 rounded-2xl p-4 sm:p-5 shadow-soft hover:shadow-soft-lg hover:-translate-y-1 transition-all duration-300 select-none"
            >
              <div>
                {/* Header: Logo & Badge */}
                <div className="flex items-start justify-between mb-4">
                  {/* Styled inline logo (Image or initials fallback) */}
                  {project.logoImage ? (
                    <div className="h-10 w-10 rounded-xl flex items-center justify-center overflow-hidden shrink-0 shadow-sm border border-slate-200/80 bg-white">
                      <img
                        src={getCloudinaryUrl(project.logoImage, 'logo')}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div
                      className={[
                        'h-10 w-10 rounded-xl flex items-center justify-center text-white font-black text-xs shadow-sm bg-gradient-to-br',
                        project.logoColor
                      ].join(' ')}
                    >
                      {project.logoText}
                    </div>
                  )}

                  {/* Category Badge */}
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[9px] font-bold tracking-wide ${project.badgeBg}`}>
                    {getCategoryIcon(project.category)}
                    {project.badgeText}
                  </span>
                </div>

                {/* Title & Description */}
                <h4 className="text-sm font-bold text-slate-900 mb-1 leading-snug">
                  {project.name}
                </h4>
                <p className="text-slate-600 text-[11px] leading-relaxed mb-4 line-clamp-2">
                  {project.description}
                </p>
              </div>

              {/* Solution Highlights */}
              <div className="pt-3 border-t border-slate-100 mt-auto">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3 text-emerald-500" /> Solución
                </p>
                <div className="flex flex-wrap gap-1">
                  {project.projectHighlights && project.projectHighlights.map((highlight) => (
                    <span
                      key={highlight}
                      className="text-[9px] font-medium bg-slate-50 text-slate-600 border border-slate-200/60 px-2 py-0.5 rounded-md"
                    >
                      {highlight}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
