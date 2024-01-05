import { InputNumber } from "antd";

interface RoomSelectionProps {
  room: any;
  roomNo: number;
  onChange: (value: any, roomNo: number) => void;
}
export default function RoomSelection({
  room,
  roomNo,
  onChange,
}: RoomSelectionProps) {
  const onAdultChange = (value: number | null) => {
    if (!value) return;
    room.adults = value;
    onChange(room, roomNo);
  };
  const onChildrenChange = (value: number | null) => {
    if (!value) return;
    room.childrens = value;
    onChange(room, roomNo);
  };
  return (
    <div className="border-black border-solid">
      <p>Room Number {`${roomNo + 1}`}</p>
      <div>
        <p>Adults</p>
        <InputNumber
          className="w-full"
          min={1}
          max={6}
          value={room?.adults}
          onChange={(e) => onAdultChange(e)}
        />
      </div>
      <div>
        <p>Children</p>
        <InputNumber
          className="w-full"
          min={0}
          max={5}
          value={room?.childrens}
          onChange={(e) => onChildrenChange(e)}
        />
      </div>
    </div>
  );
}
