import React, { CSSProperties } from "react";

interface BackButtonProps {
  content: string;
  click: () => void;
}

const middleInlineStyle: CSSProperties = {
  verticalAlign: "middle",
  cursor: "pointer"
};

export const BackButton: React.FC<BackButtonProps> = ({ content, click }) => (
  <span
    style={{ display: "inline-block", ...middleInlineStyle }}
    onClick={click}
  >
    <i className="fas fa-arrow-left" style={middleInlineStyle} />
    <span style={middleInlineStyle}> {content}</span>
  </span>
);

interface DeleteButtonProps {
  click: () => void;
}

export const DeleteButton: React.FC<DeleteButtonProps> = ({ click }) => (
  <button className="delete" aria-label="close" onClick={click} />
);

interface ButtonGroupProps {
  connected?: boolean;
  alignment?: "is-centered" | "is-right";
}

export const ButtonGroup: React.FC<ButtonGroupProps> = ({
  connected,
  alignment,
  children
}) => (
  <div
    className={["buttons", alignment, connected ? "has-addons" : null]
      .filter(x => !!x)
      .join(" ")}
  >
    {children}
  </div>
);
