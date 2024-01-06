import SchoolSection from "@/Components/School"
import ProjectsSection from '@/Components/Projects'
import ContactSection from '@/Components/Contact'
import IntroductionSection from '@/Components/Introduction'
import GithubProjectsSection from '@/Components/GithubProjects'
import React from "react"

import dynamic from 'next/dynamic';

const Navbar = dynamic(() => import('@/Components/Navbar'), { ssr: false });
const AchievementsSection = dynamic(() => import('@/Components/Achievements'), { ssr: false });
const WorkSection = dynamic(() => import('@/Components/Work'), { ssr: false });
const ToolsSection = dynamic(() => import('@/Components/Tools'), { ssr: false });

import { schoolDataReference, 
        projectDataReference, 
        contactDataReference, 
        schoolImageReference,
        storage
      } from "@/app/firebase";


export default function Home() {
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
          <AchievementsSection/>
        </section>
        <section id="work" className="secondary-back w-full ml-auto mr-auto mb-20">
          <WorkSection />
        </section>
        <section className="w-full ml-auto mr-auto mb-20" >
          <GithubProjectsSection />
        </section>        
        <section id="projects" className="secondary-back w-full ml-auto mr-auto mb-20">
          <ProjectsSection projectReference={projectDataReference} imageDatabase={storage}/>
        </section>
        <section id="tools" className="w-11/12 ml-auto mr-auto mb-20">
          <ToolsSection />
        </section>
        <section id="contact" className="secondary-back w-full">
          <ContactSection contactReference={contactDataReference} imageDatabase={storage}/>
        </section>
      </div>
    </div>
  )
}
