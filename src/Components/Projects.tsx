"use client";

import React, { useEffect, useState } from "react";
import { Octokit } from "octokit";

interface repoData {
    name: string;
    description: string,
    language: string,
    url: string
}

interface StringInterface {
    text: string;
}

interface specialProjects {
    name: string;
    description: string;
    toolsUsed: Array<string>;
    imageLink: string;
    githubRepo: string;
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

const ProjectTool = ({text}: StringInterface): React.JSX.Element => {
    return (
        <li className="mx-2 text-sm italic"> #{ text } </li>
    );
}

const Project = (props: specialProjects): React.JSX.Element => {
    let tools: Array<React.JSX.Element> = props.toolsUsed.map(
        (element: string, pos: number) => <ProjectTool key={pos} text={element} />
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

const GitHubProject = (props: repoData): React.JSX.Element => {
    if (!props.language) {
        return (
            <a href={props.url} className="w-1/4 p-2 m-8 bg-gradient-to-bl from-green-600 to-teal-400 via-lime-400 hover:bg-orange-500">
                <h2 className="text-xl bold"> {props.name} </h2>
                <p className="mt-3"> {props.description} </p>
            </a>
        );  
    } 

    return (
        <a href={props.url} className="w-1/4 p-2 m-8 bg-gradient-to-bl from-green-600 to-teal-400 via-lime-400 hover:bg-orange-500">
            <h2 className="text-xl bold mb-2"> {props.name} </h2>
            <p className="text-sm"> Most of this project is written in <em> {props.language} </em> </p>
            <p className="mt-3"> {props.description} </p>
        </a>
    );
}

const ProjectsSection = (): React.JSX.Element => {    
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

    const projectsList: Array<specialProjects> = [
        {
            name: "GraphJS",
            description: "A basic graphing application created in a team of three other members. This application allows a user to create, develop, edit, and save charts. These charts are saved to a public section where they can be accessed and used by other users.",
            toolsUsed: [
                "HTML",
                "CSS",
                "Javascript",
                "NodeJS",
                "Express.js",
                "Handlebars",
                "JSON"
            ],
            imageLink: "https://lthub.ubc.ca/files/2021/06/GitHub-Logo.png",
            githubRepo: "https://github.com/osu-cs290-f22/final-project-graph-builder"
        },
        {
            name: "Quizzler",
            description: "A website designed to allow users to create mini-quizzes, add new terms and answers, and use the OpenAI API to evaluate the answers to these quizzes. Created in a team of 3 over a 48 hour hackathon period. Implemented user authentication methods using Express.",
            toolsUsed: [
                "HTML",
                "CSS",
                "Javascript",
                "NodeJS",
                "Express.js",
                "OpenAI API"
            ],
            imageLink: "",
            githubRepo: "https://github.com/JackKammerer/HackathonProjectSpring"
        }, 
        {
            name: "MP3 Player",
            description: "A C++ MP3 player application. It provides the ability to change, add to, and remove from playlists. It also allows audio playback, has some basic settings, and search functionality. This was created in a team of six students over 7 weeks using SCRUM. Note: This was created using another Github account, @jackkammererer instead of my default account.",
            toolsUsed: [
                "C++",
                "QT Framework",
                "FFMPEG",
                "Simple DirectMedia Layer",
                "TagLib Library"
            ],
            imageLink: "",
            githubRepo: ""
        },
        {
            name: "Home Server",
            description: "An Ubuntu Server device that is used to run various applications and microservices. This includes Docker, which runs containers that manage data storage, password management, and code testing. It also uses a TLS/SSL proxy server to enable https connections. Finally, it runs a Kali Linux Virtual machine for testing code and packages, writing code, and enabling consistent storage across devices.",
            toolsUsed: [
                "Docker and Docker Compose",
                "Virsh Hypervisor",
                "Ubuntu and Kali Linux",
                "Universal Firewall (ufw)",
                "Nginx Proxy Manager"
            ],
            imageLink: "",
            githubRepo: ""
        },
        {
            name: "Home Network Setup",
            description: "My home network is setup to use PiHole and Unbound for setting up local DNS and ad-block, PiKVM to enable easy and automated startup and shutdown for my Home Server, and the Home Server itself, which is designed to be accessible through the network. This network is kept secure and connected through NATs via Tailscale VPN.",
            toolsUsed: [
                "PiHole",
                "Unbound",
                "PiKVM",
                "Tailscale VPN",
            ],
            imageLink: "",
            githubRepo: ""
        } 
    ]
    
    let projects: Array<React.JSX.Element> = projectsList.map(
        (element: specialProjects, pos:number) => <Project key={pos} {...element} />
    );

    return (
        <div className="p-10">
            <h2 className = "titleClass"> Past Projects </h2>

            <h4 className = "text-5xl font-bold mb-10"> Highlighted Projects </h4>
            <p className="text-xl mb-20"> Some personal, highlighted projects that I have worked on. </p>
            {projects}

            <h4 className = "text-5xl font-bold mb-10 mt-20"> Github Projects</h4>
            <p className="text-xl mb-20"> A live update of my current GitHub repository projects. Click on any of them, and you will be taken directly to the repository. </p>
            {githubProjectList}
        </div>
    );
}

export default ProjectsSection