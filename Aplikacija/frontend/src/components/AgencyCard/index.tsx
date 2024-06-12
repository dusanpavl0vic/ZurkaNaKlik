import { useGetImageQuery } from "@/store/api/endpoints/images";
import UserAvatar from "../UserAvatar";
import style from "./style.module.css";
import { skipToken } from "@reduxjs/toolkit/query";
import { Typography } from "@mui/material";
import Icon from "../lib/icon";
import { useNavigate } from "react-router-dom";
import { getRawLocation } from "@/utils/handleQueries";

type Props = {
  agency: Agency;
};

const AgencyCard = ({ agency }: Props) => {
  const navigate = useNavigate();
  const { data: image } = useGetImageQuery(
    getRawLocation(agency.slikaProfila) ?? skipToken
  );

  return (
    <div
      className={`${style.container} cursorPointer bs`}
      onClick={() => navigate(`/catering/viewAgency/${agency.id}`)}
    >
      <div className={style.avatarName}>
        <UserAvatar size={80} src={image} letter={agency.ime[0]} />
        <h4>{agency.ime}</h4>
      </div>
      <Typography
        overflow={"hidden"}
        textOverflow={"ellipsis"}
        maxHeight={100}
        maxWidth={260}
        marginBlock={3}
      >
        {agency.opis}
      </Typography>
      <div className={style.dataHolder}>
        {agency.mogucnostDostave && (
          <div className={style.iconLabel}>
            <Icon icon="payments" />
            <p>{agency.cenaDostave}</p>
          </div>
        )}
        <div className={style.iconLabel}>
          <Icon icon="location_on" />
          <p>{agency.lokacija}</p>
        </div>
        <div className={style.iconLabel}>
          <Icon icon="star" />
          <p>{agency.ocena || 0}</p>
        </div>
      </div>
    </div>
  );
};

export default AgencyCard;
