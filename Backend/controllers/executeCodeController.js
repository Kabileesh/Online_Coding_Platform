const Docker = require("dockerode");
const { promisify } = require("util");
const fs = require("fs");
const generateDockerfileContent = require("../other/dockerFileContent");
const getExecutionCommand = require("../other/executionCommand");
const { exec } = require('child_process');

const docker = new Docker({ socketPath: 'tcp://0.0.0.0:2375' });

const writeFileAsync = promisify(fs.writeFile);
const unlinkFileAsync = promisify(fs.unlink);

const sanitizeCode = (code) => {
  const dangerousFunctions = ["eval", "exec", "spawn", "require"];
  const code_1 = code.replace(/system\(/g, "/* sanitized system( */");
  const code_2 = code_1.replace(/[^\x00-\x7F]/g, "");
  const pattern = new RegExp(`\\b(${dangerousFunctions.join("|")})\\b`, "g");
  const sanitizedCode = code_2.replace(
    pattern,
    "/* sanitized function call */"
  );
  return sanitizedCode;
};

const getExecutionStatus = (resultInfo, output) => {
  if (resultInfo.State.ExitCode === 0 && output.includes("Runtime Error")) {
    return "Runtime Error";
  } else if (resultInfo.State.ExitCode === 0) {
    return "Accepted";
  } else if (output.includes("Compilation Error")) {
    return "Compilation Error";
  } else {
    return "Failed";
  }
};

const getExtension = (language) => {
  switch (language) {
    case "c":
      return "c";
    case "cpp":
      return "cpp";
    case "rust":
      return "rs";
    case "python":
      return "py";
    case "Go":
      return "go";
    case "ruby":
      return "rb";
  }
};

const executeCode = async (req, res) => {
  const { code, language, runtimeInput } = req.body;

  try {
    const extension = getExtension(language);
    const codeFilePath = "./temp/code." + extension;

    const sanitizedCode = sanitizeCode(code);

    await writeFileAsync(codeFilePath, sanitizedCode);

    const dockerfileContent = generateDockerfileContent(
      language,
      sanitizedCode
    );

    const dockerfilePath = "./temp/Dockerfile";
    await writeFileAsync(dockerfilePath, dockerfileContent);

    const imageName = `code-execution-image:${language}`;

    const image = await docker.buildImage(
      {
        context: "./temp",
        src: ["Dockerfile", `code.${extension}`],
        tags: [`${imageName}`],
      },
      { t: `${imageName}` }
    );

    await new Promise((resolve, reject) => {
      docker.modem.followProgress(image, (err, res) =>
        err ? reject(err) : resolve(res)
      );
    });

    const container = await docker.createContainer({
      Image: `${imageName}`,
      Cmd: getExecutionCommand(language, runtimeInput),
      Tty: true,
      OpenStdin: true,
      StdinOnce: false,
      HostConfig: {
        MemorySwap: 0,
        CpuShares: 512,
        CpuPeriod: 100000,
        CpuQuota: 50000,
      },
    });

    await container.start();

    // properly executed code without run time input

    const stream = await container.attach({
      stream: true,
      stdin: true,
      stdout: true,
    });
    const outputChunks = [];

    stream.on("data", (chunk) => {
      outputChunks.push(chunk);
    });

    await new Promise((resolve, reject) => {
      stream.on("end", () => resolve());
      stream.on("error", (err) => reject(err));
    });

    // causes rangeError
    // const logs = await container.logs({ stdout: true, stderr: true, stream: false });

    // const output = logs.toString("utf-8");

    const output = Buffer.concat(outputChunks).toString("utf-8");
    let filteredOutput = "";
    try {
      const outputJson = JSON.parse(output);

      delete outputJson.stream;
      delete outputJson.stdin;
      delete outputJson.stdout;
      delete outputJson.stderr;

      filteredOutput = JSON.stringify(outputJson);
    } catch (error) {
      filteredOutput = output;
    }

    const containerInfo = await container.inspect();

    await container.stop().catch(() => {});

    await container.remove();

    await docker.getImage(`${imageName}`).remove();

    await unlinkFileAsync(codeFilePath);
    await unlinkFileAsync(dockerfilePath);

    const status = getExecutionStatus(containerInfo, output);

    const codeResult = {
      output: filteredOutput,
      status: status,
    };

    res.send(codeResult);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while executing the code");
  }
};

module.exports = { executeCode };
