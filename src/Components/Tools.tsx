'use client';

import React, { useState, useEffect} from "react"
import { onValue, DatabaseReference } from "firebase/database";

interface DatabaseData {
    toolReference: DatabaseReference;
}

const ToolsSection = ({toolReference}: DatabaseData) => {

    const [toolData, setToolData] = useState<React.JSX.Element>( <section> Loading... </section>);

    useEffect(() => {
        onValue(toolReference, (snapshot) => {
            let dataList: Array<string> = Object.values(snapshot.val());
            let toolList: Array<React.JSX.Element> = dataList.map((element: string, pos: number) => <li key={pos} className="w-80 mx-1 my-3"> {element} </li>);
            setToolData(<ul className="flex flex-wrap mb-10"> {toolList} </ul>);
        });
    }, []);
    
    return (
        <div className="p-5">
            <h2 className="text-6xl mb-10"> Languages, Frameworks, and Other Tools </h2>
            { toolData }        
        </div>

    );
};

export default ToolsSection;