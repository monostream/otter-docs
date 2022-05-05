package docs

import (
	"fmt"

	"otter-docs/internal/npm"
)

type Docs struct {
}

func New() (*Docs, error) {
	// Check if node / npm is installed
	if out, err := npm.Version(); err != nil {
		return nil, fmt.Errorf("failed to get npm version: %w\n%s", err, out)
	}

	return &Docs{}, nil
}

func (d *Docs) Install() error {
	if out, err := npm.Install(); err != nil {
		return fmt.Errorf("failed to install dependencies: %w\n%s", err, out)
	}

	return nil
}

func (d *Docs) Build() error {
	if out, err := npm.Run("build"); err != nil {
		return fmt.Errorf("failed to build docs: %w\n%s", err, out)
	}

	return nil
}
