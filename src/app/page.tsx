'use client';

import Navbar from "@/Components/Navbar"
import SchoolSection from "@/Components/School"
import WorkSection from '@/Components/Work'
import ProjectsSection from '@/Components/Projects'
import AchievementsSection from '@/Components/Achievements'
import ContactSection from '@/Components/Contact'
import IntroductionSection from '@/Components/Introduction'
import GithubProjectsSection from '@/Components/GithubProjects'
import ToolsSection from '@/Components/Tools'
import React from "react"


import { FirebaseApp, initializeApp } from "firebase/app";
import { getDatabase, ref, Database, DatabaseReference } from "firebase/database";
import { getStorage, FirebaseStorage } from "firebase/storage";

export default function Home() {
  const firebaseConfig: any = {
    apiKey: process.env.NEXT_PUBLIC_FIRE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_APP_ID,
    databaseURL: process.env.NEXT_PUBLIC_DATA_URL
  };

  const app: FirebaseApp = initializeApp(firebaseConfig);
  const db: Database = getDatabase(app); 
  const storage: FirebaseStorage = getStorage(app);

  const schoolDataReference: DatabaseReference = ref(db, 'schoolData');
  const workDataReference: DatabaseReference = ref(db, 'workData');
  const projectDataReference: DatabaseReference = ref(db, 'projectData');
  const achievementDataReference: DatabaseReference = ref(db, 'achievementData');
  const toolDataReference: DatabaseReference = ref(db, 'toolData');
  const contactDataReference: DatabaseReference = ref(db, 'contactData');

  const schoolImageReference: DatabaseReference = ref(db, 'schoolImages');
  const leftAchievementImagesReference: DatabaseReference = ref(db, 'leftAchievementImages');
  const rightAchievementImagesReference: DatabaseReference = ref(db, 'rightAchievementImages');



  return (
    <div>
      <Navbar />

      <div id="introduction" className="pt-40">
        <section>
          <IntroductionSection />
        </section>
        <section id="school" className="secondary-back w-full ml-auto mr-auto mb-20">
          <SchoolSection schoolReference={schoolDataReference} imagesList={schoolImageReference} imageData={storage}/>
        </section>
        <section id="achievements" className="w-full ml-auto mr-auto mb-20">
          <AchievementsSection achievementReference={achievementDataReference} imagesListLeft={leftAchievementImagesReference} imagesListRight={rightAchievementImagesReference} imageData={storage}/>
        </section>
        <section id="work" className="w-full ml-auto mr-auto mb-20">
          <WorkSection workReference={workDataReference} />
        </section>
        <section id="projects" className="secondary-back w-full ml-auto mr-auto mb-20">
          <ProjectsSection projectReference={projectDataReference} imageDatabase={storage}/>
        </section>
        <section className="w-full ml-auto mr-auto mb-20" >
          <GithubProjectsSection />
        </section>
        <section id="tools" className="w-11/12 ml-auto mr-auto mb-20">
          <ToolsSection toolReference={toolDataReference}/>
        </section>
        <section id="contact" className="secondary-back w-full">
          <ContactSection contactReference={contactDataReference} imageDatabase={storage}/>
        </section>        
      </div>
    </div>
  )
}
