# 🦦 Otter Docs – Powerful, Context-Aware Documentation

> Open-sourced by the team at [Monostream](https://monostream.com)

Otter Docs is a context-aware documentation framework, featuring dynamic variable injection and a simple, yet powerful event API.

<p align="center">
  <img alt="otter docs logo" src="./logo.png" width="500" />
</p>

The documentation content is written in Markdown and lives in a Git repository. This enables non-technocal users to write documentation without having to worry about implememtation and deployment. Changes made to the content Git repository are automatically published by Otter Docs. 

Otter Docs is written in Go, TypeScript and builds upon the awesome [VuePress](https://github.com/vuejs/vuepress/) project.

## Features

* [Clear Separation of Concerns: Content vs. Technical Details](#content-repository)
* [Simple, yet powerful Event API](#event-api)
  * dynamic variables injection from host app
  * default values for variables
* [Automatic Navigation and Sidebar](#navigation-and-sidebar)
* [Full Markdown support with Source-Code Highlighting](#markdown)
* [Custom Themes](#custom-themes)

## Content Repository

The content of Otter Docs is written in Markdown files that are stored in a separate git repository.

The structure of the repository should follow this structure:

```
/
├── .otterdocs
│   ├── config.json           # [Optional] config file
│   ├── logo.png              # [Optional] logo
│   └── favicon.ico           # [Optional] favicon
├── nav-item-1                # top-level directories map to navigation links               
│   ├── readme.md             # define title of navigation item, server as index page | Link: /nav-item-1
│   └── sidebar-item-1-1.md   # documentation page, will appear in sidebar            | Link: /nav-item-1/sidebar-item-1-1.html
└── nav-item-2                # ...
    ├── readme.md             # ...                                                   | Link: /nav-item-2
    └── sidebar-item-2-1.md   # ...                                                   | Link: /nav-item-2/sidebar-item-2-1.html
```

## Event API

TODO

## Navigation and Sidebar

Top-level directories or files are mapped to navigation items. To customize the label text, place a `readme.md` file inside and set the `title` frontmatter attribute. Learn more about pages in the official [VuePress v2 documentation](https://v2.vuepress.vuejs.org/guide/page.html#frontmatter).

Pages inside directories are mapped to entries in the sidebar.

Heading inside a page are mapped to sub-entries in the sidebar.

**Note: Currently pages cannot be nested depper than one level.**

## Markdown

For rendering Markdown to HTML content, Otter Docs uses [VuePress v2](https://github.com/vuejs/vuepress/). This enables Otter Docs to support many powerful features, such as code blocks with hightlighting and table of contents.

Check out the [official documentation](https://v2.vuepress.vuejs.org/guide/markdown.html) to learn all about the Markdown features of Otter Docs.

## Custom Themes

To customize the colors of Otter Docs, `config.json` supports an optional object `colors`. In this objects two colors can be defined:

* `brand` (used for buttons, links, …)
* `brandLight` (used for hover states of buttons, links, …)

```javascript
{
  // ...
  "colors": {
    "brand": "#ff1a8c",
    "brandLight": "#ff3399"
  }
}
```

## Architecture

### Go Server

* Watch git repository for changes
* Trigger rebuild
* Serve docs

### Node Application

* Dynamically generate navigation and sidebar structure
* Parse and sanatize `config.json`
* Apply `config.json`
* Render Markdown to HTML

### JavaScript Client Application

* Listen for Events from host application
* Parse path binding Regexp
* Handle navigation

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

## Configuration

The following environment varaibles are available to configure Otter-Docs server.

| Name       | Default | Description                                                                                  | Required |
|------------|---------|----------------------------------------------------------------------------------------------|----------|
| GIT_URL    | _None_  | URL to the content git repository. Example: https://username:password@example.org/myRepo.git | Yes      |
| GIT_BRANCH | main    |                                                                                              | No       |

