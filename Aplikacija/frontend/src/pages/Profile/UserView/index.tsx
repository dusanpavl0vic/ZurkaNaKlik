import style from "./style.module.css";
import OglasKartica from "@/components/OglasKartica";
import * as React from "react";
import { useGetUserDataQuery } from "@/store/api/endpoints/korisnik";
import UserAvatar from "@/components/UserAvatar";
import { useNavigate, useParams } from "react-router-dom";
import { useGetKorisnikOglasiQuery } from "@/store/api/endpoints/oglas";
import { skipToken } from "@reduxjs/toolkit/query";
import DisplayCard from "@/components/DisplayCard";

import {
  useGetImageQuery,
  useUploadKorisnikMutation,
} from "@/store/api/endpoints/images";
import { getRawLocation } from "@/utils/handleQueries";
import UploadComponent from "@/components/UploadComponent";
import { ResultType } from "@/types";
import { useAppDispatch } from "@/store";
import { selectUser } from "@/store/auth";
import { Role } from "@/models/role";
import { useSelector } from "react-redux";

const UserViewProfile = () => {
  const userCurr = useSelector(selectUser);
  const navigate = useNavigate();

  const { id } = useParams();
  const idKorisnika = id ? parseInt(id) : undefined;
  const { data: vlasnikOglasa } = useGetUserDataQuery(idKorisnika ?? skipToken);

  const { data: tudjiOglasi } = useGetKorisnikOglasiQuery(
    idKorisnika ?? skipToken
  );

  const dispatch = useAppDispatch();

  const { data: imageUrl } = useGetImageQuery(
    getRawLocation(vlasnikOglasa?.profilePhoto) ?? skipToken
  );

  const canUpload: boolean = React.useMemo(() => {
    if (!userCurr || userCurr.role == Role.AGENCIJA) return false;
    return true;
  }, [userCurr]);

  const [uploadKorisnikAction] = useUploadKorisnikMutation();

  const uploadKorisnik = async (formData: FormData): Promise<ResultType> => {
    const result = await uploadKorisnikAction(formData);
    return result;
  };

  return (
    <div className={`containerWrapper ${style.Container}`}>
      <div className={style.PostavkeProfila}>
        <div className={style.Postavke2}>
          {/* odje ide slika od kad je clan broj oglasa i prosecna ocena */}
          <div className={style.KarticaSaSlikom}>
            <div className={style.SlikaImeIPrezime}>
              {canUpload && (
                <UploadComponent uploadFn={uploadKorisnik}>
                  <UserAvatar
                    uploadable={canUpload}
                    size={100}
                    letter={vlasnikOglasa && vlasnikOglasa.name[0]}
                    src={imageUrl}
                  />
                </UploadComponent>
              )}
              {!canUpload && (
                <UserAvatar
                  uploadable={canUpload}
                  size={100}
                  letter={vlasnikOglasa && vlasnikOglasa.name[0]}
                  src={imageUrl}
                />
              )}
              <h4>
                {vlasnikOglasa && vlasnikOglasa.name}{" "}
                {vlasnikOglasa && vlasnikOglasa.lastName}
              </h4>
            </div>
          </div>
          <div className={style.OsnovnePostavkeProfila}>
            <div className={style.PostavkeProfilaTXT}>
              <h2>Osnovne informacije profila</h2>
            </div>
            <div className={style.Inputi}>
              <div className={style.Red}>
                <DisplayCard
                  icon={"boy"}
                  text={
                    (vlasnikOglasa &&
                      vlasnikOglasa.name + " " + vlasnikOglasa?.lastName) ||
                    ""
                  }
                />

                <DisplayCard
                  icon={"boy"}
                  text={(vlasnikOglasa && vlasnikOglasa.lastName) || ""}
                />
              </div>
              <div className={style.Red}>
                <DisplayCard
                  icon={"mail"}
                  text={(vlasnikOglasa && vlasnikOglasa.email) || ""}
                />

                <DisplayCard
                  icon={"call"}
                  text={(vlasnikOglasa && vlasnikOglasa.phoneNumber) || ""}
                />
              </div>
              <div className={style.Red}>
                <DisplayCard
                  icon={"location_on"}
                  text={(vlasnikOglasa && vlasnikOglasa.location) || ""}
                />
              </div>
            </div>
            <div className={style.Dugmenajjace}>
              <div className={style.Dugme2}>{/* da azuriram korisnika */}</div>
            </div>
          </div>
        </div>
      </div>
      <div className={style.MojiOglasi}>
        <div>
          <h2>Oglasi korisnika {vlasnikOglasa?.name}</h2>
        </div>
        <div className={style.OglasiKartice}>
          {tudjiOglasi?.map((oglas) => (
            <div key={oglas.id}>
              <OglasKartica oglas={oglas} onClick={() => {}} />
            </div>
          ))}
        </div>
        <div className={style.Dugmenajjace}>
          <div className={style.Dugme2}></div>
        </div>
      </div>
    </div>
  );
};

export default UserViewProfile;
