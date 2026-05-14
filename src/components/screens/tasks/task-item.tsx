import { SymbolView } from "expo-symbols";
import { Button, Checkbox, useThemeColor } from "heroui-native";
import { View } from "react-native";
import { tv } from "tailwind-variants";

import { Typography } from "@/components/ui/typography";

const taskTitleVariants = tv({
  base: "flex-1",
  variants: {
    completed: {
      true: "text-muted line-through",
      false: "",
    },
  },
});

export function TaskItem({
  id,
  title,
  completed,
  onToggle,
  onDelete,
}: {
  id: string;
  title: string;
  completed: boolean;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const [dangerColor] = useThemeColor(["danger"]);

  return (
    <View className="flex-row items-center gap-3 px-4 py-3.5">
      <Checkbox
        accessibilityLabel={completed ? `Mark ${title} incomplete` : `Mark ${title} complete`}
        isSelected={completed}
        onSelectedChange={() => onToggle(id)}
      />
      <Typography variant="small" className={taskTitleVariants({ completed })}>
        {title}
      </Typography>
      <Button accessibilityLabel={`Delete ${title}`} isIconOnly variant="ghost" size="sm" onPress={() => onDelete(id)}>
        <SymbolView
          name={{ ios: "trash", android: "delete_outline", web: "delete_outline" }}
          size={16}
          tintColor={dangerColor}
        />
      </Button>
    </View>
  );
}
