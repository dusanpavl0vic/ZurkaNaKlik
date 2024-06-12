import React, { useState } from "react";
import { Checkbox, Dialog, DialogTitle, FormControlLabel } from "@mui/material";
import style from "./style.module.css";
import {
  EnumDodatnaOprema,
  EnumGrejanje,
  EnumTipProstora,
  dodatnaOpremaMap,
  tipGrejanjaMap,
  tipProstoraMap,
} from "@/store/api/endpoints/oglas/types";
import { pink } from "@mui/material/colors";
import { stringToEnum } from "@/utils/enumMappings";

export interface SimpleDialogProps {
  open: boolean;
  selectedValue: string;
  onClose: (value: string) => void;
  selectedDodatnaOprema: number[];
  selectedTipoviProstora: number[];
  selectedTipoviGrejanja: number[];
  handleChangeDodatnaOprema: (value: string) => void;
  handleChangeTipProstora: (value: string) => void;
  handleChangeTipGrejanja: (value: string) => void;
}
export interface JosFilteraProps {
  selectedDodatnaOprema: number[];
  selectedTipoviProstora: number[];
  selectedTipoviGrejanja: number[];
  handleChangeDodatnaOprema: (value: string) => void;
  handleChangeTipProstora: (value: string) => void;
  handleChangeTipGrejanja: (value: string) => void;
}

function SimpleDialog(props: SimpleDialogProps) {
  const {
    onClose,
    selectedValue,
    open,
    selectedDodatnaOprema,
    selectedTipoviProstora,
    selectedTipoviGrejanja,
    handleChangeDodatnaOprema,
    handleChangeTipProstora,
    handleChangeTipGrejanja,
  } = props;
  const handleClose = () => {
    onClose(selectedValue);
  };

  const handleListItemClick = (value: string) => {
    onClose(value);
  };

  return (
    <Dialog
      onClose={handleClose}
      open={open}
      sx={{ width: "100%", borderRadius: "30px", padding: "15px" }}
    >
      <DialogTitle>Izaberite jos filtera</DialogTitle>

      <div className={style.Tip}>
        <h3>Izaberite dodatnu opremu</h3>
        <div className={style.TipContainer}>
          {Object.values(dodatnaOpremaMap).map((value, index) => {
            return (
              <div className={style.JedanChk} key={value}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedDodatnaOprema.includes(index)}
                      onChange={() => handleChangeDodatnaOprema(value)}
                      sx={{
                        color: pink[800],
                        "&.Mui-checked": {
                          color: pink[600],
                        },
                      }}
                    />
                  }
                  label={value}
                />
              </div>
            );
          })}
        </div>
      </div>
      <div className={style.Tip}>
        <h3>Tipovi prostora</h3>
        <div className={style.TipContainer}>
          {Object.values(tipProstoraMap).map((value, index) => {
            return (
              <div className={style.JedanChk} key={value}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedTipoviProstora.includes(index)}
                      onChange={() => handleChangeTipProstora(value)}
                      sx={{
                        color: pink[800],
                        "&.Mui-checked": {
                          color: pink[600],
                        },
                      }}
                    />
                  }
                  label={value}
                />
              </div>
            );
          })}
        </div>
      </div>
      <div className={style.Tip}>
        <h3>Grejanje</h3>
        <div className={style.TipContainer}>
          {Object.values(tipGrejanjaMap).map((value, index) => {
            return (
              <div className={style.JedanChk} key={value}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedTipoviGrejanja.includes(index)}
                      onChange={() => handleChangeTipGrejanja(value)}
                      sx={{
                        color: pink[800],
                        "&.Mui-checked": {
                          color: pink[600],
                        },
                      }}
                    />
                  }
                  label={value}
                />
              </div>
            );
          })}
        </div>
      </div>
    </Dialog>
  );
}

const JosFiltera = (props: JosFilteraProps) => {
  const {
    selectedDodatnaOprema,
    selectedTipoviProstora,
    selectedTipoviGrejanja,
    handleChangeDodatnaOprema,
    handleChangeTipProstora,
    handleChangeTipGrejanja,
  } = props;
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value: string) => {
    setOpen(false);
  };
  return (
    <div>
      <div className={style.JosFiltera} onClick={handleClickOpen}>
        <img src="/images/page_info.png" alt="Page Info" />
        <p>Još filtera</p>
      </div>
      <SimpleDialog
        open={open}
        selectedValue="default"
        onClose={handleClose}
        selectedDodatnaOprema={selectedDodatnaOprema}
        selectedTipoviProstora={selectedTipoviProstora}
        selectedTipoviGrejanja={selectedTipoviGrejanja}
        handleChangeDodatnaOprema={handleChangeDodatnaOprema}
        handleChangeTipProstora={handleChangeTipProstora}
        handleChangeTipGrejanja={handleChangeTipGrejanja}
      />
    </div>
  );
};

export default JosFiltera;
