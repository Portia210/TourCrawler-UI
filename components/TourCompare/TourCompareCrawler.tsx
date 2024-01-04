"use client";
import { GOOGLE_MAP_API_KEY } from "@/constants/config";
import { useLoadScript } from "@react-google-maps/api";
import { Button, DatePicker, Form, InputNumber } from "antd";
import PlacesAutocomplete from "../PlacesAutocomplete";
import { ITourCompareDestination } from "../types";

const { RangePicker } = DatePicker;

export default function TourCompareCrawler() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAP_API_KEY,
    libraries: ["places"],
  });

  if (!isLoaded) return <div>Loading...</div>;

  const handleDestinationChange = (destination: ITourCompareDestination) => {
    console.log("destination1", destination);
  };

  const onRoomChange = (value: any) => {
    console.log("onRoomChange", value);
  };

  const onAdultChange = (value: any) => {
    console.log("onAdultChange", value);
  };

  const onChildrenChange = (value: any) => {
    console.log("onChildrenChange", value);
  };

  const onFinish = (values: any) => {
    console.log("onFinish", values);
  };

  return (
    <Form
      name="crawlerForm"
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 18 }}
      onFinish={onFinish}
      autoComplete="off"
      colon={false}
      labelAlign="left"
      className="w-1/2 border-solid border-1 border-black p-2 rounded-lg"
    >
      <Form.Item<any>
        label="Destination"
        name="destination"
        rules={[{ required: true, message: "Please input your destination!" }]}
      >
        <PlacesAutocomplete setSelected={handleDestinationChange} />
      </Form.Item>

      <Form.Item<any>
        label="Check-in - Check-out"
        name="checkin_checkout"
        rules={[
          {
            required: true,
            message: "Please input your Check-in - Check-out time!",
          },
        ]}
      >
        <RangePicker size="middle" className="w-full" />
      </Form.Item>
      <Form.Item<any>
        label="No of Room"
        name="room"
        rules={[{ required: true, message: "Please input number of room!" }]}
      >
        <InputNumber
          className="w-full"
          min={1}
          max={6}
          defaultValue={1}
          onChange={onRoomChange}
        />
      </Form.Item>
      <Form.Item<any>
        label="No of Adult"
        name="adult"
        rules={[{ required: true, message: "Please input number of Adult!" }]}
      >
        <InputNumber
          className="w-full"
          min={1}
          max={6}
          defaultValue={1}
          onChange={onAdultChange}
        />
      </Form.Item>
      <Form.Item<any>
        label="No of Children"
        name="children"
        rules={[
          { required: true, message: "Please input number of Children!" },
        ]}
      >
        <InputNumber
          className="w-full"
          min={1}
          max={6}
          defaultValue={1}
          onChange={onChildrenChange}
        />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
}
