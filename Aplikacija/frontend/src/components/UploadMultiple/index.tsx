import React, {
  ReactNode,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { MutationTrigger } from "@reduxjs/toolkit/dist/query/react/buildHooks";
import { toast } from "react-toastify";
import {
  FetchArgs,
  FetchBaseQueryError,
  MutationDefinition,
} from "@reduxjs/toolkit/query";
import { BaseQueryFn } from "@reduxjs/toolkit/query";
import { ResultType } from "@/types";
import { Dispatch } from "@reduxjs/toolkit";

type Props = {
  handleUpload: (arg0: FormData) => void;
  children: ReactNode;
};

const UploadMultiple = ({
  handleUpload,
  children,
}: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (!inputRef.current) return;
    inputRef.current.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files || files.length < 0) return;

    const fD = new FormData();

    for (let i = 0; i < files.length; i++) {
      fD.append(`file-${i}`, files[i]);
    }

    handleUpload(fD);
  };

  return (
    <div onClick={handleClick} className="cursorPointer">
      <input
        type="file"
        multiple={true}
        ref={inputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
      {children}
    </div>
  );
};

export default UploadMultiple;
