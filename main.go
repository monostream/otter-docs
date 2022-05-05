package main

import (
	"fmt"
	"log"
	"otter-docs/internal/docs"
	"otter-docs/internal/git"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/kelseyhightower/envconfig"
)

type Config struct {
	URL    string `envconfig:"GIT_URL" required:"true"`
	Branch string `envconfig:"GIT_BRANCH" default:"main"`

	Port string `envconfig:"PORT" default:"8080"`
}

const configPath = "./dist/environment.json"

func main() {
	var cfg Config

	if err := envconfig.Process("", &cfg); err != nil {
		panic(err)
	}

	git, err := git.New("./vuepress/guide/", cfg.URL, cfg.Branch)

	if err != nil {
		panic(err)
	}

	docs, err := docs.New()

	if err != nil {
		panic(err)
	}

	var updateError error

	go func() {
		for {
			time.Sleep(10 * time.Second)

			updateError = update(git, docs)

			if updateError != nil {
				log.Printf("failed to update docs: %s", updateError)

				continue
			}
		}
	}()

	app := fiber.New()

	app.Use(func(ctx *fiber.Ctx) error {
		if updateError != nil {
			return ctx.SendString(fmt.Sprintf("Failed to update docs: %s", updateError))
		}

		return ctx.Next()
	})

	app.Static("/", "./dist")

	app.Listen(":8080")
}

func update(git *git.Git, docs *docs.Docs) error {
	shouldBuild := false

	if !git.IsInitialized() {
		if git.Exists() {
			if err := git.Open(); err != nil {
				return err
			}
		} else {
			if err := git.Clone(); err != nil {
				return err
			}
		}

		shouldBuild = true
	}

	if !shouldBuild {
		hasNewCommits, err := git.HasNewCommits()

		if err != nil {
			return err
		}

		shouldBuild = hasNewCommits
	}

	if !shouldBuild {
		return nil
	}

	if err := docs.Install(); err != nil {
		return err
	}

	if err := docs.Build(); err != nil {
		return err
	}

	return nil
}
