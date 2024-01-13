import { isAxiosError } from "axios";
import { NextResponse } from "next/server";

const parseBody = (body: any) => {
  try {
    return JSON.parse(body);
  } catch (err) {
    return body;
  }
};

const nextReturn = (
  payload: any,
  status: number = 200,
  statusText?: string,
  headers?: any
) => {
  if (status > 300 || status < 200) {
    let errorMgs = "";
    if (isAxiosError(payload)) {
      errorMgs =
        payload?.response?.data ||
        payload?.response?.data?.message ||
        payload?.message;
      payload = errorMgs;
    } else if (payload instanceof Error) {
      errorMgs = JSON.stringify(payload);
    }
    console.error("nextReturn error", errorMgs);
  }
  return NextResponse.json(parseBody(payload), {
    status,
    statusText,
  });
};

export { nextReturn };
