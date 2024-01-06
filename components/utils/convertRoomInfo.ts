import { IRoomInfo } from "../types";
/**
 * Convert room's info to guests (Travelor)
 * @param rooms
 * @returns  {string} guests
 */
const convertRoomInfo = (rooms: IRoomInfo[]): string => {
  const result: string[] = [];

  rooms.forEach((room) => {
    const { adults, childrens } = room;
    let adult = "";
    for (let i = 0; i < adults; i++) {
      adult += "a,";
    }
    let child = "";
    for (let i = 0; i < childrens.length; i++) {
      child += `${childrens[i]},`;
    }
    let roomInfo = `${adult}${child}`;
    if (roomInfo.endsWith(",")) roomInfo = roomInfo.slice(0, -1);
    result.push(roomInfo);
  });

  return `${result.join("|")}`;
};

export { convertRoomInfo };
