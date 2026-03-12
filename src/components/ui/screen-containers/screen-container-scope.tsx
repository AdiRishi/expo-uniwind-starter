import { ReactNode, createContext, use } from "react";

export type ScreenContainerScope = "default" | "tabs";

const ScreenContainerScopeContext = createContext<ScreenContainerScope>("default");

type ScreenContainerScopeProviderProps = {
  children: ReactNode;
  scope: ScreenContainerScope;
};

export function ScreenContainerScopeProvider({ children, scope }: ScreenContainerScopeProviderProps) {
  return <ScreenContainerScopeContext value={scope}>{children}</ScreenContainerScopeContext>;
}

export function useScreenContainerScope() {
  return use(ScreenContainerScopeContext);
}
