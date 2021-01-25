import axios from "./axios";

const COMMANDS = [
  "man",
  "cd",
  "cr",
  "cat",
  "ls",
  "find",
  "up",
  "mv",
  "rm",
  "clear",
];

export const sanitizeCmd = (raw_cmd) => {
  /*
  Clean the raw command and return a list of arguments of the command.
  Input: a string that represents the raw  command.
  */
  let cmd = raw_cmd.trim(" "); // remove whitespace from both ends of the command
  cmd = cmd.replace(/ +/g, " "); // reduce whitespace between words of the command
  const args = cmd.split(" ");
  return args;
};

const InvalidCmdError = (type) => {
  const error = new Error(
    `Command '${type}' not found or not correct. Please see the manual and try again.`
  );
  return error;
};

InvalidCmdError.prototype = Object.create(Error.prototype);

const getAbsolutePath = (path, curFolderPath) => {
  /*
  Absolute paths start with a slash.
  */
  if (path[0] !== "/") return curFolderPath + path;
  return path;
};

export const validateCmd = (args, curFolderPath = "/") => {
  /*
  Extract agurments from command and return a payload object.
  See manual for more information.
  Input: list of arguments of a command.
  Raise exception if the command is invalid.
  */

  // man cmd
  if (args[0] === "man") {
    if (args.length === 2 && !COMMANDS.includes(args[1]))
      throw Error(`Command '${args[1]} is not supported.`);
    if (args.length !== 2) throw Error(`See 'man man'.`);
    return {
      command: "man",
      cmd: args[1],
    };
  }

  // clear command
  // clear
  if (args.length === 1 && args[0] === "clear") {
    return {
      command: "clear",
    };
  }

  // cd command
  // cd FOLDER_PATH
  if (args.length === 2 && args[0] === "cd" && typeof args[1] === "string") {
    return {
      command: "cd",
      folder_path: getAbsolutePath(args[1], curFolderPath),
    };
  }

  // cr command
  if (args[0] === "cr") {
    // cr -p PATH DATA
    if (args.length === 4 && args[1] === "-p") {
      return {
        command: "cr",
        p_flag: true,
        path: getAbsolutePath(args[2], curFolderPath),
        data: args[3],
      };
    }
    // cr -p PATH
    if (args.length === 3 && args[1] === "-p") {
      return {
        command: "cr",
        p_flag: true,
        path: getAbsolutePath(args[2], curFolderPath),
        data: null,
      };
    }

    // cr PATH DATA
    if (args.length === 3) {
      return {
        command: "cr",
        path: getAbsolutePath(args[1], curFolderPath),
        data: args[2],
        p_flag: false,
      };
    }

    // cr PATH
    if (args.length === 2) {
      return {
        command: "cr",
        path: getAbsolutePath(args[1], curFolderPath),
        data: null,
        p_flag: false,
      };
    }
  }

  // cat command
  // cat FILE_PATH
  if (args.length === 2 && args[0] === "cat") {
    return {
      command: "cat",
      file_path: getAbsolutePath(args[1], curFolderPath),
    };
  }

  // ls command
  if (args[0] === "ls") {
    // ls
    if (args.length === 1) {
      return {
        command: "ls",
        folder_path: curFolderPath,
      };
    }
    // ls FOLDER_PATH
    if (args.length === 2) {
      return {
        command: "ls",
        folder_path: getAbsolutePath(args[1], curFolderPath),
      };
    }
  }

  // find command
  if (args[0] === "find") {
    // find NAME FOLDER_PATH
    if (args.length === 3) {
      return {
        command: "find",
        name: args[1],
        folder_path: getAbsolutePath(args[2], curFolderPath),
      };
    }
    // find NAME
    if (args.length === 2) {
      return {
        command: "find",
        name: args[1],
        folder_path: "/",
      };
    }
  }

  // up command
  if (args[0] === "up") {
    // up PATH NAME DATA
    if (args.length === 4) {
      return {
        command: "up",
        name: args[2],
        path: getAbsolutePath(args[1], curFolderPath),
        data: args[3],
      };
    }
    // up PATH NAME
    if (args.length === 3) {
      args[1] = getAbsolutePath(args[1], curFolderPath);
      return {
        command: "up",
        name: args[2],
        path: getAbsolutePath(args[1], curFolderPath),
        data: null,
      };
    }
  }

  // mv command
  // mv PATH FOLDER_PATH
  if (args.length === 3 && args[0] === "mv") {
    args[1] = getAbsolutePath(args[1], curFolderPath);
    args[2] = getAbsolutePath(args[2], curFolderPath);
    return {
      command: "mv",
      path: getAbsolutePath(args[1], curFolderPath),
      folder_path: getAbsolutePath(args[2], curFolderPath),
    };
  }

  // rm command
  // rm PATH [PATH2 PATH3...]
  if (args[0] === "rm" && args.length > 1) {
    // Transform cmd to form: rm [PATH, PATH2, PATH3, ...]
    const paths = args.splice(1).reduce((acc, arg) => {
      acc.push(getAbsolutePath(arg, curFolderPath));
      return acc;
    }, []);
    return {
      command: "rm",
      paths: paths,
    };
  }

  throw InvalidCmdError(args[0]);
};

export const RPC = ({ command, ...payload }) => {
  /*
  Call to backend
  */
  const url = `/${command}/`;
  return axios
    .post(url, payload)
    .then((res) => res.data)
    .catch((e) => {
      let msg;
      if (e.response) {
        msg = e.response.data;
        if (typeof msg === "object")
          // validation error
          msg = "Command not valid. Please see the manual and try again";
      } else {
        msg = "Something has gone wrong. Please try again.";
      }
      throw Error(msg);
    });
};
