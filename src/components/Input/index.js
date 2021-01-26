import "./Input.scss";
import { useState, useEffect, useRef, useContext, useCallback } from "react";
import { Guid } from "js-guid";
import Textarea from "react-expanding-textarea";
import { HistoryContext, LoadingContext } from "store/context";
import { RPC, sanitizeCmd, validateCmd } from "services/command";
import get_manual from "services/manual";

const MAX_LENGTH_INPUT = 2000;

export default function Input() {
  const [cmd, setCmd] = useState("");
  const [folderPath, setFolderPath] = useState("/");
  const [cursor, setCursor] = useState(0);
  const textareaRef = useRef(null);
  const { history, addToHistory, setHistory } = useContext(HistoryContext);
  const { loading, setLoading } = useContext(LoadingContext);

  const prefix = `VFS@handsome_user: ~${folderPath}$: `;

  const focusOnTextarea = useCallback(() => {
    const textarea = textareaRef.current;
    if (
      textarea.selectionStart > prefix.length ||
      textarea.selectionEnd > prefix.length
    )
      return;
    textarea.focus();
    textarea.selectionStart = textarea.selectionEnd = (prefix + cmd).length + 1;
  }, [prefix, cmd]);

  useEffect(() => {
    focusOnTextarea();
  }, [focusOnTextarea]);

  useEffect(() => {
    setCursor(history.length);
  }, [history]);

  const onChange = (e) => {
    const inpVal = e.target.value;
    setCmd(inpVal.slice(prefix.length));
  };

  const reset = () => {
    setCmd("");
    setLoading(false);
    focusOnTextarea();
  };

  const call_RPC = async (payload) => {
    let result = await RPC({ ...payload });
    switch (payload.command) {
      case "cat":
      case "ls":
      case "find":
        // Add new response to history
        addToHistory({
          key: Guid.newGuid(),
          isCommand: false,
          content: result,
        });
        break;
      case "cd":
        setFolderPath(result["folder_path"]);
        break;
      default:
        break;
    }
  };

  const execute = async () => {
    const args = sanitizeCmd(cmd);
    if (args[0] === "") return;
    try {
      const payload = validateCmd(args, folderPath);
      switch (payload.command) {
        case "clear":
          setHistory([]);
          break;
        case "man":
          addToHistory({
            key: Guid.newGuid(),
            folderPath: folderPath,
            isCommand: false,
            content: get_manual(payload.cmd),
          });
          break;
        default:
          await call_RPC(payload);
      }
    } catch (e) {
      // Add new response about error to history
      addToHistory({
        key: Guid.newGuid(),
        folderPath: folderPath,
        isCommand: false,
        content: e.message,
      });
    }
  };

  const onEnterPress = (e) => {
    if (e.keyCode === 13 && !e.shiftKey) {
      e.preventDefault();
      // Add new command to history
      addToHistory({
        key: Guid.newGuid(),
        folderPath: folderPath,
        isCommand: true,
        content: cmd,
      });
      setLoading(true);
      execute().then(() => reset());
    }
    if (e.keyCode === 38) {
      // up button
      let c = cursor - 1;
      while (c >= 0 && (!history[c].isCommand || history[c].content === ""))
        c--;
      if (c >= 0 && history[c].isCommand && history[c].content !== "") {
        setCursor(c);
        setCmd(history[c].content);
      }
    }
    if (e.keyCode === 40) {
      // down button
      let c = cursor + 1;
      while (
        c < history.length &&
        (!history[c].isCommand || history[c].content === "")
      )
        c++;
      if (
        c < history.length &&
        history[c].isCommand &&
        history[c].content !== ""
      ) {
        setCursor(c);
        setCmd(history[c].content);
      }
      if (c === history.length) {
        setCursor(c);
        setCmd("");
      }
    }
  };

  return (
    <div className="input">
      <Textarea
        className="input__textarea"
        ref={textareaRef}
        value={prefix + cmd}
        onChange={onChange}
        onClick={focusOnTextarea}
        onKeyDown={onEnterPress}
        maxLength={MAX_LENGTH_INPUT.toString()}
        disabled={loading}
      />
    </div>
  );
}
