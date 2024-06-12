import PageSpacer from "@/components/lib/page-spacer";
import ReservedOglasCard from "./ReservedOglasCard";
import style from "./style.module.css";
import { useGetReservedOglasiQuery } from "@/store/api/endpoints/korisnik";

const HistoryPage = () => {
  const { data: reservedOglasi } = useGetReservedOglasiQuery();

  if (!reservedOglasi) {
    return null;
  }

  return (
    <>
      <PageSpacer variant="xs" />
      <div className={`containerWrapper bs ${style.Container}`}>
        <h2>Rezervisani oglasi</h2>
        <div className={style.cardsContainer}>
          {reservedOglasi.map((oglas) => {
            return <ReservedOglasCard reservedOglas={oglas} />;
          })}
        </div>
      </div>
    </>
  );
};

export default HistoryPage;
