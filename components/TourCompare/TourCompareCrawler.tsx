"use client";
import { GOOGLE_MAP_API_KEY } from "@/constants/config";
import { DATA_SOURCES } from "@/constants/datasources";
import { useLoadScript } from "@react-google-maps/api";
import { Button, DatePicker, Form, InputNumber, notification } from "antd";
import dayjs from "dayjs";
import { useState } from "react";
import PlacesAutocomplete from "../PlacesAutocomplete";
import { IRoomInfo } from "../types";
import { convertRoomInfo } from "../utils/convertRoomInfo";
import { crawlerCommandMapper } from "../utils/crawlerCommandMapper";
import DatasourceOptions from "./DatasoureOptions";
import RoomSelection from "./RoomSelection";

const { RangePicker } = DatePicker;

export default function TourCompareCrawler() {
  const [api, contextHolder] = notification.useNotification();
  const [loading, setLoading] = useState(false);
  const [rooms, setRooms] = useState<IRoomInfo[]>([
    { adults: 1, childrens: [] },
  ]);
  const [dataSource, setDataSource] = useState<DATA_SOURCES>(
    DATA_SOURCES.TRAVELOR
  );

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAP_API_KEY,
    libraries: ["places"],
  });

  const disabledDate = (current: any) => {
    return current < dayjs().startOf("day");
  };
  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      const guests = convertRoomInfo(rooms);
      const payload = crawlerCommandMapper(values, guests);
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

  const onRoomInfoChange = (value: any, index: number) => {
    setRooms((prev) => {
      prev[index] = value;
      return [...prev];
    });
  };

  const onAddRoom = () => {
    setRooms((prev) => [...prev, { adults: 1, childrens: [] }]);
  };

  const onRemoveRoom = (index: number) => {
    if (rooms?.length === 1) return;
    setRooms((prev) => {
      prev.splice(index, 1);
      return [...prev];
    });
  };

  const renderTravelorRoomInfo = () => {
    return (
      <>
        {rooms.map((room, index) => (
          <div key={index}>
            <div className="space-y-1 mb-1">
              <RoomSelection
                room={room}
                roomNo={index}
                onChange={(value, roomNo) => onRoomInfoChange(value, roomNo)}
              />
              <Button danger onClick={() => onRemoveRoom(index)}>
                Remove Room
              </Button>
            </div>
          </div>
        ))}
        <Button className="mt-2" onClick={() => onAddRoom()}>
          Add Room
        </Button>
      </>
    );
  };

  const renderBookingRoomInfo = () => {
    return (
      <>
        <Form.Item<any>
          label="No of Rooms"
          name="rooms"
          rules={[{ required: true, message: "Please input number of room!" }]}
        >
          <InputNumber className="w-full" min={1} max={30} />
        </Form.Item>
        <Form.Item<any>
          label="No of Adult"
          name="adult"
          rules={[{ required: true, message: "Please input number of Adult!" }]}
        >
          <InputNumber className="w-full" min={1} max={30} />
        </Form.Item>
        <Form.Item<any>
          label="No of Children"
          name="children"
          rules={[
            { required: true, message: "Please input number of Children!" },
          ]}
        >
          <InputNumber className="w-full" min={0} max={10} />
        </Form.Item>
      </>
    );
  };

  if (!isLoaded) return <p>Loading...</p>;
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
          label="Datasource"
          name="dataSource"
          rules={[{ required: true, message: "Please input the datasource!" }]}
        >
          <DatasourceOptions
            value={dataSource}
            onChange={(val) => setDataSource(val)}
          />
        </Form.Item>

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
        <Form.Item<any> label="Rooms Info" name="roomsInfo">
          {dataSource === DATA_SOURCES.TRAVELOR
            ? renderTravelorRoomInfo()
            : renderBookingRoomInfo()}
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
