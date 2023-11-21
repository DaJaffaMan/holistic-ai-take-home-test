import type { LoaderFunctionArgs } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { Text } from "lucide-react";
import { useState } from "react";
import { Label } from "~/components/ui/label";
import type { ProjecDetails } from "../../models/project/project.sql";
import { fetchProjectDetails } from "../../models/project/project.sql";

export async function loader({ params }: LoaderFunctionArgs) {
  return await fetchProjectDetails(Number(params));
}

export default function CreateProjectDetailsRoute() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [projectDetails, _setProjectDetails] = useState<ProjecDetails>(useLoaderData<typeof loader>());

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
