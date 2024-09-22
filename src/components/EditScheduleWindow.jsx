import { CalendarOutlined, CloseOutlined } from "@ant-design/icons";
import { Input, message } from "antd";
import dayjs from "dayjs";
import Timer from "./timer";

export default function EditScheduleWindow({
  setRest,
  setPage,
  selectedDates,
  setSelectedDates,
  time,
  setTime,
  format,
}) {
  const formatDate = (dates) => {
    if (!Array.isArray(dates) || dates.length === 0) {
      return "Нет выбранных дат";
    }
    return dates.map((date) => dayjs(date).format("DD.MM.YYYY")).join(", ");
  };

  const handleDateClick = () => {
    setPage("calendar");
  };

  const handleTimerChange = (newTime, index) => {
    setTime((prevTime) => {
      const newTimeArray = [...prevTime];
      newTimeArray[index] = newTime;
      return newTimeArray;
    });
    setRest([]);
  };

  const handleSave = () => {
    if (!time[0] || !time[1]) {
      message.error("График работы не составлен");
      return;
    }
    if (dayjs(time[0], format).isAfter(dayjs(time[1], format))) {
      message.error("Начальное время не может быть позже конечного.");
      return;
    }
    setRest([]);
    setPage("default");
  };

  const handleClose = () => {
    setPage("default");
    setRest([]);
  };
  return (
    <div className="modal-container">
      <div className="schedule-edit">
        <h2 className="h2_schedule">
          Редактирование графика работы{" "}
          {<CloseOutlined onClick={handleClose} />}
        </h2>

        <div className="commission-info">
          Комиссия №1
          <br />
          НИР
        </div>
        <Input
          style={{ marginBottom: 16, borderRadius: 8, width: "100%" }}
          value={formatDate(selectedDates)}
          placeholder="Введите даты"
          readOnly
          suffix={<CalendarOutlined onClick={handleDateClick} />}
        />
        <div className="time-fields">
          <Timer
            defaultValue={time[0]}
            format={format}
            onChange={(newTime) => handleTimerChange(newTime, 0)}
          />
          <Timer
            defaultValue={time[1]}
            format={format}
            onChange={(newTime) => handleTimerChange(newTime, 1)}
          />
        </div>
        <hr />

        <div className="buttons_edit">
          <button
            onClick={() => {
              setPage("default");
              setSelectedDates([dayjs()]);
            }}
            className="cancel-button"
          >
            Отменить
          </button>
          <button onClick={handleSave} className="save-button">
            Сохранить
          </button>
        </div>
      </div>
    </div>
  );
}
