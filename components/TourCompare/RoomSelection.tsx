import { InputNumber } from "antd";

interface RoomSelectionProps {
  room: any;
  roomNo: number;
  onChange: (value: any, index: number) => void;
}
export default function RoomSelection(props: RoomSelectionProps) {
  return (
    <div className="border-black border-solid">
      <p>Room Number {`${props.roomNo}`}</p>
      <div>
        <p>Adults</p>
        <InputNumber className="w-full" min={1} max={6} />
      </div>
      <div>
        <p>Childrens</p>
        <InputNumber className="w-full" min={0} max={5} />
      </div>
    </div>
  );
}
