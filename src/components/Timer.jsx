import React from 'react';
import { TimePicker } from 'antd';
import dayjs from 'dayjs';

export default function Timer ({ defaultValue, format, onChange }){
  const handleTimeChange = (time) => {
    if (onChange) {
      onChange(time ? time.format(format) : null);
    }
  };

  return (
    <TimePicker
      
      placeholder="Введите время"
      defaultValue={defaultValue ? dayjs(defaultValue, format) : null}
      format={format}
      onChange={handleTimeChange}
    />
  );
};


