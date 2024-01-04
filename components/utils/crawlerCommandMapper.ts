import dayjs from "dayjs";

const crawlerCommandMapper = (values: any) => {
  const checkInDate = dayjs(values.checkin_checkout[0]).format("YYYY-MM-DD");
  const checkOutDate = dayjs(values.checkin_checkout[1]).format("YYYY-MM-DD");
  return {
    dataSource: "Travelor",
    destination: values?.destination,
    checkInDate,
    checkOutDate,
    rooms: values?.rooms,
    adult: values?.adult,
    children: values?.children,
  };
};
export { crawlerCommandMapper };
