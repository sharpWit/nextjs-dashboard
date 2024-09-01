import React from "react";
import ChatComponent from "./component/chat-component";

const page = () => {
  return (
    <section className="max-w-md bg-slate-300 w-full mx-auto p-2 pt-6 flex flex-col space-y-2 items-center">
      <h1>WebSocket Page</h1>
      <div>
        <ChatComponent />
      </div>
    </section>
  );
};

export default page;
