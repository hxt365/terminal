const get_manual = (cmd) => {
  switch (cmd) {
    case "man":
      return `Syntax: man CMD<br/>
      The manual page associated with these command is then found and displayed:<br/>
      man, cd, cr, cat, ls, find, up, mv, rm, clear`;
    case "clear":
      return `
      Syntax: clear<br/>
      Clear your screen.
      `;
    case "cd":
      return `
      Syntax: cd FOLDER_PATH<br/>
      Change current working directory/folder to the specified FOLDER.
      `;
    case "cr":
      return `
        Syntax: cr [-p] PATH [DATA]<br/>
        Create a new file (if DATA is specified, otherwise create a new folder) at the specified PATH.<br/>
        If optional param -p (parents) is specified, create the missing parent folders.
        `;
    case "cat":
      return `
        Syntax: cat FILE_PATH<br/>
        Show the content of a file at FILE_PATH.
        `;
    case "ls":
      return `
        Syntax: ls [FOLDER_PATH]<br/>
        List out all items directly under a folder.<br/>
        The output list includes name, created_at, updated_at, and size of each item directly under the current folder, and of the current folder itself.<br/>
        If the optional param FOLDER_PATH is specified, list for the folder at FOLDER_PATH. Otherwise if omitted, list for the current working folder.
        `;
    case "find":
      return `
        Syntax: find NAME [FOLDER_PATH]<br/>
        Search all files/folders whose name contains the substring NAME.<br/>
        If the optional param FOLDER_PATH is specified, find in the folder at FOLDER_PATH. Otherwise if omitted, find in the current working folder.
        `;
    case "up":
      return `
        Syntax: up PATH NAME [DATA]<br/>
        Update the file/folder at PATH to have new NAME and, optionally, new DATA.
        `;
    case "mv":
      return `
        Syntax: mv PATH FOLDER_PATH.<br/>
        Move a file/folder at PATH into the destination FOLDER_PATH.
        `;
    case "rm":
      return `
        Syntax: rm PATH [PATH2 PATH3...]<br/>
        Remove files/folders at the specified PATH(s).
        `;
    default:
      break;
  }
};

export default get_manual;
