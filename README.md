![otter docs logo](./logo.png)

# 🦦 Otter Docs – Powerful, Context-Aware Documentation

> Open-sourced by the team at [Monostream](https://monostream.com)

Otter Docs is a context-aware documentation framework, featuring dynamic variable injection and a simple, yet powerful event API.

The documentation content is written in Markdown and lives in a separate Git repository. This allows a clear separation between content and technical implementation, and enables non-technocal users to write documentation without having to worry about implememtation and deployment. Changes made to the content Git repository are automatically published. 

It's written in Go, TypeScript and builds upon the awesome [VuePress](https://github.com/vuejs/vuepress/) project.

## Features

Otter Docs supports…

* a simple, yet powerful event API
* dynamic variables injection from host app
* default values for variables
* dynamic navigation and sidebar generation
* full Markdown support with source-code highlighting

## Navigation and Sidebar

TODO

## Development

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

## Architecture

### Go Server

Tasks:
* Watch git repository for changes
* Trigger rebuild
* Serve docs

### Node Application

Tasks:
* Dynamically generate navigation and sidebar structure
* Parse and sanatize `config.json`
* Apply `config.json`
* Render Markdown to HTML

### JavaScript Client Application

Tasks:
* Listen for Events from host application
* Parse path binding Regexp
* Handle navigation

## Context-aware Integration

Otter Docs can be deployed as a context-aware documentaion, living in a sidebar of another application (called "host application"). The Event API enables bi-directional communication between the two applications. This API informs Otter Docs about the currently active page in the host application. This can be useful to show relevant documentation articles to the user.

![Otter Docs Integration](./integration.drawio.png)

### Path Binding

Path bindings between the host application and Otter Docs can be defined in a file called `__bindings.json` living in the project root of the content repository.

```json 
{
  "/path-in-host-app": "/docs-path"
}
```

## Custom Theme

```json 
{
  "/path-in-host-app": "/docs-path"
}
```


## Configuration

The following environment varaibles are available to configure Otter-Docs server.

| Name       | Default | Description                                                                                  | Required |
|------------|---------|----------------------------------------------------------------------------------------------|----------|
| GIT_URL    | _None_  | URL to the content git repository. Example: https://username:password@example.org/myRepo.git | Yes      |
| GIT_BRANCH | main    |                                                                                              | No       |

