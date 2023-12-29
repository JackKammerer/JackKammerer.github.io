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
        <div className="flex w-1/3 m-5 justify-center">
            <a className= "mx-auto" href={props.link}> {props.name} </a>
        </div>
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
            <h2 className="text-6xl mb-5"> Contact Information </h2>
            <p className="text-xl mb-10"> Feel free to contact me or view my work and activities on any of the links below! </p>
            { contactData }
        </div>
    );
}

export default ContactSection;