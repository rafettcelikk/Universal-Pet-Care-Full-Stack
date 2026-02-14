import React from "react";
import { Button } from "react-bootstrap";

const ActionButtons = ({
  title,
  variant,
  onClick,
  disabled,
  className = "",
}) => {
  return (
    <Button
      variant={variant}
      size="sm"
      onClick={onClick}
      disabled={disabled}
      className={className}
    >
      {title}
    </Button>
  );
};

export default ActionButtons;
