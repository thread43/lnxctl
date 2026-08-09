package container

import (
	"context"
	"io"
	"log"
	"mime/multipart"
	"net/http"
	"path/filepath"
	"strconv"
	"strings"

	"github.com/moby/moby/client"

	docker_common "lnxctl/module/docker/common"
	"lnxctl/util"
)

func UploadContainerFileAlt(response http.ResponseWriter, request *http.Request) {
	var err error

	var server_id string
	var container_id string
	var dir string

	server_id = strings.TrimSpace(request.FormValue("server_id"))
	container_id = strings.TrimSpace(request.FormValue("container_id"))
	dir = strings.TrimSpace(request.FormValue("dir"))
	log.Println(dir)

	if util.IsNotSet(server_id, container_id, dir) {
		util.Api(response, 400)
		return
	}
	if util.IsNotInt(server_id) {
		util.Api(response, 400)
		return
	}

	var server_id2 int64
	server_id2, err = strconv.ParseInt(server_id, 10, 64)
	util.Raise(err)

	var host string
	host, err = docker_common.GetServerHost(server_id2)
	util.Raise(err)

	err = request.ParseMultipartForm(64 << 20)
	util.Raise(err)

	var file multipart.File
	var file_header *multipart.FileHeader

	file, file_header, err = request.FormFile("file")
	util.Raise(err)
	defer func() {
		_ = file.Close()
		log.Println("file closed......")
	}()

	log.Println("uploaded file name:", file_header.Filename)
	log.Println("uploaded file size:", file_header.Size)
	log.Println("uploaded file header:", file_header.Header)

	var file2 string
	file2 = filepath.Join(dir, file_header.Filename)
	log.Println(file2)

	var docker_client *client.Client
	docker_client, err = client.New(client.WithHost(host))
	util.Raise(err)
	defer func() {
		_ = docker_client.Close()
	}()

	// // also working
	// // compared to kubernetes pod, there is no size limitation
	// file2 = strconv.Quote(file2)
	// command = []string{"sh", "-c", "cat > " + file2}
	var command []string
	command = []string{"cp", "/dev/stdin", file2}
	log.Println(command)

	var exec_create_result client.ExecCreateResult
	exec_create_result, err = docker_client.ExecCreate(
		context.Background(),
		container_id,
		client.ExecCreateOptions{
			AttachStdin:  true,
			AttachStdout: true,
			AttachStderr: true,
			TTY:          false,
			Cmd:          command,
		},
	)
	util.Raise(err)

	var exec_attach_result client.ExecAttachResult
	exec_attach_result, err = docker_client.ExecAttach(
		context.Background(),
		exec_create_result.ID,
		client.ExecAttachOptions{
			TTY: false,
		},
	)
	util.Raise(err)

	var hijacked_response client.HijackedResponse
	hijacked_response = exec_attach_result.HijackedResponse
	defer func() {
		hijacked_response.Close()
	}()

	_, err = io.Copy(hijacked_response.Conn, file)
	util.Raise(err)

	err = hijacked_response.CloseWrite()
	util.Raise(err)

	util.Api(response, 200, nil)
}
