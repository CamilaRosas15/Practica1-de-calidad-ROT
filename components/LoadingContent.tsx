import { Spinner } from "@heroui/react";

export function LoadingContent() {
  return (
    <div className="mt-20 flex h-full items-center justify-center">
      <Spinner size="lg" />
    </div>
  );
}
