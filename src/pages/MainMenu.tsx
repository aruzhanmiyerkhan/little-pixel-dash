import { useNavigate } from "react-router-dom";
import PixelButton from "@/components/PixelButton";
import { getPlayer } from "@/lib/gameStore";

const MainMenu = () => {
  const navigate = useNavigate();
  const player = getPlayer();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8 p-4 scanlines relative overflow-hidden">
      {/* Decorative pixels */}
      <div className="absolute top-10 left-10 w-4 h-4 bg-primary animate-float" />
      <div className="absolute top-20 right-16 w-3 h-3 bg-accent animate-float" style={{ animationDelay: "0.5s" }} />
      <div className="absolute bottom-20 left-20 w-2 h-2 bg-secondary animate-float" style={{ animationDelay: "1s" }} />

      <div className="text-center space-y-2">
        <h1 className="text-xl md:text-3xl font-pixel text-primary animate-pulse-neon">
          PIXEL RUNNER
        </h1>
        <p className="text-[10px] font-pixel text-accent">ARENA</p>
      </div>

      {/* Pixel character preview */}
      <div className="w-16 h-16 relative animate-float">
        <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 gap-[1px]">
          {/* Simple pixel character */}
          <div /><div className="bg-primary" /><div className="bg-primary" /><div />
          <div className="bg-primary" /><div className="bg-foreground" /><div className="bg-foreground" /><div className="bg-primary" />
          <div /><div className="bg-primary" /><div className="bg-primary" /><div />
          <div className="bg-primary" /><div /><div /><div className="bg-primary" />
        </div>
      </div>

      <div className="flex flex-col gap-3 w-full max-w-xs">
        <PixelButton size="lg" onClick={() => navigate("/arena")}>
          ▶ Начать игру
        </PixelButton>
        <PixelButton variant="accent" onClick={() => navigate("/shop")}>
          🛒 Магазин
        </PixelButton>
        <PixelButton variant="secondary" onClick={() => navigate("/leaderboard")}>
          🏆 Рейтинг
        </PixelButton>
      </div>

      <div className="text-[8px] font-pixel text-muted-foreground text-center space-y-1">
        <p>Монеты: <span className="text-coin">{player.coins}</span></p>
        <p>Рекорд: <span className="text-primary">{player.highScore}</span></p>
      </div>

      <p className="text-[7px] font-pixel text-muted-foreground animate-blink">
        Нажми чтобы начать
      </p>
    </div>
  );
};

export default MainMenu;
