import type { LoaderFunctionArgs } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { Text } from "lucide-react";
import { useState } from "react";
import { Label } from "~/components/ui/label";
import { fetchProjectDetails } from "../../models/project";
import type { ProjectDetails } from "../../models/project/projectDetails.sql";

export async function loader({ params }: LoaderFunctionArgs) {
  const response = await fetchProjectDetails(Number(params.projectId));

  console.log(response)

  return response;
}

export default function CreateProjectDetailsRoute() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [projectDetails, _setProjectDetails] = useState<ProjectDetails>(useLoaderData<typeof loader>());

  return (
    <div className="max-w-2xl">
      <Form className="flex flex-col gap-4 max-w-2xl" method="post" id="project-form">
        {projectDetails ? (
          <div className="flex flex-col gap-2">
            <Label className="font-normal" htmlFor="details">
              Details
            </Label>
            <Text>{projectDetails.details}</Text>
          </div>
        ) : null}
      </Form>
    </div>
  );
}
