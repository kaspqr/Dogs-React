import { useState, useEffect, useRef, useCallback } from 'react'

import Message from "./Message"

const MessagesList = ({ messages }) => {
  const conversationDivRef = useRef(null);

  const [displayedMessagesCount, setDisplayedMessagesCount] = useState(30);
  const [initialMessagesLoaded, setInitialMessagesLoaded] = useState(false);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);

  const handleScroll = useCallback(() => {
    if (conversationDivRef?.current.scrollTop === 0 && hasMoreMessages) {
      const previousScrollHeight = conversationDivRef?.current.scrollHeight;
      const previousScrollTop = conversationDivRef?.current.scrollTop;

      setDisplayedMessagesCount((prevCount) => prevCount + 30);

      setTimeout(() => {
        requestAnimationFrame(() => {
          const newScrollHeight = conversationDivRef?.current.scrollHeight;
          const scrollPositionChange = newScrollHeight - previousScrollHeight;
          conversationDivRef.current.scrollTop =
            previousScrollTop + scrollPositionChange;
        });
      }, 0);
    }
  }, [hasMoreMessages]);

  useEffect(() => {
    if (conversationDivRef?.current && initialMessagesLoaded === false) {
      conversationDivRef.current.scrollTop =
        conversationDivRef.current.scrollHeight;
      setInitialMessagesLoaded(true);
    }
  }, [messages, initialMessagesLoaded]);

  useEffect(() => {
    const divRef = conversationDivRef?.current;

    divRef?.addEventListener("scroll", handleScroll);

    return () => divRef?.removeEventListener("scroll", handleScroll);
  }, [hasMoreMessages, handleScroll]);

  useEffect(() => {
    if (messages?.ids?.length) setHasMoreMessages(displayedMessagesCount < messages?.ids?.length);
  }, [displayedMessagesCount, messages?.ids?.length]);

  useEffect(() => {
    setDisplayedMessagesCount((prevCount) => prevCount + 1);
  }, [messages?.ids?.length]);

  return (
    <div ref={conversationDivRef} className="conversation-page-messages-div">
      {!messages?.ids?.length ? null :
        messages?.ids.slice(-displayedMessagesCount).map((id) => <Message key={id} message={messages?.entities[id]} />)
      }
    </div>
  )
}

export default MessagesList
