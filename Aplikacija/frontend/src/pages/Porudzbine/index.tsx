import { useGetCateringOrdersQuery } from "@/store/api/endpoints/agencija";
import style from "./style.module.css";
import { useGetAgencyListMenuesQuery } from "@/store/api/endpoints/pregled";
import MenyCardPorudzbine from "@/components/MenyCardPorudzbine";
import PageSpacer from "@/components/lib/page-spacer";

type CombinedMenu = {
  cateringOrder: CateringOrder;
  menu: MenuForList[];
};

const Porudzbine = () => {
  const { data: narudzbine } = useGetCateringOrdersQuery();

  const odobreneNarudzbine = narudzbine
    ? narudzbine.filter((narudzbina) => narudzbina.statusRezervacije === true)
    : [];
  const odbijeneNarudzbine = narudzbine
    ? narudzbine.filter((narudzbina) => narudzbina.statusRezervacije === false)
    : [];
  const narudzbineNaCekanju = narudzbine
    ? narudzbine.filter((narudzbina) => narudzbina.statusRezervacije === null)
    : [];

  const menijiOdobreniID = odobreneNarudzbine.flatMap(
    (order) => order.idMenija || []
  );
  const menijiNaCekanjuID = narudzbineNaCekanju.flatMap(
    (order) => order.idMenija || []
  );
  const menijiOdbijeniID = odbijeneNarudzbine.flatMap(
    (order) => order.idMenija || []
  );

  const { data: menuOdobreni } = useGetAgencyListMenuesQuery(menijiOdobreniID, {
    skip: menijiOdobreniID.length < 1,
  });
  console.log(menuOdobreni);
  console.log(menijiOdobreniID);
  console.log(menijiOdbijeniID);

  const { data: menuNaCekanju } = useGetAgencyListMenuesQuery(
    menijiNaCekanjuID,
    {
      skip: menijiNaCekanjuID.length < 1,
    }
  );

  const { data: menuOdbijeni } = useGetAgencyListMenuesQuery(menijiOdbijeniID, {
    skip: menijiOdbijeniID.length < 1,
  });

  return (
    <>
      <PageSpacer variant="xs" />
      <div className={`containerWrapper ${style.Container}`}>
        <div className={style.OdobrenePorudzbine}>
          <h3>Nove porudzbine</h3>
          <div className={style.listPorudzbine}>
            {narudzbineNaCekanju.map((narudzbina) => {
              return <MenyCardPorudzbine order={narudzbina} />;
            })}
          </div>
        </div>
        <div className={style.OdobrenePorudzbine}>
          <h3>Odobrene porudzbine</h3>
          <div className={style.listPorudzbine}>
            {odobreneNarudzbine.map((narudzbina) => {
              return <MenyCardPorudzbine order={narudzbina} />;
            })}
          </div>
        </div>
        <div className={style.OdobrenePorudzbine}>
          <h3>Odbijene porudzbine</h3>
          <div className={style.listPorudzbine}>
            {odbijeneNarudzbine.map((narudzbina) => {
              return <MenyCardPorudzbine order={narudzbina} />;
            })}
          </div>
        </div>
      </div>
    </>
  );
};
export default Porudzbine;
