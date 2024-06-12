import MojButton from "@/components/lib/button";
import { Autocomplete, Popover, TextField } from "@mui/material";
import { useMemo, useState } from "react";
import style from "./style.module.css";
import { useGetAllCitiesQuery } from "@/store/api/endpoints/oglas";

// type autocompleteOptions = {
//   label: string;
// }

type Props = {
  value: string | null;
  setValue: React.Dispatch<React.SetStateAction<string | null>>;
};

const Grad = ({ value, setValue }: Props) => {
  const [inputValue, setInputValue] = useState("");

  const { data: gradovi } = useGetAllCitiesQuery();

  return (
    <>
      <Autocomplete
        id="select-city"
        disablePortal
        value={value}
        onChange={(_, newVal: string | null) => {
          setValue(newVal);
        }}
        inputValue={inputValue}
        onInputChange={(_, newInputValue) => {
          setInputValue(newInputValue);
        }}
        options={gradovi ?? []}
        sx={{
          width: 300,
          ".css-154xyx0-MuiInputBase-root-MuiOutlinedInput-root": {
            borderRadius: "var(--borderRadiusMedium)",
            backgroundColor: "var(--lightGrey)",
          },
        }}
        renderInput={(params) => <TextField {...params} label="Grad" />}
      />
    </>
  );
};

export default Grad;
