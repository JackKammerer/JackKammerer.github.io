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
import { getStorage, StorageReference, FirebaseStorage } from "firebase/storage";

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



  return (
    <div>
      <Navbar />

      <div id="introduction" className="pt-40">
        <section>
          <IntroductionSection />
        </section>
        <section id="school" className="secondary-back w-full ml-auto mr-auto mb-20">
          <SchoolSection schoolReference={schoolDataReference}/>
        </section>
        <section id="work" className="w-full ml-auto mr-auto mb-20">
          <WorkSection workReference={workDataReference} />
        </section>
        <section id="projects" className="secondary-back w-full ml-auto mr-auto mb-20">
          <ProjectsSection projectReference={projectDataReference}/>
        </section>
        <section className="w-full ml-auto mr-auto mb-20" >
          <GithubProjectsSection />
        </section>
        <section className="w-11/12 ml-auto mr-auto mb-20">
          <ToolsSection toolReference={toolDataReference}/>
        </section>
        <section id="achievements" className="w-11/12 ml-auto mr-auto mb-20">
          <AchievementsSection achievementReference={achievementDataReference}/>
        </section>
        <section id="contact" className="secondary-back w-full">
          <ContactSection contactReference={contactDataReference}/>
        </section>        
      </div>
    </div>
  )
}
