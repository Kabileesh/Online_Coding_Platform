const generateDockerfileContent = (language, code) => {
  let dockerfileContent = "";

  if (language === "c") {
    dockerfileContent += `FROM gcc:latest\n\n`;
    dockerfileContent += `WORKDIR /temp\n`;
    dockerfileContent += `COPY code.${language} /temp/code.${language}\n`;
    dockerfileContent += `RUN chmod +x /temp/code.${language}\n`;
    dockerfileContent += `CMD ["sh", "-c", "ulimit -t 5 && ulimit -m 512000 && gcc /temp/code.c -o /temp/code.out && /temp/code.out"]\n`;
  } else if (language === "cpp") {
    dockerfileContent += `FROM gcc:latest\n\n`;
    dockerfileContent += `WORKDIR /temp\n`;
    dockerfileContent += `COPY code.${language} /temp/code.${language}\n`;
    dockerfileContent += `RUN chmod +x /temp/code.${language}\n`;
    dockerfileContent += `CMD ["sh", "-c", "ulimit -t 5 && ulimit -m 512000 && g++ /temp/code.cpp -o /temp/code.out && /temp/code.out"]\n`;
  } else if (language === "rust") {
    dockerfileContent += `FROM rust:latest\n\n`;
    dockerfileContent += `WORKDIR /temp\n`;
    dockerfileContent += `COPY code.rs /temp/code.rs\n`;
    dockerfileContent += `CMD ["sh", "-c", "ulimit -t 5 && ulimit -m 512000 && rustc /temp/code.rs -o /temp/code && /temp/code"]\n`;
  } else if (language === "python") {
    dockerfileContent += `FROM python:latest\n\n`;
    dockerfileContent += `WORKDIR /temp\n`;
    dockerfileContent += `COPY code.py /temp/code.py\n`;
    dockerfileContent += `RUN chmod +x /temp/code.py\n`;
    dockerfileContent += `CMD ["sh", "-c", "ulimit -t 5 && ulimit -m 512000 && /temp/code.py && python /temp/code.py"]\n`;
  } else if (language === "Go") {
    dockerfileContent += `FROM golang:latest\n\n`;
    dockerfileContent += `WORKDIR /temp\n`;
    dockerfileContent += `COPY code.go /temp/code.go\n`;
    dockerfileContent += `CMD ["go", "run", "/temp/code.go"]`;
  } else if (language === "ruby") {
    dockerfileContent += `FROM ruby:latest\n\n`;
    dockerfileContent += `WORKDIR /temp\n`;
    dockerfileContent += `COPY code.rb /temp/code.rb\n`;
    dockerfileContent += `CMD ["ruby", "/temp/code.rb"]`;
  } else {
    throw new Error("Invalid language");
  }

  return dockerfileContent;
};

module.exports = generateDockerfileContent;
