import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PixelButton from "@/components/PixelButton";
import { addToLeaderboard, getPlayer, savePlayer } from "@/lib/gameStore";

const Results = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { score = 0, coins = 0, arenaName = "" } = (location.state as any) || {};
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (saved) return;
    const player = getPlayer();
    const newHighScore = Math.max(player.highScore, score);
    savePlayer({
      coins: player.coins + coins,
      highScore: newHighScore,
    });
    addToLeaderboard({ nickname: player.nickname, score, arena: arenaName });
    setSaved(true);
  }, [score, coins, arenaName, saved]);

  const player = getPlayer();
  const isNewRecord = score >= player.highScore && score > 0;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-4 scanlines">
      <h1 className="text-lg font-pixel text-primary neon-text">Результаты</h1>

      {isNewRecord && (
        <p className="text-[10px] font-pixel text-accent animate-pulse-neon">🎉 Новый рекорд!</p>
      )}

      <div className="pixel-border bg-card p-6 space-y-4 w-full max-w-xs">
        <div className="flex justify-between font-pixel text-[9px]">
          <span className="text-muted-foreground">Арена:</span>
          <span className="text-foreground">{arenaName}</span>
        </div>
        <div className="flex justify-between font-pixel text-[9px]">
          <span className="text-muted-foreground">Очки:</span>
          <span className="text-primary">{score}</span>
        </div>
        <div className="flex justify-between font-pixel text-[9px]">
          <span className="text-muted-foreground">Монеты:</span>
          <span className="text-coin">+{coins}</span>
        </div>
        <div className="flex justify-between font-pixel text-[9px]">
          <span className="text-muted-foreground">Всего монет:</span>
          <span className="text-coin">{player.coins}</span>
        </div>
      </div>

      <div className="flex flex-col gap-3 w-full max-w-xs">
        <PixelButton onClick={() => navigate("/arena")}>▶ Снова</PixelButton>
        <PixelButton variant="accent" onClick={() => navigate("/shop")}>🛒 Магазин</PixelButton>
        <PixelButton variant="secondary" size="sm" onClick={() => navigate("/")}>← Меню</PixelButton>
      </div>
    </div>
  );
};

export default Results;
