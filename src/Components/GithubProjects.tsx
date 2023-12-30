"use client";

import React, { useEffect, useState } from "react";
import { Octokit } from "octokit";


interface repoData {
    name: string;
    description: string,
    language: string,
    url: string
}

async function getRepos(): Promise<Array<repoData>>  {
    let repoList: Array<repoData>;
    
    const octokit = new Octokit({
        auth: process.env.NEXT_PUBLIC_GITHUB_API_KEY
    });

    try {
        const repoInfo = await octokit.request('GET /users/JackKammerer/repos', {
            username: 'JackKammerer'
        })
        
        repoList = repoInfo.data.map((element: any) => ({
            name: element.name, 
            description: element.description, 
            language: element.language,
            url: element.html_url
        }));

        return repoList;
    } catch (e) {
        console.error("There is an error: " + e);
        return [];
    }
}


const GitHubProject = (props: repoData): React.JSX.Element => {
    if (!props.language) {
        return (
            <a href={props.url} className="w-1/4 p-2 m-8 primary-dark">
                <h2 className="text-xl bold"> {props.name} </h2>
                <p className="mt-3"> {props.description} </p>
            </a>
        );  
    } 

    return (
        <a href={props.url} className="w-1/4 p-2 m-8 primary-dark">
            <h2 className="text-xl bold mb-2"> {props.name} </h2>
            <p className="text-sm"> Most of this project is written in <em> {props.language} </em> </p>
            <p className="mt-3"> {props.description} </p>
        </a>
    );
}

const GithubProjectsSection = () => {
    const [githubProjectList, setProjectList] = useState<React.JSX.Element>( <section> Loading... </section>);
    useEffect(() => {
        async function createGithubSection() {
            const githubProject: Array<repoData> = await getRepos(); 

            let projectDataItems: Array<React.JSX.Element> = githubProject.map(
                (element: repoData, pos:number) => <GitHubProject key={pos} {...element} />
            );

            setProjectList( <section className="flex flex-wrap justify-center"> {projectDataItems} </section>)
        }

        createGithubSection();
    }, []);

    return (
        <div className="p-10">
            <h4 className = "titleClass mt-20"> Github Projects</h4>
            <p className="text-xl mb-20"> A live update of my current GitHub repository projects. Click on any of them, and you will be taken directly to the repository. </p>
            {githubProjectList}
        </div>
    );
};

export default GithubProjectsSection;