import { OglasObjekata } from "@/store/api/endpoints/oglas/types";
import style from "./style.module.css";
import DisplayCard from "../DisplayCard";
import MojButton from "../lib/button";
import Icon from "../lib/icon";
import { useGetMenuesQuery } from "@/store/api/endpoints/agencija";
import { useGetImageQuery } from "@/store/api/endpoints/images";
import { skipToken } from "@reduxjs/toolkit/query";
import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import {
  useGetReservedOglasiQuery,
  useGetUserDataQuery,
} from "@/store/api/endpoints/korisnik";
import { selectUser } from "@/store/auth";
import { useSelector } from "react-redux";
import { Role } from "@/models/role";
import { getRawLocation } from "@/utils/handleQueries";
import {
  useGetOglasQuery,
  useLazyGetOglasQuery,
} from "@/store/api/endpoints/oglas";
import { format } from "date-fns";
import Input from "../lib/inputs/text-input";
import { PorucenMeni } from "@/store/api/endpoints/korisnik/types";

type MenyCardProps = {
  meni: Menu;
  addMenu: (menu: PorucenMeni) => void;
};

const MenyCardView = ({ meni, addMenu }: MenyCardProps) => {
  const user = useSelector(selectUser);
  const [open, setOpen] = useState(false);

  const { data: userInfo } = useGetUserDataQuery(user?.id ?? skipToken, {
    skip: !user || user.role == Role.AGENCIJA,
  });

  const { data: image } = useGetImageQuery(
    getRawLocation(meni.slika) ?? skipToken
  );
  const defaultImage = "/images/imageNotFound.jpg";
  const displayImage = `${image ?? defaultImage}`;

  const [amount, selectedAmount] = useState("");

  const canAddMenu = useMemo(() => {
    return user && user.role == Role.USER;
  }, [user]);

  const handleClick = () => {
    if (!canAddMenu) return;
    setOpen(true);
  };

  const handleClose = () => {
    // setSelectedOglas(null);
    setOpen(false);
  };

  const handleAdd = () => {
    const newMenu: PorucenMeni = {
      idMenija: meni.id,
      kg: parseInt(amount),
    };

    addMenu(newMenu);
  };

  return (
    <>
      <div
        className={`${style.Container} ${canAddMenu ? "cursorPointer" : ""}`}
        onClick={handleClick}
      >
        <div className={style.MenyPicture}>
          <img className={style.picture} src={displayImage} />
        </div>
        <div className={style.MenyTxt}>
          <h2>{meni.naziv}</h2>
          <Typography
            textOverflow={"ellipsis"}
            overflow={"hidden"}
            maxWidth={"100%"}
            height={"75px"}
          >
            {meni.opis}
          </Typography>
        </div>
      </div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Zakupite ovaj meni</DialogTitle>
        <DialogContent>
          <div className={style.dialogContainer}>
            <h3 className={style.nazivMenija}>{meni.naziv}</h3>
            <FormControl sx={{ m: 1, minWidth: 200 }}>
              <Input
                icon="scale"
                text={amount}
                onChange={selectedAmount}
                placeholder="Količina"
              />
            </FormControl>
          </div>
          <DialogActions>
            <MojButton text="Dodaj meni" small={true} onClick={handleAdd} />
          </DialogActions>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MenyCardView;
