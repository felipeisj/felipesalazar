import { PERSONAL } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="border-t border-line py-10">
      <div className="mx-auto max-w-3xl px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-ink-faint">
        <p>
          © {new Date().getFullYear()} {PERSONAL.name}. {PERSONAL.location}.
        </p>
        <p>Construido con Next.js, TypeScript &amp; Tailwind CSS.</p>
      </div>
    </footer>
  );
}
