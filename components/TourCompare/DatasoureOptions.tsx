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
      <Select
        value={value}
        defaultValue={DATA_SOURCES.TRAVELOR}
        onChange={onChange}
        options={options}
      />
    </>
  );
}
