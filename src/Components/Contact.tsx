'use client';

import React, { useState, useEffect} from "react";
import LoadingElement from "@/Components/Loading";
import { onValue, DatabaseReference } from "firebase/database";
import { StorageReference, ref, FirebaseStorage, getDownloadURL } from "firebase/storage";

interface Contact {
    name: string,
    link: string,
    image: string
}

interface ContactCompInputs {
    contact: Contact,
    imageBase: FirebaseStorage
}

interface DatabaseData {
    contactReference: DatabaseReference;
    imageDatabase: FirebaseStorage;
}


const ContactComp = ({contact, imageBase}: ContactCompInputs ): React.JSX.Element => {
    let imageRef: StorageReference = ref(imageBase, contact.image);
    
    const [imageData, setImageData] = useState<React.JSX.Element>( <LoadingElement />)
    useEffect(()=> {
        async function getImageURL(referenceValue: StorageReference) {
            let url:string = await getDownloadURL(referenceValue);
            setImageData(<img className="h-full" src={url}></img>);
        }
        getImageURL(imageRef);
    }, []);
    
    return (
        <a data-content={contact.name} className="flex relative w-1/6 h-16 m-5 p-2 rounded-xl justify-center border-solid border-slate-600 border-4 contact-button hover:border-sky-300 after:bg-blue-700 after:w-full after:h-24 after:text-white after:absolute after:top-0 after:left-0 after:content-[attr(data-content)] after:transition-all duration-125 after:translate-y-full after:hover:translate-y-0 overflow-hidden after:flex after:justify-center after:object-center after:py-4" href={contact.link}>
            {imageData}
        </a>
    );
}

const ContactSection = ({contactReference, imageDatabase}: DatabaseData): React.JSX.Element => {
    const [contactData, setContactData] = useState<React.JSX.Element>(<LoadingElement />);

    useEffect(() => {
        onValue(contactReference, (snapshot) => {
            let dataList: Array<Contact> = Object.values(snapshot.val());
            let contactList: Array<React.JSX.Element> = dataList.map((element: Contact, pos: number) => <ContactComp key={pos} contact={element} imageBase={imageDatabase} />);
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