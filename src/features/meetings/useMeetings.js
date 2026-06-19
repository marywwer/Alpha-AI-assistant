import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { meetingApi } from "../../shared/api/meetingApi.js";

export const useMeetings = () =>
  useQuery({
    queryKey: ["meetings"],
    queryFn: meetingApi.getMeetings,
  });

export const useMeeting = (meetingId) =>
  useQuery({
    queryKey: ["meeting", meetingId],
    queryFn: () => meetingApi.getMeeting(meetingId),
    enabled: Boolean(meetingId),
  });

export const useProtocol = (protocolId) =>
  useQuery({
    queryKey: ["protocol", protocolId],
    queryFn: () => meetingApi.getProtocol(protocolId),
    enabled: Boolean(protocolId),
  });

export const useKonturMeetings = (start) =>
  useQuery({
    queryKey: ["kontur-meetings", start],
    queryFn: () => meetingApi.getKonturMeetings(start),
    enabled: Boolean(start),
  });

export const useCreateEmptyMeeting = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: meetingApi.createEmptyMeeting,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meetings"] });
    },
  });
};

export const useImportKonturMeeting = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: meetingApi.importKonturMeeting,
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
    mutationFn: meetingApi.createProtocol,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meeting", meetingId] });
    },
  });
};

export const useUpdateProtocol = (meetingId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: meetingApi.updateProtocol,
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
    mutationFn: meetingApi.formalizeProtocol,
  });

export const useSendProtocolEmail = () =>
  useMutation({
    mutationFn: meetingApi.sendProtocolEmail,
  });
