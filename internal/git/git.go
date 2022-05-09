package git

import (
	"errors"
	"net/url"
	"os"
	"path/filepath"

	"github.com/go-git/go-git/v5"
	"github.com/go-git/go-git/v5/plumbing"
)

type Git struct {
	path string

	url    *url.URL
	branch string

	repo *git.Repository
}

func New(path, gitUrl, gitBranch string) (*Git, error) {
	u, err := url.Parse(gitUrl)

	if err != nil {
		return nil, err
	}

	git := &Git{
		path: path,

		url:    u,
		branch: gitBranch,
	}

	if git.exists() {
		if err := git.open(); err != nil {
			return nil, err
		}
	} else {
		if err := git.clone(); err != nil {
			return nil, err
		}
	}

	return git, nil
}

func (g *Git) open() error {
	repo, err := git.PlainOpen(g.path)

	if err != nil {
		return err
	}

	g.repo = repo

	return nil
}

func (g *Git) clone() error {
	repo, err := git.PlainClone(g.path, false, &git.CloneOptions{
		URL:           g.url.String(),
		ReferenceName: plumbing.NewBranchReferenceName(g.branch),
	})

	if err != nil {
		return err
	}

	g.repo = repo

	return nil
}

func (g *Git) exists() bool {
	gitPath := filepath.Join(g.path, ".git")

	_, err := os.Stat(gitPath)

	return !os.IsNotExist(err)
}

func (g *Git) Pull() error {
	worktree, err := g.repo.Worktree()

	if err != nil {
		return err
	}

	if err = worktree.Pull(&git.PullOptions{}); err != nil {
		return err
	}

	return nil
}

func (g *Git) HasNewCommits() (bool, error) {
	if g.repo == nil {
		return false, errors.New("repository is not cloned yet")
	}

	err := g.repo.Fetch(&git.FetchOptions{})

	if err != nil {
		if err == git.NoErrAlreadyUpToDate {
			return false, nil
		}

		return false, err
	}

	return true, nil
}
