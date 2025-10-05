import React from "react";
import { Button } from "../../ui/buttons";
import { TextField, TextArea } from "../../ui/text-field";

function HomePage() {
  return (
    <div>
      <h1>Home Page</h1>
      <Button type="button" style="green">
        Click me
      </Button>
      <TextField type="email" placeholder="email" name="email" style="black">
        Email
      </TextField>
      <TextArea placeholder="Your message" name="message" style="black">
        {" "}
        informacion{" "}
      </TextArea>
    </div>
  );
}

export { HomePage };
