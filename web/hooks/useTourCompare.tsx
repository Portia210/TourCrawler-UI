import { IRoomInfo } from "@/components/types";
import { autoSelectPlace } from "@/components/utils/autoSelectPlace";
import { convertRoomInfoTB } from "@/components/utils/convertRoomInfo";
import { crawlerCommandMapper } from "@/components/utils/crawlerCommandMapper";
import { DATA_SOURCES } from "@/constants/datasources";
import axios from "axios";
import { cloneDeep } from "lodash";
import { useState } from "react";

const useTourCompare = () => {
  const [loading, setLoading] = useState(false);

  const onSendCommandByDataSource = async (
    dataSource: string,
    payload: any,
    rooms: IRoomInfo[]
  ) => {
    try {
      setLoading(true);
      const roomInfoTb = convertRoomInfoTB(rooms);
      if (dataSource === DATA_SOURCES.ALL) {
        return await Promise.all([
          onSendTravelorCommand(payload, roomInfoTb),
          onSendBookingCommand(payload, roomInfoTb),
        ]);
      } else if (dataSource === DATA_SOURCES.TRAVELOR) {
        return await onSendTravelorCommand(payload, roomInfoTb);
      } else if (dataSource === DATA_SOURCES.BOOKING) {
        return await onSendBookingCommand(payload, roomInfoTb);
      } else {
        console.error("Invalid data source", dataSource);
      }
    } catch (error) {
      console.error("Send command failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const onSendTravelorCommand = async (payload: any, roomInfoTb: any) => {
    let values: any = cloneDeep(payload);
    values.dataSource = DATA_SOURCES.TRAVELOR;
    values.guests = roomInfoTb.guests;
    return await sendCommand(values);
  };

  const onSendBookingCommand = async (payload: any, roomInfoTb: any) => {
    let values: any = cloneDeep(payload);
    if (values.dataSource === DATA_SOURCES.ALL) {
      values.destination = await autoSelectPlace(
        payload?.destination?.destination
      );
    }
    values.dataSource = DATA_SOURCES.BOOKING;
    values.rooms = roomInfoTb.rooms;
    values.adult = roomInfoTb.adult;
    values.childrenAges = roomInfoTb.childrenAges;
    values.children = roomInfoTb.childrenAges.length;
    return await sendCommand(values);
  };

  const sendCommand = async (values: any) => {
    const payload = crawlerCommandMapper(values);
    return await axios.post("/api/jobs", payload).then((res) => res.data);
  };

  return {
    loading,
    onSendCommandByDataSource,
  };
};

export default useTourCompare;
