package index

import (
	"context"
	"database/sql"
	"log"
	"net/http"
	"time"

	types_container "github.com/docker/docker/api/types/container"
	"github.com/docker/docker/client"

	core_v1 "k8s.io/api/core/v1"
	meta_v1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes"
	"k8s.io/client-go/rest"

	docker_common "lnxctl/module/docker/common"
	k8s_common "lnxctl/module/k8s/common"
	"lnxctl/util"
)

// get_linux, {host_total, host_running}
// get_dockers, [{server_id, server_name, container_total, container_running}]
// get_k8ses, [{cluster_id, cluster_name, node_total, node_running, pod_total, pod_running}]

func GetStatistics(response http.ResponseWriter, request *http.Request) {
	// var err error

	var linux map[string]interface{}
	linux = GetLinux()

	var dockers []map[string]interface{}
	dockers = GetDockers()

	var k8ses []map[string]interface{}
	k8ses = GetK8ses()

	var statistics map[string]interface{}
	statistics = map[string]interface{}{
		"linux":   linux,
		"dockers": dockers,
		"k8ses":   k8ses,
	}

	util.Api(response, 200, statistics)
}

func GetLinux() map[string]interface{} {
	var err error

	var host_total int
	{
		var query string
		query = "SELECT COUNT(1) count FROM linux_host"

		var row *sql.Row
		row = util.DB.QueryRow(query)

		err = row.Scan(&host_total)
		util.Raise(err)
	}

	var host_running int
	{
		var query string
		query = "SELECT COUNT(1) count FROM linux_host WHERE hostname IS NOT NULL"

		var row *sql.Row
		row = util.DB.QueryRow(query)

		err = row.Scan(&host_running)
		util.Raise(err)
	}

	var host_healthy bool
	if host_running == host_total {
		host_healthy = true
	}

	var linux map[string]interface{}
	linux = map[string]interface{}{
		"host_total":   host_total,
		"host_running": host_running,
		"host_healthy": host_healthy,
	}

	return linux
}

func GetDockers() []map[string]interface{} {
	var err error

	var containers []map[string]interface{}
	containers = make([]map[string]interface{}, 0)

	var query string
	query = `SELECT id, name FROM docker_server`

	var servers []map[string]interface{}
	servers = make([]map[string]interface{}, 0)

	{
		var rows *sql.Rows
		rows, err = util.DB.Query(query)
		util.Raise(err)
		defer func() {
			_ = rows.Close()
		}()

		for rows.Next() {
			var id sql.NullInt64
			var name sql.NullString

			err = rows.Scan(&id, &name)
			util.Raise(err)

			servers = append(
				servers,
				map[string]interface{}{
					"id":   id.Int64,
					"name": name.String,
				},
			)
		}
	}

	var server map[string]interface{}
	for _, server = range servers {
		var container map[string]interface{}
		container = make(map[string]interface{})

		var server_id int64
		var server_name string
		var container_total int
		var container_running int
		var container_healthy bool

		server_id = server["id"].(int64)
		server_name = server["name"].(string)
		container_total = -1
		container_running = -1
		container_healthy = false

		container = map[string]interface{}{
			"server_id":         server_id,
			"server_name":       server_name,
			"container_total":   container_total,
			"container_running": container_running,
			"container_healthy": container_healthy,
		}

		var host string
		host, err = docker_common.GetServerHost(server_id)
		util.Raise(err)

		var docker_client *client.Client
		docker_client, err = client.NewClientWithOpts(client.WithHost(host), client.WithAPIVersionNegotiation())
		if err != nil {
			log.Println(err)
			containers = append(containers, container)
			continue
		}
		defer func() {
			_ = docker_client.Close()
		}()

		var container_list []types_container.Summary
		container_list, err = docker_client.ContainerList(context.Background(), types_container.ListOptions{All: true})
		if err != nil {
			log.Println(err)
			containers = append(containers, container)
			continue
		}

		container_total = len(container_list)
		container_running = 0

		var container_summary types_container.Summary
		for _, container_summary = range container_list {
			var state string
			state = container_summary.State
			if state == "running" {
				container_running += 1
			}
		}

		container["container_total"] = container_total
		container["container_running"] = container_running
		if container_running == container_total {
			container["container_healthy"] = true
		}
		containers = append(containers, container)
	}

	return containers
}

func GetK8ses() []map[string]interface{} {
	var err error

	var k8ses []map[string]interface{}
	k8ses = make([]map[string]interface{}, 0)

	var query string
	query = "SELECT id, name FROM k8s_cluster"

	var clusters []map[string]interface{}
	clusters = make([]map[string]interface{}, 0)

	{
		var rows *sql.Rows
		rows, err = util.DB.Query(query)
		util.Raise(err)
		defer func() {
			_ = rows.Close()
		}()

		for rows.Next() {
			var id sql.NullInt64
			var name sql.NullString

			err = rows.Scan(&id, &name)
			util.Raise(err)

			clusters = append(
				clusters,
				map[string]interface{}{
					"id":   id.Int64,
					"name": name.String,
				},
			)
		}
	}

	var cluster map[string]interface{}
	for _, cluster = range clusters {
		var k8s map[string]interface{}
		k8s = make(map[string]interface{})

		var cluster_id int64
		var cluster_name string
		var node_total int
		var node_running int
		var node_healthy bool
		var pod_total int
		var pod_running int
		var pod_healthy bool

		cluster_id = cluster["id"].(int64)
		cluster_name = cluster["name"].(string)
		node_total = -1
		node_running = -1
		node_healthy = false
		pod_total = -1
		pod_running = -1
		pod_healthy = false

		k8s = map[string]interface{}{
			"cluster_id":   cluster_id,
			"cluster_name": cluster_name,
			"node_total":   node_total,
			"node_running": node_running,
			"node_healthy": node_healthy,
			"pod_total":    pod_total,
			"pod_running":  pod_running,
			"pod_healthy":  pod_healthy,
		}

		var rest_config *rest.Config
		rest_config, err = k8s_common.GetRestConfig(cluster_id)
		if err != nil {
			log.Println(err)
			k8ses = append(k8ses, k8s)
			continue
		}
		rest_config.Timeout = 1 * time.Second

		var clientset *kubernetes.Clientset
		clientset, err = kubernetes.NewForConfig(rest_config)
		if err != nil {
			log.Println(err)
			k8ses = append(k8ses, k8s)
			continue
		}

		{
			var node_list *core_v1.NodeList
			node_list, err = clientset.CoreV1().Nodes().List(context.Background(), meta_v1.ListOptions{})
			if err != nil {
				log.Println(err)
				k8ses = append(k8ses, k8s)
				continue
			}

			node_total = len(node_list.Items)
			node_running = 0

			var item core_v1.Node
			for _, item = range node_list.Items {
				var status string
				{
					// Ready|MemoryPressure|DiskPressure|PIDPressure|NetworkUnavailable
					status = "Unknown"
					var condition core_v1.NodeCondition
					for _, condition = range item.Status.Conditions {
						// True|False|Unknown
						if condition.Type == core_v1.NodeReady {
							switch condition.Status {
							case core_v1.ConditionTrue:
								status = "Ready"
							case core_v1.ConditionFalse:
								status = "NotReady"
							case core_v1.ConditionUnknown:
								// status = "NotReady (Unknown)"
								status = "NotReady"
							}
						}
					}
				}

				if status == "Ready" {
					node_running += 1
				}
			}
		}

		k8s["node_total"] = node_total
		k8s["node_running"] = node_running
		if node_running == node_total {
			k8s["node_healthy"] = true
		}

		{
			var pod_list *core_v1.PodList
			pod_list, err = clientset.CoreV1().Pods("").List(
				context.Background(),
				meta_v1.ListOptions{
					Limit: int64(1000),
				},
			)
			if err != nil {
				log.Println(err)
				k8ses = append(k8ses, k8s)
				continue
			}

			pod_total = len(pod_list.Items)
			pod_running = 0

			var item core_v1.Pod
			for _, item = range pod_list.Items {
				// Pending|Running|Succeeded|Failed|Unknown
				var pod_phase core_v1.PodPhase
				pod_phase = item.Status.Phase

				if pod_phase == "Running" {
					pod_running += 1
				}
			}
		}

		k8s["pod_total"] = pod_total
		k8s["pod_running"] = pod_running
		if pod_running == pod_total {
			k8s["pod_healthy"] = true
		}
		k8ses = append(k8ses, k8s)
	}

	return k8ses
}
