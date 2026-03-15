import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "./auth";
import type {
  SendConnectionStatus,
  RespondConnectionAction,
} from "@/types/request-user";

const connectionsApi = {
  sendConnectionRequest: (status: SendConnectionStatus, userId: string) => {
    return apiClient.post(`/connection/send/${status}/${userId}`);
  },
  respondToConnectionRequest: (
    requestId: string,
    action: RespondConnectionAction,
  ) => {
    return apiClient.post(`/connection/respond/${requestId}/${action}`);
  },
};

export function useConnectionsHooks() {
  const queryClient = useQueryClient();

  return {
    useSendConnectionRequest: () => {
      return useMutation({
        mutationFn: ({
          status,
          userId,
        }: {
          status: SendConnectionStatus;
          userId: string;
        }) => connectionsApi.sendConnectionRequest(status, userId),
      });
    },
    useRespondToConnectionRequest: () => {
      return useMutation({
        mutationFn: ({
          requestId,
          action,
        }: {
          requestId: string;
          action: RespondConnectionAction;
        }) => connectionsApi.respondToConnectionRequest(requestId, action),
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["receivedRequests"] });
        },
      });
    },
  };
}
