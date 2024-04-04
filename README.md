# MongoDB Atlas Demo

This repository demonstrates how to connect to MongoDB Atlas from a subgraph and make the data available via the Router. It demonstrates how you could in theory expose a MongoDB-like filter that is passed directly to MongoDB for filtering down returned data as well as a more demand-driven approach of using specific graphql arguments.

## Running the Example

1. Make a copy of `subgraph/.env.sample` to `subgraph/.env` and update the `MONGO_CONNECTION_STRING` with your connection string.
1. Run the subgraph from the `/subgraph` directory with `npm run dev`
1. In the `/router` directory, download the router by running `./download_router.sh`
1. In the `/router` directory, compose the schema by running `./create_local_schema.sh`
1. In the `/router` directory, run the router by running `./start_router.sh`

You can now open the Router at http://127.0.0.1:4000/ and start querying.

## Example Queries

### Basic

```
query Basic {
  patients {
    firstName
    lastName
    patientId
  }
}
```

### With Arguments

```
query WithWhere ($where: JSONObject) {
  patients(where: $where) {
    firstName
    lastName
    patientId
  }
}
```

Variables:

```
{
  "where": { "patientId": { "_eq": 1 } }
}
```

### Complex Filter

```
query WhereMore($where: JSONObject) {
  patients(where: $where) {
    firstName
    lastName
  }
}
```

Variables:

```
{
  "where": {
    "_and": [
      { "sex": { "_eq": "Female" }},
      { "healthState.diabetes": { "_eq": true }}
    ]
  }
}
```

### Single Patient (Demand Driven Design)

```
query Patient($patientId: ID!) {
  patient(patientId: $patientId) {
    firstName
    lastName
    patientId
  }
}
```

Variables:

```
{
  "patientId": 1
}
```
