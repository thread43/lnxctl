package network

import (
	"context"
	"encoding/json"
	"net/http"
	"strconv"
	"strings"

	types_network "github.com/moby/moby/api/types/network"
	"github.com/moby/moby/client"

	docker_common "lnxctl/module/docker/common"
	"lnxctl/util"
)

func InspectNetwork(response http.ResponseWriter, request *http.Request) {
	var err error

	var server_id string
	var network_id string

	server_id = strings.TrimSpace(request.FormValue("server_id"))
	network_id = strings.TrimSpace(request.FormValue("network_id"))

	if util.IsNotSet(server_id, network_id) {
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
	docker_client, err = client.New(client.WithHost(host))
	util.Raise(err)
	defer func() {
		_ = docker_client.Close()
	}()

	var network_inspect_result client.NetworkInspectResult
	// network_inspect_result, _, err = docker_client.NetworkInspectWithRaw(context.Background(), network_id, client.NetworkInspectOptions{})
	network_inspect_result, err = docker_client.NetworkInspect(context.Background(), network_id, client.NetworkInspectOptions{})
	util.Raise(err)

	var network types_network.Inspect
	network = network_inspect_result.Network

	var network2 []byte
	network2, err = json.Marshal(network)
	util.Raise(err)

	util.Api(response, 200, string(network2))
}
