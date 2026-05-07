package util

import (
	"bufio"
	"bytes"
	"context"
	"fmt"
	"io"
	"os/exec"
	"time"
)

func ExecCmd_(command string) (string, error) {
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

// use this one
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

func ExecCmdWithTimeout_(command string, args ...time.Duration) (string, error) {
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
		return "", fmt.Errorf("command timed out after %d secs", duration)
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

// use this one
func ExecCmdWithTimeout(command string, args ...time.Duration) (string, error) {
	var err error

	var duration time.Duration
	duration = 10
	if len(args) == 1 {
		duration = args[0]
	}

	var ctx context.Context
	var cancel context.CancelFunc

	ctx, cancel = context.WithTimeout(context.Background(), duration*time.Second)
	defer cancel()

	var cmd *exec.Cmd
	cmd = exec.CommandContext(ctx, "sh", "-c", command)

	var output []byte
	output, err = cmd.CombinedOutput()

	var output2 string
	output2 = string(output)

	// fmt.Println(ctx.Err()) // context deadline exceeded
	if ctx.Err() == context.DeadlineExceeded {
		// fmt.Println(err) // signal: killed
		// %!w(<nil>) (command timed out after 60 secs)
		// err = fmt.Errorf("command timed out after %d secs", duration)
		err = fmt.Errorf("%w (command timed out after %d secs)", err, duration)
		return output2, err
	}

	return output2, err
}
