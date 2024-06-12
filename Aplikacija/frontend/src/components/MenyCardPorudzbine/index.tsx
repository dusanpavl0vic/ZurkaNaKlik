import { OglasObjekata } from "@/store/api/endpoints/oglas/types";
import style from "./style.module.css";
import DisplayCard from "../DisplayCard";
import MojButton from "../lib/button";
import Icon from "../lib/icon";
import {
  useAcceptOrderMutation,
  useDeclineOrderMutation,
} from "@/store/api/endpoints/agencija";
import { useGetOglasQuery } from "@/store/api/endpoints/oglas";
import { skipToken } from "@reduxjs/toolkit/query";
import { toast } from "react-toastify";
import { useEffect, useMemo, useState } from "react";
import { useGetAgencyListMenuesQuery } from "@/store/api/endpoints/pregled";
import { format } from "date-fns";
import { useGetImageQuery } from "@/store/api/endpoints/images";
import { getRawLocation } from "@/utils/handleQueries";

type MenyCardProps = {
  order?: CateringOrder;
};

const MenyCardPorudzbine = ({ order }: MenyCardProps) => {
  const defaultImage = "/images/imageNotFound.jpg";
  const { data: oglas } = useGetOglasQuery(order?.idOglasa ?? skipToken);
  const { data: menues } = useGetAgencyListMenuesQuery(
    order?.idMenija ?? skipToken
  );

  const { data: image } = useGetImageQuery(
    getRawLocation(oglas?.slike[0]) ?? skipToken
  );

  const displayImage = image ?? defaultImage;
  console.log(displayImage);

  const [acceptOrderAction] = useAcceptOrderMutation();
  const [declineOrderAction] = useDeclineOrderMutation();

  const [statusRezervacije, setStatusRezervacije] = useState(
    order?.statusRezervacije
  );

  const accept = async () => {
    if (!order) {
      console.log("nema order");
      return;
    }
    const result = await acceptOrderAction(order.id);

    if ("error" in result) {
      return;
    }
    setStatusRezervacije(true);
    toast.success("Porudzbina je prihvacena!");
  };

  const decline = async () => {
    if (!order) {
      console.log("nema order");
      return;
    }
    const result = await declineOrderAction(order.id);

    if ("error" in result) {
      return;
    }
    setStatusRezervacije(false);
    toast.success("Porudzbina je odbijena!");
  };

  useEffect(() => {
    if (order) {
      setStatusRezervacije(order.statusRezervacije);
    }
  }, [order]);

  const textNames: string = useMemo(() => {
    if (!menues) return "";
    let str = "";

    for (let i = 0; i < menues.length; i++) {
      str += menues[i].naziv;
      if (i < menues.length - 1) {
        str += ", ";
      }
    }

    return str;
  }, [menues]);

  if (!order) {
    return;
  }

  return (
    <div className={style.Container}>
      <div className={style.MenyPicture}>
        <img src={displayImage} />
      </div>
      <div className={style.MenyTxt}>
        <h3>{textNames}</h3>
        <div className={style.InfoOglas}>
          <div className={style.DisplayMenyInfo}>
            <Icon icon={"location_on"} />
            <label>{oglas ? oglas.lokacija : ""}</label>
          </div>
          <div className={style.DisplayMenyInfo}>
            <Icon icon={"calendar_month"} />
            <label>{format(order.datumRezervacije, "LLL d, y")}</label>
          </div>
        </div>
        <div className={style.InfoOglas}>
          <div className={style.DisplayMenyInfo}>
            <Icon icon={"house"} />
            <label>{oglas && oglas.naziv}</label>
          </div>
          <div className={style.DisplayMenyInfo}>
            <Icon icon={"payments"} />
            <label>{order?.konacnaCena}</label>{" "}
          </div>
        </div>
      </div>
      {order?.statusRezervacije === null && (
        <div className={style.acceptDecline}>
          <div className={style.ButtonParentDiv}>
            <MojButton
              icon="check"
              text="Prihvati"
              backgroundColor="#00D615"
              wide={true}
              onClick={accept}
            />
          </div>
          <div className={style.ButtonParentDiv}>
            <MojButton
              icon="cancel"
              text="Odbij"
              backgroundColor="#FA3636"
              wide={true}
              onClick={decline}
            />
          </div>
        </div>
      )}
    </div>
  );
};
export default MenyCardPorudzbine;
