import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

export type ResultType =
  | {
      data: void;
    }
  | {
      error: FetchBaseQueryError | SerializedError;
    }
  | undefined;

export type tipProslave = {
  value: string;
  selected: boolean;
};
