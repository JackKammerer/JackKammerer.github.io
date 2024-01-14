import React, {use} from "react";
import { onValue, DatabaseReference } from "firebase/database";
import { StorageReference, ref, FirebaseStorage, getDownloadURL } from "firebase/storage";
import Image from 'next/image';

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

async function getImage(referenceValue: StorageReference): Promise<React.JSX.Element> {
    let url:string = await getDownloadURL(referenceValue);
    return <img className="h-full z-20" src={url} alt=""/>;
}

const ContactComp = ({contact, imageBase}: ContactCompInputs ): React.JSX.Element => {
    let imageRef: StorageReference = ref(imageBase, contact.image);
    
    const imageData = use(getImage(imageRef));
    
    return (
        <div className="flex flex-wrap relative w-1/6 m-5 justify-center contact-class">
            <span className="absolute z-20 mx-auto bg-sky-300 text-slate-600 p-2 rounded-3xl pointer-events-none before:content-[''] before:w-5 before:h-5 before:transform before:rotate-45 before:absolute before:-bottom-2 before:right-1/2 before:-z-10 before:bg-sky-300 opacity-0"> {contact.name} </span>
            <a className="flex relative w-full h-16 p-2 rounded-xl justify-center border-solid border-slate-600 border-4 contact-button hover:border-sky-300 after:bg-blue-700 after:w-full after:h-24 after:text-white after:absolute after:top-0 after:left-0 after:content-[''] after:transition-all duration-125 after:translate-y-full after:hover:translate-y-0 after:flex after:justify-center after:object-center after:py-4 after:z-10 overflow-hidden" href={contact.link}>
                {imageData}
            </a>
        </div>
    );
}

async function contactProps({contactReference, imageDatabase}: DatabaseData): Promise<React.JSX.Element> {
    let contactProp: React.JSX.Element = <></>;
    
    new Promise<void>((resolve, reject) => {
        onValue(contactReference, (snapshot) => {
            let dataList: Array<Contact> = Object.values(snapshot.val());
            let contactList: Array<React.JSX.Element> = dataList.map((element: Contact, pos: number) => <ContactComp key={pos} contact={element} imageBase={imageDatabase} />);
            contactProp = <ul className="flex flex-wrap justify-center"> {contactList} </ul>;
            resolve();
        }, reject);
    });

    return contactProp;
}

const ContactSection = ({contactReference, imageDatabase}: DatabaseData): React.JSX.Element => {
    const contactData = use(contactProps({contactReference, imageDatabase}));

    return (
        <div className="p-5">
            <h2 className="titleClass"> Contact Information </h2>
            <p className="text-xl -mt-10 mb-10"> Feel free to contact me or view my work and activities on any of the links below! </p>
            { contactData }
        </div>
    );
}

export default ContactSection;