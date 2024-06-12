import MojButton from "@/components/lib/button";
import { Popover, Typography } from "@mui/material";
import { SyntheticEvent, useEffect, useMemo, useState } from "react";
import style from "./style.module.css";
import Icon from "@/components/lib/icon";
import { selectFiltersData } from "@/store/filters";
import { useSelector } from "react-redux";

type Props = {
  icon: string;
  inputText: string;
  from: string;
  to: string;
  setFrom: React.Dispatch<React.SetStateAction<string>>;
  setTo: React.Dispatch<React.SetStateAction<string>>;
  disabled?: boolean;
};

const PopupRange = ({
  icon,
  inputText,
  from,
  to,
  setFrom,
  setTo,
  disabled,
}: Props) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const handleCenaOd = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFrom(event.target.value);
  };
  const handleCenaDo = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTo(event.target.value);
  };

  const text: string = useMemo(() => {
    if (from != "" && to != "") return `${from} - ${to}`;
    if (from != "") return `${from} - `;
    return inputText;
  }, [from, to]);

  return (
    <div>
      <MojButton
        text={text}
        onClick={handleClick}
        paddingX="80px"
        paddingY="14px"
        fontSize="15px"
        icon={icon}
        grey={true}
        color="black"
        wide={true}
        disabled={disabled}
      />
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        sx={{
          "& .css-3bmhjh-MuiPaper-root-MuiPopover-paper": {
            borderRadius: "30px",
          },
        }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        {/* <Typography sx={{ p: 2 }}>The content of the Popover.</Typography> */}
        <div className={style.CenaVelikiDiv}>
          <div className={style.CenaOd}>
            <Typography sx={{ p: 2 }}>Od :</Typography>

            <Icon icon={icon} />

            <input
              type="number"
              id="textInput"
              value={from}
              onChange={handleCenaOd}
            />
          </div>
          <div className={style.CenaOd}>
            <Typography sx={{ p: 2 }}>Do :</Typography>

            <Icon icon={icon} />
            <input
              type="number"
              id="textInput"
              value={to}
              onChange={handleCenaDo}
            />
          </div>
        </div>
      </Popover>
    </div>
  );
};
export default PopupRange;
