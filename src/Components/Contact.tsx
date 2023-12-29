import React from 'react'

interface Contact {
    name: string,
    link: string
}

const ContactComp = (props: Contact): React.JSX.Element => {
    return (
        <div className="flex w-1/3 m-5 justify-center">
            <a className= "mx-auto" href={props.link}> {props.name} </a>
        </div>
    );
}

const ContactSection = (): React.JSX.Element => {
    const contactData: Array<Contact> = [
        {
            name: "LinkedIn",
            link: ""
        },
        {
            name: "Gmail",
            link: ""
        },
        {
            name: "GitHub",
            link: ""
        },
        {
            name: "Twitter",
            link: ""
        }
    ];

    let contactElems: Array<React.JSX.Element> = contactData.map((element: Contact, pos: number) => <ContactComp key={pos} {...element} />);

    return (
        <div className="p-5">
            <h2 className="text-6xl mb-5"> Contact Information </h2>
            <p className="text-xl mb-10"> Feel free to contact me or view my work and activities on any of the links below! </p>
            <ul className="flex flex-wrap justify-center">
                {contactElems}
            </ul>
        </div>
    );
}

export default ContactSection;