import MojButton from "@/components/lib/button";
import Icon from "@/components/lib/icon";
import { Popover, Typography } from "@mui/material";
import { useState } from "react";
import style from "./style.module.css";

type Props = {
  broj: string;
  setBroj: React.Dispatch<React.SetStateAction<string>>;
};

const BrojLjudi = ({ broj, setBroj }: Props) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const handleBroj = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBroj(event.target.value);
  };

  return (
    <div>
      <MojButton
        text={(broj !== "") ? broj : "Broj ljudi"}
        onClick={handleClick}
        paddingX="80px"
        paddingY="14px"
        fontSize="15px"
        icon="boy"
        grey={true}
        color="black"
        wide={true}
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
            <Typography sx={{ p: 2 }}>Broj ljudi :</Typography>

            <Icon icon="boy" />
            <input
              type="number"
              id="textInput"
              value={broj}
              onChange={handleBroj}
              min="1"
            />
          </div>
        </div>
      </Popover>
    </div>
  );
};
export default BrojLjudi;
