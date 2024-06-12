import {
  EnumDodatnaOprema,
  EnumGrejanje,
  EnumTipProslava,
  EnumTipProstora,
} from "../api/endpoints/oglas/types";

export type Filters = {
  filtersData: FiltersData;
  sort: Sort;
  paginationData: PaginationData;
};

export type FiltersData = {
  tipProslava: EnumTipProslava[];
  tipProstora: EnumTipProstora[];
  grejanje: EnumGrejanje[];
  dodatnaOprema: EnumDodatnaOprema[];
  grad: string | null;
  cenaOd?: number;
  cenaDo?: number;
  kvadraturaOd?: number;
  kvadraturaDo?: number;
  datumOd?: Date;
  datumDo?: Date;
};

export type PaginationData = {
  pageNumber: number;
  pageSize: number;
};

export enum Sort {
  CenaRastuca = "CenaRastuca",
  CenaOpadajuce = "CenaOpadajuce",
  OcenaRastuce = "OcenaRastuce",
  OcenaOpadajuce = "OcenaOpadajuce",
}

export const mapStringToSort = (value: string): Sort | undefined => {
  switch (value) {
    case "CenaRastuca":
      return Sort.CenaRastuca;
    case "CenaOpadajuce":
      return Sort.CenaOpadajuce;
    case "OcenaRastuce":
      return Sort.OcenaRastuce;
    case "OcenaOpadajuce":
      return Sort.OcenaOpadajuce;
    default:
      return undefined;
  }
};

// public string? sort { get; set; }
// public List<EnumTipProslava>? tipProslava { get; set; }
// public List<EnumTipProstora>? tipProstora { get; set; }

// public string? grad { get; set; }
// public int cenaOd { get; set; }
// public int cenaDo { get; set; }
// public int kvadraturaOd { get; set; }
// public int kvadraturaDo { get; set; }

// public List<EnumGrejanje>? grejanje { get; set; }
// public List<EnumDodatnaOprema>? dodatnaOprema { get; set; }

// public DateTime datumOd { get; set; }
// public DateTime datumDo { get; set; }

// const [gradValue, setGradValue] = useState<string | null>(null);
// const [cenaOd, setCenaOd] = useState("");
// const [cenaDo, setCenaDo] = useState("");
// const [broj, setBroj] = useState("");
// const [selectedDodatnaOprema, setSelectedDodatnaOprema] = useState<number[]>(
//   []
// );
// const [selectedTipoviProstora, setSelectedTipoviProslava] = useState<
//   number[]
// >([]);
// const [selectedTipoviGrejanja, setSelectedTipoviGrejanja] = useState<
//   number[]
// >([]);

// const [date, setDate] = useState<DateRange | undefined>();
