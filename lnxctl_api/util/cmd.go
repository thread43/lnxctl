package util

import (
	"bufio"
	"bytes"
	"errors"
	"fmt"
	"io"
	"os/exec"
	"time"
)

func ExecCmd(command string) (string, error) {
	var err error

	var cmd *exec.Cmd
	cmd = exec.Command("sh", "-c", command)

	var combined_output []byte
	combined_output, err = cmd.CombinedOutput()

	var output string
	output = string(combined_output)

	return output, err
}

func ExecCmd_Run(command string) error {
	var err error

	var cmd *exec.Cmd
	cmd = exec.Command("sh", "-c", command)
	err = cmd.Run()

	return err
}

func ExecCmd_Start(command string) (string, error) {
	var err error

	var cmd *exec.Cmd
	var stdout bytes.Buffer
	var stderr bytes.Buffer

	cmd = exec.Command("sh", "-c", command)
	cmd.Stdout = &stdout
	cmd.Stderr = &stderr

	cmd.Start()

	err = cmd.Wait()

	var output string
	if err == nil {
		output = stdout.String()
	} else {
		output = stderr.String()
	}

	return output, err
}

func ExecCmd_Pipe(command string) (string, error) {
	var err error

	var cmd *exec.Cmd
	cmd = exec.Command("sh", "-c", command)

	var stdout io.ReadCloser
	stdout, err = cmd.StdoutPipe()
	if err != nil {
		panic(err)
	}
	cmd.Stderr = cmd.Stdout

	err = cmd.Start()
	if err != nil {
		panic(err)
	}

	var scanner *bufio.Scanner
	scanner = bufio.NewScanner(stdout)
	for scanner.Scan() {
		fmt.Println(scanner.Text())
	}

	err = cmd.Wait()
	if err != nil {
		panic(err)
	}

	var output string = "done"
	return output, err
}

func ExecCmdWithTimeout(command string, args ...time.Duration) (string, error) {
	var err error

	var duration time.Duration
	duration = 10
	if len(args) == 1 {
		duration = args[0]
	}

	var cmd *exec.Cmd
	var stdout bytes.Buffer
	var stderr bytes.Buffer

	cmd = exec.Command("sh", "-c", command)
	cmd.Stdout = &stdout
	cmd.Stderr = &stderr

	cmd.Start()

	var done chan error
	done = make(chan error)
	go func() { done <- cmd.Wait() }()

	var timeout <-chan time.Time
	timeout = time.After(duration * time.Second)

	select {
	case <-timeout:
		cmd.Process.Kill()
		return "", errors.New(fmt.Sprintf("command timed out after %d secs", duration))
	case err = <-done:
		var output string
		if err == nil {
			output = stdout.String()
		} else {
			output = stderr.String()
		}
		return output, err
	}
}
