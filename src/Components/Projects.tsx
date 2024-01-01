"use client";

import React, { useEffect, useState } from "react";
import { onValue, DatabaseReference } from "firebase/database";
import { StorageReference, ref, FirebaseStorage, getDownloadURL } from "firebase/storage";
import LoadingElement from "@/Components/Loading";

interface SpecialProjects {
    name: string;
    description: string;
    toolsUsed: Array<string>;
    imageLink: string;
    githubRepo: string;
    image: string;
}

interface ProjectInput {
    project: SpecialProjects;
    imageBase: FirebaseStorage;
}

interface DatabaseData {
    projectReference: DatabaseReference;
    imageDatabase: FirebaseStorage;
}

const Project = ({project, imageBase}: ProjectInput): React.JSX.Element => {
    let imageRef: StorageReference = ref(imageBase, project.image);

    const [imageData, setImageData] = useState<React.JSX.Element>( <LoadingElement />)
    useEffect(()=> {
        async function getImageURL(referenceValue: StorageReference) {
            let url:string = await getDownloadURL(referenceValue);
            setImageData(<img className="h-full" src={url}></img>);
        }
        getImageURL(imageRef);
    }, []);

    let tools: Array<React.JSX.Element> = project.toolsUsed.map(
        (element: string, pos: number) => <li key={pos} className="mx-2 text-sm italic"> #{ element } </li>
    );

    let content: React.JSX.Element = (
        <>
            <div className="w-1/2"> 
                <h2 className="text-4xl font-bold mb-1"> { project.name } </h2>
                <ul className="flex flex-wrap mb-5 list-none">
                    { tools }
                </ul>
                <p> { project.description } </p>                
            </div>
            <div className="w-1/4 m-auto items-center">
                {imageData}
            </div>
        </> 
    );    

    return (
        <> 
            {project.githubRepo ? <a href={project.githubRepo} className="flex flex-wrap align-middle my-20 p-5 primary-dark"> {content} </a> : <div className="flex flex-wrap align-middle my-20 p-5 primary-dark"> {content} </div>} 
        </>
    );
}



const ProjectsSection = ({projectReference, imageDatabase} : DatabaseData): React.JSX.Element => {    
    const [projectData, setProjectData] = useState<React.JSX.Element>( <LoadingElement />);

    useEffect(() => {
        onValue(projectReference, (snapshot) => {
            let dataList: Array<SpecialProjects> = Object.values(snapshot.val());
            let projectList: Array<React.JSX.Element> = dataList.map((element: SpecialProjects, pos: number) => <Project key={pos} imageBase={imageDatabase} project={element} />);
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