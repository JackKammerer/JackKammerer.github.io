import React from "react";
import { Link } from "react-scroll"


interface buttonInput {
    text: string;
}

const SearchButtons = (props: buttonInput): React.JSX.Element => {
    let linkText: string = props.text.toLowerCase();
    let displayText: string = props.text + "/";
    return (
        <Link to={linkText} duration={500} smooth={true} offset={-100}>
            <div before={displayText} className="m-3 cursor-pointer transform hover:scale-125 after:content-[attr(before)] after:font-bold after:h-0 after:hidden after:relative"> 
                {displayText} 
            </div>
        </Link>
    );
}
const Navbar = (): React.JSX.Element => {
    let array: Array<string> = ["Introduction", "School", "Work", "Projects", "Achievements", "Contact"];
    let returnArray: Array<React.JSX.Element> = array.map((element:string, pos: number) => <SearchButtons key={pos} text={element} />);

    return (
        <div className="flex flex-wrap fixed justify-start object-left-top p-5 w-screen bg-gradient-to-b from-blue-600 to-transparent">
            <h1 className="text-6xl mr-auto"> JackKammerer.com </h1>
            <div className="flex ml-auto flex-wrap">
                {returnArray}
            </div>
        </div>
    );
}

export default Navbar;