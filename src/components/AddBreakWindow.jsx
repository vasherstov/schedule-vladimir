import { DownOutlined, CloseOutlined } from "@ant-design/icons";
import { Input, Select, message } from "antd";
import Timer from "./timer";
import dayjs from "dayjs";
import { useEffect } from "react";

export default function AddBreakWindow({
  setPage,
  rest,
  setRest,
  projects,
  setBreaken,
  format,
  selectedRests,
}) {
  const handleDateClick = () => {
    setPage("calendar");
    setBreaken(true);
  };
  const formatDate = (dates) => {
    if (!Array.isArray(dates) || dates.length === 0) {
      return "Нет выбранных дат";
    }
    return dates.map((date) => dayjs(date).format("DD.MM.YYYY")).join(", ");
  };
  const handleRestChange = (newTime, index) => {
    setRest((prevTime) => {
      const newTimeArray = [...prevTime];
      newTimeArray[index] = newTime;
      return newTimeArray;
    });
  };
  const handleSaveRest = () => {
    if (selectedRests.length === 0) {
      message.error("Вы не выбрали нужные даты");
      return;
    }
    if (rest.length !== 2) {
      message.error("Вы не выбрали нужный интервал времени");
      return;
    }
    if (dayjs(rest[0], format).isAfter(dayjs(rest[1], format))) {
      message.error("Начальное время не может быть позже конечного времени.");
      return;
    }
    setPage("default");
  };
  const newProject = projects.map((project) => {
    return {
      value: project.endTime,
      label: project.endTime,
    };
  });
  return (
    <div className="break_window">
      <div className="break-add">
        <h2 className="h2_schedule">
          Добавление перерыва{" "}
          {<CloseOutlined onClick={() => setPage("default")} />}
        </h2>
        <Input
          style={{
            marginBottom: 16,
            borderRadius: 8,
            width: "100%",
            backgroundColor: "#fff",
            opacity: 2,
          }}
          placeholder={
            selectedRests.length !== 0
              ? formatDate(selectedRests)
              : "Введите нужные даты"
          }
          readOnly
          suffix={<DownOutlined onClick={handleDateClick} />}
        />
        <div className="time-fields">
          <Select
            showSearch
            style={{ width: 200, backgroundColor: "#fff", opacity: 1 }}
            placeholder={rest[0] ? rest[0] : "Введите время"}
            optionFilterProp="label"
            filterSort={(optionA, optionB) =>
              (optionA?.label ?? "")
                .toLowerCase()
                .localeCompare((optionB?.label ?? "").toLowerCase())
            }
            options={newProject}
            onChange={(value) => handleRestChange(value, 0)}
          />
          <Timer
            format={format}
            defaultValue={rest[1]}
            onChange={(value) => handleRestChange(value, 1)}
          />
        </div>
        <div className="button_add">
          <button
            onClick={() => {
              setPage("default");
              useEffect(() => {
                setRest([]);
              }, [rest]);
            }}
            className="add-break-cancel"
          >
            Отменить
          </button>
          <button onClick={handleSaveRest} className="add-break-button">
            Добавить перерыв
          </button>
        </div>
      </div>
    </div>
  );
}
