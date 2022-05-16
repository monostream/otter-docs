package docs

import (
	"fmt"
	"os"
	"path/filepath"
	"time"

	"otter-docs/internal/npm"
)

type Docs struct {
	LastBuilt time.Time

	contentPath string
	publicPath  string
}

func New() (*Docs, error) {
	// Check if node / npm is installed
	if out, err := npm.Version(); err != nil {
		return nil, fmt.Errorf("failed to get npm version: %w\n%s", err, out)
	}

	return &Docs{
		contentPath: filepath.Join(".", "vuepress", "docs"),
		publicPath:  filepath.Join(".", "vuepress", ".vuepress", "public"),
	}, nil
}

func (d *Docs) Install() error {
	if out, err := npm.Install(); err != nil {
		return fmt.Errorf("failed to install dependencies: %w\n%s", err, out)
	}

	return nil
}

func (d *Docs) Build() error {
	otterDocsPath := filepath.Join(d.contentPath, ".otterdocs")

	if exists(otterDocsPath) {
		// .otterdocs directory exists

		toCopy := []string{"logo.png", "favicon.ico", "config.json"}

		for _, f := range toCopy {
			source := filepath.Join(otterDocsPath, f)
			destination := filepath.Join(d.publicPath, f)

			if !exists(source) {
				continue
			}

			file, err := os.ReadFile(source)

			if err != nil {
				return err
			}

			if err := os.WriteFile(destination, file, 0644); err != nil {
				return err
			}
		}
	}

	if out, err := npm.Run("build"); err != nil {
		return fmt.Errorf("failed to build docs: %w\n%s", err, out)
	}

	d.LastBuilt = time.Now()

	return nil
}

func exists(path string) bool {
	_, err := os.Stat(path)

	return !os.IsNotExist(err)
}
