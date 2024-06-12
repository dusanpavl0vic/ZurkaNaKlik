import {
  MakeCateringReservationDTO,
  PorucenMeni,
  ReservedOglas,
} from "@/store/api/endpoints/korisnik/types";
import style from "./style.module.css";
import { useEffect, useMemo, useState } from "react";
import {
  useGetOglasQuery,
  useLazyGetOglasQuery,
} from "@/store/api/endpoints/oglas";
import { useSelector } from "react-redux";
import { selectUser } from "@/store/auth";
import {
  useGetReservedOglasiQuery,
  useMakeCateringReservationMutation,
} from "@/store/api/endpoints/korisnik";
import { Role } from "@/models/role";
import {
  Checkbox,
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
import Icon from "@/components/lib/icon";
import { format } from "date-fns";
import MojButton from "@/components/lib/button";
import {
  useGetImageQuery,
  useLazyGetImageQuery,
} from "@/store/api/endpoints/images";
import { skipToken } from "@reduxjs/toolkit/query";
import { getRawLocation } from "@/utils/handleQueries";
import { useGetAgencyListMenuesQuery } from "@/store/api/endpoints/pregled";
import { useGetAgencyDataQuery } from "@/store/api/endpoints/agencija";
import { toast } from "react-toastify";

type Props = {
  agencyId?: number;
  meniji: PorucenMeni[];
  removeMenu: (arg: number) => void;
  resetMenues: () => void;
};

type SelectOglas = {
  text: string;
  date: Date;
  value: number;
};

type FinalMenuData = {
  kg: number;
  menue: MenuForList;
};

// TODO mnogo lose ovde jedan refaktor da se udari
const Checkout = ({ meniji, agencyId, removeMenu, resetMenues }: Props) => {
  const user = useSelector(selectUser);
  const defaultImage = "/images/imageNotFound.jpg";

  const [makeReservationAction] = useMakeCateringReservationMutation();

  const [open, setOpen] = useState(false);
  const [selectedOglasId, setSelectedOglasId] = useState<number | null>(null);
  const [selectOglasOptions, setSelectOglasOptions] = useState<SelectOglas[]>(
    []
  );

  const [checkedPrice, setCheckedPrice] = useState(false);

  const [getOglasAction] = useLazyGetOglasQuery();
  const { data: reservedOglasi } = useGetReservedOglasiQuery(undefined, {
    skip: !user || user.role == Role.AGENCIJA,
  });

  const selectedReservedOglasData: ReservedOglas | null = useMemo(() => {
    if (!reservedOglasi) return null;
    return reservedOglasi.filter((oglas) => oglas.id === selectedOglasId)[0];
  }, [selectedOglasId]);

  const { data: selectedOglasData } = useGetOglasQuery(
    selectedReservedOglasData?.oglasId ?? skipToken
  );

  const { data: image } = useGetImageQuery(
    getRawLocation(selectedOglasData?.slike[0]) ?? skipToken
  );

  const { data: agencyData } = useGetAgencyDataQuery(agencyId ?? skipToken);

  const menijiIds: number[] = useMemo(() => {
    const ids: number[] = [];

    meniji.forEach((meni) => {
      ids.push(meni.idMenija);
    });

    return ids;
  }, [meniji]);

  const { data: menuesData } = useGetAgencyListMenuesQuery(menijiIds, {
    skip: menijiIds.length < 1,
  });

  const finalMenuData: FinalMenuData[] = useMemo(() => {
    if (!menuesData) return [];

    const newArr: FinalMenuData[] = [];

    for (let i = 0; i < meniji.length; i++) {
      for (let j = 0; j < menuesData.length; j++) {
        if (meniji[i].idMenija === menuesData[j].id) {
          newArr.push({
            kg: meniji[i].kg,
            menue: menuesData[j],
          });
        }
      }
    }

    return newArr;
  }, [meniji, menuesData]);

  const displayImage = image ?? defaultImage;

  useEffect(() => {
    const oglasOptions: SelectOglas[] = [];
    if (!reservedOglasi) return;

    reservedOglasi.forEach(async (oglas) => {
      if (!oglas.oglasId) return;

      const { data: oglasData } = await getOglasAction(oglas.oglasId);
      if (!oglasData) return;
      oglasOptions.push({
        text: oglasData.naziv,
        date: new Date(oglas.zakupljenOd),
        value: oglas.id,
      });
    });

    setSelectOglasOptions(oglasOptions);
  }, [reservedOglasi]);

  const handleSelectOglas = (event: SelectChangeEvent) => {
    setSelectedOglasId(parseInt(event.target.value));
  };

  const handleClose = () => {
    setOpen(false);
  };

  const displayChooseOglas = !!(selectedOglasData && selectedReservedOglasData);

  const totalPrice: number = useMemo(() => {
    if (!agencyData) return 0;
    let price = checkedPrice ? agencyData.cenaDostave : 0;

    finalMenuData.forEach((menu) => {
      price += menu.menue.cenaMenija * menu.kg;
    });

    return price;
  }, [agencyData, finalMenuData, checkedPrice]);

  const canSubmit: boolean = useMemo(() => {
    if (meniji.length < 1 || displayChooseOglas == false) return false;
    return true;
  }, [displayChooseOglas, meniji]);

  const handleSubmit = () => {
    if (!canSubmit || agencyId == undefined || !selectedReservedOglasData)
      return;

    const reservationObject: MakeCateringReservationDTO = {
      idAgencije: agencyId,
      idZakupljenOglas: selectedReservedOglasData.id,
      mogucnostDostave: checkedPrice,
      porucenMeni: meniji,
    };

    const result = makeReservationAction(reservationObject);

    if ("error" in result) {
      return;
    }

    setCheckedPrice(false);
    setSelectedOglasId(null);
    resetMenues();

    toast.success("Usepesno zakupljen meni!");
  };

  if (agencyId == undefined || !agencyData) {
    return null;
  }

  const displayedCheckout: boolean = useMemo(() => {
    if (!open && meniji.length < 1) return false;
    return true;
  }, [open, meniji]);

  return (
    <div
      className={`${style.checkoutContainer} ${
        displayedCheckout ? style.displayedCheckout : ""
      }`}
    >
      <h4>Naruceni Meniji</h4>
      {!displayChooseOglas && (
        <div
          className={`${style.unselectedOglasCard} ${style.oglasCard} cursorPointer`}
          onClick={() => setOpen(true)}
        >
          <p>Odaberite oglas</p>
        </div>
      )}
      {displayChooseOglas && (
        <div className={`${style.oglasCard}`}>
          <img src={displayImage} />
          <div className={style.oglasCardText}>
            <p>{selectedOglasData.naziv}</p>
            <p>
              {format(selectedReservedOglasData.zakupljenOd, "LLL d, y")}
            </p>
          </div>
          <Icon
            iconMargin="14px"
            icon="cancel"
            onClick={() => setSelectedOglasId(null)}
            classes="cursorPointer"
          />
        </div>
      )}

      <div className={style.menuContainer}>
        {finalMenuData.map((menue) => {
          return (
            <div className={style.menuCard}>
              <Typography fontFamily={"Nunito"}>{menue.menue.naziv}</Typography>
              <div className={style.iconPrice}>
                <Typography fontFamily={"Nunito"}>
                  {menue.kg}kg • {menue.kg * menue.menue.cenaMenija} din
                </Typography>
                <Icon
                  icon="cancel"
                  classes="cursorPointer"
                  onClick={() => removeMenu(menue.menue.id)}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className={style.bottomContainer}>
        <div className={style.priceContainer}>
          <div>
            <Checkbox
              checked={checkedPrice}
              onChange={() => setCheckedPrice(!checkedPrice)}
            />
            <label
              style={{
                color: !checkedPrice ? "var(--lightText)" : undefined,
              }}
            >
              Dostava: {agencyData.cenaDostave} din
            </label>
          </div>
          <Typography sx={{ marginBottom: 1 }} fontFamily={"Nunito"}>
            Ukupno: {totalPrice} din
          </Typography>
          <MojButton
            text="Potvrdi Zakup"
            classes={style.potvrdiZakupButton}
            small={true}
            wide={true}
            center={true}
            grey={!canSubmit}
            disabled={!canSubmit}
            onClick={handleSubmit}
          />
        </div>
      </div>

      <Dialog open={open} onClose={setOpen}>
        <DialogTitle>Odaberi oglas</DialogTitle>
        <DialogContent>
          <FormControl sx={{ m: 1, minWidth: 200 }}>
            <InputLabel id="Select-Vikendica">Odaberite oglas</InputLabel>
            <Select
              value={selectedOglasId != null ? String(selectedOglasId) : ""}
              onChange={handleSelectOglas}
              labelId="Select-Vikendica"
              label="Mjau"
            >
              {selectOglasOptions.map((oglasOption) => {
                return (
                  <MenuItem value={oglasOption.value}>
                    <div className={style.selectOglasOption}>
                      <p>{oglasOption.text}</p>
                      <Typography>
                        {format(oglasOption.date, "LLL d, y")}
                      </Typography>
                    </div>
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <DialogActions>
            <MojButton text="Potvrdi" small={true} onClick={handleClose} />
          </DialogActions>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Checkout;
