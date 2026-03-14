import { useState, useCallback } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  AnimatePresence,
} from "motion/react";
import type { User } from "@/types/user";
import { Heart, X, RotateCcw } from "lucide-react";

interface SwipeCardsProps {
  users: User[];
  onSwipe?: (userId: string, direction: "left" | "right") => void;
}

export const SwipeCards = ({ users, onSwipe }: SwipeCardsProps) => {
  const [cards, setCards] = useState<User[]>(users);
  const [gone, setGone] = useState<Set<string>>(new Set());
  const [exitDir, setExitDir] = useState<"left" | "right">("left");

  const topCard = cards[cards.length - 1];

  const handleRemove = useCallback(
    (userId: string, direction: "left" | "right") => {
      setExitDir(direction);
      setGone((prev) => new Set(prev).add(userId));
      setCards((prev) => prev.filter((c) => c._id !== userId));
      onSwipe?.(userId, direction);
    },
    [onSwipe],
  );

  const handleUndo = useCallback(() => {
    if (gone.size === 0) return;
    const lastGone = Array.from(gone).pop();
    if (!lastGone) return;
    const restored = users.find((u) => u._id === lastGone);
    if (restored) {
      setGone((prev) => {
        const next = new Set(prev);
        next.delete(lastGone);
        return next;
      });
      setCards((prev) => [...prev, restored]);
    }
  }, [gone, users]);

  return (
    <div className="flex flex-col items-center gap-8">
      {/* Card stack area */}
      <div className="relative w-[min(85vw,22rem)] aspect-[3/4.5]">
        {/* Background stack hint */}
        {cards.length > 1 && (
          <div className="absolute inset-x-3 inset-y-0 rounded-2xl bg-muted/60 translate-y-2 scale-[0.96]" />
        )}

        <AnimatePresence custom={exitDir}>
          {cards.map((user, index) => (
            <SwipeCard
              key={user._id}
              user={user}
              isTop={index === cards.length - 1}
              onRemove={(dir) => handleRemove(user._id, dir)}
            />
          ))}
        </AnimatePresence>

        {/* Empty state */}
        {cards.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-card">
            <div className="size-14 rounded-full bg-muted flex items-center justify-center mb-3">
              <Heart className="size-6 text-muted-foreground" />
            </div>
            <p className="font-semibold text-foreground">No more profiles</p>
            <p className="text-sm text-muted-foreground mt-1 px-6 text-center">
              You've seen everyone for now
            </p>
            {gone.size > 0 && (
              <button
                onClick={handleUndo}
                className="mt-4 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                <RotateCcw className="size-3.5" />
                Undo last
              </button>
            )}
          </div>
        )}
      </div>

      {/* Action buttons */}
      {cards.length > 0 && (
        <div className="flex items-center gap-5">
          {gone.size > 0 && (
            <button
              onClick={handleUndo}
              className="size-10 rounded-full border border-border bg-card flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              <RotateCcw className="size-4" />
            </button>
          )}
          <button
            className="size-14 rounded-full border-2 border-border bg-card flex items-center justify-center text-muted-foreground hover:border-destructive hover:text-destructive active:scale-90 transition-all cursor-pointer shadow-sm"
            onClick={() => topCard && handleRemove(topCard._id, "left")}
          >
            <X className="size-7" strokeWidth={2.5} />
          </button>
          <button
            className="size-14 rounded-full border-2 border-border bg-card flex items-center justify-center text-green-600 hover:border-green-500 hover:text-green-500 active:scale-90 transition-all cursor-pointer shadow-sm"
            onClick={() => topCard && handleRemove(topCard._id, "right")}
          >
            <Heart className="size-7" strokeWidth={2.5} />
          </button>
        </div>
      )}
    </div>
  );
};

const SwipeCard = ({ user, isTop, onRemove }: CardProps) => {
  const x = useMotionValue(0);

  const rotateRaw = useTransform(x, [-200, 200], [-15, 15]);
  const likeOpacity = useTransform(x, [0, 80], [0, 1]);
  const nopeOpacity = useTransform(x, [-80, 0], [1, 0]);

  const rotate = useTransform(() => {
    let base = 0;
    if (!isTop) {
      try {
        const lastChar = String(user?._id ?? "0").slice(-1);
        base = parseInt(lastChar, 16) % 2 ? 4 : -4;
      } catch {
        base = 4;
      }
    }
    return `${rotateRaw.get() + base}deg`;
  });

  const handleDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: { offset: { x: number } },
  ) => {
    if (info.offset.x > 100) {
      onRemove("right");
    } else if (info.offset.x < -100) {
      onRemove("left");
    } else {
      x.set(0);
    }
  };

  const imageSrc =
    user?.avatar ??
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      `${user?.firstName ?? ""} ${user?.lastName ?? ""}`,
    )}&background=random&size=500`;

  return (
    <motion.div
      className="absolute inset-0"
      style={{ zIndex: isTop ? 10 : 1 }}
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{
        scale: isTop ? 1 : 0.96,
        y: isTop ? 0 : 8,
        opacity: 1,
      }}
      exit="exit"
      variants={{
        exit: (dir: "left" | "right") => ({
          x: dir === "right" ? 300 : -300,
          opacity: 0,
          transition: { duration: 0.25 },
        }),
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <motion.div
        className="h-full w-full rounded-2xl overflow-hidden bg-card border border-border select-none"
        style={{
          x,
          rotate,
          boxShadow: isTop
            ? "0 10px 40px -10px rgba(0,0,0,0.15), 0 4px 12px -4px rgba(0,0,0,0.08)"
            : "none",
        }}
        drag={isTop ? "x" : false}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.9}
        onDragEnd={handleDragEnd}
        whileDrag={{ cursor: "grabbing" }}
      >
        {/* Full-bleed photo */}
        <img
          src={imageSrc}
          alt={`${user?.firstName ?? ""} ${user?.lastName ?? ""}`}
          className="absolute inset-0 h-full w-full object-cover pointer-events-none"
          draggable={false}
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent pointer-events-none" />

        {/* LIKE stamp */}
        <motion.div
          className="absolute top-8 left-5 z-20 -rotate-12 rounded-sm border-[3px] border-green-400 px-3 py-0.5 pointer-events-none"
          style={{ opacity: likeOpacity }}
        >
          <span className="text-green-400 font-extrabold text-2xl tracking-widest">
            LIKE
          </span>
        </motion.div>

        {/* NOPE stamp */}
        <motion.div
          className="absolute top-8 right-5 z-20 rotate-12 rounded-sm border-[3px] border-red-400 px-3 py-0.5 pointer-events-none"
          style={{ opacity: nopeOpacity }}
        >
          <span className="text-red-400 font-extrabold text-2xl tracking-widest">
            NOPE
          </span>
        </motion.div>

        {/* Info overlay on photo */}
        <div className="absolute bottom-0 left-0 right-0 p-5 z-10 pointer-events-none">
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold text-white leading-tight">
              {user?.firstName} {user?.lastName}
            </h3>
            {user?.age ? (
              <span className="text-xl font-light text-white/80">
                {user.age}
              </span>
            ) : null}
          </div>

          {user?.bio ? (
            <p className="mt-1.5 text-sm text-white/75 line-clamp-2 leading-relaxed">
              {user.bio}
            </p>
          ) : null}

          {user?.skills?.length ? (
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {user.skills.slice(0, 3).map((skill) => (
                <span
                  key={skill}
                  className="text-xs bg-white/15 text-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full"
                >
                  {skill}
                </span>
              ))}
              {user.skills.length > 3 && (
                <span className="text-xs text-white/60 self-center">
                  +{user.skills.length - 3}
                </span>
              )}
            </div>
          ) : null}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SwipeCards;

interface CardProps {
  user: User;
  isTop: boolean;
  onRemove: (direction: "left" | "right") => void;
}
