export async function isNewUser(token) {
  const operationsDoc = `
  query MyQuery {
    users(where: {issuer: {_eq: "did:ethr:0x7cb7dD72a5755E6073Da9c098F3796e14bde1941"}}) {
      email
      id
      issuer
    }
  }
`;

  const response = await queryHasuraGQL(operationsDoc, "MyQuery", {}, token);

  //check if the user already exists or not
  return response?.users?.length === 0;
}

export async function queryHasuraGQL(
  operationsDoc,
  operationName,
  variables,
  token
) {
  const result = await fetch(process.env.NEXT_PUBLIC_HASURA_ADMIN_URL, {
    method: "POST",
    headers: {
      "x-hasura-admin-secret": process.env.NEXT_PUBLIC_HASURA_ADMIN_SECRET,
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      query: operationsDoc,
      variables: variables,
      operationName: operationName,
    }),
  });

  return await result.json();
}

function fetchMyQuery() {
  return queryHasuraGQL(
    operationsDoc,
    "MyQuery",
    {},
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3N1ZXIiOiJkaWQ6ZXRocjoweDdjYjdkRDcyYTU3NTVFNjA3M0RhOWMwOThGMzc5NmUxNGJkZTE5NDEiLCJwdWJsaWNBZGRyZXNzIjoiMHg3Y2I3ZEQ3MmE1NzU1RTYwNzNEYTljMDk4RjM3OTZlMTRiZGUxOTQxIiwiZW1haWwiOiJtdWhpYmFpdWJAZ21haWwuY29tIiwib2F1dGhQcm92aWRlciI6bnVsbCwicGhvbmVOdW1iZXIiOm51bGwsIndhbGxldHMiOltdLCJpYXQiOjE2ODY2ODE3MzEsImV4cCI6MTY4NzI4NjUzMSwiaHR0cHM6Ly9oYXN1cmEuaW8vand0L2NsYWltcyI6eyJ4LWhhc3VyYS1kZWZhdWx0LXJvbGUiOiJ1c2VyIiwieC1oYXN1cmEtYWxsb3dlZC1yb2xlcyI6WyJ1c2VyIiwiYWRtaW4iXSwieC1oYXN1cmEtdXNlci1pZCI6ImRpZDpldGhyOjB4N2NiN2RENzJhNTc1NUU2MDczRGE5YzA5OEYzNzk2ZTE0YmRlMTk0MSJ9fQ.g5HTrnj86YhMOXicDFw2DsaId6Gw8mNkcmEqaKUIY_U"
  );
}

export async function startFetchMyQuery() {
  const { errors, data } = await fetchMyQuery();

  if (errors) {
    // handle those errors like a pro
    console.error(errors);
  }

  // do something great with this precious data
  console.log(data);
}

startFetchMyQuery();
