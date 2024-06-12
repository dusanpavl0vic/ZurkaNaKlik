import { Filters, FiltersData, PaginationData, Sort } from "@/store/filters/types";

export enum EnumDodatnaOprema {
  net,
  tv,
  terasa,
  bazen,
  klima,
  kuhinja,
  dvoriste,
  parking,
  frizider,
  zamrzivac,
}

export enum EnumTipProslava {
  Rodjendan,
  Zurka,
  Teambuilding,
  Momacko,
  Devojacko,
  Sve,
  Ostalo,
}

export enum EnumTipProstora {
  Vikendica,
  Stan,
  Lokal,
  Kuca,
}

export enum EnumGrejanje {
  TA_pec,
  Klima,
  Sporet,
  Kotao,
  Etazno,
  Nema,
}

export const dodatnaOpremaMap: { [key in EnumDodatnaOprema]: string } = {
  [EnumDodatnaOprema.net]: "Internet",
  [EnumDodatnaOprema.tv]: "TV",
  [EnumDodatnaOprema.terasa]: "Terasa",
  [EnumDodatnaOprema.bazen]: "Bazen",
  [EnumDodatnaOprema.klima]: "Klima",
  [EnumDodatnaOprema.kuhinja]: "Kuhinja",
  [EnumDodatnaOprema.dvoriste]: "Dvoriste",
  [EnumDodatnaOprema.parking]: "Parking",
  [EnumDodatnaOprema.frizider]: "Fridzer",
  [EnumDodatnaOprema.zamrzivac]: "Zamrzivač",
};
export const dodatnaOpremaIkoniceMap: { [key in EnumDodatnaOprema]: string } = {
  [EnumDodatnaOprema.net]: "wifi",
  [EnumDodatnaOprema.tv]: "desktop_windows",
  [EnumDodatnaOprema.terasa]: "balcony",
  [EnumDodatnaOprema.bazen]: "waves",
  [EnumDodatnaOprema.klima]: "thermostat",
  [EnumDodatnaOprema.kuhinja]: "soup_kitchen",
  [EnumDodatnaOprema.dvoriste]: "deck",
  [EnumDodatnaOprema.parking]: "local_parking",
  [EnumDodatnaOprema.frizider]: "kitchen",
  [EnumDodatnaOprema.zamrzivac]: "ac_unit",
};

export const tipProslavaMap: { [key in EnumTipProslava]: string } = {
  [EnumTipProslava.Rodjendan]: "Rodjendan",
  [EnumTipProslava.Zurka]: "Zurka",
  [EnumTipProslava.Teambuilding]: "Teambuilding",
  [EnumTipProslava.Momacko]: "Momacko",
  [EnumTipProslava.Devojacko]: "Devojacko",
  [EnumTipProslava.Sve]: "Sve",
  [EnumTipProslava.Ostalo]: "Ostalo",
};

export const tipProstoraMap: { [key in EnumTipProstora]: string } = {
  [EnumTipProstora.Vikendica]: "Vikendica",
  [EnumTipProstora.Stan]: "Stan",
  [EnumTipProstora.Lokal]: "Lokal",
  [EnumTipProstora.Kuca]: "Kuca",
};

export const tipGrejanjaMap: { [key in EnumGrejanje]: string } = {
  [EnumGrejanje.TA_pec]: "TA_pec",
  [EnumGrejanje.Klima]: "Klima",
  [EnumGrejanje.Sporet]: "Sporet",
  [EnumGrejanje.Kotao]: "Kotao",
  [EnumGrejanje.Etazno]: "Etazno",
  [EnumGrejanje.Nema]: "Nema",
};

// export type Filters = {
//   sort?: string;
//   tipProslava?: EnumTipProslava[];
//   tipProstora?: EnumTipProstora[];
//   grad?: string;
//   cenaOd: number;
//   cenaDo: number;
//   kvadraturaOd: number;
//   kvadraturaDo: number;
//   grejanje?: EnumGrejanje[];
//   dodatnaOprema?: EnumDodatnaOprema[];
//   datumOd: Date;
//   datumDo: Date;
// };

// export type FiltersPaginationData = {
//   pageNumber: number;
//   pageSize: number;
// };

export type OglasObjekata = {
  id: number;
  listaTipProslava: EnumTipProslava[];
  listaTipProstora: EnumTipProstora[];
  listDodatneOpreme: EnumDodatnaOprema[];
  grejanje: EnumGrejanje;
  naziv: string;
  grad: string;
  lokacija: string;
  cenaPoDanu: number;
  brojSoba: number;
  kvadratura: number;
  brojKreveta: number;
  brojKupatila: number;
  brTel: string;
  opis: string;
  slike: string[];
  ocena?: number;
  brojOcena: number;
  zauzetiDani: Date[];
  idVlasnika: number;
};

export type AddOglasObjektaDTO = Omit<
  OglasObjekata,
  "id" | "zauzetiDani" | "idVlasnika"
>;
export type UpdateOglasObjektaDTO = Omit<
  OglasObjekata,
  "zauzetiDani" | "idVlasnika"
>;

export type FilteredOglasObjektaRequest = {
  filtersData: Partial<Pick<FiltersData, "grejanje" | "tipProstora" | "tipProslava" | "dodatnaOprema">>,
  sort: Sort,
  paginationData: PaginationData,
}

export type FilteredOglasObjektaResponse = {
  brojOglasa: number;
  response: OglasObjekata[];
};
