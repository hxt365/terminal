import "./Message.scss";
import { useEffect, useRef } from "react";

export default function Message({ folderPath, isCommand = false, content }) {
  const textRef = useRef(null);

  const ls_representation = (items) => {
    let table = ` <table>
    <tr>
      <th>created_at</th>
      <th>updated_at</th>
      <th>size</th>
      <th>name</th>
    </tr>`;
    items.forEach((item) => {
      table += `<tr>
      <td>${item.created_at}</td>
        <td>${item.updated_at}</td>
        <td>${item.size}</td>
        <td>${item.name}</td>
      </tr>`;
    });
    table += "</table>";
    return table;
  };

  const find_representation = (results) => {
    let list = "";
    results.forEach((path) => {
      list += path + "<br/>";
    });
    return list;
  };

  useEffect(() => {
    if (content?.items) {
      // response of ls command
      console.log(content.items.toString());
      textRef.current.innerHTML = ls_representation(content.items);
    } else if (content?.content) {
      // response of cat command
      textRef.current.innerHTML = content.content;
    } else if (content?.results) {
      // response of find command
      textRef.current.innerHTML = find_representation(content.results);
    } else {
      // typical string response
      textRef.current.innerHTML = content;
    }
  }, [content]);

  return (
    <div className="message">
      {isCommand && (
        <span>
          <span style={{ color: "#FF605C" }}>V</span>
          <span style={{ color: "#FFBD44" }}>F</span>
          <span style={{ color: "#00CA4E" }}>S</span>@handsome_user&nbsp;~
          {folderPath}$:&nbsp;
        </span>
      )}
      <p ref={textRef}></p>
    </div>
  );
}
