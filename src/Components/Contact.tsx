'use client';

import React, { useState, useEffect} from "react"
import { onValue, DatabaseReference } from "firebase/database";

interface Contact {
    name: string,
    link: string
}

interface DatabaseData {
    contactReference: DatabaseReference;
}

const ContactComp = (props: Contact): React.JSX.Element => {
    return (
        <a className="flex relative w-1/6 m-5 p-2 rounded-xl justify-center border-solid border-slate-600 border-4 contact-button overflow-hidden hover:border-sky-300" href={props.link}> {props.name} </a>
    );
}

const ContactSection = ({contactReference}: DatabaseData): React.JSX.Element => {
    const [contactData, setContactData] = useState<React.JSX.Element>( <section> Loading... </section>);

    useEffect(() => {
        onValue(contactReference, (snapshot) => {
            let dataList: Array<Contact> = Object.values(snapshot.val());
            let contactList: Array<React.JSX.Element> = dataList.map((element: Contact, pos: number) => <ContactComp key={pos} {...element} />);
            setContactData(<ul className="flex flex-wrap justify-center"> {contactList} </ul>);
        });
    }, []);


    return (
        <div className="p-5">
            <h2 className="titleClass"> Contact Information </h2>
            <p className="text-xl -mt-10 mb-10"> Feel free to contact me or view my work and activities on any of the links below! </p>
            { contactData }
        </div>
    );
}

export default ContactSection;