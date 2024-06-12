import { CSSProperties, useEffect, useMemo, useState } from "react";
import style from "./style.module.css";
import Icon from "../lib/icon";
import { Typography } from "@mui/material";
import {
  OglasObjekata,
  tipProslavaMap,
} from "@/store/api/endpoints/oglas/types";
import { enumToString } from "@/utils/enumMappings";
import { useSelector } from "react-redux";
import {
  useAddFavouriteMutation,
  useDeleteFavouriteMutation,
  useGetUserDataQuery,
  useIsFavoriteQuery,
} from "@/store/api/endpoints/korisnik";
import { selectUser } from "@/store/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { skipToken } from "@reduxjs/toolkit/query";
import { useGetImageQuery } from "@/store/api/endpoints/images";
import { getRawLocation } from "@/utils/handleQueries";
import { Role } from "@/models/role";

type Props = {
  oglas: OglasObjekata;
  onClick: React.MouseEventHandler<HTMLButtonElement> | (() => void);
};

const OglasKartica = ({ oglas, onClick }: Props) => {
  const userCurr = useSelector(selectUser);
  const navigate = useNavigate();
  const [addFavorite] = useAddFavouriteMutation();
  const [deleteFavorite] = useDeleteFavouriteMutation();

  const { data: isFavorite } = useIsFavoriteQuery(oglas.id ?? skipToken);
  const { data: user } = useGetUserDataQuery(userCurr?.id!, {
    skip: !userCurr || userCurr.role == Role.AGENCIJA,
  });

  const [localFavorite, setLocalFavorite] = useState<boolean>();

  const { data: imageUrl } = useGetImageQuery(
    getRawLocation(oglas.slike[0]) ?? skipToken
  );

  useEffect(() => {
    if(isFavorite == undefined) return;
    setLocalFavorite(isFavorite);
  }, [isFavorite]);

  const handleFavoriteClick = async () => {
    if (!user) {
      toast.error("Morate biti prijavljeni da biste dodali oglas u omiljene.");
      return;
    }

    try {
      if (localFavorite) {
        const response = await deleteFavorite(oglas.id);
        toast.success("Oglas uspešno uklonjen iz omiljenih.");
        setLocalFavorite((prevFavorite) => !prevFavorite);
      } else {
        const response = await addFavorite(oglas.id);
        toast.success("Oglas uspešno dodat u omiljene.");
        setLocalFavorite((prevFavorite) => !prevFavorite);
      }
    } catch (error) {
      console.error("Error updating favorite status:", error);
      toast.error("Greška pri ažuriranju omiljenih.");
    }
  };

  const defaultImage = "/images/imageNotFound.jpg";

  const OglasKarticaStyle: CSSProperties = {};

  // TODO IZMENI, OVDE TREBA GETUJES SLIKU SA BEKA
  const SlikaKartica: CSSProperties = {
    backgroundImage:
      oglas.slike?.length > 0 ? `url(${imageUrl})` : `url(${defaultImage})`,
  };

  const tipoviProslave: string[] = useMemo(() => {
    return oglas.listaTipProslava.map((tip) => {
      return enumToString(tip, tipProslavaMap);
    });
  }, [oglas]);

  const textTipProslave: string = useMemo(() => {
    let finalString = "";

    for (let i = 0; i < tipoviProslave.length; i++) {
      finalString += tipoviProslave[i];
      if (i < tipoviProslave.length - 1) {
        finalString += ", ";
      }
    }

    return finalString;
  }, [oglas]);

  let flagAgency = userCurr?.role === Role.AGENCIJA;
  return (
    <div className={style.GlavniDiv}>
      <div className={`${style.SlikaKartica} bs`} style={SlikaKartica}>
        {/* ovde ide slika , pa onda tip proslave i dal je omiljeno ili ne */}
        <div className={style.TipOmiljeno}>
          <div>
            <Typography noWrap maxWidth={150}>
              {textTipProslave}
            </Typography>
          </div>
          {user && user.id !== oglas.idVlasnika ? (
            <Icon
              icon="favorite"
              classes={`${
                localFavorite ? "colorMain" : "colorWhite"
              } cursorPointer`}
              onClick={handleFavoriteClick}
            />
          ) : (
            !flagAgency && (
              <Icon
                icon="edit"
                onClick={() => navigate(`/prostor/izmeniProstor/${oglas.id}`)}
                classes="cursorPointer colorWhite"
              />
            )
          )}
        </div>
      </div>
      <div
        className={`cursorPointer ${style.ViseInfo}`}
        onClick={() => {
          navigate(`/place/${oglas.id}`);
        }}
      >
        <div className={style.ViseInfoTekst}>
          <div className={style.ImeOcena}>
            <h2>{oglas.naziv}</h2>
            <div className={style.Ocena}>
              <Icon icon="grade" />
              <p>{oglas.ocena}</p>
            </div>
          </div>
          <div className={style.Opis}>
            <Typography
              overflow={"hidden"}
              textOverflow={"ellipsis"}
              height={100}
              lineHeight={"1.5rem"}
            >
              {oglas.opis}
            </Typography>
          </div>
        </div>
        <div className={style.CenaBrojLokacija}>
          <div className={style.BottomIcon}>
            <Icon icon="payments" />
            <p>{oglas.cenaPoDanu}</p>
          </div>
          <div className={style.BottomIcon}>
            <Icon icon="view_in_ar" />
            <p>{oglas.kvadratura}</p>
          </div>
          <div className={style.BottomIcon}>
            <Icon icon="location_on" />
            <p>{oglas.grad}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default OglasKartica;
