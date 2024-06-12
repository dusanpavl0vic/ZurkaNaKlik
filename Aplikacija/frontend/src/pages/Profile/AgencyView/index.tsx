import style from "./style.module.css";
import { useGetAgencyDataQuery } from "@/store/api/endpoints/agencija";
import { Chip, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { selectUser } from "@/store/auth";
import { skipToken } from "@reduxjs/toolkit/query";
import UserAvatar from "@/components/UserAvatar";
import PageSpacer from "@/components/lib/page-spacer";
import { useParams } from "react-router-dom";
import DisplayCard from "@/components/DisplayCard";
import { useGetAgencyMenuesQuery } from "@/store/api/endpoints/pregled";
import CategoryMenuCard from "./CategoryMenuCard";
import UploadComponent from "@/components/UploadComponent";
import {
  useGetImageQuery,
  useUploadAgencyMutation,
} from "@/store/api/endpoints/images";
import { ResultType } from "@/types";
import { getRawLocation } from "@/utils/handleQueries";
import { PorucenMeni } from "@/store/api/endpoints/korisnik/types";
import { useMemo, useState } from "react";
import Checkout from "./Checkout";
import { Role } from "@/models/role";

const AgencyView = () => {
  const currUser = useSelector(selectUser);
  const { id } = useParams();
  const idAgencije = id ? parseInt(id) : undefined;
  const { data: agencyData } = useGetAgencyDataQuery(idAgencije ?? skipToken);
  const { data: meniDTO } = useGetAgencyMenuesQuery(idAgencije ?? skipToken);

  const { data: profileImage } = useGetImageQuery(
    getRawLocation(agencyData?.slikaProfila) ?? skipToken
  );

  const [uploadAction] = useUploadAgencyMutation();

  const uploadAgency = async (formData: FormData): Promise<ResultType> => {
    const result = await uploadAction(formData);
    return result;
  };

  const [menues, setMenues] = useState<PorucenMeni[]>([]);

  const addMenu = (newMenu: PorucenMeni) => {
    for (let i = 0; i < menues.length; i++) {
      if (menues[i].idMenija === newMenu.idMenija) {
        return;
      }
    }

    const newMenues = [...menues, newMenu];
    setMenues(newMenues);
  };

  const deleteMenu = (menuId: number) => {
    const newMenues: PorucenMeni[] = [];

    menues.forEach((menu) => {
      if (menu.idMenija != menuId) {
        newMenues.push(menu);
      }
    });

    setMenues(newMenues);
  };

  const resetMenues = () => {
    const emptyArr: PorucenMeni[] = [];
    setMenues(emptyArr);
  };

  const canUpload: boolean = useMemo(() => {
    if (!currUser || currUser.role != Role.AGENCIJA) return false;
    return true;
  }, [currUser]);

  const canAddMenu = useMemo(() => {
    return currUser && currUser.role == Role.USER;
  }, [currUser]);

  if (!agencyData) {
    return null;
  }
  return (
    <>
      <PageSpacer variant="xs" />
      <div className={`containerWrapper ${style.Glavni}`}>
        <div className={style.Gore}>
          <div className={style.Heading}>
            <div className={style.HeadingText}>
              <h2>Osnovne informacije o agenciji {agencyData?.ime}</h2>
            </div>
            <div className={style.AvatarText}>
              {canUpload && (
                <UploadComponent uploadFn={uploadAgency}>
                  <UserAvatar
                    uploadable={canUpload}
                    src={profileImage}
                    size={100}
                    letter={agencyData.ime[0]}
                  />
                  <Typography fontSize={24}>{agencyData.ime}</Typography>
                </UploadComponent>
              )}
              {!canUpload && (
                <>
                  <UserAvatar
                    uploadable={canUpload}
                    src={profileImage}
                    size={100}
                    letter={agencyData.ime[0]}
                  />
                  <Typography fontSize={24}>{agencyData.ime}</Typography>
                </>
              )}
            </div>
          </div>
          {/* div za opis agencije i grad,brtel, cenu i mogucnost dostave */}
          <div className={style.DodatneInfo}>
            {/* txt box */}
            <div>
              <Typography maxWidth={500}>{agencyData.opis}</Typography>
            </div>
            {/* inputi za grad br cenu i check */}
            <div className={style.Inputs}>
              <DisplayCard text={agencyData.ime} icon="edit" />
              <DisplayCard text={agencyData.lokacija} icon="location_on" />
              <DisplayCard text={agencyData.brTel} icon="call" />
              <DisplayCard text={agencyData.email} icon="mail" />
            </div>
          </div>
        </div>
        <div className={style.Dole}>
          <div className={style.DodajMenije}>
            <h2>Meniji</h2>
            {!meniDTO && (
              <div>
                <p>Nema dostupnih menija</p>
              </div>
            )}
            {meniDTO &&
              meniDTO.map((category) => {
                return (
                  <CategoryMenuCard category={category} addMenu={addMenu} />
                );
              })}
          </div>
        </div>
      </div>
      {canAddMenu && (
        <Checkout
          meniji={menues}
          agencyId={idAgencije}
          resetMenues={resetMenues}
          removeMenu={deleteMenu}
        />
      )}
    </>
  );
};

export default AgencyView;
