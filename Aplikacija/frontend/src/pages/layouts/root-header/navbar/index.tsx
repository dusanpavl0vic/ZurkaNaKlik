import LabeledAvatar from "@/components/LabeledAvatar";
import { Popover, Typography, useMediaQuery } from "@mui/material";
import { useMemo, useState } from "react";
import style from "./style.module.css";
import Icon from "@/components/lib/icon";
import { NavLink } from "react-router-dom";
import { User } from "@/models/user";
import { Role } from "@/models/role";
import { useGetImageQuery } from "@/store/api/endpoints/images";
import { useGetUserDataQuery } from "@/store/api/endpoints/korisnik";
import { skipToken } from "@reduxjs/toolkit/query";
import { getRawLocation } from "@/utils/handleQueries";
import { useGetAgencyDataQuery } from "@/store/api/endpoints/agencija";

type Props = {
  user: User;
};

type ZaPrikaz = {
  icon: string;
  text: string;
  link: string;
};

const Navbar = ({ user }: Props) => {
  const [anchor, setAnchor] = useState<HTMLDivElement | null>();
  const [open, setOpen] = useState(false);

  const { data: allUserData } = useGetUserDataQuery(user.id, {
    skip: user.role == Role.AGENCIJA,
  });
  const { data: allAgencyData } = useGetAgencyDataQuery(user.id, {
    skip: user.role == Role.USER,
  });

  const { data: userUrl } = useGetImageQuery(
    getRawLocation(allUserData?.profilePhoto) ?? skipToken
  );

  const { data: agencyUrl } = useGetImageQuery(
    getRawLocation(allAgencyData?.slikaProfila) ?? skipToken
  );

  const onClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchor(event.currentTarget);
    setOpen((prevOpen) => !prevOpen);
  };

  // true / false u zavisnosti od toga dal je korisnik ili agnecija
  const isUser = useMemo(() => {
    return user.role == Role.USER;
  }, [user]);

  const zaPrikaz: ZaPrikaz[] = useMemo(() => {
    return [
      {
        icon: "account_circle",
        text: "Profil",
        link: isUser ? `/user/profile` : "/catering/profile",
      },
      isUser
        ? { icon: "favorite", text: "Omiljeno", link: "/omiljeno" }
        : {
            icon: "shopping_bag",
            text: "Porudzbine",
            link: "/catering/porudzbine",
          },
      isUser
        ? { icon: "schedule", text: "Već posećeno", link: "/history" }
        : null,
      isUser
        ? {
            icon: "add",
            text: "Oglasi Prostor",
            link: "/prostor/oglasiprostor",
          }
        : null,
      { icon: "logout", text: "Odjavi se", link: "/logout" },
    ].filter((item): item is ZaPrikaz => item !== null);
  }, [isUser]);

  return (
    <div>
      <div onClick={onClick}>
        <LabeledAvatar
          src={userUrl ?? agencyUrl}
          classes="cursorPointer"
          heading
          text={user.name}
        />
      </div>
      <Popover
        anchorEl={anchor}
        open={open}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        // TODO stavi ovo u defaultni stilovi
        sx={{
          "& .css-3bmhjh-MuiPaper-root-MuiPopover-paper": {
            borderRadius: "30px",
          },
        }}
        onClose={() => setOpen(false)}
      >
        <div className={style.popoverContent}>
          {zaPrikaz.map((element) => (
            <NavLink
              key={element.text}
              style={{ textDecoration: "none", color: "black" }}
              to={element.link}
              onClick={() => setOpen(false)}
            >
              <div className={style.popoverItem}>
                <Icon classes="pointer" icon={element.icon} />
                <Typography>{element.text}</Typography>
              </div>
            </NavLink>
          ))}
        </div>
      </Popover>
    </div>
  );
};

export default Navbar;
