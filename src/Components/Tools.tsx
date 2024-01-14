'use client';

import React, { useEffect, useRef, use} from "react"
import { onValue, DatabaseReference } from "firebase/database";
import Typed from "typed.js";
import { toolDataReference } from "@/app/firebase";

interface DatabaseData {
    toolReference: DatabaseReference;
}

const TypingWindow = (): React.JSX.Element => {
    const el = useRef(null);

    useEffect(() => {
        const options = {
            strings: ["^1000 int main() {\n\tstd::cout &lt;&lt; \"Hello World!\" &lt;&lt; std::endl&#59;\n\treturn 0&#59;\n }", "^1000 function hello_world() {\n \tconsole.log(\"Hello World\")&#59;\n }", "^1000 !#/bin/bash\n echo \"Hello World!\"", "^1000 public static void main() {\n \tSystem.out.println(\"Hello World!\")&#59;\n }", "^1000 print(\"Hello World!\")", "^1000 int main() {\n \tprintf(\"Hello World!\\n\")&#59;\n \treturn 0&#59;\n }", "^1000 fn main() {\n \tprintln!(\"Hello World!\")&#59;\n }", "^1000 static void Main() {\n \tConsole.WriteLine(\"Hello World!\")&#59;\n }"],
            typeSpeed: 50,
            backSpeed: 25,
            loop: true,
            backDelay: 1000,
            showCursor: false,
            smartBackspace: true,
        };

        const typed = new Typed(el.current, options);

        return () => {
            typed.destroy();
        }
    }, []);

    return (
        <div ref={el} className="whitespace-pre inline text-white"/>
    );

}

async function getToolData({toolReference}: DatabaseData): Promise<React.JSX.Element> {
    let toolData: React.JSX.Element = <></>;

    await new Promise<void>((resolve, reject) => {
        onValue(toolReference, (snapshot) => {
            let dataList: Array<string> = Object.values(snapshot.val());
            let toolList: Array<React.JSX.Element> = dataList.map((element: string, pos: number) => <li key={pos} className="w-80 mx-1 my-3"> {element} </li>);
            toolData = <ul className="flex flex-wrap mb-10 w-full"> {toolList} </ul>;
            resolve();
        }, reject);
    });

    return toolData;
}

const ToolsSection = () => {

    const toolData = use(getToolData({toolReference: toolDataReference}));
    
    return (
        <div className="p-5 flex flex-wrap justify-center">
            <h2 className="text-6xl mb-10"> Languages, Frameworks, and Other Tools </h2>
            <p className="text-xl"> A list of the tools, frameworks, and programming languages I have used and learned in the past.</p>
            <div className="flex flex-wrap object-center justify-center">
                <div className="terminal-style w-1/2 h-64 bg-black p-8 flex border-solid border-slate-500 border-8 my-16 relative -z-10">
                    <div className="text-lime-600 relative top-val -left-4 flex flex-col w-2 h-15"> 1 2 3 4 5 6 </div>
                    <div className="text-lime-600 absolute -top-1 left-14 z-20 font-medium"> {"//Hello World"} </div>       
                    <TypingWindow />
                </div>
                { toolData } 
            </div>
        </div>

    );
};

export default ToolsSection;