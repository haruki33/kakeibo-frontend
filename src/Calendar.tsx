import "./MyCalendar.css";
import Calendar from "react-calendar";

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
  setSelectedDate,
  selectedDate,
  transactions,
}: CalendarProps) {
  const handleMonthChange = ({ activeStartDate }: CalendarOnArgs) => {
    if (activeStartDate) {
      const newMonth = `${activeStartDate.getFullYear()}-${
        activeStartDate.getMonth() + 1
      }`;
      setYearAndMonth(newMonth);
    }
  };

  const handleDateChange = (value: Value) => {
    if (value instanceof Date) {
      const localStr = `${value.getFullYear()}-${String(
        value.getMonth() + 1
      ).padStart(2, "0")}-${String(value.getDate()).padStart(2, "0")}`;
      setSelectedDate(localStr);
    } else {
      console.log("選択された日付が不正です:", value);
    }
  };

  const displayTransactionsForDay = ({
    date,
    view,
  }: displayTransactionsForDayProps) => {
    if (view === "month") {
      const localStr = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

      const txs = transactions.filter(
        (tx) => tx.date.slice(0, 10) === localStr
      );

      if (txs.length > 0) {
        const displayTxs = txs.slice(0, 5);
        return (
          <>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "2px" }}>
              {displayTxs.map((tx) => (
                <div
                  key={tx.id}
                  style={{ color: tx.type === "income" ? "blue" : "red" }}
                >
                  ●
                </div>
              ))}
            </div>
          </>
        );
      }
    }
    return null;
  };

  return (
    <div>
      <Calendar
        value={selectedDate}
        onChange={handleDateChange}
        onActiveStartDateChange={handleMonthChange}
        tileContent={displayTransactionsForDay}
        locale="ja-JP"
      />
    </div>
  );
}

export default MyCalendar;
