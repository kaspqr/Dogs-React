import { memo } from "react";
import { useNavigate } from "react-router-dom";

import useAuth from "../../hooks/useAuth";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";

const Message = ({ message }) => {
  const navigate = useNavigate();
  const { userId } = useAuth();

  if (!message) return;

  return (
    <div style={{
      display: "grid",
      justifyContent: message?.sender === userId ? "flex-end" : "flex-start",
      marginBottom: "5px",
    }}>
      <p id={`time-${message?.id}`} className="message-time" style={{ display: "none" }}>
        {message?.sender !== userId ? (
          <button
            onClick={() => navigate(`/reportmessage/${message?.id}`)}
            className="report-message-button"
          >
            <FontAwesomeIcon color="red" icon={faTriangleExclamation} />
          </button>
        ) : null}
        {message.time.split("T").join(" ").split("Z").join(" ").split(":").slice(0, 2).join(":")}
      </p>
      <p
        id={`message-${message?.id}`}
        style={{
          backgroundColor: message?.sender === userId ? "rgb(235, 155, 52)" : "lightgrey",
          borderRadius: "5px",
          padding: "5px",
          maxWidth: "300px",
          wordWrap: "break-word",
        }}
        className="message-text"
        onClick={(e) => {
          const extraInfoParagraph = document.getElementById("time-" + e.target.id.split("-")[1]);
          extraInfoParagraph.style.display = extraInfoParagraph.style.display === "none" ? "block" : "none"
        }}
      >
        {message?.text}
      </p>
    </div>
  );
};

const memoizedMessage = memo(Message);

export default memoizedMessage;
