import { useApi } from "@/api";
import SwipeCards from "@/components/swip-card";
import { Loader2, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const FeedPage = () => {
  const { useFeed, useSendConnectionRequest } = useApi();
  const { data: feed, isLoading } = useFeed();
  const sendRequest = useSendConnectionRequest();

  const handleSwipe = (userId: string, direction: "left" | "right") => {
    const status = direction === "right" ? "interested" : "ignored";
    sendRequest.mutate({ status, userId });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="size-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Finding developers...</p>
        </div>
      </div>
    );
  }

  const users = feed?.data ?? [];

  return (
    <div className="container mx-auto max-w-2xl py-8 px-4">
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Discover</h1>
        <p className="text-muted-foreground mt-1">
          Swipe right to connect, left to pass
        </p>
      </div>

      {users.length > 0 ? (
        <SwipeCards users={users} onSwipe={handleSwipe} />
      ) : (
        <Card className="py-16">
          <CardContent className="flex flex-col items-center justify-center text-center">
            <div className="size-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Users className="size-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-1">No more profiles</h3>
            <p className="text-muted-foreground text-sm max-w-sm">
              You've seen all available developers for now. Check back later for
              new profiles!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
