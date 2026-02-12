import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { LuX } from "react-icons/lu";

interface TagInputProps {
  value?: string[];
  onChange: (tags: string[]) => void;
}

export default function TagInput({
  value = [],
  onChange,
}: TagInputProps) {
  const [inputValue, setInputValue] = useState("");

  const addTag = () => {
    if (inputValue.trim() && !value.includes(inputValue.trim())) {
      onChange([...value, inputValue.trim()]);
      setInputValue("");
    }
  };

  const removeTag = (tag: string) => {
    onChange(value.filter((t) => t !== tag));
  };

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {value.map((tag, index) => (
          <div
            key={index}
            className="flex items-center px-3 py-1 bg-zinc-200 rounded-md text-sm font-medium"
          >
            {tag}
            <Button
              variant="ghost"
              size="sm"
              className="ml-2 p-0 h-4 w-4"
              type="button"
              onClick={() => removeTag(tag)}
            >
              <LuX className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addTag();
            }
          }}
          placeholder="Enter a tag and press Enter"
        />
        <Button type="button" onClick={addTag}>
          Add Tag
        </Button>
      </div>
    </>
  );
}
