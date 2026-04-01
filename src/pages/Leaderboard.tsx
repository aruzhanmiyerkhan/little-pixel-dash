import { useNavigate } from "react-router-dom";
import PixelButton from "@/components/PixelButton";
import { getLeaderboard } from "@/lib/gameStore";

const Leaderboard = () => {
  const navigate = useNavigate();
  const board = getLeaderboard();

  return (
    <div className="min-h-screen flex flex-col items-center gap-6 p-4 pt-8 scanlines">
      <h1 className="text-lg font-pixel text-primary neon-text">🏆 Рейтинг</h1>

      <div className="w-full max-w-sm space-y-2">
        {board.length === 0 && (
          <p className="font-pixel text-[8px] text-muted-foreground text-center py-8">
            Пока пусто. Сыграй первым!
          </p>
        )}
        {board.slice(0, 20).map((entry, i) => (
          <div
            key={i}
            className={`pixel-border bg-card p-3 flex justify-between items-center ${
              i < 3 ? "neon-box" : ""
            }`}
          >
            <div className="flex items-center gap-3">
              <span className={`font-pixel text-[10px] ${
                i === 0 ? "text-coin" : i === 1 ? "text-muted-foreground" : i === 2 ? "text-accent" : "text-muted-foreground"
              }`}>
                #{i + 1}
              </span>
              <span className="font-pixel text-[8px] text-foreground">{entry.nickname}</span>
            </div>
            <div className="text-right">
              <span className="font-pixel text-[9px] text-primary">{entry.score}</span>
              <span className="font-pixel text-[6px] text-muted-foreground ml-2">{entry.arena}</span>
            </div>
          </div>
        ))}
      </div>

      <PixelButton variant="secondary" size="sm" onClick={() => navigate("/")}>
        ← Назад
      </PixelButton>
    </div>
  );
};

export default Leaderboard;
