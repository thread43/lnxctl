package container

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"sort"
	"strconv"
	"strings"
	"time"

	types_container "github.com/docker/docker/api/types/container"
	types_mount "github.com/docker/docker/api/types/mount"
	types_network "github.com/docker/docker/api/types/network"
	"github.com/docker/docker/client"

	docker_common "lnxctl/module/docker/common"
	"lnxctl/util"
)

func GetContainers(response http.ResponseWriter, request *http.Request) {
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

	// client.FromEnv
	// - EnvOverrideHost = "DOCKER_HOST"
	// - EnvOverrideAPIVersion = "DOCKER_API_VERSION"
	// - EnvOverrideCertPath = "DOCKER_CERT_PATH"
	// - EnvTLSVerify = "DOCKER_TLS_VERIFY"
	//
	// DOCKER_HOST="tcp://0.0.0.0:2375"
	// DOCKER_HOST="tcp://127.0.0.1:2375"
	var docker_client *client.Client
	// docker_client, err = client.NewClientWithOpts(client.FromEnv, client.WithAPIVersionNegotiation())
	docker_client, err = client.NewClientWithOpts(client.WithHost(host), client.WithAPIVersionNegotiation())
	util.Raise(err)
	defer func() {
		_ = docker_client.Close()
	}()

	var container_list []types_container.Summary
	// container_list, err = docker_client.ContainerList(context.Background(), types_container.ListOptions{})
	container_list, err = docker_client.ContainerList(context.Background(), types_container.ListOptions{All: true})
	if err != nil {
		log.Println(err)
		// Cannot connect to the Docker daemon at unix:///var/run/docker.sock. Is the docker daemon running?
		if strings.Contains(err.Error(), "Cannot connect to the Docker daemon") {
			util.Api(response, 999)
			return
		}
	}
	util.Raise(err)

	var containers []map[string]interface{}
	containers = make([]map[string]interface{}, 0)

	var container types_container.Summary
	for _, container = range container_list {
		var id string
		var container_id_raw string
		var container_id string
		var name_raw string
		var name string
		var image_raw string
		var image string
		var image_id string
		var command string
		var created_raw int64
		var created time.Time
		var status string
		var state string

		id = container.ID
		container_id_raw = container.ID
		container_id = container.ID[0:12]
		name_raw = container.Names[0]
		name = strings.Replace(container.Names[0], "/", "", 1)

		image_raw = container.Image
		image = container.Image
		if strings.HasPrefix(image, "sha256") {
			image = strings.Split(image, ":")[1][0:12]
		}

		image_id = container.ImageID
		created_raw = container.Created
		created = time.Unix(container.Created, 0)
		status = container.Status
		state = container.State
		command = container.Command

		var network_mode string
		network_mode = container.HostConfig.NetworkMode

		var ip_address string
		{
			var networks map[string]*types_network.EndpointSettings
			networks = container.NetworkSettings.Networks

			// if networks["bridge"] != nil {
			// 	// network_mode = "bridge"
			// 	ip_address = networks["bridge"].IPAddress
			// } else if networks["host"] != nil {
			// 	// network_mode = "host"
			// 	ip_address = networks["host"].IPAddress
			// } else {
			// }

			var key string
			for key = range networks {
				ip_address = networks[key].IPAddress
			}
		}

		var ports []types_container.Port
		ports = container.Ports

		var ports2 []map[string]interface{}
		ports2 = make([]map[string]interface{}, 0)

		var ports3 []string
		ports3 = make([]string, 0)

		{

			var port types_container.Port
			for _, port = range ports {
				var ip string
				var private_port uint16
				var public_port uint16
				var type2 string

				ip = port.IP
				private_port = port.PrivatePort
				public_port = port.PublicPort
				type2 = port.Type

				var private_port_type string
				var ip_public_port string
				var port_mapping string

				private_port_type = fmt.Sprintf("%d/%s", private_port, type2)
				if ip == "::" {
					ip_public_port = fmt.Sprintf("[%s]:%d", ip, public_port)
				} else {
					ip_public_port = fmt.Sprintf("%s:%d", ip, public_port)
				}
				port_mapping = fmt.Sprintf("%s -> %s", ip_public_port, private_port_type)

				ports2 = append(
					ports2,
					map[string]interface{}{
						"ip":                ip,
						"private_port":      private_port,
						"public_port":       public_port,
						"type":              type2,
						"private_port_type": private_port_type,
						"ip_public_port":    ip_public_port,
						"port_mapping":      port_mapping,
					},
				)

				if ip != "" {
					ports3 = append(ports3, port_mapping)
				} else {
					ports3 = append(ports3, private_port_type)
				}
			}

			// slices.Sort(ports3)
			sort.Strings(ports3)
		}

		var mounts []types_container.MountPoint
		mounts = container.Mounts

		var mounts2 []map[string]interface{}
		mounts2 = make([]map[string]interface{}, 0)

		var mounts3 []string
		mounts3 = make([]string, 0)

		{
			var mount types_container.MountPoint
			for _, mount = range mounts {
				// mount_type: bind|volume|tmpfs|npipe|cluster|image
				var mount_type types_mount.Type
				var mount_source string
				var mount_destination string
				var mount_rw bool

				mount_type = mount.Type
				mount_source = mount.Source
				mount_destination = mount.Destination
				mount_rw = mount.RW

				if mount_type == "bind" {
					mounts2 = append(
						mounts2,
						map[string]interface{}{
							"type":        mount_type,
							"source":      mount_source,
							"destination": mount_destination,
							"rw":          mount_rw,
						},
					)
					mounts3 = append(mounts3, fmt.Sprintf("%s:%s", mount_source, mount_destination))
				} else {
				}
			}

			sort.Strings(mounts3)
		}

		containers = append(
			containers,
			map[string]interface{}{
				"server_id":        server_id2,
				"id":               id,
				"container_id_raw": container_id_raw,
				"container_id":     container_id,
				"name_raw":         name_raw,
				"name":             name,
				"image_raw":        image_raw,
				"image":            image,
				"image_id":         image_id,
				"created_raw":      created_raw,
				"created":          created.Format("2006-01-02 15:04:05"),
				"status":           status,
				"state":            state,
				"command":          command,
				"network_mode":     network_mode,
				"ip_address":       ip_address,
				"ports":            ports2,
				"ports2":           ports3,
				"mounts":           mounts2,
				"mounts2":          mounts3,
			},
		)
	}

	/*
		sort.Slice(containers,
			func(i int, j int) bool {
				if containers[i]["state"].(string) != containers[j]["state"].(string) {
					if containers[i]["state"].(string) == "running" {
						return true // no need sorting
					} else if containers[j]["state"].(string) == "running" {
						return false // need sorting
					} else {
						return containers[i]["state"].(string) < containers[j]["state"].(string)
					}
				} else {
					return containers[i]["state"].(string) < containers[j]["state"].(string)
				}
			},
		)
	*/

	util.Api(response, 200, containers)
}
