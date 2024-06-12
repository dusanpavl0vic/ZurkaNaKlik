import MojButton from "@/components/lib/button";
import style from "./style.module.css";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import Input from "@/components/lib/inputs/text-input";
import {
  Chip,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  SxProps,
  Theme,
  formGroupClasses,
} from "@mui/material";
import {
  AddOglasObjektaDTO,
  EnumDodatnaOprema,
  EnumGrejanje,
  EnumTipProslava,
  EnumTipProstora,
  dodatnaOpremaMap,
  tipGrejanjaMap,
  tipProslavaMap,
  tipProstoraMap,
} from "@/store/api/endpoints/oglas/types";
import Icon from "@/components/lib/icon";
import { enumToString, stringToEnum } from "@/utils/enumMappings";
import { useAddUserOglasMutation } from "@/store/api/endpoints/oglas";
import { addUserOglasSchema } from "@/utils/validators";
import { toast } from "react-toastify";
import { getValidationMessage } from "@/utils/validationMessage";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "@/store/auth";
import ImageGallery from "@/components/ImageGallery";
import PageSpacer from "@/components/lib/page-spacer";
import UploadMultiple from "@/components/UploadMultiple";
import { count } from "console";
import {
  useUploadMultipleOglasMutation,
  useUploadOglasMutation,
} from "@/store/api/endpoints/images";
import {
  UploadMultipleOglasDTO,
  UploadOglasDTO,
} from "@/store/api/endpoints/images/types";
import { resourceUsage } from "process";

const OglasiProstor = () => {
  const [opisProstora, setOpisProstora] = useState("");

  const [grejanje, setGrejanje] = useState("");
  const [naziv, setNaziv] = useState("");
  const [brojTelefona, setBrojTelefona] = useState("");
  const [grad, setGrad] = useState("");
  const [adresa, setAdresa] = useState("");
  const [cenaDan, setCenaDan] = useState("");
  const [kvadratura, setKvadratura] = useState("");
  const [brojSoba, setBrojSoba] = useState("");
  const [brojKreveta, setBrojKreveta] = useState("");
  const [brojKupatila, setBrojKupatila] = useState("");

  const [selectedTipoviProslava, setSelectedTipoviProslava] = useState<
    number[]
  >([]);
  const [selectedTipoviProstora, setSelectedTipoviProstora] = useState<
    number[]
  >([]);
  const [selectedDodatnaOprema, setSelectedDodatnaOprema] = useState<number[]>(
    []
  );

  const [formData, setFormData] = useState<FormData | null>(null);
  const prevFormData = useRef<FormData | null>(null);
  const [images, setImages] = useState<(string | null | undefined)[]>([]);
  const [imagePaths, setImagePaths] = useState<string[]>([]);

  // const [uploadMultipleAction] = useUploadMultipleOglasMutation();
  const [uploadOglasAction] = useUploadOglasMutation();

  const handleDelete = (index: number) => {
    if (!formData) return;
    const newFD = new FormData();

    let toDelete: string | null = null;

    let i = 0;
    for (const [key, value] of formData.entries()) {
      if (i === index) {
        i++;
        continue;
      }

      i++;
      newFD.append(key, value);
    }

    const newImages = images.filter((_, id) => id != index);

    setFormData(newFD);
    setImages(newImages);
  };

  // TODO Izbaci ga u utils
  const createBlobFromFormData = (fd: FormData, key: string): Blob | null => {
    const file = fd.get(key);

    if (file instanceof File) {
      const blob = new Blob([file], { type: file.type });
      return blob;
    }

    return null;
  };

  const handleUpload = (fD: FormData) => {
    const newFD = new FormData();
    const newImages: (string | null | undefined)[] = [];

    // prepisem stare
    if (formData) {
      for (const [key, value] of formData.entries()) {
        newFD.append(key, value);
      }
    }
    for (let i = 0; i < images.length; i++) {
      newImages.push(images[i]);
    }

    // dodam nove
    let counter = formData ? Array.from(formData.keys()).length : 0;
    for (const [key, value] of fD.entries()) {
      newFD.append(`file-${counter}`, value);

      const blob = createBlobFromFormData(newFD, key);
      if (blob) {
        newImages.push(URL.createObjectURL(blob));
      }

      counter++;
    }

    setFormData(newFD);
    setImages(newImages);
  };

  const user = useSelector(selectUser);
  const [addOglas] = useAddUserOglasMutation();
  const navigate = useNavigate();

  const handleChangeGrejanje = (event: SelectChangeEvent) => {
    setGrejanje(event.target.value);
  };

  function updateOpisProstora(event: ChangeEvent<HTMLTextAreaElement>) {
    setOpisProstora(event.target.value);
  }

  const handleTipProslavaChange = (value: string) => {
    const selected = stringToEnum(value, tipProslavaMap);
    if (selected == undefined) return;

    const tipoviSet = new Set(selectedTipoviProslava);
    if (tipoviSet.has(selected)) {
      tipoviSet.delete(selected);

      if (tipoviSet.has(EnumTipProslava.Sve)) {
        tipoviSet.delete(EnumTipProslava.Sve);
      }
    } else {
      tipoviSet.add(selected);

      if (tipoviSet.has(EnumTipProslava.Sve)) {
        Object.values(EnumTipProslava).forEach((element) => {
          if (typeof element !== "number") return;
          tipoviSet.add(element);
        });
      }
    }

    setSelectedTipoviProslava(Array.from(tipoviSet));
  };

  const handleTipProstoraChange = (value: string) => {
    const selected = stringToEnum(value, tipProstoraMap);
    if (selected == undefined) return;

    const tipoviSet = new Set(selectedTipoviProstora);
    if (tipoviSet.has(selected)) {
      tipoviSet.delete(selected);
    } else {
      tipoviSet.add(selected);
    }

    setSelectedTipoviProstora(Array.from(tipoviSet));
  };

  const handleDodatnaOpremaChange = (value: string) => {
    const selected = stringToEnum(value, dodatnaOpremaMap);
    if (selected == undefined) return;

    const tipoviSet = new Set(selectedDodatnaOprema);
    if (tipoviSet.has(selected)) {
      tipoviSet.delete(selected);
    } else {
      tipoviSet.add(selected);
    }

    setSelectedDodatnaOprema(Array.from(tipoviSet));
  };

  function getChipSx<T extends string>(
    value: T,
    enumMap: { [key in T]: string },
    selected: number[]
  ): SxProps<Theme> {
    const defaultSx: SxProps<Theme> = {
      width: "100%",
      borderRadius: "12px",
      height: "40px",
      color: "var(--lightText)",
      border: "1px solid var(--lightText)",
    };

    const selectedSx: SxProps<Theme> = {
      width: "100%",
      borderRadius: "12px",
      height: "40px",
      color: "black",
      border: "1px solid black",
    };

    const item = stringToEnum(value, enumMap);
    if (item == undefined) return defaultSx;
    if (selected.indexOf(item) == -1) {
      return defaultSx;
    }

    return selectedSx;
  }

  function isSelected<T extends string>(
    value: T,
    enumMap: { [key in T]: string },
    selected: number[]
  ): boolean {
    const item = stringToEnum(value, enumMap);
    if (item == undefined) return false;
    if (selected.indexOf(item) == -1) {
      return false;
    }

    return true;
  }

  const submit = async () => {
    if (!user) return;
    const tipGrejanja = stringToEnum(grejanje, tipGrejanjaMap);
    if (tipGrejanja == undefined) {
      toast.error("Tip grejanja nije validan");
      return;
    }

    const oglasObject: AddOglasObjektaDTO = {
      listaTipProslava: selectedTipoviProslava,
      listaTipProstora: selectedTipoviProstora,
      listDodatneOpreme: selectedDodatnaOprema,
      grejanje: tipGrejanja,
      brojKreveta: parseInt(brojKreveta),
      brojKupatila: parseInt(brojKupatila),
      brojSoba: parseInt(brojSoba),
      kvadratura: parseInt(kvadratura),
      ocena: 0,
      brojOcena: 0,
      brTel: brojTelefona,
      cenaPoDanu: parseInt(cenaDan),
      grad: grad,
      lokacija: adresa,
      naziv: naziv,
      opis: opisProstora,
      slike: [],
    };

    const validation = addUserOglasSchema.validate(oglasObject);
    if (validation.error) {
      const [type, msg] = getValidationMessage(validation);
      toast.error(`Polje ${msg}`);
      return;
    }

    const response = await addOglas(oglasObject);
    if ("error" in response) {
      return;
    }

    if (!formData) {
      toast.success("Oglas uspesno dodat");
      return;
    }

    for (let [key, value] of formData) {
      let newFormData = new FormData();
      newFormData.append("file", value);

      const uploadObject: UploadOglasDTO = {
        id: response.data.id,
        formData: newFormData,
      };

      let result = await uploadOglasAction(uploadObject);
    }

    toast.success("Oglas kao i slike oglasa dodat");
    navigate(`/user/profile`);
  };

  return (
    <>
      <PageSpacer variant="xs" />
      <div className={`containerWrapper ${style.Glavni}`}>
        <div className={style.Txt}>
          <h2>Oglasite prostor za izdavanje</h2>
          <p>
            Dodajte sve validne podatke za Vas prostor, kako bi korisnicima dali
            sto siru sliku prostora kojeg izdajete.
          </p>
        </div>
        <ImageGallery
          imagePaths={imagePaths}
          deleteHandler={handleDelete}
          images={images}
        />
        <div className={style.NAJJACEDUGME}>
          <UploadMultiple handleUpload={handleUpload}>
            <MojButton
              text="Dodaj sliku"
              onClick={() => {}}
              icon="add_photo_alternate"
              backgroundColor="lightgrey"
              color="black"
              wide={true}
              center={true}
            />
          </UploadMultiple>
        </div>
        <div className={style.OpisiProstora}>
          {/* opisi */}
          <div className={style.KolonaTxtArea}>
            <textarea
              placeholder="Opis prostora"
              className={style.TxtArea}
              onChange={updateOpisProstora}
              value={opisProstora}
            />
          </div>
          <div className={style.KolonaTxtArea}>
            <Input
              text={naziv}
              placeholder="Naziv prostora"
              icon="house"
              onChange={setNaziv}
            />
            <Input
              text={brojTelefona}
              placeholder="Broj Telefona"
              icon="call"
              onChange={setBrojTelefona}
            />
            <Input
              text={grad}
              placeholder="Grad"
              icon="location_on"
              onChange={setGrad}
            />
            <Input
              text={adresa}
              placeholder="Adresa"
              icon="location_on"
              onChange={setAdresa}
            />
            <Input
              text={cenaDan}
              placeholder="Cena po danu"
              icon="payments"
              onChange={setCenaDan}
            />
            <Input
              text={kvadratura}
              placeholder="Kvadratura"
              icon="view_in_ar"
              onChange={setKvadratura}
            />
            <Input
              text={brojSoba}
              placeholder="Broj soba"
              icon="chair"
              onChange={setBrojSoba}
            />
            <Input
              text={brojKreveta}
              placeholder="Broj kreveta"
              icon="bed"
              onChange={setBrojKreveta}
            />
            <Input
              text={brojKupatila}
              placeholder="Broj kupatila"
              icon="bathroom"
              onChange={setBrojKupatila}
            />
            <Select
              id="select-tip-grejanja"
              value={grejanje ?? ""}
              onChange={handleChangeGrejanje}
              sx={{
                width: "100%",
                borderRadius: "12px",
                color: "black",
              }}
            >
              {Object.values(tipGrejanjaMap).map((value) => {
                return (
                  <MenuItem key={`Select-${value}`} value={value}>
                    {value}
                  </MenuItem>
                );
              })}
            </Select>
          </div>
        </div>

        <div className={style.TipoviProslava}>
          <div>
            <h3>Tipovi proslava koje dozvoljavate</h3>
          </div>
          <div className={style.ChipProslave}>
            {Object.values(tipProslavaMap).map((value) => {
              return (
                <div key={`Chip-${value}`} className={style.JedanChip}>
                  <Chip
                    label={value}
                    variant="outlined"
                    onClick={() => handleTipProslavaChange(value)}
                    onDelete={() => handleTipProslavaChange(value)}
                    deleteIcon={
                      isSelected(
                        value,
                        tipProslavaMap,
                        selectedTipoviProslava
                      ) ? undefined : (
                        <Icon
                          classes={style.addIcon}
                          fontSize="23px"
                          icon="add_circle"
                        />
                      )
                    }
                    sx={getChipSx(
                      value,
                      tipProslavaMap,
                      selectedTipoviProslava
                    )}
                  />
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <div className={style.TipoviProslava}>
            <h3>Tipovi prostora u koje Vas oglas pripada</h3>
            <div className={style.ChipProslave}>
              {Object.values(tipProstoraMap).map((value) => {
                return (
                  <div key={value} className={style.JedanChip}>
                    <Chip
                      label={value}
                      variant="outlined"
                      onClick={() => handleTipProstoraChange(value)}
                      onDelete={() => handleTipProstoraChange(value)}
                      deleteIcon={
                        isSelected(
                          value,
                          tipProstoraMap,
                          selectedTipoviProstora
                        ) ? undefined : (
                          <Icon
                            classes={style.addIcon}
                            fontSize="23px"
                            icon="add_circle"
                          />
                        )
                      }
                      sx={getChipSx(
                        value,
                        tipProstoraMap,
                        selectedTipoviProstora
                      )}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div>
          <div className={style.TipoviProslava}>
            <h3>Dodatna oprema koju poseduje Vas prostor</h3>
            <div className={style.ChipProslave}>
              {Object.values(dodatnaOpremaMap).map((value) => (
                <div key={value} className={style.JedanChip}>
                  <Chip
                    label={value}
                    variant="outlined"
                    onClick={() => handleDodatnaOpremaChange(value)}
                    onDelete={() => handleDodatnaOpremaChange(value)}
                    deleteIcon={
                      isSelected(
                        value,
                        dodatnaOpremaMap,
                        selectedDodatnaOprema
                      ) ? undefined : (
                        <Icon
                          classes={style.addIcon}
                          fontSize="23px"
                          icon="add_circle"
                        />
                      )
                    }
                    sx={getChipSx(
                      value,
                      dodatnaOpremaMap,
                      selectedDodatnaOprema
                    )}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={style.NAJJACEDUGME}>
          <div className={style.dodajOglasDugme}>
            <MojButton
              text="Dodajte oglas"
              center={true}
              wide={true}
              onClick={submit}
            />
          </div>
        </div>
      </div>
    </>
  );
};
export default OglasiProstor;
