package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"os"
	"os/exec"
	"time"

	"github.com/go-git/go-git/v5"
	"github.com/go-git/go-git/v5/plumbing"
	"github.com/gofiber/fiber/v2"
	"github.com/kelseyhightower/envconfig"
)

type GitConfig struct {
	URL    string `envconfig:"GIT_URL" required:"true"`
	Branch string `envconfig:"GIT_BRANCH" default:"main"`
}

const configPath = "./dist/environment.json"
const gitPath = "./docs/guide/"

func main() {
	var cfg GitConfig

	if err := envconfig.Process("", &cfg); err != nil {
		panic(err)
	}

	app := fiber.New()

	app.Static("/", "./dist")

	repo, err := pullContent(cfg)

	if err != nil {
		panic(err)
	}

	if err := install(); err != nil {
		panic(err)
	}

	if err := build(); err != nil {
		panic(err)
	}

	if err := setupEnvironment(); err != nil {
		panic(err)
	}

	go func() {
		for {
			time.Sleep(10 * time.Second)

			newCommits, err := hasNewCommits(repo)

			if err != nil {
				fmt.Printf("Failed to check for new commits: %s", err)

				continue
			}

			if !newCommits {
				fmt.Println("Repository has no new commits")

				continue
			}

			fmt.Println("Repository has new commits")

			worktree, err := repo.Worktree()

			if err != nil {
				panic(err)
			}

			err = worktree.Pull(&git.PullOptions{})

			if err != nil {
				panic(err)
			}

			if err := build(); err != nil {
				panic(err)
			}

			if err := setupEnvironment(); err != nil {
				panic(err)
			}
		}
	}()

	app.Listen(":8080")

	select {}
}

func pullContent(cfg GitConfig) (*git.Repository, error) {
	if err := os.RemoveAll(gitPath); err != nil {
		return nil, err
	}

	repo, err := git.PlainClone(gitPath, false, &git.CloneOptions{
		URL:           cfg.URL,
		ReferenceName: plumbing.NewBranchReferenceName(cfg.Branch),
	})

	if err != nil {
		return nil, err
	}

	return repo, nil
}

func hasNewCommits(repo *git.Repository) (bool, error) {
	err := repo.Fetch(&git.FetchOptions{})

	if err != nil {
		if err == git.NoErrAlreadyUpToDate {
			return false, nil
		}

		return false, err
	}

	return true, nil
}

func install() error {
	args := []string{"install"}

	cmd := exec.Command("npm", args...)

	out, err := cmd.CombinedOutput()

	if err != nil {
		return fmt.Errorf("Failed to install: %s %w", out, err)
	}

	fmt.Printf("Install output: %s", string(out))

	return nil
}

func build() error {
	args := []string{"run", "build"}

	cmd := exec.Command("npm", args...)

	out, err := cmd.CombinedOutput()

	if err != nil {
		return fmt.Errorf("Failed to build: %s %w", out, err)
	}

	fmt.Printf("Build output: %s", string(out))

	return nil
}

func setupEnvironment() error {
	data, err := ioutil.ReadFile(configPath)

	if err != nil {
		return err
	}

	config := map[string]interface{}{}

	if err := json.Unmarshal(data, &config); err != nil {
		return err
	}

	if val, found := os.LookupEnv("PORTAL_URL"); found {
		config["portalUrl"] = val
	}

	data, err = json.Marshal(config)

	if err != nil {
		return err
	}

	if err := os.WriteFile(configPath, data, 0666); err != nil {
		return err
	}

	return nil
}
