import { InputNumber } from "antd";

interface ChildAgeInputProps {
  noChild: number[];
  onChange: (age: number, index: number) => void;
}
export default function ChildAgeInput({
  noChild,
  onChange,
}: ChildAgeInputProps) {
  return (
    <div className="flex space-x-1 flex-wrap">
      {noChild.map((item, index) => {
        return (
          <div key={index}>
            <p>Child {index + 1} Age</p>
            <InputNumber
              min={0}
              max={17}
              value={item}
              onChange={(e) => onChange(e || 1, index)}
            />
          </div>
        );
      })}
    </div>
  );
}
