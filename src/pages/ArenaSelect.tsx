import { useNavigate } from "react-router-dom";
import PixelButton from "@/components/PixelButton";
import { ARENAS } from "@/lib/gameStore";

const ArenaSelect = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8 p-4 scanlines">
      <h1 className="text-lg font-pixel text-primary neon-text">Выбери арену</h1>

      <div className="flex flex-col gap-4 w-full max-w-sm">
        {ARENAS.map((arena) => (
          <button
            key={arena.id}
            onClick={() => navigate(`/game/${arena.id}`)}
            className="pixel-border bg-card p-4 text-left hover:brightness-125 transition-all cursor-pointer active:translate-y-1"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="font-pixel text-[10px] text-foreground">{arena.name}</span>
              <span
                className={`font-pixel text-[8px] ${
                  arena.color === "primary" ? "text-primary" : arena.color === "accent" ? "text-accent" : "text-destructive"
                }`}
              >
                {arena.difficulty}
              </span>
            </div>
            <div className="flex gap-1">
              {Array.from({ length: arena.id === "easy" ? 1 : arena.id === "medium" ? 2 : 3 }).map((_, i) => (
                <div key={i} className="w-2 h-2 bg-accent" />
              ))}
              {Array.from({ length: 3 - (arena.id === "easy" ? 1 : arena.id === "medium" ? 2 : 3) }).map((_, i) => (
                <div key={i} className="w-2 h-2 bg-muted" />
              ))}
            </div>
          </button>
        ))}
      </div>

      <PixelButton variant="secondary" size="sm" onClick={() => navigate("/")}>
        ← Назад
      </PixelButton>
    </div>
  );
};

export default ArenaSelect;
