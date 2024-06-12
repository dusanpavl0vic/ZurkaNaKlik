import MojButton from "@/components/lib/button";
import style from "./style.module.css";
import BrojLjudi from "./brojLjudi";
import PopupRange from "./popupRange";
import Datum from "./datum";
import Grad from "./grad";
import { useState } from "react";
import JosFiltera from "./josFiltera";
import { stringToEnum } from "@/utils/enumMappings";
import {
  dodatnaOpremaMap,
  tipGrejanjaMap,
  tipProstoraMap,
} from "@/store/api/endpoints/oglas/types";
import { DateRange } from "react-day-picker";
import { addDays } from "date-fns";
import { useSelector } from "react-redux";
import { selectFiltersData, setFiltersData } from "@/store/filters";
import { useAppDispatch } from "@/store";
import { FiltersData } from "@/store/filters/types";

const DivFilteri = () => {
  const dispatch = useAppDispatch();
  const filtersState = useSelector(selectFiltersData);

  const [gradValue, setGradValue] = useState<string | null>(filtersState.grad);

  const [broj, setBroj] = useState(`${filtersState ?? ""}`);
  const [cenaOd, setCenaOd] = useState(`${filtersState.cenaOd ?? ""}`);
  const [cenaDo, setCenaDo] = useState(`${filtersState.cenaDo ?? ""}`);
  const [kvadraturaOd, setKvadraturaOd] = useState(
    `${filtersState.kvadraturaOd ?? ""}`
  );
  const [kvadraturaDo, setKvadraturaDo] = useState(
    `${filtersState.kvadraturaDo ?? ""}`
  );

  const [selectedDodatnaOprema, setSelectedDodatnaOprema] = useState<number[]>(
    filtersState.dodatnaOprema
  );
  const [selectedTipoviProstora, setSelectedTipoviProslava] = useState<
    number[]
  >(filtersState.tipProstora);
  const [selectedTipoviGrejanja, setSelectedTipoviGrejanja] = useState<
    number[]
  >(filtersState.grejanje);

  const [date, setDate] = useState<DateRange | undefined>({
    from: filtersState.datumOd,
    to: filtersState.datumDo,
  });

  const handleSubmit = async () => {
    const newFilterData: FiltersData = {
      ...filtersState,
      dodatnaOprema: selectedDodatnaOprema,
      grejanje: selectedTipoviGrejanja,
      cenaOd: cenaOd != "" ? parseInt(cenaOd) : undefined,
      cenaDo: cenaDo != "" ? parseInt(cenaDo) : undefined,
      datumOd: date?.from,
      datumDo: date?.to,
      grad: gradValue != "" ? gradValue : null,
      kvadraturaOd: kvadraturaOd != "" ? parseInt(kvadraturaOd) : undefined,
      kvadraturaDo: kvadraturaDo != "" ? parseInt(kvadraturaDo) : undefined,
    };

    dispatch(setFiltersData(newFilterData));
  };

  const handleChangeDodatnaOprema = (value: string) => {
    const type = stringToEnum(value, dodatnaOpremaMap);
    if (type == undefined || type == null) return;

    const set = new Set(selectedDodatnaOprema);
    if (set.has(type)) {
      set.delete(type);
    } else {
      set.add(type);
    }

    setSelectedDodatnaOprema(Array.from(set));
  };

  const handleChangeTipProstora = (value: string) => {
    const type = stringToEnum(value, tipProstoraMap);
    if (type == undefined || type == null) return;

    const set = new Set(selectedTipoviProstora);
    if (set.has(type)) {
      set.delete(type);
    } else {
      set.add(type);
    }

    setSelectedTipoviProslava(Array.from(set));
  };

  const handleChangeTipGrejanja = (value: string) => {
    const type = stringToEnum(value, tipGrejanjaMap);
    if (type == undefined || type == null) return;

    const set = new Set(selectedTipoviGrejanja);
    if (set.has(type)) {
      set.delete(type);
    } else {
      set.add(type);
    }

    setSelectedTipoviGrejanja(Array.from(set));
  };

  return (
    <div className={style.DivZaPretragu}>
      <div className={style.DugmeFilter}>
        <Grad value={gradValue} setValue={setGradValue} />

        <Datum numberOfMonths={2} date={date} setDate={setDate} />

        <PopupRange
          icon="payments"
          inputText="Cena"
          from={cenaOd}
          to={cenaDo}
          setFrom={setCenaOd}
          setTo={setCenaDo}
        />

        <PopupRange
          icon="view_in_ar"
          inputText="Kvadratura"
          from={kvadraturaOd}
          to={kvadraturaDo}
          setFrom={setKvadraturaOd}
          setTo={setKvadraturaDo}
        />

        <MojButton
          text="Pretraži"
          onClick={handleSubmit}
          paddingX="80px"
          paddingY="18px"
          fontSize="15px"
          center={true}
        />
      </div>
      <JosFiltera
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

export default DivFilteri;
