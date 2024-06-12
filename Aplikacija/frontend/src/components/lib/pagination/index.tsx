import style from "./style.module.css";

type Props = {
  paginationNumbers: number[];
  selectedPageNumber: number;
  handlePageNumberChange: (index: number) => void;
};

const Pagination = ({
  paginationNumbers,
  selectedPageNumber,
  handlePageNumberChange,
}: Props) => {
  return (
    <div className={style.pageNumberContainer}>
      {paginationNumbers.map((number) => {
        number++;
        if (number === selectedPageNumber)
          return (
            <div
              className={`${style.pageNumber} ${style.selected}`}
              onClick={() => {
                handlePageNumberChange(number);
              }}
            >
              {number}
            </div>
          );
        return (
          <div
            className={style.pageNumber}
            onClick={() => {
              handlePageNumberChange(number);
            }}
          >
            {number}
          </div>
        );
      })}
    </div>
  );
};

export default Pagination;
