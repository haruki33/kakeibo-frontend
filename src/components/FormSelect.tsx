import { Select, type ListCollection } from "@chakra-ui/react";
import type { CategoryType, typeSelect } from "../types/mysetting";
import { Controller, type Control } from "react-hook-form";

type formSelectProps = {
  name: keyof CategoryType;
  control: Control<CategoryType>;
  collections: ListCollection<typeSelect>;
  label: string;
  placeholder: string;
};

function FormSelect({
  name,
  control,
  collections,
  label,
  placeholder,
}: formSelectProps) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Select.Root
          collection={collections}
          name={field.name}
          value={[String(field.value)]}
          onValueChange={(e) => field.onChange(e.value[0])}
        >
          <Select.HiddenSelect />
          <Select.Label>{label}</Select.Label>
          <Select.Control>
            <Select.Trigger>
              <Select.ValueText placeholder={placeholder} />
            </Select.Trigger>
            <Select.IndicatorGroup>
              <Select.Indicator />
            </Select.IndicatorGroup>
          </Select.Control>
          <Select.Positioner>
            <Select.Content>
              {collections.items.map((collection) => (
                <Select.Item item={collection} key={collection.value}>
                  {collection.label}
                  <Select.ItemIndicator />
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Positioner>
        </Select.Root>
      )}
    />
  );
}

export default FormSelect;
