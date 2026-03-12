import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { CreateTaskForm } from "@/components/screens/tasks/create-task-form";
import { TaskList } from "@/components/screens/tasks/task-list";
import { TasksHeader } from "@/components/screens/tasks/tasks-header";
import { FormScrollView } from "@/components/ui/screen-containers/form-scroll-view";
import { useRefreshOnFocus } from "@/hooks/use-refresh-on-focus";
import { useTRPC } from "@/lib/trpc";

export function TasksScreen() {
  const trpc = useTRPC();
  useRefreshOnFocus(trpc.tasks.pathKey());
  const queryClient = useQueryClient();
  const listQueryOptions = trpc.tasks.list.queryOptions();
  const { data: tasks = [] } = useQuery(listQueryOptions);

  const invalidateList = () => queryClient.invalidateQueries(listQueryOptions);

  const createMutation = useMutation(trpc.tasks.create.mutationOptions({ onSuccess: invalidateList }));
  const toggleMutation = useMutation(trpc.tasks.toggle.mutationOptions({ onSuccess: invalidateList }));
  const deleteMutation = useMutation(trpc.tasks.delete.mutationOptions({ onSuccess: invalidateList }));

  return (
    <FormScrollView className="flex-1" contentContainerClassName="gap-8 pb-8 pt-12">
      <TasksHeader />
      <TaskList
        tasks={tasks}
        onToggle={(id) => toggleMutation.mutate({ id })}
        onDelete={(id) => deleteMutation.mutate({ id })}
      />
      <CreateTaskForm onSubmit={(title) => createMutation.mutateAsync({ title })} />
    </FormScrollView>
  );
}
