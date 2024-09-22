import { useState } from "react";
import "./App.css";
import AddBreakWindow from "./components/AddBreakWindow";
import EditScheduleWindow from "./components/EditScheduleWindow";
import Buttons from "./components/Buttons";
import MultiDateCalendar from "./components/Calendars";
import MainPage from "./components/MainPage";
import dayjs from "dayjs";

export default function App() {
  const format = "HH:mm";
  const [projects, setProjects] = useState([]);
  const [page, setPage] = useState();
  const [selectedDates, setSelectedDates] = useState([dayjs()]);
  const [time, setTime] = useState(["10:00", "18:00"]);
  const [breaken, setBreaken] = useState();
  const [rest, setRest] = useState([]);
  const [selectedRests, setSelectedRests] = useState([]);

  return (
    <>
      <Buttons setPage={setPage} setBreaken={setBreaken} rest={rest} />
      <MainPage
        setRest={setRest}
        rest={rest}
        selectedRests={selectedRests}
        setPage={setPage}
        selectedDates={selectedDates}
        setSelectedDates={setSelectedDates}
        time={time}
        setTime={setTime}
        projects={projects}
        setProjects={setProjects}
      />

      {page === "calendar" && (
        <MultiDateCalendar
          selectedRests={selectedRests}
          setSelectedRests={setSelectedRests}
          breaken={breaken}
          setBreaken={setBreaken}
          selectedDates={selectedDates}
          setSelectedDates={setSelectedDates}
          setPage={setPage}
        />
      )}
      {page === "editGraph" && (
        <EditScheduleWindow
          setRest={setRest}
          setSelectedDates={setSelectedDates}
          selectedDates={selectedDates}
          time={time}
          setTime={setTime}
          setPage={setPage}
          format={format}
        />
      )}
      {page === "addBreak" && (
        <AddBreakWindow
          setProjects={setProjects}
          setPage={setPage}
          setBreaken={setBreaken}
          projects={projects}
          format={format}
          rest={rest}
          setRest={setRest}
          selectedRests={selectedRests}
          setSelectedRests={setSelectedRests}
        />
      )}
    </>
  );
}
