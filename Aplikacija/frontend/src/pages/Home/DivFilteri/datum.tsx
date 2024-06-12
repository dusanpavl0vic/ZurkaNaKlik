import { addDays, format } from "date-fns";
import { Calendar as CalendarIcon, HandHelpingIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import style from "../style.module.css";

import { cn } from "@/lib/utils";
// import { Button } from "@/shadcncomponents/ui/button";
import { Calendar } from "@/shadcncomponents/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shadcncomponents/ui/popover";
import MojButton from "@/components/lib/button";
import { useMemo, useState } from "react";

type Props = {
  date: DateRange | undefined;
  setDate: (arg0: DateRange | undefined) => void;
  numberOfMonths: number;
};

const Datum = ({ numberOfMonths, date, setDate }: Props) => {
  const [openCalendar, setOpenCalendar] = useState(false);

  const text = useMemo(() => {
    if (!date) return "Izaberite datum";
    if (date.from && date.to)
      return `${format(date.from, "LLL d, y")} - ${format(
        date.to,
        "LLL dd, y"
      )}`;
    if (date.from) return `${format(date.from, "LLL d, y")}`;
    return "Izaberite datum";
  }, [date]);

  const handleOpen = () => {
    setOpenCalendar(!openCalendar);
  };

  return (
    <div className={cn("grid gap-2")}>
      <MojButton
        text={text}
        onClick={handleOpen}
        paddingX="80px"
        paddingY="14px"
        fontSize="15px"
        icon="calendar_month"
        grey={true}
        color="black"
      />

      <Popover open={openCalendar}>
        <PopoverTrigger asChild>
          <span></span>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="center" side="bottom">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={numberOfMonths}
          />
        </PopoverContent>
      </Popover>
    </div>
  );

  // return (
  //   <MojButton
  //     text="Datum od - do"
  //     onClick={() => {}}
  //     paddingX="80px"
  //     paddingY="14px"
  //     fontSize="15px"
  //     icon="calendar_month"
  //     grey={true}
  //     color="black"
  //   />
  // );
};
export default Datum;
