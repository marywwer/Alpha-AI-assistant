import { useQuery } from "@tanstack/react-query";
import { api } from "../../shared/api/mockApi.js";
import { metricsApi } from "../../shared/api/metricsApi.js";
import { digestApi } from "../../shared/api/digestApi.js";

/*export const useKpi = (teamId, metricsKeys = []) =>
  useQuery({
    queryKey: ["kpi", teamId, metricsKeys],
    queryFn: async () => {
      const data = await metricsApi.getMetrics({
        teamId,
        metricsKeys,
      });

      return {
        teamId,
        metrics:
          data.metricResponses?.map((metric) => ({
            id: metric.key,
            title: metric.name,
            value: metric.value,
            delta: metric.changeInProcentage,
            trend: metric.isUp ? "up" : "down",
          })) || [],
      };
    },
    enabled: metricsKeys.length > 0,
    refetchInterval: 60_000,
  });*/

export const useKpi = (teamId) =>
  useQuery({
    queryKey: ["kpi", teamId],
    queryFn: () => api.getKpi(teamId),
    refetchInterval: 60_000,
  });

export const useStatusDistribution = (teamId) =>
  useQuery({
    queryKey: ["status-distribution", teamId],
    queryFn: api.getStatusDistribution,
  });

export const useOverdueByTeam = (teamId) =>
  useQuery({
    queryKey: ["overdue-by-team", teamId],
    queryFn: api.getOverdueByTeam,
  });

export const useEfficiencyByTeam = (teamId) =>
  useQuery({
    queryKey: ["efficiency-by-team", teamId],
    queryFn: api.getEfficiencyByTeam,
  });

export const useMemberLoad = (teamId) =>
  useQuery({
    queryKey: ["member-load", teamId],
    queryFn: () => api.getMemberLoad(teamId),
  });

/*export const useRoadmap = (teamId) =>
  useQuery({
    queryKey: ["roadmap", teamId],
    queryFn: () => digestApi.getDigestData(teamId),
    refetchInterval: 60_000,
  });*/

export const useRoadmap = (teamId) =>
  useQuery({
    queryKey: ["roadmap", teamId],
    queryFn: () => api.getRoadmap(teamId),
  });

export function usePriorityDoneTasks(teamId) {
  return useQuery({
    queryKey: ["priority-done-tasks", teamId],
    queryFn: () => api.getPriorityDoneTasks(teamId),
  });
}

export function useClosedTasksByType(teamId) {
  return useQuery({
    queryKey: ["closed-tasks-by-type", teamId],
    queryFn: () => api.getClosedTasksByType(teamId),
  });
}

export function useLateDoneByTeam(teamId) {
  return useQuery({
    queryKey: ["late-done-by-team", teamId],
    queryFn: () => api.getLateDoneByTeam(teamId),
  });
}
