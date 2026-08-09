package network

import (
	"context"
	"log"
	"net/http"
	"sort"
	"strconv"
	"strings"
	"time"

	types_network "github.com/moby/moby/api/types/network"
	"github.com/moby/moby/client"

	docker_common "lnxctl/module/docker/common"
	"lnxctl/util"
)

func GetNetworks(response http.ResponseWriter, request *http.Request) {
	var err error

	var server_id string
	server_id = strings.TrimSpace(request.FormValue("server_id"))

	if util.IsNotSet(server_id) {
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
	// docker_client, err = client.New(client.FromEnv)
	docker_client, err = client.New(client.WithHost(host))
	util.Raise(err)
	defer func() {
		_ = docker_client.Close()
	}()

	var network_list_result client.NetworkListResult
	network_list_result, err = docker_client.NetworkList(context.Background(), client.NetworkListOptions{})
	if err != nil {
		log.Println(err)
		// Cannot connect to the Docker daemon at unix:///var/run/docker.sock. Is the docker daemon running?
		if strings.Contains(err.Error(), "Cannot connect to the Docker daemon") {
			util.Api(response, 999)
			return
		}
	}
	util.Raise(err)

	var network_list []types_network.Summary
	network_list = network_list_result.Items

	var networks []map[string]any
	networks = make([]map[string]any, 0)

	var network types_network.Summary
	for _, network = range network_list {
		var id string
		var network_id_raw string
		var network_id string

		id = network.ID
		network_id_raw = network.ID
		network_id = network.ID[:12]

		var name string
		name = network.Name

		// bridge|overlay|etc.
		var driver string
		driver = network.Driver

		// swarm|local
		var scope string
		scope = network.Scope

		// var created_raw int64
		var created time.Time
		created = network.Created

		networks = append(
			networks,
			map[string]any{
				"server_id":      server_id2,
				"id":             id,
				"network_id_raw": network_id_raw,
				"network_id":     network_id,
				"name":           name,
				"driver":         driver,
				"scope":          scope,
				"created":        created.Format("2006-01-02 15:04:05"),
			},
		)
	}

	sort.Slice(networks, func(i int, j int) bool {
		return networks[i]["name"].(string) < networks[j]["name"].(string)
	})

	util.Api(response, 200, networks)
}
