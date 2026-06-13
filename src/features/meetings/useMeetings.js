import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { meetingApi as api } from "../../shared/api/meetingApi.js";

export const useMeetings = () =>
  useQuery({
    queryKey: ["meetings"],
    queryFn: api.getMeetings,
  });

export const useMeeting = (meetingId) =>
  useQuery({
    queryKey: ["meeting", meetingId],
    queryFn: () => api.getMeeting(meetingId),
    enabled: Boolean(meetingId),
  });

export const useProtocol = (protocolId) =>
  useQuery({
    queryKey: ["protocol", protocolId],
    queryFn: () => api.getProtocol(protocolId),
    enabled: Boolean(protocolId),
  });

export const useKonturMeetings = () =>
  useQuery({
    queryKey: ["kontur-meetings"],
    queryFn: api.getKonturMeetings,
  });

export const useCreateEmptyMeeting = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.createEmptyMeeting,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meetings"] });
    },
  });
};

export const useImportKonturMeeting = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.importKonturMeeting,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["meetings"] });

      if (data?.meetingId) {
        queryClient.invalidateQueries({
          queryKey: ["meeting", data.meetingId],
        });
      }
    },
  });
};

export const useCreateProtocol = (meetingId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.createProtocol,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meeting", meetingId] });
    },
  });
};

export const useUpdateProtocol = (meetingId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.updateProtocol,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["meeting", meetingId] });

      if (variables?.protocolId) {
        queryClient.invalidateQueries({
          queryKey: ["protocol", variables.protocolId],
        });
      }
    },
  });
};

export const useFormalizeProtocol = () =>
  useMutation({
    mutationFn: api.formalizeProtocol,
  });

export const useSendProtocolEmail = () =>
  useMutation({
    mutationFn: api.sendProtocolEmail,
  });
