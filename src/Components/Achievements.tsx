'use client';

import React, { useState, useEffect} from "react";
import { onValue, DatabaseReference } from "firebase/database";
import { FirebaseStorage, ref, StorageReference, getDownloadURL } from "firebase/storage";
import LoadingElement from "@/Components/Loading";

interface DatabaseData {
    achievementReference: DatabaseReference;
    imagesListLeft: DatabaseReference;
    imagesListRight: DatabaseReference;
    imageData: FirebaseStorage;
};


const AchievementsSection = ({achievementReference, imagesListLeft, imagesListRight, imageData}: DatabaseData): React.JSX.Element => {
    const [achievementData, setAchievementData] = useState<React.JSX.Element>( <LoadingElement />);
    const [leftImages, setleftImages] = useState<Array<React.JSX.Element>>( []);
    const [rightImages, setrightImages] = useState<Array<React.JSX.Element>>( []);


    const [leftRefs, setLeftRefs] = useState<Array<React.RefObject<HTMLImageElement>>>([]);
    const [rightRefs, setRightRefs] = useState<Array<React.RefObject<HTMLImageElement>>>([]);

    useEffect(() => {
        onValue(achievementReference, (snapshot) => {
            let dataList: Array<string> = Object.values(snapshot.val());
            let achievementList: Array<React.JSX.Element> = dataList.map((element: string, pos: number) => <li key={pos} className="my-10 w-3/4 text-center"> {element} </li>);
            setAchievementData(<ul className="w-5/12 list-none flex justify-center align-center flex-wrap"> {achievementList} </ul>);
        });

        onValue(imagesListLeft, (snapshot) => { 
            let refList: Array<React.RefObject<HTMLImageElement>> = [];
            let dataList: Array<string> = Object.values(snapshot.val());
            let imageList: Array<Promise<React.JSX.Element>> = dataList.map((element: string, pos: number) => {
                let imageReference: StorageReference = ref(imageData, element);
                return (getDownloadURL(imageReference).then((url) => {
                    let reactRef: React.RefObject<HTMLImageElement> = React.createRef<HTMLImageElement>();
                    refList.push(reactRef);
                    return (
                        <img key={pos} ref={reactRef} className="hidden-image-left h-1/4 -z-10 my-10 border-solid border-slate-400 border-4 side-margin bg-white" src={url}></img>
                    );
                }));
            });
            Promise.all(imageList).then((values) => {
                setleftImages( values );
                setLeftRefs(refList);
            });
        });

        onValue(imagesListRight, (snapshot) => { 
            let refList: Array<React.RefObject<HTMLImageElement>> = [];
            let dataList: Array<string> = Object.values(snapshot.val());
            let imageList: Array<Promise<React.JSX.Element>> = dataList.map((element: string, pos: number) => {
                let imageReference: StorageReference = ref(imageData, element);
                return (getDownloadURL(imageReference).then((url) => {
                    let reactRef: React.RefObject<HTMLImageElement> = React.createRef<HTMLImageElement>();
                    refList.push(reactRef);
                    return (
                        <img key={pos} ref={reactRef} className="hidden-image-right h-1/4 -z-10 my-10 border-solid border-slate-400 border-4 side-margin bg-white" src={url}></img>
                    );
                }));
            });
            Promise.all(imageList).then((values) => {
                setrightImages( values );
                setRightRefs(refList);
            });
        });
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting && entry.target.classList.contains("hidden-image-right")) {
                    entry.target.classList.add("shown-image-right");
                } else if (entry.isIntersecting && entry.target.classList.contains("hidden-image-left")) {
                    entry.target.classList.add("shown-image-left");
                }
            });
        }); 

        leftRefs.forEach((ref) => {
            if (ref.current) {
                observer.observe(ref.current);
            }
        });

        rightRefs.forEach((ref) => {
            if (ref.current) {
                observer.observe(ref.current);
            }
        });

        return () => {
            leftRefs.forEach((ref) => {
                if (ref.current) {
                    observer.unobserve(ref.current);
                }
            });

            rightRefs.forEach((ref) => {
                if (ref.current) {
                    observer.unobserve(ref.current);
                }
            });
        }
    }, [leftRefs, rightRefs]);



    return (
        <div className="p-5 flex justify-center flex-wrap">
            <h2 className="text-6xl mb-10"> Academic and Professional Accomplishments </h2>
            <div className="flex flex-wrap justify-center object-center">
                <section className="w-1/4 flex justify-center flex-wrap">
                    { leftImages }
                </section>
                { achievementData }
                <section className="w-1/4 flex justify-center flex-wrap">
                    { rightImages }
                </section>
            </div>
        </div>
    );
}

export default AchievementsSection;