import AgencyCard from "@/components/AgencyCard";
import style from "./style.module.css";
import Pagination from "@/components/lib/pagination";
import { useAppDispatch } from "@/store";
import {
  selectAgencyFilters,
  setAgencyPaginationData,
  setAgencySortingData,
} from "@/store/agencyFilters";
import { AgencySort, mapStringToSort } from "@/store/agencyFilters/types";
import { useGetFilteredAgenciesQuery } from "@/store/api/endpoints/pregled";
import { MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";

const Results = () => {
  const filters = useSelector(selectAgencyFilters);
  const paginationState = filters.paginationData;
  const sortState = filters.sort;

  const dispatch = useAppDispatch();

  const [selectedSort, setSelectedSort] = useState(filters.sort);
  const [selectedPageSize, setSelectedPageSize] = useState(
    paginationState.pageSize
  );
  const [selectedPageNumber, setSelectedPageNumber] = useState(
    paginationState.pageNumber
  );

  const { data: agencies } = useGetFilteredAgenciesQuery(filters);

  const paginationNumbers: number[] = useMemo(() => {
    const arr: number[] = [];
    if (!agencies) return arr;

    let total = agencies.brojAgencija / selectedPageSize;
    let start = 0;

    if (total > 10) {
      start = selectedPageNumber - 5;
      if (start < 0) start = 0;
      if (selectedPageNumber + 10 > total) start = total - 13;
    }

    for (let i = start; i < total && i <= start + 10; i++) {
      arr.push(i);
    }

    return arr;
  }, [agencies, selectedPageSize]);

  const handleSortChange = (event: SelectChangeEvent) => {
    if (!event) return;
    const str = mapStringToSort(event.target.value);
    if (str == undefined) return;

    setSelectedSort(str);
    setSelectedPageNumber(1);
    dispatch(setAgencySortingData(str));
    dispatch(setAgencyPaginationData({ ...paginationState, pageNumber: 1 }));
  };

  const handlePaginationChange = (event: SelectChangeEvent) => {
    if (!event) return;
    const selectedVal = parseInt(event.target.value);

    setSelectedPageSize(selectedVal);
    setSelectedPageNumber(1);
    dispatch(setAgencyPaginationData({ pageNumber: 1, pageSize: selectedVal }));
  };

  const handlePageNumberChange = (page: number) => {
    setSelectedPageNumber(page);
    dispatch(setAgencyPaginationData({ ...paginationState, pageNumber: page }));
  };

  console.log(agencies);

  if (!agencies) {
    return null;
  }

  const paginationValues = [10, 20, 30, 40, 50, 100];
  return (
    <div className={style.resultsWrapper}>
      <div className={style.resultsTop}>
        <Select
          id="selectSorting"
          value={selectedSort}
          onChange={handleSortChange}
          sx={{
            borderRadius: "12px",
            color: "black",
          }}
        >
          {Object.values(AgencySort).map((value) => {
            return (
              <MenuItem key={`Select-${value}`} value={value}>
                {value}
              </MenuItem>
            );
          })}
        </Select>
        <Select
          id="selectSize"
          value={String(selectedPageSize)}
          onChange={handlePaginationChange}
          sx={{
            borderRadius: "12px",
            color: "black",
          }}
        >
          {paginationValues.map((value) => {
            return (
              <MenuItem key={`Select-${value}`} value={value}>
                {value}
              </MenuItem>
            );
          })}
        </Select>
      </div>
      <div className={style.resultsContainer}>
        {agencies.response.map((agency) => {
          return <AgencyCard agency={agency} />;
        })}
      </div>
      <Pagination
        selectedPageNumber={selectedPageNumber}
        handlePageNumberChange={handlePageNumberChange}
        paginationNumbers={paginationNumbers}
      />
    </div>
  );
};

export default Results;
