import MojButton from "@/components/lib/button";
import Input from "@/components/lib/inputs/text-input";
import style from "./style.module.css";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import {
  useAddMenuMutation,
  useDeleteMenuMutation,
} from "@/store/api/endpoints/agencija";
import { enumToString } from "@/utils/enumMappings";
import { useSelector } from "react-redux";
import { selectUser } from "@/store/auth";
import DisplayCard from "@/components/DisplayCard";
import { DESTRUCTION } from "dns";
import { toast } from "react-toastify";
import { useGetImageQuery } from "@/store/api/endpoints/images";
import { skipToken } from "@reduxjs/toolkit/query";
import { getRawLocation } from "@/utils/handleQueries";

type Props = {
  kategorija?: Category[];
  menuData: Menu;
};

const Meniji = ({ kategorija, menuData }: Props) => {
  const currUser = useSelector(selectUser);

  const [deleteMenu] = useDeleteMenuMutation();
  let selectedKategorija = "";

  if (kategorija && menuData) {
    for (let i = 0; i < kategorija?.length; i++) {
      if (kategorija[i].id === menuData.idKategorije) {
        selectedKategorija = kategorija[i].naziv;
      }
    }
  }

  const defaultImage = "/images/imageNotFound.jpg";
  const { data: image } = useGetImageQuery(
    getRawLocation(menuData.slika) ?? skipToken
  );

  const displayImage: string = useMemo(() => {
    return image ?? defaultImage;
  }, [image]);

  const deleteMeny = async () => {
    if (!menuData) return;
    const result = await deleteMenu(menuData.id);

    if ("error" in result) {
      return;
    }

    toast.success("Meni je uspesno obrisan!");
  };

  return (
    <div className={style.menijji}>
      <div className={style.InputiOpisPlusic}>
        {/* odje ide ime menija blabla */}
        <div className={style.newMenu}>
          <div className={style.choseImage}>
            <img src={displayImage} />
          </div>
          <div className={style.inputs}>
            <DisplayCard
              width="200px"
              text={menuData.naziv}
              icon={"restaurant_menu"}
            />
            <DisplayCard
              text={menuData.cenaMenija.toString()}
              icon={"payments"}
            />
            <DisplayCard text={selectedKategorija} icon={"category"} />
          </div>
          <textarea
            placeholder="Opis menija"
            className={`${style.MenuTxt} ${style.TxtAreaPostojeciMeni}`}
            value={menuData?.opis}
            onChange={() => {}}
            disabled
          />
        </div>
        <div className={style.Kocka}>
          <MojButton
            text=""
            onClick={deleteMeny}
            icon="delete"
            paddingX="20px"
            paddingY="20px"
          />
        </div>
      </div>
    </div>
  );
};
export default Meniji;
