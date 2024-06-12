import Input from "@/components/lib/inputs/text-input";
import style from "./style.module.css";
import { useEffect, useState } from "react";
import MojButton from "@/components/lib/button";
import { useSelector } from "react-redux";
import { logOut, selectUser } from "@/store/auth";
import OglasKartica from "@/components/OglasKartica";
import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import {
  useDeleteUserMutation,
  useGetUserDataQuery,
  useUpdateUserMutation,
} from "@/store/api/endpoints/korisnik";
import UserAvatar from "@/components/UserAvatar";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetKorisnikOglasiQuery,
  useGetUserOglasiQuery,
} from "@/store/api/endpoints/oglas";
import { skipToken } from "@reduxjs/toolkit/query";
import DisplayCard from "@/components/DisplayCard";
import { UpdateUserDTO } from "@/store/api/endpoints/korisnik/types";
import { updateUserSchema } from "@/utils/validators";
import { getValidationMessage } from "@/utils/validationMessage";
import { toast } from "react-toastify";
import Icon from "@/components/lib/icon";
import {
  useGetImageQuery,
  useUploadKorisnikMutation,
} from "@/store/api/endpoints/images";
import { getRawLocation } from "@/utils/handleQueries";
import UploadComponent from "@/components/UploadComponent";
import { ResultType } from "@/types";
import { useAppDispatch } from "@/store";
import { Role } from "@/models/role";

const UserProfile = () => {
  const navigate = useNavigate();
  const userCurr = useSelector(selectUser);

  const dispatch = useAppDispatch();

  // nece da se pozove ako ne postoji user, zbog skip
  const { data: user } = useGetUserDataQuery(userCurr?.id!, {
    skip: !userCurr,
  });
  const { data: MojiOglasi } = useGetUserOglasiQuery();
  console.log(MojiOglasi);

  const { data: imageUrl } = useGetImageQuery(
    getRawLocation(user?.profilePhoto) ?? skipToken
  );

  const [updateUserAction] = useUpdateUserMutation();
  const [deleteUserAction] = useDeleteUserMutation();

  console.log(user);

  const [ime, setIme] = useState("");
  const [prezime, setPrezime] = useState("");
  const [email, setEmail] = useState("");
  const [brTel, setBrTel] = useState("");
  const [slikaProfila, setSlikaProfila] = useState<string | undefined>("");
  const [lokacija, setLokacija] = useState("");
  const [opis, setOpis] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteUser] = useDeleteUserMutation();

  useEffect(() => {
    if (!user) return;

    setIme(user.name);
    setPrezime(user.lastName);
    setEmail(user.email);
    setBrTel(user.phoneNumber);
    setSlikaProfila(user.profilePhoto);
    setLokacija(user.location);
  }, [user]);

  const handleDelete = () => {
    setOpenDialog(true);
  };
  const submit = async () => {
    if (!user) return;

    const updateUser: UpdateUserDTO = {
      id: user.id,
      name: ime,
      lastName: prezime,
      email: email,
      phoneNumber: brTel,
      location: lokacija,
    };

    const valResult = updateUserSchema.validate(updateUser);

    if (valResult.error) {
      const [type, msg] = getValidationMessage(valResult);

      toast.error(msg);
      return;
    }

    const result = await updateUserAction(updateUser);
    if ("error" in result) return;

    toast.success("Uspesno izmenjeni podaci");
  };

  const handleDialogClose = async (agree: boolean) => {
    setOpenDialog(false);

    if (agree) {
      if (!userCurr) return;
      const response = await deleteUser();

      if ("error" in response) {
        navigate(`/user/profile/${userCurr.id}`);
        return;
      }

      toast.success("Uspesno obrisan nalog");
      dispatch(logOut());
    }
  };

  const [uploadKorisnikAction] = useUploadKorisnikMutation();

  const uploadKorisnik = async (formData: FormData): Promise<ResultType> => {
    const result = await uploadKorisnikAction(formData);
    return result;
  };

  const canUpload: boolean = React.useMemo(() => {
    if (!userCurr || userCurr.role == Role.AGENCIJA) return false;
    return true;
  }, [userCurr]);

  if (!user) {
    return null;
  }

  return (
    <div className={`containerWrapper ${style.Container}`}>
      <div className={style.PostavkeProfila}>
        <h2>Postavke profila</h2>
        <div className={style.Postavke2}>
          {/* odje ide slika od kad je clan broj oglasa i prosecna ocena */}
          <div className={style.KarticaSaSlikom}>
            <div className={style.SlikaImeIPrezime}>
              {canUpload && (
                <UploadComponent uploadFn={uploadKorisnik}>
                  <UserAvatar
                    uploadable={true}
                    size={100}
                    letter={user.name[0]}
                    src={imageUrl}
                  />
                </UploadComponent>
              )}
              {!canUpload && (
                <UploadComponent uploadFn={uploadKorisnik}>
                  <UserAvatar
                    uploadable={true}
                    size={100}
                    letter={user.name[0]}
                    src={imageUrl}
                  />
                </UploadComponent>
              )}
              <p>{user.name} {user.lastName}</p>
            </div>
          </div>
          <div className={style.OsnovnePostavkeProfila}>
            <div className={style.PostavkeProfilaTXT}>
              {<h2>Osnovne postavke profila</h2>}
            </div>
            <div className={style.Inputi}>
              <div className={style.Red}>
                {
                  <Input
                    text={ime}
                    placeholder="Ime"
                    icon="boy"
                    onChange={setIme}
                  />
                }
                {<Input text={prezime} icon="boy" onChange={setPrezime} />}
              </div>
              <div className={style.Red}>
                {
                  <Input
                    text={email}
                    placeholder="Email"
                    icon="mail"
                    onChange={setEmail}
                  />
                }
                {<Input text={brTel} icon="call" onChange={setBrTel} />}
              </div>
              <div className={style.Red}>
                {
                  <Input
                    text={lokacija}
                    placeholder="Grad"
                    icon="location_on"
                    onChange={setLokacija}
                  />
                }
              </div>
            </div>
            <div className={style.Dugmenajjace}>
              <div className={style.Dugme2}>
                {/* da azuriram korisnika */}
                {
                  <MojButton
                    text="Sacuvaj"
                    onClick={submit}
                    wide={true}
                    center={true}
                  />
                }
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={style.MojiOglasi}>
        <div>
          <h2>Moji oglasi</h2>
        </div>
        <div className={style.OglasiKartice}>
          {MojiOglasi?.map((oglas) => (
            <div key={oglas.id}>
              <OglasKartica oglas={oglas} onClick={() => {}} />
            </div>
          ))}
        </div>
        <div className={style.Dugmenajjace}>
          <div className={style.Dugme2}>
            {
              <MojButton
                text="Dodaj oglas"
                onClick={() => {
                  navigate("/prostor/oglasiProstor");
                }}
                wide={true}
                center={true}
              />
            }
          </div>
        </div>
      </div>
      <Dialog
        open={openDialog}
        onClose={() => handleDialogClose(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Da li ste sigurni da želite da obrišete nalog?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Brisanje naloga je trajna akcija i ne može se poništiti. Da li ste
            sigurni da želite da nastavite?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleDialogClose(false)}>Ne</Button>
          <Button onClick={() => handleDialogClose(true)} autoFocus>
            Da
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default UserProfile;
