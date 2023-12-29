"use client";

import React, { useEffect, useState } from "react";
import { onValue, DatabaseReference } from "firebase/database";

interface SpecialProjects {
    name: string;
    description: string;
    toolsUsed: Array<string>;
    imageLink: string;
    githubRepo: string;
}

interface DatabaseData {
    projectReference: DatabaseReference;
}

const Project = (props: SpecialProjects): React.JSX.Element => {
    let tools: Array<React.JSX.Element> = props.toolsUsed.map(
        (element: string, pos: number) => <li key={pos} className="mx-2 text-sm italic"> #{ element } </li>
    );

    if (!props.githubRepo) {
        return (
            <div className="flex flex-wrap align-middle bg-gradient-to-tr my-8 p-5 from-sky-400 to-indigo-700 via-blue-500">
                <div className="w-1/2"> 
                    <h2 className="text-4xl font-bold mb-1"> { props.name } </h2>
                    <ul className="flex flex-wrap mb-5 list-none">
                        { tools }
                    </ul>
                    <p> { props.description } </p>                
                </div>
                <div className="w-1/4 m-auto items-center">
                    <img src={props.imageLink} />
                </div>                
            </div>
        );   
    } else {
        return (
            <div className="flex flex-wrap align-middle bg-gradient-to-tr my-8 p-5 from-sky-400 to-indigo-700 via-blue-500">
                <div className="w-1/2"> 
                    <h2 className="text-4xl font-bold mb-1"> { props.name } </h2>
                    <ul className="flex flex-wrap mb-5 list-none">
                        { tools }
                    </ul>
                    <p> { props.description } </p>                
                </div>
                <div className="w-1/4 m-auto items-center">
                    <img src={props.imageLink} />
                </div>                
            </div>
        );
    }
}



const ProjectsSection = ({projectReference} : DatabaseData): React.JSX.Element => {    
    const [projectData, setProjectData] = useState<React.JSX.Element>( <section> Loading... </section>);

    useEffect(() => {
        onValue(projectReference, (snapshot) => {
            let dataList: Array<SpecialProjects> = Object.values(snapshot.val());
            let projectList: Array<React.JSX.Element> = dataList.map((element: SpecialProjects, pos: number) => <Project key={pos} {...element} />);
            setProjectData(<ul className="list-none"> {projectList} </ul>);
        });
    }, []);

    return (
        <div className="p-10">
            <h2 className = "titleClass"> Past Projects </h2>

            <h4 className = "text-5xl font-bold mb-10"> Highlighted Projects </h4>
            <p className="text-xl mb-20"> Some personal, highlighted projects that I have worked on. </p>
            {projectData}
        </div>
    );
}

export default ProjectsSection