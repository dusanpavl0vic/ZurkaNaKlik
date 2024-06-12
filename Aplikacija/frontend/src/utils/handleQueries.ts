import { useGetImageQuery } from "@/store/api/endpoints/images";
import { skipToken } from "@reduxjs/toolkit/query";

export const getRawLocation = (
  rawLocation: string | undefined
): string | undefined => {
  if (!rawLocation) return undefined;
  return rawLocation.split("/").join("%2F");
};
