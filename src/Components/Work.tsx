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
                {data.details}
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
    
    let workDataList: Array<WorkExperience> = [
        {
            position: "Math Tutor",
            company: "Clackamas Community College",
            dates: "< 09/2021 - 06/2022 >",
            details: [
                "Worked with students in a wide variety of subjects including geometry, calculus, trigonometry, and statistics.",
                "Aided students in remote and in-person environments.",
                "Used and demonstrated resources including Desmos, Wolfram Alpha's web interface, and other online information sources such as Google and Youtube.",
                "Helped over 20 different students with solving and understanding mathematical ideas."            
            ]
        },
        {
            position: "Extended Reality Intern",
            company: "Portland State University",
            dates: "< 06/2021 - 08/2021 >",
            details: [
                "This internship was the focus of a 3-month internship through the Saturday Academy's ASE internship program.",
                "Tested the lab material for CS 410/510 with Dr. Ehsan Aryafar and his graduate student Samuel Shippey.",
                "Worked with Unity, C#, and Vuforia to create virtual reality and augmented reality applications.",
                "Worked remotely, with meetings every two weeks to communicate progress",
                "Worked full time, eight hours a day, five days a week.",
                "Created a virtual reality puzzle game to demonstrate the knowledge gained through the use of the labs."
            ]
        },
        {
            position: "SOC Analyst",
            company: "Oregon State University",
            dates: "< 09/2022 - Current Day >",
            details: [
                "Analyzed and responded to potential security flags.",
                "Used the Microsoft Azure suite of tools, including Sentinel and Defender XDR.",
                "Worked in a team environment with up to five other analysts when triaging alerts.",
                "Created new automation tools to better identify suspicious behavior and close alerts.",
                "Refined and updated old automation rules.",
                "Examined phishing and spam emails for suspicious activity."
            ]
        }
    ];

    let workList: Array<React.JSX.Element> = workDataList.map((element: WorkExperience, pos:number) => <Work key={pos} {...element} />);

    return (
        <div className="p-10">
            <h1 className="titleClass"> Work Experience </h1>
            { workData }
        </div>
    );
}

export default WorkSection;