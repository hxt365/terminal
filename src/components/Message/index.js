import "./Message.scss";
import { useEffect, useRef } from "react";
import moment from "moment";

export default function Message({ folderPath, isCommand = false, content }) {
  const textRef = useRef(null);

  const ls_representation = (items) => {
    let table = `<div class="table_wrapper"><table>
    <tr>
      <th class="time">created_at</th>
      <th class="time">updated_at</th>
      <th>size</th>
      <th>name</th>
    </tr>`;
    items.forEach((item) => {
      table += `<tr>
      <td class="center time">${moment(item.created_at).format(
        "MMMM Do YYYY, h:mm:ss a"
      )}</td>
        <td class="center time">${moment(item.updated_at).format(
          "MMMM Do YYYY, h:mm:ss a"
        )}</td>
        <td class="center">${item.size}</td>
        <td>${item.name}</td>
      </tr>`;
    });
    table += "</table></div>";
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
