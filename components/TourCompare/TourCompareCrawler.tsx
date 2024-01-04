"use client";
import { GOOGLE_MAP_API_KEY } from "@/constants/config";
import { useLoadScript } from "@react-google-maps/api";
import { Button, DatePicker, Form, InputNumber, notification } from "antd";
import dayjs from "dayjs";
import { useState } from "react";
import PlacesAutocomplete from "../PlacesAutocomplete";
import { crawlerCommandMapper } from "../utils/crawlerCommandMapper";

const { RangePicker } = DatePicker;

export default function TourCompareCrawler() {
  const [api, contextHolder] = notification.useNotification();
  const [loading, setLoading] = useState(false);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAP_API_KEY,
    libraries: ["places"],
  });

  if (!isLoaded) return <div>Loading...</div>;

  const disabledDate = (current: any) => {
    return current < dayjs().startOf("day");
  };
  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      const payload = crawlerCommandMapper(values);
      const response = await fetch("/api/jobs", {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => res.json());
      api.success({
        message: "Send command successfully",
        description: `Job ID: ${response}`,
      });
    } catch (error) {
      console.error("Send command failed:", error);
      api.error({
        message: "Send command failed",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {contextHolder}
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
          rules={[
            { required: true, message: "Please input your destination!" },
          ]}
        >
          <PlacesAutocomplete />
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
          <RangePicker
            disabledDate={disabledDate}
            size="middle"
            className="w-full"
          />
        </Form.Item>
        <Form.Item<any>
          label="No of Rooms"
          name="rooms"
          rules={[{ required: true, message: "Please input number of room!" }]}
        >
          <InputNumber className="w-full" min={1} max={6} defaultValue={1} />
        </Form.Item>
        <Form.Item<any>
          label="No of Adult"
          name="adult"
          rules={[{ required: true, message: "Please input number of Adult!" }]}
        >
          <InputNumber className="w-full" min={1} max={6} defaultValue={1} />
        </Form.Item>
        <Form.Item<any>
          label="No of Children"
          name="children"
          rules={[
            { required: true, message: "Please input number of Children!" },
          ]}
        >
          <InputNumber className="w-full" min={1} max={6} defaultValue={1} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Send crawl command
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}
