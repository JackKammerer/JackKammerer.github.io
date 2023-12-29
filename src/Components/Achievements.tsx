'use client';

import React, { useState, useEffect} from "react"
import { onValue, DatabaseReference } from "firebase/database";

interface DatabaseData {
    achievementReference: DatabaseReference;
};


const AchievementsSection = ({achievementReference}: DatabaseData): React.JSX.Element => {
    const [achievementData, setAchievementData] = useState<React.JSX.Element>( <section> Loading... </section>);

    useEffect(() => {
        onValue(achievementReference, (snapshot) => {
            let dataList: Array<string> = Object.values(snapshot.val());
            let achievementList: Array<React.JSX.Element> = dataList.map((element: string, pos: number) => <li key={pos} className="my-5"> {element} </li>);
            setAchievementData(<ul> {achievementList} </ul>);
        });
    }, []);

    return (
        <div className="p-5">
            <h2 className="text-6xl mb-10"> Notable Accomplishments </h2>
            { achievementData }
        </div>
    );
}

export default AchievementsSection;