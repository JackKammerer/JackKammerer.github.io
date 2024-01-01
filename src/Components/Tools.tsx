'use client';

import React, { useState, useEffect, useRef} from "react"
import { onValue, DatabaseReference } from "firebase/database";
import Typed from "typed.js";

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
        <div ref={el} className="whitespace-pre inline text-white text-4xl"/>
    );

}

const ToolsSection = ({toolReference}: DatabaseData) => {

    const [toolData, setToolData] = useState<React.JSX.Element>( <section> Loading... </section>);

    useEffect(() => {
        onValue(toolReference, (snapshot) => {
            let dataList: Array<string> = Object.values(snapshot.val());
            let toolList: Array<React.JSX.Element> = dataList.map((element: string, pos: number) => <li key={pos} className="w-80 mx-1 my-3"> {element} </li>);
            setToolData(<ul className="flex flex-wrap mb-10 w-full"> {toolList} </ul>);
        });
    }, []);
    
    return (
        <div className="p-5">
            <h2 className="text-6xl mb-10"> Languages, Frameworks, and Other Tools </h2>
            <div className="flex flex-wrap object-center justify-center">
                <div className="w-1/2 h-64 bg-black p-10 flex border-solid border-slate-500 border-8 my-16 relative -z-10">
                    <div className="text-lime-600 relative -top-10 -left-8 flex flex-wrap w-5 text-4xl"> 1 2 3 4 5 6 </div>
                    <div className="text-lime-600 absolute top-0 left-16 text-4xl z-20"> //Hello World</div>       
                    <TypingWindow />
                </div>
                { toolData } 
            </div>
        </div>

    );
};

export default ToolsSection;