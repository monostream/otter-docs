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
	"github.com/go-git/go-git/v5/plumbing/transport/http"
	"github.com/gofiber/fiber/v2"
)

const configPath = "./dist/environment.json"
const gitPath = "./docs/guide/"
const gitRepository = "https://github.com/monostream/2pack-docs.git"
const gitUser = "cblaettl"
const gitAccessToken = "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"
const gitRemote = "origin"
const gitBranch = "main"

func main() {
	app := fiber.New()

	app.Use(NewHelmet())

	app.Static("/", "./dist")

	repo, err := pullContent()

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

			err = worktree.Pull(&git.PullOptions{
				Auth: &http.BasicAuth{
					Username: gitUser,
					Password: gitAccessToken,
				},
			})

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

func pullContent() (*git.Repository, error) {
	if err := os.RemoveAll(gitPath); err != nil {
		return nil, err
	}

	repo, err := git.PlainClone(gitPath, false, &git.CloneOptions{
		URL:           gitRepository,
		ReferenceName: plumbing.NewBranchReferenceName(gitBranch),
		RemoteName:    gitRemote,
		Auth: &http.BasicAuth{
			Username: gitUser,
			Password: gitAccessToken,
		},
	})

	if err != nil {
		return nil, err
	}

	return repo, nil
}

func hasNewCommits(repo *git.Repository) (bool, error) {
	err := repo.Fetch(&git.FetchOptions{
		Auth: &http.BasicAuth{
			Username: gitUser,
			Password: gitAccessToken,
		},
	})

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

// Copied from https://github.com/gofiber/helmet/blob/v2.2.3/main.go
// to manually disable X-Frame-Options because helmet has no way to disable it

// Config ...
type Config struct {
	// Filter defines a function to skip middleware.
	// Optional. Default: nil
	Filter func(*fiber.Ctx) bool
	// XSSProtection
	// Optional. Default value "1; mode=block".
	XSSProtection string
	// ContentTypeNosniff
	// Optional. Default value "nosniff".
	ContentTypeNosniff string
	// XFrameOptions
	// Optional. Default value "SAMEORIGIN".
	// Possible values: "SAMEORIGIN", "DENY", "ALLOW-FROM uri"
	XFrameOptions string
	// HSTSMaxAge
	// Optional. Default value 0.
	HSTSMaxAge int
	// HSTSExcludeSubdomains
	// Optional. Default value false.
	HSTSExcludeSubdomains bool
	// ContentSecurityPolicy
	// Optional. Default value "".
	ContentSecurityPolicy string
	// CSPReportOnly
	// Optional. Default value false.
	CSPReportOnly bool
	// HSTSPreloadEnabled
	// Optional.  Default value false.
	HSTSPreloadEnabled bool
	// ReferrerPolicy
	// Optional. Default value "".
	ReferrerPolicy string

	// Permissions-Policy
	// Optional. Default value "".
	PermissionPolicy string
}

// NewHelmet ...
func NewHelmet(config ...Config) fiber.Handler {
	// Init config
	var cfg Config
	if len(config) > 0 {
		cfg = config[0]
	}
	// Set config default values
	if cfg.XSSProtection == "" {
		cfg.XSSProtection = "1; mode=block"
	}
	if cfg.ContentTypeNosniff == "" {
		cfg.ContentTypeNosniff = "nosniff"
	}
	// Return middleware handler
	return func(c *fiber.Ctx) error {
		// Filter request to skip middleware
		if cfg.Filter != nil && cfg.Filter(c) {
			return c.Next()
		}
		if cfg.XSSProtection != "" {
			c.Set(fiber.HeaderXXSSProtection, cfg.XSSProtection)
		}
		if cfg.ContentTypeNosniff != "" {
			c.Set(fiber.HeaderXContentTypeOptions, cfg.ContentTypeNosniff)
		}
		if cfg.XFrameOptions != "" {
			c.Set(fiber.HeaderXFrameOptions, cfg.XFrameOptions)
		}
		if (c.Secure() || (c.Get(fiber.HeaderXForwardedProto) == "https")) && cfg.HSTSMaxAge != 0 {
			subdomains := ""
			if !cfg.HSTSExcludeSubdomains {
				subdomains = "; includeSubdomains"
			}
			if cfg.HSTSPreloadEnabled {
				subdomains = fmt.Sprintf("%s; preload", subdomains)
			}
			c.Set(fiber.HeaderStrictTransportSecurity, fmt.Sprintf("max-age=%d%s", cfg.HSTSMaxAge, subdomains))
		}
		if cfg.ContentSecurityPolicy != "" {
			if cfg.CSPReportOnly {
				c.Set(fiber.HeaderContentSecurityPolicyReportOnly, cfg.ContentSecurityPolicy)
			} else {
				c.Set(fiber.HeaderContentSecurityPolicy, cfg.ContentSecurityPolicy)
			}
		}
		if cfg.ReferrerPolicy != "" {
			c.Set(fiber.HeaderReferrerPolicy, cfg.ReferrerPolicy)
		}
		if cfg.PermissionPolicy != "" {
			c.Set(fiber.HeaderPermissionsPolicy, cfg.PermissionPolicy)

		}
		return c.Next()
	}
}
