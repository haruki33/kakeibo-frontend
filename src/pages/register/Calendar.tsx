import "./MyCalendar.css";
import Calendar from "react-calendar";
import JapaneseHolidays from "japanese-holidays";

type Transaction = {
  id: string;
  date: string;
  amount: number;
  type: string;
  categoryId: string;
  memo: string;
};

type CalendarProps = {
  setYearAndMonth: (month: string) => void;
  selectedYearAndMonth: string;
  setSelectedDate: (date: string) => void;
  selectedDate: string;
  transactions: Transaction[];
};

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

type CalendarOnArgs = {
  action: string;
  activeStartDate: Date | null;
  value: Value;
  view: string;
};

type displayTransactionsForDayProps = {
  date: Date;
  view: string;
};

function MyCalendar({
  setYearAndMonth,
  selectedYearAndMonth,
  setSelectedDate,
  selectedDate,
  transactions,
}: CalendarProps) {
  const handleMonthChange = ({ activeStartDate }: CalendarOnArgs) => {
    if (activeStartDate) {
      const newMonth = `${activeStartDate.getFullYear()}-${String(
        activeStartDate.getMonth() + 1,
      ).padStart(2, "0")}`;
      setYearAndMonth(newMonth);
    }
  };

  const handleDateChange = (value: Value) => {
    if (value instanceof Date) {
      const localStr = `${value.getFullYear()}-${String(
        value.getMonth() + 1,
      ).padStart(2, "0")}-${String(value.getDate()).padStart(2, "0")}`;
      setSelectedDate(localStr);
    } else {
      console.error("選択された日付が不正です:", value);
    }
  };

  const displayTransactionsForDay = ({
    date,
    view,
  }: displayTransactionsForDayProps) => {
    if (view === "month") {
      const localStr = `${date.getFullYear()}-${String(
        date.getMonth() + 1,
      ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

      const txs = transactions.filter(
        (tx) => tx.date.slice(0, 10) === localStr,
      );

      if (txs.length > 0) {
        const displayTxs = txs.slice(0, 5);
        return (
          <>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "2px" }}>
              {displayTxs.map((tx) => (
                <div
                  key={tx.id}
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    backgroundColor:
                      tx.type === "income" ? "#60A5FA" : "#F87171",
                  }}
                ></div>
              ))}
            </div>
          </>
        );
      }
    }
    return null;
  };

  return (
    <Calendar
      value={selectedDate}
      onChange={handleDateChange}
      onActiveStartDateChange={handleMonthChange}
      tileContent={displayTransactionsForDay}
      locale="ja-JP"
      calendarType="gregory"
      showFixedNumberOfWeeks={true}
      tileClassName={({ date, view }) => {
        if (view === "month") {
          const tileMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
          if (selectedYearAndMonth !== tileMonth) return "gray-date";

          const day = date.getDay();
          if (JapaneseHolidays.isHoliday(date)) return "holiday";
          if (day === 0) return "sunday"; // 日曜
          if (day === 6) return "saturday"; // 土曜
        }
        return null;
      }}
      view="month"
      minDetail="month"
      maxDetail="month"
      next2Label={null}
      prev2Label={null}
      nextLabel={
        <span style={{ fontSize: "15px" }}>
          {Number(selectedYearAndMonth.slice(5, 7)) + 1 === 13
            ? 1
            : Number(selectedYearAndMonth.slice(5, 7)) + 1}
          月 ▶
        </span>
      }
      prevLabel={
        <span style={{ fontSize: "15px" }}>
          ◀{" "}
          {Number(selectedYearAndMonth.slice(5, 7)) - 1 === 0
            ? 12
            : Number(selectedYearAndMonth.slice(5, 7)) - 1}
          月
        </span>
      }
    />
  );
}

export default MyCalendar;
