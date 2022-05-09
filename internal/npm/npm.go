package npm

import (
	"fmt"
	"os/exec"
)

func Install() (string, error) {
	return npm("install")
}

func Run(command string) (string, error) {
	return npm("run", command)
}

func Version() (string, error) {
	return npm("-v")
}

func npm(args ...string) (string, error) {
	cmd := exec.Command("npm", args...)

	out, err := cmd.CombinedOutput()

	if err != nil {
		return "", fmt.Errorf("%w: %s", err, out)
	}

	return string(out), nil
}
