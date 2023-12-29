'use client';

import React, { useState, useEffect} from "react"
import { onValue, DatabaseReference } from "firebase/database";

interface WorkExperience {
    position: string;
    company: string;
    dates: string;
    details: Array<string>;
}

interface DatabaseData {
    workReference: DatabaseReference;
}

const Work = ( data: WorkExperience ): React.JSX.Element => {
    let detailsElements: Array<React.JSX.Element> = data.details.map((element: string, pos: number) => <li key={pos}> {element} </li>);

    return (
        <li className="mt-10 p-5 w-1/2 flex flex-wrap bg-gradient-to-t from-blue-800 to-transparent bg-no-repeat hover:bg-emerald-600">
            <div className="flex flex-wrap w-full">
                <div className="mt-5 mb-5 mr-auto">
                    <h2 className="font-bold text-3xl mr-5"> {data.position}: </h2>
                    <p className="flex text-xl items-end"> {data.company} </p>
                </div>
                <p className="font-extralight italic text-sm"> {data.dates} </p>
            </div>
            <p className="text-xl font-bold mr-64 mb-5 mt-10" > Description: </p>
            <ul>
                {detailsElements}
            </ul>
        </li>
    );
}

const WorkSection = ({workReference}: DatabaseData): React.JSX.Element => {
    
    const [workData, setWorkData] = useState<React.JSX.Element>( <section> Loading... </section>);

    useEffect(() => {
        onValue(workReference, (snapshot) => {
            let dataList: Array<WorkExperience> = Object.values(snapshot.val());
            let workList: Array<React.JSX.Element> = dataList.map((element: WorkExperience, pos: number) => <Work key={pos} {...element} />);
            setWorkData(<ul className="list-none"> {workList} </ul>);
        });
    }, []);

    return (
        <div className="p-10">
            <h1 className="titleClass"> Work Experience </h1>
            { workData }
        </div>
    );
}

export default WorkSection;