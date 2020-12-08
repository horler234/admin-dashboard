import React, { useRef } from "react";
import EmailEditor from "react-email-editor";

import PageTitle from "../components/Typography/PageTitle";
import { Button } from "@windmill/react-ui";

function MailUser() {
  const emailEditorRef = useRef(null);

  const exportHtml = () => {
    emailEditorRef.current.editor.exportHtml((data) => {
      const { design, html } = data;
      console.log("exportHtml", html);
    });
  };

  const onLoad = () => {
    // you can load your template here;
    // const templateJson = {};
    // emailEditorRef.current.editor.loadDesign(templateJson);
  };

  return (
    <div>
      <PageTitle>Mail User</PageTitle>
      <div className="flex-1">

      <EmailEditor ref={emailEditorRef} onLoad={onLoad} />
      </div>
      <div className="mx-auto my-5">
        <Button onClick={exportHtml} block>
          Export
        </Button>
      </div>
    </div>
  );
}

export default MailUser;
