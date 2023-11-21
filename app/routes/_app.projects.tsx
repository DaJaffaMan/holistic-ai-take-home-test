import { listProjects } from "@/models/project";
import type { Project } from "@/models/project/project.sql";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "~/components/data-table";
import { DataTableColumnHeader } from "~/components/data-table-column-header";
import { buttonVariants } from "~/components/ui/button";

export async function loader() {
  const projects = await listProjects();

  return json({ projects });
}

export default function Projects() {
  const { projects } = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-end">
        <Link to="/create" className={buttonVariants({ variant: "outline" })}>
          Create Project
        </Link>
      </div>

      <DataTable data={projects} columns={columns} />
    </div>
  );
}

const columns: ColumnDef<Project>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            <Link className="text-blue-500 underline" to={`projectDetails/${row.getValue("id")}`}>
              {row.getValue("id")}
            </Link>
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            <Link className="text-blue-500 underline" to={`projectDetails/${row.getValue("name")}`}>
              {row.getValue("name")}
            </Link>
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "filename",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Filename" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("filename")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "summary",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Summary" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[800px] truncate font-medium">
            {row.getValue("summary")}
          </span>
        </div>
      );
    },
  },
];
