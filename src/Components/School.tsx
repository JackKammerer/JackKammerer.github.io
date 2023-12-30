'use client';

import React, { useState, useEffect} from "react"
import { onValue, DatabaseReference } from "firebase/database";
import { FirebaseStorage, StorageReference } from "firebase/storage";


interface SchoolExperience {
    name: string;
    dates: string;
    degree: string;
    awardsList: Array<string>;
}

interface DatabaseData {
    schoolReference: DatabaseReference;
/*    imageData: FirebaseStorage; */
}


const School = ( data: SchoolExperience ): React.JSX.Element => {

    let awardsListElements: Array<React.JSX.Element> = data.awardsList.map((element: string, pos: number) => <li key={pos}> {element} </li>);

    return (
        <li className="mt-10 p-5 w-1/2 flex flex-wrap primary-dark">
            <div className="mt-5 mb-5">
                <h2 className="font-bold text-3xl"> {data.name} </h2>
                <p className="font-extralight italic text-sm"> {data.dates} </p>
            </div>
            <p className="mb-5 w-11/12"> <strong className="mr-1 text-xl">Degree:</strong> {data.degree} </p>
            <p className="text-xl font-bold mr-64 mb-5" > Accomplishments: </p>
            <ul>
                {awardsListElements}
            </ul>
        </li>
    );
}

const SchoolSection = ({schoolReference}: DatabaseData): React.JSX.Element => {

    const [schoolData, setSchoolData] = useState<React.JSX.Element>( <section> Loading... </section>);

    useEffect(() => {
        onValue(schoolReference, (snapshot) => {
            let dataList: Array<SchoolExperience> = Object.values(snapshot.val());
            let schoolList: Array<React.JSX.Element> = dataList.map((element: SchoolExperience, pos: number) => <School key={pos} {...element} />);
            setSchoolData(<ul className="list-none"> {schoolList} </ul>);
        });
    }, []);
    
    return (
        <div className="p-10">
            <h1 className="titleClass"> School Experience </h1>
            {schoolData}
        </div>
    );
}

export default SchoolSection;
