package pod

import (
	"context"
	"fmt"
	"net/http"
	"strconv"
	"strings"
	"time"

	core_v1 "k8s.io/api/core/v1"
	meta_v1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/util/duration"
	"k8s.io/client-go/kubernetes"
	"k8s.io/client-go/rest"

	k8s_common "lnxctl/module/k8s/common"
	"lnxctl/util"
)

func GetPods(response http.ResponseWriter, request *http.Request) {
	var err error

	var cluster_id string
	var namespace string

	cluster_id = strings.TrimSpace(request.FormValue("cluster_id"))
	namespace = strings.TrimSpace(request.FormValue("namespace"))

	if util.IsNotSet(cluster_id) {
		util.Api(response, 400)
		return
	}
	if util.IsNotInt(cluster_id) {
		util.Api(response, 400)
		return
	}

	var cluster_id2 int64
	cluster_id2, err = strconv.ParseInt(cluster_id, 10, 64)
	util.Raise(err)

	var rest_config *rest.Config
	rest_config, err = k8s_common.GetRestConfig(cluster_id2)
	util.Raise(err)

	var clientset *kubernetes.Clientset
	clientset, err = kubernetes.NewForConfig(rest_config)
	util.Raise(err)

	var pod_list *core_v1.PodList
	pod_list, err = clientset.CoreV1().Pods(namespace).List(
		context.Background(),
		meta_v1.ListOptions{
			Limit: int64(1000),
		},
	)
	util.Raise(err)

	var pods []map[string]interface{}
	pods = make([]map[string]interface{}, 0)

	var item core_v1.Pod
	for _, item = range pod_list.Items {
		var namespace string
		namespace = item.Namespace

		var name string
		name = item.Name

		var containers []map[string]interface{}
		containers = make([]map[string]interface{}, 0)

		var ready string
		var restarts int32

		{
			var container_statuses []core_v1.ContainerStatus
			container_statuses = item.Status.ContainerStatuses

			var container_status core_v1.ContainerStatus
			var ready_containers int

			for _, container_status = range container_statuses {
				var status string
				{
					if container_status.State.Running != nil {
						status = "Running"
					}
					if container_status.State.Waiting != nil {
						status = container_status.State.Waiting.Reason
					}
					if container_status.State.Terminated != nil {
						status = container_status.State.Terminated.Reason
					}
				}

				var last_termination string
				{
					if container_status.LastTerminationState.Terminated != nil {
						var finished_at time.Time
						var finished_at2 time.Duration

						finished_at = container_status.LastTerminationState.Terminated.FinishedAt.Time
						finished_at2 = time.Since(finished_at)

						last_termination = duration.ShortHumanDuration(finished_at2)
						last_termination = fmt.Sprintf("%s ago", last_termination)
					}
				}

				containers = append(
					containers,
					map[string]interface{}{
						"name":             container_status.Name,
						"image":            container_status.Image,
						"status":           status,
						"restart_count":    container_status.RestartCount,
						"last_termination": last_termination,
					},
				)

				if container_status.Ready {
					ready_containers++
				}

				restarts += container_status.RestartCount
			}

			var total_containers int
			total_containers = len(item.Status.ContainerStatuses)
			ready = fmt.Sprintf("%d/%d", ready_containers, total_containers)
		}

		// Pending|Running|Succeeded|Failed|Unknown
		var pod_phase core_v1.PodPhase
		pod_phase = item.Status.Phase

		var age string
		{
			var creation_timestamp time.Time
			var creation_timestamp2 time.Duration

			creation_timestamp = item.CreationTimestamp.Time
			creation_timestamp2 = time.Since(creation_timestamp)
			// age = creation_timestamp2.Round(time.Second).String()
			// age = duration.HumanDuration(creation_timestamp2)
			age = duration.ShortHumanDuration(creation_timestamp2)
		}

		var pod_ip string
		pod_ip = item.Status.PodIP

		var host_ip string
		host_ip = item.Status.HostIP

		var node_name string
		node_name = item.Spec.NodeName

		pods = append(
			pods,
			map[string]interface{}{
				"cluster_id": cluster_id2,
				"namespace":  namespace,
				"name":       name,
				"containers": containers,
				"ready":      ready,
				"pod_phase":  pod_phase,
				"restarts":   restarts,
				"age":        age,
				"pod_ip":     pod_ip,
				"host_ip":    host_ip,
				"node_name":  node_name,
			},
		)

	}

	util.Api(response, 200, pods)
}
