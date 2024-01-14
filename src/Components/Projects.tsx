import React, { use } from "react";
import { onValue, DatabaseReference } from "firebase/database";
import { StorageReference, ref, FirebaseStorage, getDownloadURL } from "firebase/storage";
import Image from 'next/image';

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


async function getImage(referenceValue: StorageReference): Promise<React.JSX.Element> {
    let url:string = await getDownloadURL(referenceValue);
    return (<img className="h-full" src={url} alt="" />);
}

const Project = ({project, imageBase}: ProjectInput): React.JSX.Element => {
    let imageRef: StorageReference = ref(imageBase, project.image);

    const imageData = use(getImage(imageRef));

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
            <div className="w-1/4 m-auto items-center z-10">
                {imageData}
            </div>
        </> 
    );    

    return (
        <> 
            {project.githubRepo ? <a href={project.githubRepo} className="flex flex-wrap relative overflow-hidden align-middle my-20 p-5 primary-dark project-link"> {content} </a> : <a href="#projects" className="flex flex-wrap relative overflow-hidden align-middle my-20 p-5 primary-dark project-link"> {content} </a>} 
        </>
    );
}

async function projectProps({projectReference, imageDatabase}: DatabaseData): Promise<React.JSX.Element> { 
    let projectData: React.JSX.Element = <></>;

    await new Promise<void>((resolve, reject) => {
        onValue(projectReference, (snapshot) => {
            let dataList: Array<SpecialProjects> = Object.values(snapshot.val());
            let projectList: Array<React.JSX.Element> = dataList.map((element: SpecialProjects, pos: number) => <Project key={pos} imageBase={imageDatabase} project={element} />);
            projectData = <ul className="list-none"> {projectList} </ul>;
            resolve();
        }, reject);
    });

    return projectData;
}

const ProjectsSection = ({projectReference, imageDatabase} : DatabaseData): React.JSX.Element => {    
    const projectData = use(projectProps({projectReference, imageDatabase}))

    return (
        <div className="flex flex-wrap p-10 justify-center">
            <h2 className = "titleClass mx-48"> Highlighted Projects </h2>

            <p className="text-2xl"> Highlighted projects that display my best skills. </p>
            {projectData}
        </div>
    );
}

export default ProjectsSection