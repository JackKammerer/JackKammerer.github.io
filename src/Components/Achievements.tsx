import React from 'react'

const LanguagesPortion = (): React.JSX.Element => {
    const languagesArray: Array<string> = [
        "C/C++", 
        "HTML/CSS/Javascript", 
        "Typscript",
        "Java", 
        "C#", 
        "Python", 
        "Rust",
        "x86 Assembly",
        "Microsoft Macro Assembly (MASM)",
        "Bash Script", 
        "SQL", 
        "KQL", 
        "PHP",
        "Qt Framework", 
        "React", 
        "NodeJS", 
        "Express.js", 
        "Vite", 
        "NextJS",
        "Ghidra",
        "gdb",
        "gcc/g++", 
        "AWS", 
        "Github/Git", 
        "Unity", 
        "Docker"
    ];

    let elementsArray: Array<React.JSX.Element> = languagesArray.map((element: string, pos: number) => <li key={pos} className="w-80 mx-1 my-3"> {element} </li>);

    return (
        <ul className="flex flex-wrap mb-10">
            { elementsArray }           
        </ul>
    );
} 

const AccomplishmentsPortion = (): React.JSX.Element => {

    const accArray: Array<string> = [
        "Graduated high school with 126 college credits, an Associate of Arts Oregon Transfer Degree, and a 4.0 GPA",
        "Acceptance into the MECOP internship program",
        "Completion of the ASE internship program",
        "Holds the position of the Oregon State University Google Student Developer Club Technical Officer",
        "Awarded the North Clackamas Student Fund Bridges to Success Scholarship",
        "Accepted into the Oregon State University Honors College"
    ]

    let accElemArray: Array<React.JSX.Element> = accArray.map((element: string, pos: number) => <li key={pos} className="my-5"> {element} </li>);

    return (
        <ul>
            { accElemArray }
        </ul>
    );
}

const AchievementsSection = (): React.JSX.Element => {
    return (
        <div className="p-5">
            <h2 className="text-6xl mb-10"> Languages, Frameworks, and Other Tools </h2>
            < LanguagesPortion />
            <h2 className="text-6xl mb-10"> Notable Accomplishments </h2>
            < AccomplishmentsPortion />
        </div>
    );
}

export default AchievementsSection;