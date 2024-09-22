import React from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/ru'; 
import localizedFormat from 'dayjs/plugin/localizedFormat';
import Schedule from './Schedule'; 
dayjs.locale('ru'); 
dayjs.extend(localizedFormat);

export default function MainPage({selectedRests,rest, setRest, selectedDates,setSelectedDates, time, projects, setProjects }) {

  return (
    <div className="schedule-container">
      <h2 className="schedule-date">
        
            <div className="schedule-date-item">
              {dayjs(selectedDates[0]).format('D MMMM')}
              {<Schedule setRest={setRest}selectedRests={selectedRests}selectedDates={selectedDates} rest={rest} time={time} projects={projects} setProjects={setProjects}/>}

            </div>
          
      </h2>
    </div>
  );
}
