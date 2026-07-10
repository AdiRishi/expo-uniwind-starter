import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Input, Label, Spinner, TextField } from "heroui-native";
import { useState } from "react";
import { RefreshControl, View } from "react-native";

import { CreateMissionForm } from "@/components/screens/mission-control/create-mission-form";
import { MissionControlHeader } from "@/components/screens/mission-control/mission-control-header";
import { MissionFilters, type MissionFilter } from "@/components/screens/mission-control/mission-filters";
import { MissionList } from "@/components/screens/mission-control/mission-list";
import { MissionSummaryGrid } from "@/components/screens/mission-control/mission-summary-grid";
import { StandardScrollView } from "@/components/ui/screen-containers/standard-scroll-view";
import { Typography } from "@/components/ui/typography";
import { useRefreshOnFocus } from "@/hooks/use-refresh-on-focus";
import { filterMissions } from "@/lib/mission-control";
import { useTRPC } from "@/lib/trpc";
import { EMPTY_MISSION_SUMMARY, type MissionCheckpoint, type MissionStatus } from "@/schemas/mission-control";

export function MissionControlScreen() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<MissionFilter>("all");
  const [query, setQuery] = useState("");
  const [expandedMissionId, setExpandedMissionId] = useState<string | null>(null);
  const listQueryOptions = trpc.missionControl.list.queryOptions();
  const listQuery = useQuery(listQueryOptions);
  useRefreshOnFocus(trpc.missionControl.pathKey());

  const invalidateList = () => queryClient.invalidateQueries(listQueryOptions);
  const createMission = useMutation(trpc.missionControl.create.mutationOptions({ onSuccess: invalidateList }));
  const setStatus = useMutation(trpc.missionControl.setStatus.mutationOptions({ onSuccess: invalidateList }));
  const setConfidence = useMutation(trpc.missionControl.setConfidence.mutationOptions({ onSuccess: invalidateList }));
  const updateCheckpoint = useMutation(
    trpc.missionControl.updateCheckpoint.mutationOptions({ onSuccess: invalidateList }),
  );
  const addRisk = useMutation(trpc.missionControl.addRisk.mutationOptions({ onSuccess: invalidateList }));
  const resolveRisk = useMutation(trpc.missionControl.resolveRisk.mutationOptions({ onSuccess: invalidateList }));
  const deleteMission = useMutation(trpc.missionControl.delete.mutationOptions({ onSuccess: invalidateList }));

  const missions = filterMissions(listQuery.data?.items ?? [], query, filter);

  const handleStatusChange = (missionId: string, status: MissionStatus) => {
    setStatus.mutate({ missionId, status });
  };

  const handleCheckpointChange = (missionId: string, checkpointId: string, status: MissionCheckpoint["status"]) => {
    updateCheckpoint.mutate({ missionId, checkpointId, status });
  };

  const handleToggleExpanded = (missionId: string) => {
    setExpandedMissionId((current) => (current === missionId ? null : missionId));
  };

  return (
    <StandardScrollView
      className="flex-1"
      contentContainerClassName="gap-8 pb-12 pt-10"
      refreshControl={<RefreshControl refreshing={listQuery.isRefetching} onRefresh={() => void listQuery.refetch()} />}
    >
      <MissionControlHeader />
      <MissionSummaryGrid summary={listQuery.data?.summary ?? EMPTY_MISSION_SUMMARY} />
      <CreateMissionForm onSubmit={(input) => createMission.mutateAsync(input)} />

      <View className="gap-5">
        <View className="gap-3 px-4">
          <Typography variant="h3">Mission portfolio</Typography>
          <TextField>
            <Label>Search missions</Label>
            <Input value={query} placeholder="Search outcomes, owners, checkpoints, or risks" onChangeText={setQuery} />
          </TextField>
        </View>
        <MissionFilters value={filter} onChange={setFilter} />
      </View>

      {listQuery.isPending ? (
        <View className="items-center gap-3 py-10">
          <Spinner />
          <Typography variant="small" tone="muted">
            Loading mission telemetry…
          </Typography>
        </View>
      ) : listQuery.isError ? (
        <View className="mx-4 gap-2 rounded-2xl bg-danger/10 p-5">
          <Typography variant="smallBold" tone="danger">
            Mission Control is offline
          </Typography>
          <Typography variant="small" tone="muted">
            Pull to refresh after the API server is available.
          </Typography>
        </View>
      ) : (
        <MissionList
          missions={missions}
          expandedMissionId={expandedMissionId}
          riskSubmitting={addRisk.isPending}
          onToggleExpanded={handleToggleExpanded}
          onSetStatus={handleStatusChange}
          onSetConfidence={(missionId, confidence) => setConfidence.mutate({ missionId, confidence })}
          onUpdateCheckpoint={handleCheckpointChange}
          onResolveRisk={(missionId, riskId) => resolveRisk.mutate({ missionId, riskId })}
          onAddRisk={(missionId, risk) => addRisk.mutateAsync({ missionId, ...risk })}
          onDelete={(missionId) => {
            if (expandedMissionId === missionId) setExpandedMissionId(null);
            deleteMission.mutate({ missionId });
          }}
        />
      )}

      <Typography variant="caption" tone="muted" align="center" className="px-4">
        Mission data is stored in memory for this starter and resets when the API server restarts.
      </Typography>
    </StandardScrollView>
  );
}
