import React, { useEffect, useState } from "react";
import CodeNavBar from "../Components/CodeNavbar";
import Editor from "@monaco-editor/react";
import axios from "../Components/axiosConfig";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../Styles/Home.css";

toast.configure();

const HomePage = (props) => {
  const [language, setLanguage] = useState("c");
  const [theme, setTheme] = useState("vs-dark");
  const [code, setCode] = useState(``);
  const [output, setOutput] = useState("");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [codeStatus, setCodeStatus] = useState("");

  useEffect(() => {
    defaultCodeSetter(language);
  }, [language]);

  const languageHandler = (lang) => {
    setLanguage(lang);
  };

  const themeHandler = (theme) => {
    setTheme(theme);
  };

  const defaultCodeSetter = (language) => {
    switch (language) {
      case "c":
        setCode(
          `#include<stdio.h>\n\nint main(){\n\tprintf("Hello World");\nreturn 0;\n}`
        );
        break;
      case "cpp":
        setCode(
          `#include<iostream>\n\nint main(){\n\tstd::cout<<"Hello World";\nreturn 0;\n}`
        );
        break;
      case "rust":
        setCode(
          `fn main(){\n\tprintln!("Hello World");\n}`
        );
        break;
      case "python":
        setCode(`print("Hello World")`);
        break;
      case "Go":
        setCode(`package main\n\nimport "fmt";\n\nfunc main(){\n\tfmt.Println("Hello World")\n}`);
        break;
      case "ruby":
        setCode(`puts "Hello World"`);
        break;
      default:
        setCode("//Enter your code here");
    }
  };

  const Compile = async () => {
    setLoading(true);
    const codeDetails = {
      code,
      language,
      runtimeInput: input,
    };
    const response = await axios.post("/execute", codeDetails);
    if (response?.status === 200) {
      setOutput(response?.data.output);
      setCodeStatus(response?.data.status);
      setLoading(false);
    } else {
      setOutput("Error while executing code! Please try again in few seconds");
      setCodeStatus("Failed");
      setLoading(false);
    }
  };

  const saveCodeHandler = async () => {
    const codeDetails = {
      code,
      language,
      runtimeInput: input,
      status: codeStatus,
      output: output,
    };
    const response = await axios.post("/submit-code", codeDetails);
    if (response?.status === 200) {
      toast.success("Successfully Saved", { autoClose: 3000 });
    } else {
      toast.error("Error in saving! Please try again", {autoClose: 3000});
      console.log("Error in code submission");
    }
  };

  return (
    <div>
      <CodeNavBar
        user={props.user}
        onLanguageSelect={languageHandler}
        onThemeSelect={themeHandler}
        saveCode={saveCodeHandler}
      />
      <div className="main">
        <div className="left-container">
          <Editor
            height="calc(100vh - 50px)"
            width="100%"
            theme={theme}
            language={language}
            value={code}
            onChange={(value) => {
              setCode(value);
            }}
          />
          <button className="run-btn" onClick={() => Compile()}>
            Run
          </button>
        </div>
        <div className="right-container">
          <h4>Input:</h4>
          <div className="input-box">
            <textarea
              id="code-inp"
              onChange={(e) => setInput(e.target.value)}
            ></textarea>
          </div>
          <h4>Output:</h4>
          {loading ? (
            "Executing..."
          ) : (
            <div className="output-box">
              <pre>{output}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
