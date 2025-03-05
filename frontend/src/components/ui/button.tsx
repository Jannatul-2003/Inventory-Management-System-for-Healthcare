import { Tooltip } from "react-tooltip";
import { Eye, Edit, Trash2 } from "lucide-react";
import React from "react";

const TooltipButton = ({ onClick, tooltipText }) => {
  // Determine the button style and icon based on tooltipText
  let btnClass = "btn-secondary";
  let Icon = Eye; // Default icon

  if (tooltipText.toLowerCase().includes("edit")) {
    btnClass = "btn-primary";
    Icon = Edit;
  } else if (tooltipText.toLowerCase().includes("delete")) {
    btnClass = "btn-danger";
    Icon = Trash2;
  }

  // Generate a unique tooltip ID
  const tooltipId = tooltipText.replace(/\s+/g, "-").toLowerCase();

  return (
    <>
      <button className={`btn btn-sm ${btnClass} mr-3`} onClick={onClick} data-tooltip-id={tooltipId}>
        <Icon size={16} />
      </button>
      <Tooltip id={tooltipId} place="top" content={tooltipText} />
    </>
  );
};

export default TooltipButton;
