import { json } from "@remix-run/node";
import { useLoaderData, Form, useActionData } from "@remix-run/react";
import isURL from "validator/lib/isURL";

const validateURL = (url) => {
  if (!url) return "URL is required";
  if (!isURL(url)) return "URL is not valid";
};

export async function loader() {
  const data = await fetch("http://localhost:3001/links");
  return json(await data.json());
}

export const action = async ({ request }) => {
  let data = Object.fromEntries(await request.formData());

  const formErrors = {
    url: validateURL(data.url),
  };

  if (Object.values(formErrors).some(Boolean)) return { formErrors };

  return await fetch("http://localhost:3001/links", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
};

export default function Index() {
  const links = useLoaderData();
  const actionData = useActionData();

  if (!links) {
    throw new Response("Not found", { status: 404 });
  }

  return (
    <div>
      <p>Bask</p>
      <Form method="post">
        <label>URL:</label>
        <input type="text" name="url" />
        <button type="submit">Submit</button>
        {actionData?.formErrors?.url ? (
          <p style={{ color: "red" }}>{actionData.formErrors.url}</p>
        ) : null}
      </Form>
      <ul>
        {links.map((link) => (
          <li key={link.id}>
            <a href={link.url}>{link.name ?? link.url}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
