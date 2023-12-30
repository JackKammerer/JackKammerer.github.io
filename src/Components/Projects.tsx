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
            <div className="flex flex-wrap align-middle my-20 p-5 primary-dark">
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
            <a href={props.githubRepo} className="flex flex-wrap align-middle my-20 p-5 primary-dark">
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
            </a>
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
        <div className="flex flex-wrap p-10 justify-center">
            <h2 className = "titleClass mx-48"> Highlighted Projects </h2>

            <p className="text-2xl"> Highlighted projects that display my best skills. </p>
            {projectData}
        </div>
    );
}

export default ProjectsSection