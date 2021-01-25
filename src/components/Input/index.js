import "./Input.scss";
import { useState, useEffect, useRef, useContext } from "react";
import { Guid } from "js-guid";
import Textarea from "react-expanding-textarea";
import { HistoryContext, LoadingContext } from "store/context";
import { RPC, sanitizeCmd, validateCmd } from "services/command";
import get_manual from "services/manual";

const MAX_LENGTH_INPUT = 2000;

export default function Input() {
  const [cmd, setVal] = useState("");
  const [folderPath, setFolderPath] = useState("/");
  const textareaRef = useRef(null);
  const { addToHistory, setHistory } = useContext(HistoryContext);
  const { loading, setLoading } = useContext(LoadingContext);

  const prefix = `VFS@handsome_user: ~${folderPath}$: `;

  const focusOnTextarea = () => {
    const textarea = textareaRef.current;
    if (
      textarea.selectionStart > prefix.length ||
      textarea.selectionEnd > prefix.length
    )
      return;
    textarea.focus();
    textarea.selectionStart = textarea.selectionEnd = (prefix + cmd).length + 1;
  };

  useEffect(() => {
    const _focusOnTextarea = () => {
      const textarea = textareaRef.current;
      if (
        textarea.selectionStart > prefix.length ||
        textarea.selectionEnd > prefix.length
      )
        return;
      textarea.focus();
      textarea.selectionStart = textarea.selectionEnd =
        (prefix + cmd).length + 1;
    };

    _focusOnTextarea();
  }, [cmd, prefix]);

  const onChange = (e) => {
    const inpVal = e.target.value;
    setVal(inpVal.slice(prefix.length));
  };

  const reset = () => {
    setVal("");
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

  const onEnterPress = async (e) => {
    if (e.keyCode === 13 && !e.shiftKey) {
      e.preventDefault();
      setLoading(true);
      // Add new command to history
      addToHistory({
        key: Guid.newGuid(),
        folderPath: folderPath,
        isCommand: true,
        content: cmd,
      });
      await execute();
      reset();
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
