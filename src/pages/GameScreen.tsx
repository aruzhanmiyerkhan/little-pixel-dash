import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ARENAS, getPlayer, SKINS } from "@/lib/gameStore";

interface GameObject {
  x: number;
  y: number;
  w: number;
  h: number;
  type: "obstacle" | "coin" | "shield" | "speed" | "double" | "magnet" | "shrink" | "life" | "freeze" | "mega";
}

const GROUND_Y = 260;
const PLAYER_W = 24;
const PLAYER_H = 32;
const GRAVITY = 0.6;
const JUMP_FORCE = -12;
const CANVAS_W = 600;
const CANVAS_H = 300;

const GameScreen = () => {
  const { arenaId } = useParams();
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef({
    playerY: GROUND_Y - PLAYER_H,
    velY: 0,
    isJumping: false,
    objects: [] as GameObject[],
    score: 0,
    coins: 0,
    gameOver: false,
    running: true,
    frame: 0,
    shieldTimer: 0,
    speedTimer: 0,
    doubleCoins: false,
    doubleTimer: 0,
    magnetTimer: 0,
    shrinkTimer: 0,
    freezeTimer: 0,
    lives: 0,
    megaTimer: 0,
    speed: 4,
    lastSpawn: 0,
  });

  const arena = ARENAS.find((a) => a.id === arenaId) || ARENAS[0];
  const player = getPlayer();
  const skin = SKINS.find((s) => s.id === player.activeSkin) || SKINS[0];

  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);

  const jump = useCallback(() => {
    const g = gameRef.current;
    if (g.gameOver) return;
    if (!started) setStarted(true);
    if (!g.isJumping) {
      g.velY = JUMP_FORCE;
      g.isJumping = true;
    }
  }, [started]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowUp") {
        e.preventDefault();
        jump();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [jump]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const g = gameRef.current;
    g.speed = arena.obstacleSpeed;

    g.running = true;
    let animId: number;

    const spawnObject = () => {
      const rand = Math.random();
      let type: GameObject["type"] = "obstacle";
      if (rand > 0.75) type = "coin";
      else if (rand > 0.94) type = "shield";
      else if (rand > 0.91) type = "speed";
      else if (rand > 0.88) type = "double";
      else if (rand > 0.85) type = "magnet";
      else if (rand > 0.82) type = "shrink";
      else if (rand > 0.80) type = "life";
      else if (rand > 0.78) type = "freeze";
      else if (rand > 0.76) type = "mega";

      const h = type === "obstacle" ? 20 + Math.random() * 20 : 12;
      const w = type === "obstacle" ? 16 + Math.random() * 16 : 12;
      const y = type === "coin" ? GROUND_Y - 30 - Math.random() * 40 : GROUND_Y - h;

      g.objects.push({ x: CANVAS_W + 10, y, w, h, type });
    };

    const checkCollision = (obj: GameObject) => {
      const px = 40;
      const py = g.playerY;
      return (
        px + PLAYER_W > obj.x + 3 &&
        px < obj.x + obj.w - 3 &&
        py + PLAYER_H > obj.y + 3 &&
        py < obj.y + obj.h - 3
      );
    };

    const drawPixelChar = (x: number, y: number) => {
      ctx.fillStyle = skin.color;
      // Body
      ctx.fillRect(x + 4, y, 16, 8);
      ctx.fillRect(x, y + 8, 24, 16);
      // Eyes
      ctx.fillStyle = "#fff";
      ctx.fillRect(x + 6, y + 2, 4, 4);
      ctx.fillRect(x + 14, y + 2, 4, 4);
      ctx.fillStyle = "#000";
      ctx.fillRect(x + 8, y + 3, 2, 2);
      ctx.fillRect(x + 16, y + 3, 2, 2);
      // Legs animation
      ctx.fillStyle = skin.color;
      if (g.isJumping) {
        ctx.fillRect(x + 2, y + 24, 8, 8);
        ctx.fillRect(x + 14, y + 24, 8, 8);
      } else if (g.frame % 20 < 10) {
        ctx.fillRect(x, y + 24, 8, 8);
        ctx.fillRect(x + 16, y + 24, 8, 8);
      } else {
        ctx.fillRect(x + 4, y + 24, 8, 8);
        ctx.fillRect(x + 12, y + 24, 8, 8);
      }
      // Shield effect
      if (g.shieldTimer > 0) {
        ctx.strokeStyle = "#3b82f6";
        ctx.lineWidth = 2;
        ctx.strokeRect(x - 4, y - 4, PLAYER_W + 8, PLAYER_H + 12);
      }
    };

    const loop = () => {
      if (!g.running) return;
      g.frame++;

      ctx.fillStyle = "#0f0e17";
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

      // Ground
      ctx.fillStyle = "#1a1a2e";
      ctx.fillRect(0, GROUND_Y, CANVAS_W, CANVAS_H - GROUND_Y);
      ctx.strokeStyle = "#22c55e33";
      ctx.lineWidth = 1;
      for (let i = 0; i < CANVAS_W; i += 20) {
        ctx.beginPath();
        ctx.moveTo(i - (g.frame % 20), GROUND_Y);
        ctx.lineTo(i - (g.frame % 20), CANVAS_H);
        ctx.stroke();
      }

      if (!started || g.gameOver) {
        drawPixelChar(40, GROUND_Y - PLAYER_H);
        if (!started) {
          ctx.fillStyle = "#22c55e";
          ctx.font = "10px 'Press Start 2P'";
          ctx.textAlign = "center";
          ctx.fillText("ПРОБЕЛ / ТАП", CANVAS_W / 2, CANVAS_H / 2 - 20);
          ctx.fillText("ЧТОБЫ НАЧАТЬ", CANVAS_W / 2, CANVAS_H / 2);
        }
        if (g.gameOver) {
          ctx.fillStyle = "#ef4444";
          ctx.font = "14px 'Press Start 2P'";
          ctx.textAlign = "center";
          ctx.fillText("GAME OVER", CANVAS_W / 2, CANVAS_H / 2 - 10);
          ctx.fillStyle = "#eab308";
          ctx.font = "8px 'Press Start 2P'";
          ctx.fillText(`ОЧКИ: ${g.score}`, CANVAS_W / 2, CANVAS_H / 2 + 15);
        }
        animId = requestAnimationFrame(loop);
        return;
      }

      // Physics
      g.velY += GRAVITY;
      g.playerY += g.velY;
      if (g.playerY >= GROUND_Y - PLAYER_H) {
        g.playerY = GROUND_Y - PLAYER_H;
        g.velY = 0;
        g.isJumping = false;
      }

      // Spawn
      const spawnRate = g.speedTimer > 0 ? arena.spawnRate * 0.7 : arena.spawnRate;
      if (g.frame - g.lastSpawn > spawnRate / 16) {
        spawnObject();
        g.lastSpawn = g.frame;
      }

      // Update & draw objects
      const currentSpeed = g.freezeTimer > 0 ? g.speed * 0.3 : g.speedTimer > 0 ? g.speed * 0.6 : g.speed;
      const magnetRange = g.magnetTimer > 0 ? 80 : 0;

      g.objects = g.objects.filter((obj) => {
        obj.x -= currentSpeed;
        if (obj.x + obj.w < 0) return false;

        // Magnet: attract coins
        if (magnetRange > 0 && obj.type === "coin") {
          const dx = 40 - obj.x;
          const dy = g.playerY - obj.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < magnetRange) {
            obj.x += dx * 0.15;
            obj.y += dy * 0.15;
          }
        }

        if (checkCollision(obj)) {
          if (obj.type === "obstacle") {
            if (g.megaTimer > 0) return false; // mega destroys obstacles
            if (g.shieldTimer > 0) {
              g.shieldTimer = 0;
              return false;
            }
            if (g.lives > 0) {
              g.lives--;
              return false;
            }
            if (g.shrinkTimer > 0) return false; // tiny = dodge
            g.gameOver = true;
            setGameOver(true);
            return true;
          } else if (obj.type === "coin") {
            const mult = (g.doubleCoins ? 2 : 1) * (g.megaTimer > 0 ? 3 : 1);
            g.coins += mult;
            setCoins(g.coins);
          } else if (obj.type === "shield") {
            g.shieldTimer = 300;
          } else if (obj.type === "speed") {
            g.speedTimer = 200;
          } else if (obj.type === "double") {
            g.doubleCoins = true;
            g.doubleTimer = 300;
          } else if (obj.type === "magnet") {
            g.magnetTimer = 400;
          } else if (obj.type === "shrink") {
            g.shrinkTimer = 250;
          } else if (obj.type === "life") {
            g.lives = Math.min(g.lives + 1, 3);
          } else if (obj.type === "freeze") {
            g.freezeTimer = 200;
          } else if (obj.type === "mega") {
            g.megaTimer = 180;
          }
          return false;
        }

        // Draw objects
        if (obj.type === "obstacle") {
          ctx.fillStyle = "#ef4444";
          ctx.fillRect(obj.x, obj.y, obj.w, obj.h);
          ctx.fillStyle = "#dc2626";
          ctx.fillRect(obj.x + 2, obj.y + 2, obj.w - 4, 3);
        } else if (obj.type === "coin") {
          ctx.fillStyle = "#eab308";
          ctx.fillRect(obj.x, obj.y, obj.w, obj.h);
          ctx.fillStyle = "#fde047";
          ctx.fillRect(obj.x + 2, obj.y + 2, 4, 4);
        } else if (obj.type === "shield") {
          ctx.fillStyle = "#3b82f6";
          ctx.fillRect(obj.x, obj.y, obj.w, obj.h);
          ctx.fillStyle = "#60a5fa";
          ctx.fillRect(obj.x + 3, obj.y + 2, 6, 4);
        } else if (obj.type === "speed") {
          ctx.fillStyle = "#facc15";
          ctx.fillRect(obj.x, obj.y, obj.w, obj.h);
        } else if (obj.type === "double") {
          ctx.fillStyle = "#a855f7";
          ctx.fillRect(obj.x, obj.y, obj.w, obj.h);
        } else if (obj.type === "magnet") {
          ctx.fillStyle = "#f43f5e";
          ctx.fillRect(obj.x, obj.y, obj.w, obj.h);
          ctx.fillStyle = "#fb7185";
          ctx.fillRect(obj.x + 2, obj.y + 4, 4, 4);
        } else if (obj.type === "shrink") {
          ctx.fillStyle = "#06b6d4";
          ctx.fillRect(obj.x, obj.y, obj.w, obj.h);
        } else if (obj.type === "life") {
          ctx.fillStyle = "#f472b6";
          ctx.fillRect(obj.x, obj.y, obj.w, obj.h);
          ctx.fillStyle = "#ec4899";
          ctx.fillRect(obj.x + 3, obj.y + 2, 6, 3);
          ctx.fillRect(obj.x + 2, obj.y + 3, 8, 5);
        } else if (obj.type === "freeze") {
          ctx.fillStyle = "#67e8f9";
          ctx.fillRect(obj.x, obj.y, obj.w, obj.h);
          ctx.fillStyle = "#a5f3fc";
          ctx.fillRect(obj.x + 4, obj.y + 4, 4, 4);
        } else if (obj.type === "mega") {
          ctx.fillStyle = "#f59e0b";
          ctx.fillRect(obj.x, obj.y, obj.w, obj.h);
          ctx.fillStyle = "#fbbf24";
          ctx.fillRect(obj.x + 2, obj.y + 2, 8, 8);
        }
        return true;
      });

      // Timers
      if (g.shieldTimer > 0) g.shieldTimer--;
      if (g.speedTimer > 0) g.speedTimer--;
      if (g.magnetTimer > 0) g.magnetTimer--;
      if (g.shrinkTimer > 0) g.shrinkTimer--;
      if (g.freezeTimer > 0) g.freezeTimer--;
      if (g.megaTimer > 0) g.megaTimer--;
      if (g.doubleTimer > 0) {
        g.doubleTimer--;
        if (g.doubleTimer <= 0) g.doubleCoins = false;
      }

      // Score
      g.score = Math.floor(g.frame / 6);
      setScore(g.score);

      // Draw player
      drawPixelChar(40, g.playerY);

      // HUD
      ctx.fillStyle = "#22c55e";
      ctx.font = "8px 'Press Start 2P'";
      ctx.textAlign = "left";
      ctx.fillText(`${g.score}`, 10, 20);
      ctx.fillStyle = "#eab308";
      ctx.textAlign = "right";
      ctx.fillText(`${g.coins}🪙`, CANVAS_W - 10, 20);

      // Active power-ups HUD
      let hudX = 10;
      const drawHud = (emoji: string, color: string) => {
        ctx.fillStyle = color;
        ctx.textAlign = "left";
        ctx.fillText(emoji, hudX, 35);
        hudX += 20;
      };
      if (g.shieldTimer > 0) drawHud("🛡", "#3b82f6");
      if (g.speedTimer > 0) drawHud("⚡", "#facc15");
      if (g.doubleCoins) drawHud("x2", "#a855f7");
      if (g.magnetTimer > 0) drawHud("🧲", "#f43f5e");
      if (g.shrinkTimer > 0) drawHud("🔹", "#06b6d4");
      if (g.freezeTimer > 0) drawHud("❄", "#67e8f9");
      if (g.megaTimer > 0) drawHud("⭐", "#f59e0b");
      if (g.lives > 0) drawHud(`❤${g.lives}`, "#f472b6");

      animId = requestAnimationFrame(loop);
    };

    loop();
    return () => {
      g.running = false;
      cancelAnimationFrame(animId);
    };
  }, [arena, skin, started]);

  const handleEnd = () => {
    const g = gameRef.current;
    navigate("/results", {
      state: {
        score: g.score,
        coins: g.coins,
        arenaId: arena.id,
        arenaName: arena.name,
      },
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-4">
      <div className="flex justify-between w-full max-w-[600px] font-pixel text-[8px]">
        <span className="text-muted-foreground">{arena.name}</span>
        <span className="text-primary">Очки: {score}</span>
        <span className="text-coin">Монеты: {coins}</span>
      </div>

      <canvas
        ref={canvasRef}
        width={CANVAS_W}
        height={CANVAS_H}
        className="pixel-border bg-card max-w-full cursor-pointer"
        style={{ imageRendering: "pixelated" }}
        onClick={jump}
        onTouchStart={(e) => { e.preventDefault(); jump(); }}
      />

      {gameOver && (
        <div className="flex gap-3">
          <button
            onClick={handleEnd}
            className="font-pixel text-[10px] px-4 py-2 bg-primary text-primary-foreground pixel-border hover:brightness-125 cursor-pointer"
          >
            Результаты →
          </button>
        </div>
      )}

      <p className="text-[7px] font-pixel text-muted-foreground">
        Пробел / ↑ / Тап — прыжок
      </p>
    </div>
  );
};

export default GameScreen;
