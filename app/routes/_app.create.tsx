import { redirect, type ActionFunctionArgs } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import invariant from "tiny-invariant";
import { createProject } from "@/models/project";
import AwsS3 from "@uppy/aws-s3";
import type { UppyFile } from "@uppy/core";
import Uppy from "@uppy/core";
import { Dashboard } from "@uppy/react";
import { useState } from "react";
import { XIcon } from "lucide-react";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  const name = formData.get("name");
  const filename = formData.get("filename");

  invariant(typeof name === "string", "name is required");
  invariant(typeof filename === "string", "filename is required");

  const createdProjectId = await createProject({ name, filename });

  await fetch("https://d7qe7ky466.execute-api.us-east-1.amazonaws.com", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ projectId: createdProjectId, filename }),
  });

  return redirect("/projects");
}
const uppy = new Uppy().use(AwsS3);

export default function CreateProjectRoute() {
  const [filename, setFilename] = useState("");

  uppy.getPlugin("AwsS3")?.setOptions({
    async getUploadParameters(file: UppyFile) {
      const { signedUrl } = await fetch("/presigned-url", {
        method: "POST",
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type,
        }),
      }).then((x) => x.json());

      return {
        url: signedUrl,
        method: "PUT",
        headers: {
          "Content-Type": file.type,
        },
        fields: {
          Key: file.name,
        },
        shouldUseMultipart: true,
      };
    },
  });

  uppy.on("complete", (res) => {
    setFilename((res.successful[0] as any).data.name);
  });

  return (
    <div className="max-w-2xl">
      <Form className="flex flex-col gap-4 max-w-2xl" method="post" id="project-form">
        <div className="flex flex-col gap-4">
          <div>
            <Label className="text-base">Create new project</Label>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="name" className="font-normal">
              Name
            </Label>
            <Input required id="name" name="name" />
          </div>
        </div>

        {filename ? null : <Dashboard uppy={uppy} height={200} />}

        {filename ? (
          <div className="flex flex-col gap-2">
            <Label className="font-normal">Filename</Label>
            <div>
              <input required readOnly type="text" value={filename} name="filename" />
              <Button variant="ghost" onClick={() => setFilename("")} className="h-8 px-2 lg:px-3">
                Clear
                <XIcon className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : null}
        <div>
          <Button type="submit">Submit</Button>
        </div>
      </Form>
    </div>
  );
}
