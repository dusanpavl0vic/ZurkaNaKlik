import style from "./style.module.css";
import HomeImage from "@/components/HomeImage";
import PageSpacer from "@/components/lib/page-spacer";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shadcncomponents/ui/tabs";
import Home from "../Home";
import FindCateringPage from "../FindCatering";
import { useState } from "react";
import MojButton from "@/components/lib/button";
import Hero from "./Hero";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("findPlace");

  return (
    <>
      <PageSpacer variant="xs" />
      <Hero />
      <div className={style.actionsWrapper}>
        <div className={style.actionsContainer}>
          <img className={style.imgLeft} src="/images/actionProslava.jpg" />
          <div className={style.actionsContent}>
            <div>
              <h2>Hajde da zajedno organizujemo vasu sledecu proslavu!</h2>
              <p>
                Zelimo vam pomoci u pronalasku savrsenog prostora, posedujemo
                jedan od najvecih asortimana kuca, stanova, vikendica, lokala,
                praktično bilo kakvog tipa prostora koji su vam potrebni!
              </p>
            </div>
            <button
              className="specialButton specialMainButton"
              onClick={() => navigate("/login")}
            >
              Prijava
            </button>
          </div>
        </div>

        <div className={style.actionsContainer}>
          <div className={style.actionsContent}>
            <div>
              <h2>Pronadjite Savršeni Meni</h2>
              <p>
                Imamo najširu ponudu keteringa na ovim prostorima, mozete
                pronaci najšavrsenije menije iz najsavršenijih restorana i
                kulinarskih kuća.
              </p>
            </div>
            <button
              className="specialButton specialMainButton"
              onClick={() => navigate("/login")}
            >
              Pogledajte Ponudu
            </button>
          </div>
          <img className={style.imgRight} src="/images/actionCatering.jpg" />
        </div>
      </div>

      <div className={style.breakOutContainer}>
        <div className={style.breakOutElement}>
          <h1>1000+</h1>
          <h2>Oglasa</h2>
        </div>
        <div className={style.breakOutElement}>
          <h1>3000+</h1>
          <h2>Zadovoljnih mušterija</h2>
        </div>
        <div className={style.breakOutElement}>
          <h1>10+</h1>
          <h2>Godina sa vama</h2>
        </div>
      </div>

      <Tabs value={selectedTab} className={style.tabsWrapper}>
        <TabsList className={style.tabsButtonsContainer}>
          <div className={style.tabsButtons}>
            <MojButton
              text="Pronađite vikendicu"
              onClick={() => setSelectedTab("findPlace")}
              small={true}
            />
            <MojButton
              text="Pronađite ketering"
              onClick={() => setSelectedTab("findAgency")}
              small={true}
            />
          </div>
        </TabsList>
        <TabsContent value="findPlace">
          <Home />
        </TabsContent>
        <TabsContent value="findAgency">
          <FindCateringPage />
        </TabsContent>
      </Tabs>
    </>
  );
};

export default Index;
