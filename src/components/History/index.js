import { animateScroll } from "react-scroll";
import { useContext, useEffect } from "react";
import Message from "components/Message";
import "./History.scss";
import { HistoryContext } from "store/context";

export default function History() {
  const { history } = useContext(HistoryContext);

  const scrollToBottom = () => {
    animateScroll.scrollToBottom({
      containerId: "history",
      duration: 100,
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [history]);

  return (
    <div className="history" id="history">
      {history.map((msg) => (
        <Message
          key={msg.key}
          folderPath={msg.folderPath}
          content={msg.content}
          isCommand={msg.isCommand}
        />
      ))}
    </div>
  );
}
