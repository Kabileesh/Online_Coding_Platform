const getExecutionCommand = (language, input) => {
  switch (language) {
    case "c":
      return [
        "/bin/sh",
        "-c",
        `gcc /temp/code.c -o /temp/code.out && echo "${input}" | /temp/code.out 2>&1`,
      ];
    case "cpp":
      return [
        "/bin/sh",
        "-c",
        `g++ /temp/code.cpp -o /temp/code.out && echo "${input}" | /temp/code.out 2>&1`,
      ];
    case "rust":
      return [
        "/bin/sh",
        "-c",
        `rustc /temp/code.rs -o /temp/code && echo "${input}" | /temp/code 2>&1`,
      ];
    case "python":
      return ["/bin/sh", "-c", `echo "${input}" | python /temp/code.py 2>&1`];
    case "Go":
      return ["/bin/sh", "-c", `echo "${input}" | go run /temp/code.go 2>&1`];
    case "ruby":
      return ["/bin/sh", "-c", `echo "${input}" | ruby /temp/code.rb 2>&1`];
    default:
      throw new Error("Invalid language");
  }
};

module.exports = getExecutionCommand;
