import { useNavigate, useParams } from "react-router-dom";
import style from "./style.module.css";
import { useGetOglasQuery } from "@/store/api/endpoints/oglas";
import Icon from "@/components/lib/icon";
import {
  useAddFavouriteMutation,
  useDeleteFavouriteMutation,
  useGetUserDataQuery,
  useIsFavoriteQuery,
  useMakeReservationMutation,
} from "@/store/api/endpoints/korisnik";
import UserAvatar from "@/components/UserAvatar";
import MojButton from "@/components/lib/button";
import { skipToken } from "@reduxjs/toolkit/query";
import { useEffect, useMemo, useState } from "react";
import {
  dodatnaOpremaIkoniceMap,
  dodatnaOpremaMap,
  tipProslavaMap,
} from "@/store/api/endpoints/oglas/types";
import ImageGallery from "@/components/ImageGallery";
import {
  useGetImageQuery,
  useLazyGetImageQuery,
} from "@/store/api/endpoints/images";
import { getRawLocation } from "@/utils/handleQueries";
import PageSpacer from "@/components/lib/page-spacer";
import ImageOverview from "@/components/ImageOverview";
import { enumToString } from "@/utils/enumMappings";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from "@mui/material";
import { Button, DateRange } from "react-day-picker";
import SelectDatum from "./calendar";
import { MakeReservationDTO } from "@/store/api/endpoints/korisnik/types";
import { areIntervalsOverlapping, eachDayOfInterval } from "date-fns";
import { toast } from "react-toastify";
import { selectUser } from "@/store/auth";
import { useSelector } from "react-redux";
import { Role } from "@/models/role";

const Oglas = () => {
  const currUser = useSelector(selectUser);
  const [date, setDate] = useState<DateRange | undefined>();
  const [openDialog, setOpenDialog] = useState(false);

  const { id } = useParams();
  const idOglasa = id ? parseInt(id) : undefined;
  const navigate = useNavigate();

  const { data: currentOglas } = useGetOglasQuery(idOglasa ?? skipToken);

  const { data: VlasnikOglasa } = useGetUserDataQuery(
    currentOglas?.idVlasnika ?? skipToken
  );

  const canReserve: boolean = useMemo(() => {
    if (!currUser) return false;
    if (currUser.role === Role.AGENCIJA) return false;
    if (!VlasnikOglasa) return false;
    if (currUser.id === VlasnikOglasa.id) return false;
    return true;
  }, [currUser, VlasnikOglasa]);

  const { data: isFavorite } = useIsFavoriteQuery(
    currentOglas?.id ?? skipToken
  );

  const [addFavouriteAction] = useAddFavouriteMutation();
  const [removeFavouriteAction] = useDeleteFavouriteMutation();

  const [localFavorite, setLocalFavorite] = useState<boolean>();
  const [bigImage, setBigImage] = useState<string | null>(null);
  const [images, setImages] = useState<(string | null | undefined)[]>([]);

  console.log(localFavorite);

  useEffect(() => {
    if (isFavorite == undefined) return;
    setLocalFavorite(isFavorite);
  }, [isFavorite]);

  const [getImageAction] = useLazyGetImageQuery();

  const [makeReservationAction] = useMakeReservationMutation();

  const bussyDates: Date[] = useMemo(() => {
    if (!currentOglas) return [];

    const datumi: Date[] = [];

    currentOglas.zauzetiDani.forEach((dan) => {
      datumi.push(new Date(dan));
    });

    return datumi;
  }, [currentOglas]);
  const { data: imageUrl } = useGetImageQuery(
    getRawLocation(VlasnikOglasa?.profilePhoto) ?? skipToken
  );

  const handleFavourite = async () => {
    if (!currentOglas) return;

    if (localFavorite) {
      setLocalFavorite(false);
      await addFavouriteAction(currentOglas.id);
    } else {
      setLocalFavorite(true);
      await removeFavouriteAction(currentOglas.id);
    }
  };

  const tipoviProslave: string[] = useMemo(() => {
    if (!currentOglas) return [];
    return currentOglas.listaTipProslava.map((tip) => {
      return enumToString(tip, tipProslavaMap);
    });
  }, [currentOglas]);

  const textTipProslave: string = useMemo(() => {
    let finalString = "";

    for (let i = 0; i < tipoviProslave.length; i++) {
      finalString += tipoviProslave[i];
      if (i < tipoviProslave.length - 1) {
        finalString += ", ";
      }
    }

    return finalString;
  }, [currentOglas]);

  useEffect(() => {
    if (!currentOglas) return;

    const fetchImages = async () => {
      const results = await Promise.all(
        currentOglas.slike.map(async (slikaLocation) => {
          if (!slikaLocation) return undefined;
          const { data, error } = await getImageAction(
            getRawLocation(slikaLocation)!
          );
          if (error) {
            console.error(error);
            return null;
          }
          return data;
        })
      );

      setImages(results);
    };

    fetchImages();
  }, [currentOglas?.slike, getImageAction]);

  const dates: Date[] = useMemo(() => {
    if (!date || !date.from || !date.to) return [];
    return eachDayOfInterval({ start: date.from, end: date.to });
  }, [date]);

  const overlap: boolean = useMemo(() => {
    if (!date || !date.from || !date.to || bussyDates.length < 2) return false;

    return areIntervalsOverlapping(
      { start: date.from, end: date.to },
      { start: bussyDates[0], end: bussyDates[bussyDates.length - 1] }
    );
  }, [date, bussyDates]);

  const numberOfDays: number = useMemo(() => {
    return dates.length;
  }, [dates]);

  const totalPrice: number = useMemo(() => {
    if (!currentOglas) return 0;
    return currentOglas.cenaPoDanu * numberOfDays;
  }, [currentOglas, numberOfDays]);

  useEffect(() => {
    if (!images[0]) return;
    setBigImage(images[0]);
  }, [images]);

  const submit = async () => {
    if (!currentOglas) return;

    const reservationObject: MakeReservationDTO = {
      idOglasa: currentOglas.id,
      trazeniDatumi: dates,
    };

    const result = await makeReservationAction(reservationObject);
    if ("error" in result) {
      return;
    }

    toast.success("Oglas je uspesno rezervisan");

    setOpenDialog(true);
  };

  if (!currentOglas) {
    return null;
  }

  return (
    <>
      <PageSpacer variant="xs" />
      <div className={`containerWrapper ${style.Glavni}`}>
        <div className={style.PodeliteOmiljeno}>
          <div onClick={() => {}} className={style.Podelite}>
            <Icon icon="ios_share" />
            <label>Podelite</label>
          </div>
          <div onClick={handleFavourite} className={style.Podelite}>
            <Icon
              icon="favorite"
              classes={`${
                localFavorite ? "colorMain" : undefined
              } cursorPointer`}
            />
            <label>Dodajte oglas u omiljene</label>
          </div>
        </div>
        <div className={style.container}>
          <ImageOverview tipoviProslava={textTipProslave} image={bigImage} />
          <ImageGallery
            onClick={setBigImage}
            deletable={false}
            images={images}
          />
        </div>
        {/* informacije ispod slike */}
        <div className={style.Informacije}>
          <div className={style.InformacijeKolona}>
            <div className={style.PrvaKocka}>
              <div>
                <h1>{currentOglas?.naziv}</h1>
                <div className={style.ocena}>
                  <Icon
                    classes={style.ikonicaOcene}
                    fontSize="30px"
                    icon="grade"
                  />
                  <label>{currentOglas?.ocena}</label>
                </div>
              </div>
              <div className={style.OsobeKrevetKupatilo}>
                <div className={style.Osobe}>
                  <Icon icon="view_in_ar" />
                  <label>{currentOglas?.kvadratura}</label>
                </div>
                <div className={style.Osobe}>
                  <Icon icon="bed" />
                  <label>{currentOglas?.brojKreveta}</label>
                </div>
                <div className={style.Osobe}>
                  <Icon icon="bathroom" />
                  <label>{currentOglas?.brojKupatila}</label>
                </div>
              </div>
              <div>
                <Typography lineHeight={"1.5rem"}>
                  {currentOglas.opis}
                </Typography>
              </div>
            </div>
            {/* ovde ide info o vlasniku */}
            <div className={style.InfoOVlasniku}>
              <div className={style.Avatar}>
                <UserAvatar size={100} src={imageUrl} />
                <h2>
                  {VlasnikOglasa?.name} {VlasnikOglasa?.lastName}
                </h2>
              </div>
              <div>
                <MojButton
                  text="Prikazi profil"
                  wide={true}
                  center={true}
                  onClick={() =>
                    navigate(
                      `/user/profile/${VlasnikOglasa && VlasnikOglasa.id}`
                    )
                  }
                  paddingX="50px"
                  paddingY="6px"
                />
              </div>
            </div>
            {/* ii opremljenost */}
            <div className={style.OpremljenostDIV}>
              <h3>Opremljenost</h3>
              <div className={style.Opremljenost}>
                {/* ovde */}
                {currentOglas &&
                  currentOglas?.listDodatneOpreme.map((oprema) => {
                    return (
                      <div className={style.JedanChk}>
                        <Icon icon={dodatnaOpremaIkoniceMap[oprema]} />
                        <label>{dodatnaOpremaMap[oprema]}</label>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
          {/* ovde ide s desne strane sve sto treba */}
          <div className={style.InformacijeKolona}>
            <div className={style.Kontakt}>
              <h4>Kontaktirajte nas</h4>
              <div className={style.RedKontakt}>
                <Icon icon="mail" />
                <h5>{VlasnikOglasa?.email}</h5>
              </div>
              <div className={style.RedKontakt}>
                <Icon icon="location_on" />
                <h5>{currentOglas?.grad}</h5>
              </div>
              <div className={style.RedKontakt}>
                <Icon icon="phone" />
                <h5>{currentOglas?.brTel}</h5>
              </div>
            </div>
            <div className={style.Calendar}>
              <h4>Izaberite Datume</h4>
              <SelectDatum
                bussyDays={bussyDates}
                date={date}
                setDate={setDate}
                overlap={overlap}
                disabled={!canReserve}
              />
            </div>
            {canReserve && (
              <MojButton
                text={`Rezerviši Vikendicu • ${totalPrice} din`}
                onClick={submit}
                paddingX="60px"
              />
            )}
          </div>
        </div>
      </div>
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Oglas je uspešno rezervisan
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Uspešno ste rezervisali ovaj oglas. Možete odabrati ketering za
            oglas, ili nastaviti dalje na pregled svih zakupljenih oglasa.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <MojButton
            small={true}
            text="Zakupljeni Oglasi"
            grey={true}
            onClick={() => {
              navigate("/history");
            }}
          />
          <MojButton
            small={true}
            text="Dodajte Ketering"
            onClick={() => {
              navigate("/findCatering");
            }}
          />
        </DialogActions>
      </Dialog>
    </>
  );
};
export default Oglas;
