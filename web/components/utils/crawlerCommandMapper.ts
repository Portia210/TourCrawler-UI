import dayjs from "dayjs";

const crawlerCommandMapper = (values: any) => {
  if (!values?.dataSource) throw new Error("dataSources is required");
  const checkInDate = dayjs(values.checkin_checkout[0]).format("YYYY-MM-DD");
  const checkOutDate = dayjs(values.checkin_checkout[1]).format("YYYY-MM-DD");
  return {
    dataSource: values?.dataSource,
    destination: values?.destination,
    checkInDate,
    checkOutDate,
    guests: values?.guests,
    rooms: values?.rooms,
    adult: values?.adult,
    children: values?.children,
    childrenAges: values?.childrenAges,
  };
};
export { crawlerCommandMapper };
