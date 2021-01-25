import { Guid } from "js-guid";
import { useEffect, useState } from "react";
import "./Window.scss";
import Circle from "components/Circle";
import History from "components/History";
import Input from "components/Input";
import ClipLoader from "react-spinners/ClipLoader";

import { HistoryContext, LoadingContext } from "store/context";

export default function Window() {
  /*
  history is a list of messages, each of them contains 4 information:
  1. key: unique key for React rendering
  2. folderPath: current folder path that user is within
  3. isCommand: whether the message is a request or a response
  4. content: content of the message
  */
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const addToHistory = (newMsg) => {
    setHistory((history) => {
      const newHistory = [...history];
      newHistory.push(newMsg);
      return newHistory;
    });
  };

  useEffect(() => {
    // first message
    addToHistory({
      key: Guid.newGuid(),
      folderPath: "/",
      isCommand: false,
      content: "Connected to VFS server.",
    });
  }, []);

  return (
    <section className="window">
      <div className="window__header">
        <div className="window__circle_wrapper">
          <Circle color="#FF605C" />
          <Circle color="#FFBD44" />
          <Circle color="#00CA4E" />
        </div>
        <h3 className="window__title">VFS Terminal</h3>
      </div>
      <div className="window__spinner">
        <ClipLoader color={"white"} loading={loading} size={20} />
      </div>

      <HistoryContext.Provider value={{ history, setHistory, addToHistory }}>
        <LoadingContext.Provider value={{ loading, setLoading }}>
          <div className="window__terminal">
            <History />
          </div>

          <div className="window__input">
            <Input />
          </div>
        </LoadingContext.Provider>
      </HistoryContext.Provider>
    </section>
  );
}
