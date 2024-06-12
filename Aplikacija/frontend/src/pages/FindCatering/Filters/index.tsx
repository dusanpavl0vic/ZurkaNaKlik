import { Autocomplete, Checkbox, TextField } from "@mui/material";
import style from "./style.module.css";
import {
  useGetAllGlobalCategoriesQuery,
  useGetFilteredAgenciesQuery,
} from "@/store/api/endpoints/pregled";
import Grad from "@/pages/Home/DivFilteri/grad";
import { useGetAllCitiesQuery } from "@/store/api/endpoints/oglas";
import { SyntheticEvent, useState } from "react";
import PopupRange from "@/pages/Home/DivFilteri/popupRange";
import MojButton from "@/components/lib/button";
import { useSelector } from "react-redux";
import {
  selectAgencyFilters,
  selectAgencyFiltersData,
  setAgencyFilters,
} from "@/store/agencyFilters";
import { useAppDispatch } from "@/store";
import { AgencyFilters } from "@/store/agencyFilters/types";

const Filters = () => {
  const filters = useSelector(selectAgencyFilters);
  const filtersState = useSelector(selectAgencyFiltersData);
  const dispatch = useAppDispatch();

  const { data: allCategories } = useGetAllGlobalCategoriesQuery();

  const [city, setCity] = useState<string | null>(filtersState.grad ?? null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    filtersState.listaKategorija
  );

  const handleSelectCategory = (
    event: SyntheticEvent<Element>,
    newValue: string[]
  ) => {
    setSelectedCategories(newValue);
  };

  const [cenaOd, setCenaOd] = useState<string>(
    `${filtersState.cenaDostaveOd ?? ""}`
  );
  const [cenaDo, setCenaDo] = useState(`${filtersState.cenaDostaveDo ?? ""}`);

  const [mogucnostDostave, setMogucnostDostave] = useState<boolean>(
    filtersState.mogucnostDostave
  );

  const handleMogucnostDostaveChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setMogucnostDostave(event.target.checked);
  };

  const submit = async () => {
    const newFiltersData: AgencyFilters = {
      ...filters,
      filtersData: {
        ...filtersState,
        cenaDostaveDo: cenaDo != "" ?  parseInt(cenaDo) : undefined,
        cenaDostaveOd: cenaOd != "" ?  parseInt(cenaOd) : undefined,
        grad: city ?? undefined,
        listaKategorija: selectedCategories,
        mogucnostDostave: mogucnostDostave,
      },
    };

    dispatch(setAgencyFilters(newFiltersData));
  };

  return (
    <>
      <div className={style.backgroundImage}>
        <div className={style.filtersWrapper}>
          <div className={style.content}>
            <h2>Pronadjite savršeni ketering!</h2>
            <p>
              Dobrodošli na našu platformu gde možete jednostavno naručiti
              vrhunski ketering za vašu žurku! Kod nas ćete pronaći sve što vam
              je potrebno za savršeno gastronomsko iskustvo.
            </p>
          </div>
          <div className={style.filtersContainer}>
            <div className={style.filters}>
              <Autocomplete
                multiple
                limitTags={2}
                id="kategorijeAutocomplete"
                options={allCategories || []}
                onChange={handleSelectCategory}
                renderInput={(params) => (
                  <TextField {...params} label="Kategorije" />
                )}
                sx={{
                  width: "300px",
                  ".css-154xyx0-MuiInputBase-root-MuiOutlinedInput-root": {
                    borderRadius: "var(--borderRadiusMedium)",
                    backgroundColor: "var(--lightGrey)",
                  },
                }}
              />
              <Grad value={city} setValue={setCity}></Grad>
              <PopupRange
                icon="payments"
                inputText="Cena Dostave"
                from={cenaOd}
                to={cenaDo}
                setFrom={setCenaOd}
                setTo={setCenaDo}
                disabled={!mogucnostDostave}
              />
              <MojButton
                text="Pretraži"
                onClick={submit}
                paddingX="50px"
                paddingY="10px"
              />
            </div>
            <div className={style.mogucnostDostave}>
              <Checkbox
                checked={mogucnostDostave}
                onChange={handleMogucnostDostaveChange}
              />

              <label>Mogućnost dostave</label>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Filters;
