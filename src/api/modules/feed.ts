import { useQuery } from "@tanstack/react-query";
import { apiClient } from "./auth";
import type { User } from "@/types/user";

type FeedUser = User & { _id: string };

interface FeedResponse {
  data: FeedUser[];
  meta: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

const feedApi = {
  getFeed: () => apiClient.get<FeedResponse>(`/user/feed`),
};

export function useFeedHooks() {
  return {
    useFeed: () =>
      useQuery({
        queryKey: ["feed"],
        queryFn: async () => {
          const response = await feedApi.getFeed();
          return response.data;
        },
      }),
  };
}
