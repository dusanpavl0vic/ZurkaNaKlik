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
import { toast } from "react-toastify";
import UploadComponent from "@/components/UploadComponent";
import { useUploadMenuMutation } from "@/store/api/endpoints/images";
import { UploadMenuDTO } from "@/store/api/endpoints/images/types";

type Props = {
  kategorije?: Category[];
  menuData?: Menu;
};

const DodajIzmeniMeni = ({ kategorije, menuData }: Props) => {
  const currUser = useSelector(selectUser);

  const [opisMenija, setOpisMenija] = useState("");
  const [imeMenija, setImeMenija] = useState("");
  const [cenaMeni, setCenaMeni] = useState("");
  const [kategorija, setkategorija] = useState("");
  const [menuImage, setMenuImage] = useState<FormData | null>(null);

  const defaultImage = "/images/imageNotFound.jpg";
  console.log(menuImage);

  const newMenuDisplayImage: string = useMemo(() => {
    if (!menuImage) return defaultImage;

    const extractedImg = menuImage.get("file") as File | null;
    if(!extractedImg) return defaultImage;
    const imgBlob = URL.createObjectURL(extractedImg);

    return imgBlob;
  }, [menuImage]);

  useEffect(() => {
    if (!menuData) return;

    let selectedKategorija = "";
    if (kategorije) {
      for (let i = 0; i < kategorije?.length; i++) {
        if (kategorije[i].id === menuData.idKategorije) {
          selectedKategorija = kategorije[i].naziv;
        }
      }
    }

    setOpisMenija(menuData.opis);
    setImeMenija(menuData.naziv);
    setCenaMeni(String(menuData.cenaMenija));
    setkategorija(selectedKategorija);
  }, [menuData]);

  const handleChange = (event: SelectChangeEvent) => {
    console.log(event.target.value);
    setkategorija(event.target.value);
  };

  function updateOpisMenija(event: ChangeEvent<HTMLTextAreaElement>) {
    setOpisMenija(event.target.value);
  }

  const [addMenu] = useAddMenuMutation();
  const [uploadMenuAction] = useUploadMenuMutation();

  const submit = async () => {
    let cena: number = parseInt(cenaMeni);
    let idKategorije: number = parseInt(kategorija);

    const newMenu: Omit<Menu, "id" | "idKategorije"> = {
      naziv: imeMenija,
      slika: "",
      opis: opisMenija,
      cenaMenija: cena,
      sastavMenija: [""],
    };

    const addMenuDTO: AddMenuDTO = {
      id: idKategorije,
      menu: newMenu,
    };

    const result = await addMenu(addMenuDTO);

    if ("error" in result) {
      return;
    }

    setOpisMenija("");
    setImeMenija("");
    setCenaMeni("");
    setkategorija("");

    if (menuImage == null) {
      toast.success("Oglas je uspesno dodat!");
      return;
    }

    const uploadImageObject: UploadMenuDTO = {
      idMenija: result.data.id,
      formData: menuImage,
    };

    setMenuImage(null);

    const uploadResult = await uploadMenuAction(uploadImageObject);
    if ("error" in uploadResult) return;

    toast.success("Oglas je uspesno dodat!");
  };

  const storeMenuImage = (formData: FormData): void => {
    // const result = await uploadKorisnikAction(formData);
    setMenuImage(formData);
  };

  return (
    <div className={style.menijji}>
      <div className={style.InputiOpisPlusic}>
        <div className={style.newMenu}>
          <UploadComponent uploadFn={storeMenuImage}>
            <div className={style.choseImage}>
              <img src={newMenuDisplayImage} />
            </div>
          </UploadComponent>
          <div className={style.inputs}>
            <Input
              text={imeMenija}
              placeholder="Ime menija"
              onChange={setImeMenija}
            />
            <Input text={cenaMeni} placeholder="Cena" onChange={setCenaMeni} />
            <Select
              value={kategorija}
              onChange={handleChange}
              sx={{
                minWidth: "250px",
                borderRadius: "20px",
              }}
            >
              {kategorije &&
                kategorije.map((kategorija) => {
                  return (
                    <MenuItem value={kategorija.id}>
                      {kategorija.naziv}
                    </MenuItem>
                  );
                })}
            </Select>
          </div>
          <textarea
            placeholder="Opis menija"
            className={style.MenuTxt}
            value={opisMenija}
            onChange={updateOpisMenija}
          />
        </div>
        {/* opis menija */}
        <div className={style.Kocka}>
          <MojButton
            text=""
            onClick={submit}
            icon="add"
            paddingX="20px"
            paddingY="20px"
          />
        </div>
      </div>
    </div>
  );
};
export default DodajIzmeniMeni;
