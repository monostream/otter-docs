# 🦦 Otter Docs – powerful context-aware Documentation

> Open-sourced by the team at [Monostream](https://monostream.com)

Otter Docs is a context-aware documentation system, supporting dynamic variable injection. The documentation content is written in Markdown and lives in a separate Git repository. This allows non-technical users to write documentation without having to worry about the implememtation and deployment. The Otter Docs server monitors this Git repository and automatically publishes changes made to the content in realtime. 

## Features

Otter Docs supports…

* a flexible event API to interact add context-awareness
* dynamic variables injection from host app
* default values for variables
* dynamic nav and sidebar generation
* full Markdown support with source-code highlighting

## Build & Run Locally

To run the Otter Docs Server locally you can choose between Docker or Go. 

### Go

Build and run the go source-code locally with the following command.

```
go build .
./otter-docs
```

### Docker

If you have docker installed on your system, you can use the following command to build and run the source-code. Environment variables can be configured in a `.env` file in the root of the project.

```bash
docker build . -t otter-docs
docker run -p 8080:8080 -it --env-file ./.env --rm otter-docs
```

## Configuration

| Name       | Default | Description                                                                                  | Required |
|------------|---------|----------------------------------------------------------------------------------------------|----------|
| GIT_URL    |         | URL to the content git repository. Example: https://username:password@example.org/myRepo.git | Yes      |
| GIT_BRANCH | main    |                                                                                              | No       |

