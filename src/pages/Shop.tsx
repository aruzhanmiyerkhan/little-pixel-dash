import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PixelButton from "@/components/PixelButton";
import { getPlayer, savePlayer, SKINS } from "@/lib/gameStore";

const Shop = () => {
  const navigate = useNavigate();
  const [player, setPlayer] = useState(getPlayer());

  const buySkin = (skinId: string, price: number) => {
    if (player.coins < price || player.ownedSkins.includes(skinId)) return;
    const updated = {
      coins: player.coins - price,
      ownedSkins: [...player.ownedSkins, skinId],
    };
    savePlayer(updated);
    setPlayer({ ...player, ...updated });
  };

  const equipSkin = (skinId: string) => {
    savePlayer({ activeSkin: skinId });
    setPlayer({ ...player, activeSkin: skinId });
  };

  return (
    <div className="min-h-screen flex flex-col items-center gap-6 p-4 pt-8 scanlines">
      <h1 className="text-lg font-pixel text-primary neon-text">Магазин</h1>
      <p className="font-pixel text-[9px] text-coin">Монеты: {player.coins}</p>

      <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
        {SKINS.map((skin) => {
          const owned = player.ownedSkins.includes(skin.id);
          const active = player.activeSkin === skin.id;
          return (
            <div
              key={skin.id}
              className={`pixel-border bg-card p-3 flex flex-col items-center gap-2 ${
                active ? "neon-box" : ""
              }`}
            >
              {/* Skin preview */}
              <div className="w-10 h-10 relative">
                <div
                  className="w-full h-full rounded-sm"
                  style={{ backgroundColor: skin.color }}
                />
              </div>
              <span className="font-pixel text-[8px] text-foreground">{skin.name}</span>
              {!owned ? (
                <button
                  onClick={() => buySkin(skin.id, skin.price)}
                  disabled={player.coins < skin.price}
                  className="font-pixel text-[7px] px-2 py-1 bg-accent text-accent-foreground pixel-border cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {skin.price} 🪙
                </button>
              ) : active ? (
                <span className="font-pixel text-[7px] text-primary">✓ Активен</span>
              ) : (
                <button
                  onClick={() => equipSkin(skin.id)}
                  className="font-pixel text-[7px] px-2 py-1 bg-muted text-foreground pixel-border cursor-pointer hover:brightness-125"
                >
                  Выбрать
                </button>
              )}
            </div>
          );
        })}
      </div>

      <PixelButton variant="secondary" size="sm" onClick={() => navigate("/")}>
        ← Назад
      </PixelButton>
    </div>
  );
};

export default Shop;
