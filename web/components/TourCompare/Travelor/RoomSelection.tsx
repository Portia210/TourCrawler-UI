import { InputNumber } from "antd";
import { useState } from "react";
import { IRoomInfo } from "../../types";

interface RoomSelectionProps {
  room: IRoomInfo;
  roomNo: number;
  onChange: (value: any, roomNo: number) => void;
}
export default function RoomSelection({
  room,
  roomNo,
  onChange,
}: RoomSelectionProps) {
  const [noOfChild, setNoOfChild] = useState(0);
  const onAdultChange = (value: number | null) => {
    if (!value) return;
    room.adults = value;
    onChange(room, roomNo);
  };
  const onChangeNumberOfChildren = (value: number | null) => {
    if (!value) return;
    setNoOfChild(value);
  };

  const onChildrenAgeChange = (value: number | null, index: number) => {
    if (!value) return;
    room.childrens[index] = value;
    onChange(room, roomNo);
  };

  const renderChildrenAgeInputs = () => {
    return Array.from({ length: noOfChild || 0 }).map((_, index) => {
      return (
        <div key={index}>
          <p>Child {`${index + 1}`} Age</p>
          <InputNumber
            min={0}
            max={17}
            value={room?.childrens[index]}
            onChange={(e) => onChildrenAgeChange(e, index)}
          />
        </div>
      );
    });
  };

  return (
    <div className="border-black border-solid">
      <p>Room Number {`${roomNo + 1}`}</p>
      <div>
        <p>Adults</p>
        <InputNumber
          className="w-full"
          min={1}
          max={10}
          value={room?.adults}
          onChange={(e) => onAdultChange(e)}
        />
      </div>
      <div>
        <p>Children</p>
        <InputNumber
          className="w-full"
          min={0}
          max={10}
          value={noOfChild}
          onChange={(e) => onChangeNumberOfChildren(e)}
        />
        <div className="flex space-x-1 flex-wrap">
          {renderChildrenAgeInputs()}
        </div>
      </div>
    </div>
  );
}
