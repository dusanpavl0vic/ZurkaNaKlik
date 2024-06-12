import React, { ReactNode, useRef } from "react";
import { toast } from "react-toastify";
import { ResultType } from "@/types";

type Props = {
  uploadFn: (formData: FormData) => Promise<ResultType> | void;
  children: ReactNode;
};

const UploadComponent = ({ uploadFn, children }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (!inputRef.current) return;
    inputRef.current.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!event.target.files || event.target.files.length < 0) return;

    const file = event.target.files[0];
    const fD = new FormData();
    fD.append("file", file);

    const result = await uploadFn(fD);
    if (result && "error" in result) {
      return;
    }

    toast.success("Uspesno uplodana slika");
  };

  return (
    <div onClick={handleClick} className="cursorPointer">
      <input
        type="file"
        ref={inputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
      {children}
    </div>
  );
};

export default UploadComponent;
