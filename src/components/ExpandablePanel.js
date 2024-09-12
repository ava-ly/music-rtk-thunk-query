import { useState } from "react";
import { GoChevronDown, GoChevronLeft } from "react-icons/go";

function ExpandablePanel({ header, children }) {
    const [expanded, setExpanded] = useState(false);

    const handleClick = () => {
        setExpanded(!expanded);
    }

    return (
        <div className="mb-5 border-4 rounded">
            <div className="flex p-2 justify-between items-center bg-gray-200">
                <div className="flex flex-row items-center justify-between">
                    {header}
                </div>

                <div onClick={handleClick} className="cursor-pointer">
                    {expanded ? <GoChevronDown /> : <GoChevronLeft />}
                </div>
            </div>
            {
                expanded && <div className="p-2 border-t">{children}</div>
            }
        </div>
    )
}

export default ExpandablePanel;