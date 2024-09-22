import { CloseOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import dayjs from 'dayjs';
dayjs.locale('ru'); 
dayjs.extend(localizedFormat);
const ItemType = 'PROJECT';

const projectsData = [
  { name: '858', participants: Math.floor(Math.random() * 10) + 1, date: dayjs() },
  { name: '858', participants: Math.floor(Math.random() * 10) + 1, date: dayjs() },
  { name: '858', participants: Math.floor(Math.random() * 10) + 1, date: dayjs() },
  { name: '858', participants: Math.floor(Math.random() * 10) + 1, date: dayjs() },
  { name: '858', participants: Math.floor(Math.random() * 10) + 1, date: dayjs() },
];

function Project({ project, index, moveProject, removeProject }) {
  const [, ref] = useDrag({
    type: ItemType,
    item: { index, date: project.date },
  });

  const [, drop] = useDrop({
    accept: ItemType,
    hover(item) {
      if (item.index !== index || item.date !== project.date) {
        moveProject(item.index, index, item.date, project.date);
        item.index = index;
        item.date = project.date;
      }
    },
  });

  return (
    <li ref={node => ref(drop(node))} className={project.name === 'Дата' ? "schedule-date-item" : project.name === '858' ? "schedule-item" : 'schedule-break'}>
  {project.name === 'Дата' ? (
    <div className="schedule-date-item">
      {dayjs(project.date).locale('ru').format('D MMMM')}
    </div>
  ) : (
    <>
      <div className={project.name === '858' ? "schedule_time" : 'schedule_time_break'}>
        {project.startTime} - {project.endTime}
      </div>
      <div className="div_participants">
        <strong className={project.name === '858' ? "str_participants" : "str_break"}>
          {project.name}
          {project.name === 'Перерыв' && (
            <CloseOutlined className="svg_cross" onClick={removeProject} />
          )}
          <div className="div_participants__text">
            {project.name === '858' && 'DataFlow Вычислительная система. Телекоммуникационная система суперкомпьютера'}
          </div>
        </strong>
        {project.participants && `${project.participants} ${project.participants === 1 ? 'участник' : 'участников'}`}
      </div>
    </>
  )}
</li>
  );
}

export default function Schedule({ time, setProjects, projects, rest, selectedRests, selectedDates, setRest }) {
  const [prjt, setPrjct] = useState([]);

  useEffect(() => {
    const updatedProjectsData = projectsData.map(project => ({
      ...project,
      date: dayjs(project.date).format('YYYY-MM-DD'),
    }));

    const newDates = selectedDates
      .filter(date => !updatedProjectsData.some(project => dayjs(project.date).isSame(dayjs(date), 'day')))
      .map(date => ({
        name: 'Дата',
        participants: Math.floor(Math.random() * 10) + 1,
        date: dayjs(date).format('YYYY-MM-DD'),
        startTime: '00:00', 
        endTime: time[0],   
      }));

    const allProjectsData = [...updatedProjectsData, ...newDates];

    const schedule = [];
    let currentStartTime = dayjs(time[0], 'HH:mm');

    allProjectsData.forEach((project) => {
      const isRestTime = currentStartTime.isSame(dayjs(rest[0], 'HH:mm'));
      const isProjectDateSelected = selectedRests.some(date => dayjs(date).isSame(dayjs(project.date), 'day'));

      if (isRestTime && isProjectDateSelected) {
        schedule.push({
          name: 'Перерыв',
          startTime: rest[0],
          endTime: rest[1],
          duration: dayjs(rest[1], 'HH:mm').diff(dayjs(rest[0], 'HH:mm'), 'minute'),
        });
        currentStartTime = dayjs(rest[1], 'HH:mm');
      }

      const duration = 20 + 5 * project.participants;
      const endTime = currentStartTime.add(duration, 'minute');
      schedule.push({
        ...project,
        startTime: project.name === 'Дата' ? '00:00' : currentStartTime.format('HH:mm'),
        endTime: project.name === 'Дата' ? time[0] : (endTime.isAfter(dayjs(time[1])) ? dayjs(time[1]).format('HH:mm') : endTime.format('HH:mm')),
        duration,
      });
      currentStartTime = endTime;
    });

    setPrjct(schedule);
    setProjects(schedule);
  }, [time, rest, selectedRests, selectedDates, setProjects]);

  const moveProject = (fromIndex, toIndex, fromDate, toDate) => {
    const updatedProjects = [...prjt];
    const [movedProject] = updatedProjects.splice(fromIndex, 1);
  
    const updatedMovedProject = {
      ...movedProject,
      date: dayjs(toDate).format('YYYY-MM-DD'),
    };
  
    updatedProjects.splice(toIndex, 0, updatedMovedProject);
      const projectsGroupedByDate = updatedProjects.reduce((acc, project) => {
      const projectDate = dayjs(project.date).format('YYYY-MM-DD');
      if (!acc[projectDate]) {
        acc[projectDate] = [];
      }
      acc[projectDate].push(project);
      return acc;
    }, {});
  
    const recalculatedProjects = Object.keys(projectsGroupedByDate).flatMap((date) => {
      let currentStartTime = dayjs(time[0], 'HH:mm'); 
      return projectsGroupedByDate[date].map((project, index, arr) => {
        let duration;
        if (project.name === 'Перерыв') {
          duration = dayjs(rest[1], 'HH:mm').diff(dayjs(rest[0], 'HH:mm'), 'minute');
        } else {
          duration = 20 + 5 * project.participants;
        }

        let startTime;
        
         if (project.name === 'Дата') {
          startTime = '00:00';
        }else {
          if (index > 0 && arr[index - 1].name === 'Дата') {
            startTime = dayjs(arr[index - 1].endTime, 'HH:mm').format('HH:mm');
          }
           else {
            startTime = currentStartTime.format('HH:mm');
          }
        }
        
        const endTime = dayjs(startTime, 'HH:mm').add(duration, 'minute');
  
        const updatedProject = {
          ...project,
          startTime: project.name === 'Дата' ? '00:00' : startTime,
          endTime: project.name === 'Дата' ? time[0] : (endTime.isAfter(dayjs(time[1])) ? dayjs(time[1]).format('HH:mm') : endTime.format('HH:mm')),
        };
  
        currentStartTime = endTime;
        return updatedProject;
      });
    });
  
    setPrjct(recalculatedProjects);
    setProjects(recalculatedProjects);
  };
  const removeProject = (index) => {
    const updatedProjects = prjt.filter((_, i) => i !== index || prjt[i].name !== 'Перерыв');
    
    if (prjt[index].name === 'Перерыв') {
      setRest([]);
    }
  
    let currentStartTime = dayjs(time[0], 'HH:mm');
    const recalculatedProjects = updatedProjects.map((project) => {
      const duration = project.name === 'Перерыв' 
        ? dayjs(rest[1], 'HH:mm').diff(dayjs(rest[0], 'HH:mm'), 'minute')
        : 20 + 5 * project.participants;
  
      const startTime = currentStartTime.format('HH:mm');
      const endTime = currentStartTime.add(duration, 'minute');
  
      const updatedProject = {
        ...project,
        startTime,
        endTime: endTime.isAfter(dayjs(time[1])) ? dayjs(time[1]).format('HH:mm') : endTime.format('HH:mm'),
      };
  
      currentStartTime = endTime; 
      return updatedProject;
    });
  
    setPrjct(recalculatedProjects);
    setProjects(recalculatedProjects);
  };
  
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="schedule_list">
        <ul className="schedule_ul">
          {prjt.map((project, index) => (
            <Project
              key={`${project.startTime}-${index}`}
              index={index}
              project={project}
              moveProject={moveProject}
              removeProject={() => removeProject(index)}
            />
          ))}
        </ul>
      </div>
    </DndProvider>
  );
}
