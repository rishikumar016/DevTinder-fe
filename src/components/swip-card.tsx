import { useState } from "react";
import { motion, useMotionValue, useTransform } from "motion/react";

const SwipeCards = () => {
  const [cards, setCards] = useState(cardData);

  return (
    <div className="grid h-screen w-full place-items-center bg-neutral-100">
      {cards.map((card, index) => (
        <Card
          key={card.id}
          card={card}
          isTop={index === cards.length - 1}
          onRemove={() => setCards(cards.filter((c) => c.id !== card.id))}
        />
      ))}
    </div>
  );
};

const Card = ({ card, isTop, onRemove }: CardProps) => {
  const x = useMotionValue(0);

  const rotateRaw = useTransform(x, [-150, 150], [-18, 18]);
  const opacity = useTransform(x, [-150, 0, 150], [0, 1, 0]);

  const rotate = useTransform(() => {
    const baseRotation = isTop ? 0 : card.id % 2 ? 6 : -6;
    return `${rotateRaw.get() + baseRotation}deg`;
  });

  const handleDragEnd = (_event: any, info: { offset: { x: number } }) => {
    const swipeThreshold = 100;

    if (Math.abs(info.offset.x) > swipeThreshold) {
      onRemove();
    } else {
      x.set(0);
    }
  };

  return (
    <motion.div
      className="absolute"
      style={{
        gridRow: 1,
        gridColumn: 1,
      }}
    >
      <motion.img
        src={card.url}
        alt="Card"
        className="h-130 w-96 rounded-lg bg-white object-cover hover:cursor-grab active:cursor-grabbing"
        style={{
          x,
          opacity,
          rotate,
          originY: 0.5,
          originX: 0.5,
          boxShadow: isTop
            ? "0 20px 25px -5px rgb(0 0 0 / 0.5), 0 8px 10px -6px rgb(0 0 0 / 0.5)"
            : "none",
        }}
        animate={{
          scale: isTop ? 1 : 0.98,
          y: isTop ? 0 : 12,
        }}
        transition={{
          scale: { type: "spring", stiffness: 300, damping: 30 },
          y: { type: "spring", stiffness: 300, damping: 30 },
        }}
        drag={isTop ? "x" : false}
        dragConstraints={{
          left: -500,
          right: 500,
        }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
      />
    </motion.div>
  );
};

export default SwipeCards;

interface CardData {
  id: number;
  url: string;
}

interface CardProps {
  card: CardData;
  isTop: boolean;
  onRemove: () => void;
}

const cardData: CardData[] = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2370&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1512374382149-233c42b6a83b?q=80&w=2235&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=2342&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 4,
    url: "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=2224&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 5,
    url: "https://images.unsplash.com/photo-1516478177764-9fe5bd7e9717?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 6,
    url: "https://images.unsplash.com/photo-1570464197285-9949814674a7?q=80&w=2273&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 7,
    url: "https://images.unsplash.com/photo-1578608712688-36b5be8823dc?q=80&w=2187&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 8,
    url: "https://images.unsplash.com/photo-1505784045224-1247b2b29cf3?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];
