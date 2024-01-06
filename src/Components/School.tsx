import React, { use } from "react";
import { onValue, DatabaseReference } from "firebase/database";
import { FirebaseStorage, ref, StorageReference, getDownloadURL } from "firebase/storage";

//A typescript interface that defines the data needed for every school in the list.
interface SchoolExperience {
    name: string;
    dates: string;
    degree: string;
    awardsList: Array<string>;
}

interface DatabaseData {
    schoolReference: DatabaseReference;
    imagesList: DatabaseReference;
    imageData: FirebaseStorage;
}

interface SchoolProps {
    schoolData: React.JSX.Element;
    imageData: React.JSX.Element;
};


const School = ( data: SchoolExperience ): React.JSX.Element => {

    let awardsListElements: Array<React.JSX.Element> = data.awardsList.map((element: string, pos: number) => <li key={pos}> {element} </li>);

    return (
        <li className="mt-10 p-5 w-full flex flex-wrap primary-dark">
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

    

async function getImageURL(referenceValue: StorageReference, key: number): Promise<React.JSX.Element> {
    return (getDownloadURL(referenceValue).then((url) => {
        return (
            <img key={key} className="h-1/4 my-10 border-solid border-slate-400 border-4 side-margin" src={url}></img>
        );
    }));
}





async function getSchoolData({schoolReference, imagesList, imageData}: DatabaseData): Promise<SchoolProps> {

    let schoolData: React.JSX.Element = <></>;
    let imagesData: React.JSX.Element = <></>;

    await Promise.all([
        new Promise<void>((resolve, reject) => {
            onValue(schoolReference, (snapshot) => {
                let dataList: Array<SchoolExperience> = Object.values(snapshot.val());
                let schoolList: Array<React.JSX.Element> = dataList.map((element: SchoolExperience, pos: number) => <School key={pos} {...element} />);
                schoolData = <ul className="w-1/2 list-none"> {schoolList} </ul>;
                resolve();
            }, reject);
        }),
        new Promise<void>((resolve, reject) => {
            onValue(imagesList, (snapshot) => {
                let imageList: Array<string> = Object.values(snapshot.val());
                let imageRef: Array<StorageReference> = imageList.map((element: string) => ref(imageData, element));
                Promise.all(imageRef.map((element: StorageReference, pos: number) => getImageURL(element, pos)))
                .then((result) => {
                    imagesData = <div className="ml-auto -mr-10 w-1/2 p-4 fixed-height"> {result} </div>;
                    resolve();
                })
            }, reject);
        })        
    ])

    return {
        schoolData: schoolData,
        imageData: imagesData
    };
}


const SchoolSection = ({schoolReference, imagesList, imageData}: DatabaseData): React.JSX.Element => {


    const schoolProps: SchoolProps = use(getSchoolData({schoolReference, imagesList, imageData}));
    
    return (
        <div className="p-10">
            <h1 className="titleClass"> School Experience </h1>
            <div className="flex flex-wrap mb-20">
                {schoolProps.schoolData}
                {schoolProps.imageData}
            </div>
        </div>
    );
}

export default SchoolSection;
