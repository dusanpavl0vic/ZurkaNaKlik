import MojButton from "@/components/lib/button";
import style from "./style.module.css";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className={style.HeroContainer}>
        <div className={style.ContentWrapper}>
          <p className={style.subHeading}>ŽurkaNaKlik</p>
          <h1 className={style.heading}>
            Najbolja platforma za pronalazak smeštaja i keteringa!
          </h1>
          <p className={style.paragraph}>
            Organizujte vas sledeci dogadjaj, bilo to bila zurka, miting,
            rodjendan, proslava momacke ili devojacke veceri. Na istom mestu
            pronadjite i savrseni meni koji odgovara bas vasim zahtevima.
          </p>
          <div className={style.buttonsContainer}>
            <button
              className="specialButton specialMainButton"
              onClick={() => navigate("/login")}
            >
              Prijava
            </button>
            <button
              className="specialButton specialAccentButton"
              onClick={() => navigate("/login")}
            >
              Više informacija
            </button>
          </div>
          <div className={style.bottomCarusel}>
            <div className={style.caruselItem}>
              <img src="/images/meetingProstori.jpg" />

              <div className={style.overlay}>
                <h4>Prostori za meeting</h4>
              </div>
            </div>
            <div className={style.caruselItem}>
              <img src="/images/svecaneProslave.jpg" />

              <div className={style.overlay}>
                <h4>Svečane proslave</h4>
              </div>
            </div>
            <div className={style.caruselItem}>
              <img src="/images/orgZurke.jpg" />

              <div className={style.overlay}>
                <h4>Organizujte žurke</h4>
              </div>
            </div>
          </div>
        </div>
        <div className={style.HeroImage}>
          <img src="/images/heroImage.jpg" />
        </div>
      </div>
    </>
  );
};

export default Hero;
