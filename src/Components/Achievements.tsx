'use client';

import React, { useState, useEffect, use} from "react";
import { onValue, DatabaseReference } from "firebase/database";
import { FirebaseStorage, ref, StorageReference, getDownloadURL } from "firebase/storage";
import { achievementDataReference,
        imagesListLeft,
        imagesListRight,
        storage } from "@/app/firebase";

interface DatabaseData {
    achievementDataReference: DatabaseReference;
    imagesListLeft: DatabaseReference;
    imagesListRight: DatabaseReference;
    storage: FirebaseStorage;
};

interface AchievementProps {
    achievementData: React.JSX.Element;
    leftImages: Array<React.JSX.Element>;
    rightImages: Array<React.JSX.Element>;
    leftRefs: Array<React.RefObject<HTMLImageElement>>;
    rightRefs: Array<React.RefObject<HTMLImageElement>>;
};

async function getAchievementData({achievementDataReference, imagesListLeft, imagesListRight, storage}: DatabaseData): Promise<AchievementProps> {
    let achievementData: React.JSX.Element = <></>;
    let leftImages: Array<React.JSX.Element> = [];
    let rightImages: Array<React.JSX.Element> = [];
    let leftRefs: Array<React.RefObject<HTMLImageElement>> = [];
    let rightRefs: Array<React.RefObject<HTMLImageElement>> = [];

    
    await Promise.all ([
        new Promise<void>((resolve, reject) => {
            onValue(achievementDataReference, (snapshot) => {
                let dataList: Array<string> = Object.values(snapshot.val());
                let achievementList: Array<React.JSX.Element> = dataList.map((element: string, pos: number) => <li key={pos} className="my-10 w-3/4 text-center"> {element} </li>);
                achievementData = <ul className="w-5/12 list-none flex justify-center align-center flex-wrap"> {achievementList} </ul>;
                resolve();
            }, reject);
        }),
        new Promise<void>((resolve, reject) => {
            onValue(imagesListLeft, (snapshot) => { 
                let dataList: Array<string> = Object.values(snapshot.val());
                let imageList: Array<Promise<React.JSX.Element>> = dataList.map((element: string, pos: number) => {
                    let imageReference: StorageReference = ref(storage, element);
                    return (getDownloadURL(imageReference).then((url) => {
                        let reactRef: React.RefObject<HTMLImageElement> = React.createRef<HTMLImageElement>();
                        leftRefs.push(reactRef);
                        return (
                            <img key={pos} ref={reactRef} className="hidden-image-left h-1/4 -z-10 my-10 border-solid border-slate-400 border-4 side-margin bg-white" src={url}></img>
                        );
                    }));
                });
                Promise.all(imageList).then((values) => {
                    leftImages = values;
                    resolve();
                });
            }, reject);
        }),
        new Promise<void>((resolve, reject) => {
            onValue(imagesListRight, (snapshot) => { 
                let dataList: Array<string> = Object.values(snapshot.val());
                let imageList: Array<Promise<React.JSX.Element>> = dataList.map((element: string, pos: number) => {
                    let imageReference: StorageReference = ref(storage, element);
                    return (getDownloadURL(imageReference).then((url) => {
                        let reactRef: React.RefObject<HTMLImageElement> = React.createRef<HTMLImageElement>();
                        rightRefs.push(reactRef);
                        return (
                            <img key={pos} ref={reactRef} className="hidden-image-right h-1/4 -z-10 my-10 border-solid border-slate-400 border-4 side-margin bg-white" src={url}></img>
                        );
                    }));
                });
                Promise.all(imageList).then((values) => {
                    rightImages = values;
                    resolve();
                });
            }, reject);
        })
    ])

    return {
        achievementData: achievementData,
        leftImages: leftImages,
        rightImages: rightImages,
        leftRefs: leftRefs,
        rightRefs: rightRefs
    };
}

const AchievementsSection = (): React.JSX.Element => {
    
    const achievementProps = use(getAchievementData({achievementDataReference, imagesListLeft, imagesListRight, storage}));

    const [leftRefs, setLeftRefs] = useState<Array<React.RefObject<HTMLImageElement>>>(achievementProps.leftRefs);
    const [rightRefs, setRightRefs] = useState<Array<React.RefObject<HTMLImageElement>>>(achievementProps.rightRefs);


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
                    { achievementProps.leftImages }
                </section>
                { achievementProps.achievementData }
                <section className="w-1/4 flex justify-center flex-wrap">
                    { achievementProps.rightImages }
                </section>
            </div>
        </div>
    );
}

export default AchievementsSection;