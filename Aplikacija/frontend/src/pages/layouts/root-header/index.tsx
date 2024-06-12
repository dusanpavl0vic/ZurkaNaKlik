import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import style from "./style.module.css";
import { useSelector } from "react-redux";
import { selectIsFirstLogin, selectUser } from "@/store/auth";
import Navbar from "./navbar";
import MojButton from "@/components/lib/button";
import { useEffect, useMemo } from "react";
import { Role } from "@/models/role";
import PageSpacer from "@/components/lib/page-spacer";

type ZaPrikaz = {
  message: string;
  link: string;
};

const RootHeader = () => {
  const user = useSelector(selectUser);
  const isFirstLogin = useSelector(selectIsFirstLogin);
  const navigate = useNavigate();
  const location = useLocation();

  const zaPrikaz: ZaPrikaz | undefined = useMemo(() => {
    if (!user) return;

    let objPrikaz: ZaPrikaz;
    if (user.role == Role.AGENCIJA) {
      objPrikaz = {
        message: "Podesite sve što se tiče vaše agencije",
        link: "/catering/profile",
      };
    } else {
      objPrikaz = {
        message: "Postavke profila",
        link: `/user/profile`,
      };
    }

    return objPrikaz;
  }, [user]);

  const showMessage =
    zaPrikaz && isFirstLogin && location.pathname !== "/catering/profile";

  return (
    <div className={style.EverythingWrapper}>
      <div className={style.AppHeaderWrapper}>
        <header className={style.AppHeader}>
          <nav>
            <NavLink to="/" className={style.ZurkaNaKlik}>
              <img src="/images/logo.png" />
            </NavLink>

            <div className={style.HeaderButtons}>
              <NavLink to="/home" className="uL">
                <h4>Oglaseni prostori</h4>
              </NavLink>

              <NavLink to="/findCatering" className="uL">
                <h4>Ketering</h4>
              </NavLink>
            </div>

            {user && <Navbar user={user} />}

            {!user && (
              <NavLink to="/Login" className={style.LoginButtonHeader}>
                Prijava
              </NavLink>
            )}
          </nav>
        </header>
        {user?.role === Role.AGENCIJA &&
          zaPrikaz &&
          zaPrikaz.message &&
          zaPrikaz.link && (
            <div className={style.headerPoopup}>
             <div className="headerMessage">
                <p>{zaPrikaz.message}</p>
              </div>
              <div className={style.profileButton}>
                <MojButton
                  classes={style.profileButton}
                  small={true}
                  grey={true}
                  text="Profil"
                  onClick={() => {
                    navigate(zaPrikaz.link);
                  }}
                />
              </div>
            </div>
          )}
      </div>

      <main>
        <Outlet />
      </main>

      <PageSpacer variant="small" />

      <footer className={style.footer}>
        <div className={style.footerTop}>
          <div className={style.footerContent}>
            <div className={style.LogoSLikaDiv}>
              <img src="/images/logo.png" />
            </div>
            <p>
              Zurka na klik je platforma za oglasavanje kuca, vikendica,
              stanova, poslovnih prostora povodom zurka, proslava, sastanaka.
            </p>
          </div>

          <div className={`${style.footerContent} `}>
            <h2>Radite sa nama</h2>
            <NavLink className={`${style.footerLink} uL`} to="/user/signup">
              Registrujte se kao korisnik
            </NavLink>
            <NavLink className={`${style.footerLink} uL`} to="/catering/signup">
              Ponudite usluge keteringa
            </NavLink>
            <NavLink className={`${style.footerLink} uL`} to="/login">
              Prijavite se
            </NavLink>
            <NavLink className={`${style.footerLink} uL`} to="/login">
              Oglasite Vaš prostor
            </NavLink>
          </div>

          <div className={style.footerContent}>
            <h2>Kontaktirajte nas</h2>
            <NavLink
              className={`${style.footerLink} uL`}
              to="mailto:zurkanaklik@gmail.com"
            >
              Email: zurkanaklik@gmail.com
            </NavLink>
            <NavLink
              className={`${style.footerLink} uL`}
              to="https://www.instagram.com/zurkanaklik"
            >
              Instagram: @ZurkaNaKlik
            </NavLink>
          </div>
        </div>

        <div className={style.footerBottom}>
          <p>ZurkaNaKlik</p>
          <p>
            Tim <span className={`${style.timLevl} uL`}>LeVl</span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default RootHeader;
