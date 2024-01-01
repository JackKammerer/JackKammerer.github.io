import React, { useState, useEffect } from "react";
import { Link } from "react-scroll"


interface buttonInput {
    text: string;
}

const SearchButtons = (props: buttonInput): React.JSX.Element => {
    let linkText: string = props.text.toLowerCase();
    let displayText: string = props.text + "/";
    return (
        <Link to={linkText} duration={500} smooth={true}>
            <div className="m-3 p-2 rounded-xl cursor-pointer transform hover:scale-125 before:absolute before:top-0 before:left-0 before:w-full before:h-full before:bg-gradient-to-r before:from-transparent before:to-indigo-600 before:transition-all duration-125 before:-z-10 before:translate-x-full before:hover:translate-x-0 overflow-hidden"> 
                {displayText} 
            </div>
        </Link>
    );
}

const Navbar = (): React.JSX.Element => {
    const [visible, setVisible] = useState<boolean>(true);
    const [mouseVisible, setMouseVisible] = useState<boolean>(false);
    const [prevScrollPos, setPrevScrollPos] = useState<number>(typeof window !== 'undefined' ? window.scrollY : 0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollPos: number = window.scrollY;
            const visible: boolean = prevScrollPos > currentScrollPos;
            setPrevScrollPos(currentScrollPos);
            setVisible(visible);
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        }
    }, [prevScrollPos]);

    let array: Array<string> = ["Introduction", "School", "Work", "Projects", "Tools", "Contact"];
    let returnArray: Array<React.JSX.Element> = array.map((element:string, pos: number) => <SearchButtons key={pos} text={element} />);

    return (
        <div onMouseEnter={() => setMouseVisible(true)} onMouseLeave={() => setMouseVisible(false)} className="fixed object-left-top w-full h-32 z-50">
            <div className={`${visible || mouseVisible ? 'translate-y-0': '-translate-y-full'} flex transform duration-500 ease-out flex-wrap fixed align-middle object-left-top p-5 w-screen bg-gradient-to-b from-blue-600 to-transparent`}>
                <h1 className="text-6xl mr-auto"> JackKammerer.com </h1>
                <div className="flex ml-auto flex-wrap">
                    {returnArray}
                </div>
            </div>
        </div>
    );
}

export default Navbar;