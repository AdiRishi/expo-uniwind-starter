import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  type RenderHookOptions,
  type RenderHookResult,
  type RenderOptions,
  render,
  renderHook,
} from "@testing-library/react-native";
import { createTRPCClient, httpLink } from "@trpc/client";
import type { ReactElement, ReactNode } from "react";
import { type Metrics, SafeAreaProvider } from "react-native-safe-area-context";

import type { AppRouter, RouterInputs, RouterOutputs } from "@repo/api";
import { superjsonTransformer } from "@repo/rpc";

import { TRPCProvider } from "@/lib/trpc";

export type MaybePromise<TValue> = TValue | Promise<TValue>;

export type MockTrpcProcedurePath = {
  [RouterName in keyof RouterInputs & keyof RouterOutputs & string]: {
    [ProcedureName in keyof RouterInputs[RouterName] &
      keyof RouterOutputs[RouterName] &
      string]: `${RouterName}.${ProcedureName}`;
  }[keyof RouterInputs[RouterName] & keyof RouterOutputs[RouterName] & string];
}[keyof RouterInputs & keyof RouterOutputs & string];

type RouterNameFromPath<Path extends MockTrpcProcedurePath> = Path extends `${infer RouterName}.${string}`
  ? RouterName & keyof RouterInputs & keyof RouterOutputs
  : never;

type ProcedureNameFromPath<Path extends MockTrpcProcedurePath> = Path extends `${string}.${infer ProcedureName}`
  ? ProcedureName & keyof RouterInputs[RouterNameFromPath<Path>] & keyof RouterOutputs[RouterNameFromPath<Path>]
  : never;

export type MockTrpcInput<Path extends MockTrpcProcedurePath> =
  RouterInputs[RouterNameFromPath<Path>][ProcedureNameFromPath<Path>];
export type MockTrpcOutput<Path extends MockTrpcProcedurePath> =
  RouterOutputs[RouterNameFromPath<Path>][ProcedureNameFromPath<Path>];
export type MockTrpcResolver<Path extends MockTrpcProcedurePath> = (
  input: MockTrpcInput<Path>,
) => MaybePromise<MockTrpcOutput<Path>>;
export type MockTrpcHandler<Path extends MockTrpcProcedurePath> = MockTrpcOutput<Path> | MockTrpcResolver<Path>;
export type MockTrpcHandlerMap = Partial<{
  [Path in MockTrpcProcedurePath]: MockTrpcHandler<Path>;
}>;

export type MockTrpcOptions = {
  queries?: MockTrpcHandlerMap;
  mutations?: MockTrpcHandlerMap;
};

export type MockTrpcCall<Path extends MockTrpcProcedurePath = MockTrpcProcedurePath> = {
  type: "query" | "mutation" | "subscription";
  path: Path;
  input: MockTrpcInput<Path>;
};

type TestProviderOptions = {
  queryClient?: QueryClient;
  trpc?: MockTrpcOptions;
};

type RenderWithTestProvidersOptions = Omit<RenderOptions, "wrapper"> & TestProviderOptions;
type RenderHookWithTestProvidersOptions<TProps> = Omit<RenderHookOptions<TProps>, "wrapper"> & TestProviderOptions;

const DEFAULT_SAFE_AREA_METRICS: Metrics = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 0, right: 0, bottom: 0, left: 0 },
};

export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        gcTime: Number.POSITIVE_INFINITY,
        retry: false,
      },
      mutations: {
        gcTime: Number.POSITIVE_INFINITY,
        retry: false,
      },
    },
  });
}

// Screens should exercise the real TanStack Query + tRPC client path. Instead of
// mocking hooks, this helper swaps only the HTTP transport with an explicit in-test
// procedure map so cache invalidation, serialization, and loading behavior stay real.
function getMockRequestType(method: string | undefined): MockTrpcCall["type"] {
  if (method === "POST") {
    return "mutation";
  }

  if (method === "PATCH") {
    return "subscription";
  }

  return "query";
}

function readMockRequestInput(url: URL, init?: RequestInit) {
  const rawInput = init?.method === "POST" ? init.body : url.searchParams.get("input");

  if (typeof rawInput !== "string") {
    return undefined;
  }

  return superjsonTransformer.deserialize(JSON.parse(rawInput));
}

function createMockTrpcResponse(data: unknown) {
  return {
    ok: true,
    json: async () => ({
      result: {
        data: superjsonTransformer.serialize(data),
      },
    }),
  };
}

export function createMockTrpcClient(options: MockTrpcOptions = {}) {
  const calls: MockTrpcCall[] = [];

  const fetch: typeof globalThis.fetch = async (request, init) => {
    const url = new URL(String(request));
    const path = url.pathname.replace(/^\//, "") as MockTrpcProcedurePath;
    const type = getMockRequestType(init?.method);
    const input = readMockRequestInput(url, init) as MockTrpcInput<typeof path>;

    calls.push({ type, path, input });

    if (type === "subscription") {
      throw new Error(`[mockTrpc] Subscriptions are not supported by the test client: "${path}".`);
    }

    const handlers = type === "mutation" ? options.mutations : options.queries;
    const hasHandler = handlers ? Object.prototype.hasOwnProperty.call(handlers, path) : false;
    const handler = handlers?.[path];

    if (!hasHandler) {
      throw new Error(
        `[mockTrpc] No ${type} mock registered for "${path}". ` +
          `Add it to renderWithTestProviders(..., { trpc: { ${type === "mutation" ? "mutations" : "queries"}: { "${path}": ... } } }).`,
      );
    }

    const data =
      typeof handler === "function"
        ? await (handler as MockTrpcResolver<typeof path>)(input)
        : (handler as MockTrpcOutput<typeof path>);

    return createMockTrpcResponse(data) as Response;
  };

  return {
    calls,
    client: createTRPCClient<AppRouter>({
      links: [
        httpLink({
          url: "http://mock-trpc",
          transformer: superjsonTransformer,
          fetch,
        }),
      ],
    }),
    getCalls<Path extends MockTrpcProcedurePath>(path?: Path) {
      return (path ? calls.filter((call) => call.path === path) : calls) as MockTrpcCall<Path>[];
    },
  };
}

export function createTestProviders(options: TestProviderOptions = {}) {
  const queryClient = options.queryClient ?? createTestQueryClient();
  const trpc = createMockTrpcClient(options.trpc);

  function TestProviders({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <TRPCProvider trpcClient={trpc.client} queryClient={queryClient}>
          <SafeAreaProvider initialMetrics={DEFAULT_SAFE_AREA_METRICS}>{children}</SafeAreaProvider>
        </TRPCProvider>
      </QueryClientProvider>
    );
  }

  return {
    queryClient,
    trpc,
    wrapper: TestProviders,
  };
}

export function renderWithTestProviders(ui: ReactElement, options: RenderWithTestProvidersOptions = {}) {
  const { queryClient, trpc, wrapper } = createTestProviders(options);
  const result = render(ui, { ...options, wrapper });

  return {
    ...result,
    queryClient,
    trpc,
  };
}

export function renderHookWithTestProviders<TResult, TProps>(
  renderCallback: (initialProps: TProps) => TResult,
  options: RenderHookWithTestProvidersOptions<TProps> = {},
): RenderHookResult<TResult, TProps> & Pick<ReturnType<typeof createTestProviders>, "queryClient" | "trpc"> {
  const { queryClient, trpc, wrapper } = createTestProviders(options);
  const result = renderHook(renderCallback, { ...options, wrapper });

  return {
    ...result,
    queryClient,
    trpc,
  };
}
