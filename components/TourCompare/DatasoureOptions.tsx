import { DATA_SOURCES } from "@/constants/datasources";
import { Select } from "antd";

const options = [
  {
    value: DATA_SOURCES.TRAVELOR,
    label: "Travelor",
  },
  {
    value: DATA_SOURCES.BOOKING,
    label: "Booking",
    disabled: true,
  },
  {
    value: DATA_SOURCES.ALL,
    label: "All",
  },
];
interface DatasourceOptionsProps {
  value?: any;
  onChange?: (val: DATA_SOURCES) => void;
}

export default function DatasourceOptions({
  value,
  onChange,
}: DatasourceOptionsProps) {
  return (
    <>
      <Select value={value} onChange={onChange} options={options} />
    </>
  );
}
