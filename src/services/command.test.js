import { sanitizeCmd, validateCmd } from "./command";

test("sanitize command", () => {
  expect(sanitizeCmd("   clear  ")).toStrictEqual(["clear"]);
  expect(sanitizeCmd(" cd   /abc/  ")).toStrictEqual(["cd", "/abc/"]);
  expect(sanitizeCmd("   rm /a  /n /d  ")).toStrictEqual([
    "rm",
    "/a",
    "/n",
    "/d",
  ]);
});

test("man cmd", () => {
  expect(validateCmd(sanitizeCmd("man man"))).toStrictEqual({
    command: "man",
    cmd: "man",
  });

  expect(validateCmd(sanitizeCmd("man find"))).toStrictEqual({
    command: "man",
    cmd: "find",
  });
});

test("clear cmd", () => {
  expect(validateCmd(sanitizeCmd("clear"))).toStrictEqual({
    command: "clear",
  });
});

test("cd cmd", () => {
  expect(validateCmd(sanitizeCmd("cd /a/b"))).toStrictEqual({
    command: "cd",
    folder_path: "/a/b",
  });
});

test("cr cmd", () => {
  expect(validateCmd(sanitizeCmd("cr -p /a test"))).toStrictEqual({
    command: "cr",
    p_flag: true,
    path: "/a",
    data: "test",
  });

  expect(validateCmd(sanitizeCmd("cr -p /a"))).toStrictEqual({
    command: "cr",
    p_flag: true,
    path: "/a",
    data: null,
  });

  expect(validateCmd(sanitizeCmd("cr /a test"))).toStrictEqual({
    command: "cr",
    path: "/a",
    data: "test",
    p_flag: false,
  });

  expect(validateCmd(sanitizeCmd("cr /a"))).toStrictEqual({
    command: "cr",
    path: "/a",
    data: null,
    p_flag: false,
  });
});

test("cat cmd", () => {
  expect(validateCmd(sanitizeCmd("cat /a/b"))).toStrictEqual({
    command: "cat",
    file_path: "/a/b",
  });
});

test("ls cmd", () => {
  expect(validateCmd(sanitizeCmd("ls"))).toStrictEqual({
    command: "ls",
    folder_path: "/",
  });

  expect(validateCmd(sanitizeCmd("ls /a/b"))).toStrictEqual({
    command: "ls",
    folder_path: "/a/b",
  });
});

test("find cmd", () => {
  expect(validateCmd(sanitizeCmd("find a /a/b"))).toStrictEqual({
    command: "find",
    name: "a",
    folder_path: "/a/b",
  });

  expect(validateCmd(sanitizeCmd("find a"))).toStrictEqual({
    command: "find",
    name: "a",
    folder_path: "/",
  });
});

test("up cmd", () => {
  expect(validateCmd(sanitizeCmd("up /a/b a test"))).toStrictEqual({
    command: "up",
    name: "a",
    path: "/a/b",
    data: "test",
  });

  expect(validateCmd(sanitizeCmd("up /a/b a"))).toStrictEqual({
    command: "up",
    name: "a",
    path: "/a/b",
    data: null,
  });
});

test("mv cmd", () => {
  expect(validateCmd(sanitizeCmd("mv /a/b /c/d"))).toStrictEqual({
    command: "mv",
    path: "/a/b",
    folder_path: "/c/d",
  });
});

test("rm cmd", () => {
  expect(validateCmd(sanitizeCmd("rm /a/b /c/d"))).toStrictEqual({
    command: "rm",
    paths: ["/a/b", "/c/d"],
  });

  expect(validateCmd(sanitizeCmd("rm /a/b"))).toStrictEqual({
    command: "rm",
    paths: ["/a/b"],
  });
});
