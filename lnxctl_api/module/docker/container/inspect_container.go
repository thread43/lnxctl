package container

import (
	"context"
	"encoding/json"
	"net/http"
	"strconv"
	"strings"

	types_container "github.com/docker/docker/api/types/container"
	"github.com/docker/docker/client"

	docker_common "lnxctl/module/docker/common"
	"lnxctl/util"
)

func InspectContainer(response http.ResponseWriter, request *http.Request) {
	var err error

	var server_id string
	var container_id string

	server_id = strings.TrimSpace(request.FormValue("server_id"))
	container_id = strings.TrimSpace(request.FormValue("container_id"))

	if util.IsNotSet(server_id, container_id) {
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

	var docker_client *client.Client
	docker_client, err = client.NewClientWithOpts(client.WithHost(host), client.WithAPIVersionNegotiation())
	util.Raise(err)
	defer func() {
		_ = docker_client.Close()
	}()

	var container types_container.InspectResponse
	container, err = docker_client.ContainerInspect(context.Background(), container_id)
	util.Raise(err)

	var container2 []byte
	container2, err = json.Marshal(container)
	util.Raise(err)

	util.Api(response, 200, string(container2))
}
