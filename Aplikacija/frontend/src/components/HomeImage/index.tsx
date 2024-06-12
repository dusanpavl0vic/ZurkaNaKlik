import MojButton from "@/components/lib/button";
import style from "./style.module.css";
import { useSelector } from "react-redux";
import { selectUser } from "@/store/auth";
import DivFilteri from "@/pages/Home/DivFilteri";
import { useGetAllCitiesQuery } from "@/store/api/endpoints/oglas";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { tipProslave } from "@/types";
import { selectFiltersData, setFiltersData } from "@/store/filters";
import {
  EnumTipProslava,
  tipProslavaMap,
} from "@/store/api/endpoints/oglas/types";
import { enumToString, stringToEnum } from "@/utils/enumMappings";
import { useAppDispatch } from "@/store";
import { FiltersData } from "@/store/filters/types";

const HomeImage = () => {
  const filters = useSelector(selectFiltersData);
  const dispatch = useAppDispatch();

  const [tipoviProslave, setTipoviProslave] = useState<tipProslave[]>([
    {
      value: enumToString(EnumTipProslava.Sve, tipProslavaMap),
      selected: filters.tipProslava.includes(EnumTipProslava.Sve),
    },
    {
      value: enumToString(EnumTipProslava.Rodjendan, tipProslavaMap),
      selected: filters.tipProslava.includes(EnumTipProslava.Rodjendan),
    },
    {
      value: enumToString(EnumTipProslava.Zurka, tipProslavaMap),
      selected: filters.tipProslava.includes(EnumTipProslava.Zurka),
    },
    {
      value: enumToString(EnumTipProslava.Teambuilding, tipProslavaMap),
      selected: filters.tipProslava.includes(EnumTipProslava.Teambuilding),
    },
    {
      value: enumToString(EnumTipProslava.Momacko, tipProslavaMap),
      selected: filters.tipProslava.includes(EnumTipProslava.Momacko),
    },
    {
      value: enumToString(EnumTipProslava.Devojacko, tipProslavaMap),
      selected: filters.tipProslava.includes(EnumTipProslava.Devojacko),
    },
    {
      value: enumToString(EnumTipProslava.Ostalo, tipProslavaMap),
      selected: filters.tipProslava.includes(EnumTipProslava.Ostalo),
    },
  ]);

  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const cities = useGetAllCitiesQuery();

  const selectTipProslave = (index: number) => {
    let sel = [...tipoviProslave];
    sel[index].selected = !sel[index].selected;

    // klik na sve
    if (sel[index].value == "Sve") {
      sel.forEach((el) => {
        el.selected = sel[index].selected;
      });
    }

    // klik na bilo sta drugo kad je selektano sve
    if (sel[index].value != "Sve" && sel[index].selected == false) {
      sel.forEach((el) => {
        if (el.value != "Sve") return;
        el.selected = false;
      });
    }

    setTipoviProslave(sel);

    const selectedValues: number[] = [];
    sel.forEach((element) => {
      if (!element.selected) return;
      const str = stringToEnum(element.value, tipProslavaMap);
      if (str == undefined) return;

      selectedValues.push(str);
    });

    const newFiltersData: FiltersData = {
      ...filters,
      tipProslava: selectedValues,
    };

    dispatch(setFiltersData(newFiltersData));
  };

  return (
    <div className={style.SearchDiv}>
      <div className={style.contentWrapper}>
        <div className={style.GoreDiv}>
          <h1>Pronađite svoj savršeni prostor!</h1>
          <p>
            Oglašavajte i iznajmljujte savršen prostor za žurke. Na našoj
            platformi lako pronađite ili ponudite prostor za događaje i naručite
            vrhunski ketering za vašu žurku.{" "}
          </p>
        </div>

        <div className={style.DoleDiv}>
          
            <div className={style.Dugmad}>
              {tipoviProslave.map((dugme, index) => {
                return (
                  <MojButton
                    text={dugme.value}
                    onClick={() => {
                      selectTipProslave(index);
                    }}
                    paddingX="14px"
                    paddingY="14px"
                    fontSize="16px"
                    backgroundColor={
                      tipoviProslave[index].selected ? undefined : "white"
                    }
                    color={tipoviProslave[index].selected ? undefined : "black"}
                    small={true}
                  />
                );
              })}
            </div>

           <DivFilteri />
        </div>
      </div>
    </div>
  );
};

export default HomeImage;
