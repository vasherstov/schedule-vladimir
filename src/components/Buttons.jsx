import React from "react";
import { message } from "antd";
export default function Buttons({ setPage, setBreaken, rest }) {
  const breakButton = () => {
    if (rest.length == 2) {
      message.error("Удалите предыдущий перерыв");
      return;
    } else {
      setPage("addBreak");
      setBreaken(true);
    }
  };
  return (
    <>
      <div className="container">
        <div className="button-group">
          <button
            className="custom-button"
            onClick={() => {
              setPage("editGraph");
              setBreaken(false);
            }}
          >
            ✏️ Редактировать график
          </button>
          <button className="custom-button" onClick={breakButton}>
            ➕ Добавить перерыв
          </button>
        </div>
      </div>
    </>
  );
}
