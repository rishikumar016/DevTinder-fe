import { useApi } from "@/api";
import SwipeCards from "@/components/swip-card";

export const FeedPage = () => {
  const { useFeed } = useApi();
  const { data: feed } = useFeed();

  console.log(feed);

  return (
    <div className="text-2xl font-bold">
      <SwipeCards users={feed?.users} />
    </div>
  );
};
