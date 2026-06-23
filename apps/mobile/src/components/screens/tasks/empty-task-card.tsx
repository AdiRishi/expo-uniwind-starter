import { Card } from "heroui-native";

import { Typography } from "@/components/ui/typography";

export function EmptyTaskCard() {
  return (
    <Card variant="tertiary">
      <Card.Body className="items-center py-8">
        <Typography variant="small" tone="muted">
          No tasks yet. Add one above!
        </Typography>
      </Card.Body>
    </Card>
  );
}
