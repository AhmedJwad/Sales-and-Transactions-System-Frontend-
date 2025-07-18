import { FC, useEffect, useState } from "react";
import Multiselect from "multiselect-react-dropdown";
import { MultipleSelectorModel } from "../types/MultipleSelectorModel";

interface Props {
  selected: MultipleSelectorModel[];
  nonSelected: MultipleSelectorModel[];
  onChange: (selected: MultipleSelectorModel[]) => void;
}

const MultipleSelector: FC<Props> = ({
  selected,
  nonSelected,
  onChange,
}) => {
  const [options, setOptions] = useState<{ name: string; id: string }[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<
    { name: string; id: string }[]
  >([]);

  useEffect(() => {
    const allOptions = [...selected, ...nonSelected].map((item) => ({
      id: item.key,
      name: item.value,
    }));
    const selectedMapped = selected.map((item) => ({
      id: item.key,
      name: item.value,
    }));

    setOptions(allOptions);
    setSelectedOptions(selectedMapped);
  }, [selected, nonSelected]);

  const handleSelect = (
    selectedList: { name: string; id: string }[],
    selectedItem: { name: string; id: string }
  ) => {
    const result = selectedList.map((item) => ({
      key: item.id,
      value: item.name,
    }));
    setSelectedOptions(selectedList);
    onChange(result);
  };

  const handleRemove = (
    selectedList: { name: string; id: string }[],
    removedItem: { name: string; id: string }
  ) => {
    const result = selectedList.map((item) => ({
      key: item.id,
      value: item.name,
    }));
    setSelectedOptions(selectedList);
    onChange(result);
  };

  return (
    <div>
      <Multiselect
        options={options}
        selectedValues={selectedOptions}
        onSelect={handleSelect}
        onRemove={handleRemove}
        displayValue="name"
        placeholder="Select options"
        showCheckbox
        style={{
          chips: { background: "#1976d2" },
          multiselectContainer: { color: "black" },
        }}
      />
    </div>
  );
};

export default MultipleSelector;
