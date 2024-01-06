'use client';

import React, {use} from "react"
import { onValue, DatabaseReference } from "firebase/database";
import { workDataReference as workDataReference } from "@/app/firebase";
import Models from "@/Components/Models";


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
        <li className="mt-10 p-5 w-full flex flex-wrap primary-dark">
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


async function workProps({workReference}: DatabaseData): Promise<React.JSX.Element> {
    let workData: React.JSX.Element = <></>;

    await new Promise<void>((resolve, reject) => {
        onValue(workReference, (snapshot) => {
            let dataList: Array<WorkExperience> = Object.values(snapshot.val());
            let workList: Array<React.JSX.Element> = dataList.map((element: WorkExperience, pos: number) => <Work key={pos} {...element} />);
            workData = <ul className="list-none w-1/2"> {workList} </ul>;
            resolve();
        }, reject);
    });

    return workData;
}

const WorkSection = (): React.JSX.Element => {
    
    const workData = use(workProps({workReference: workDataReference}));

    return (
        <div className="p-10">
            <h1 className="titleClass"> Work Experience </h1>
            <div className="flex">
                { workData }
                < Models />
            </div>
        </div>
    );
}

export default WorkSection;