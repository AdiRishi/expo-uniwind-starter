import { useRouter } from "expo-router";

import { GenericErrorScreen } from "@/screens/error/generic-error-screen";

export default function NotFoundScreen() {
  const router = useRouter();

  return (
    <GenericErrorScreen
      title="Page not found"
      message="The page you're looking for doesn't exist or has been moved."
      errorDetails={{ code: 404, status: "Not Found" }}
      onGoHome={() => router.replace("/")}
    />
  );
}
