package namespace

import (
	"context"
	"math"
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

func GetNodes(response http.ResponseWriter, request *http.Request) {
	var err error

	var cluster_id string
	cluster_id = strings.TrimSpace(request.FormValue("cluster_id"))

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

	var node_list *core_v1.NodeList
	node_list, err = clientset.CoreV1().Nodes().List(context.Background(), meta_v1.ListOptions{})
	util.Raise(err)

	var nodes []map[string]interface{}
	nodes = make([]map[string]interface{}, 0)

	var item core_v1.Node
	for _, item = range node_list.Items {
		var name string
		name = item.Name

		var status string
		{
			// https://kubernetes.io/docs/reference/node/node-status/#condition
			// NodeReady NodeConditionType = "Ready"
			// NodeMemoryPressure NodeConditionType = "MemoryPressure"
			// NodeDiskPressure NodeConditionType = "DiskPressure"
			// NodePIDPressure NodeConditionType = "PIDPressure"
			// NodeNetworkUnavailable NodeConditionType = "NetworkUnavailable"
			status = "Unknown"
			var condition core_v1.NodeCondition
			for _, condition = range item.Status.Conditions {
				// if condition.Status == core_v1.ConditionTrue {
				// 	status = string(condition.Type)
				// }
				// ConditionTrue    ConditionStatus = "True"
				// ConditionFalse   ConditionStatus = "False"
				// ConditionUnknown ConditionStatus = "Unknown"
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

		var roles string
		{
			var roles2 []string
			var key string

			// node-role.kubernetes.io/control-plane=
			for key = range item.Labels {
				if strings.HasPrefix(key, "node-role.kubernetes.io/") {
					key = strings.TrimPrefix(key, "node-role.kubernetes.io/")
					roles2 = append(roles2, key)
				}
			}

			if len(roles2) == 0 {
				roles2 = append(roles2, "<none>")
			}

			roles = strings.Join(roles2, ",")
		}

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

		var version string
		version = item.Status.NodeInfo.KubeletVersion

		var hostname string
		var ip string

		{
			// NodeHostName NodeAddressType = "Hostname"
			// NodeInternalIP NodeAddressType = "InternalIP"
			// NodeExternalIP NodeAddressType = "ExternalIP"
			// NodeInternalDNS NodeAddressType = "InternalDNS"
			// NodeExternalDNS NodeAddressType = "ExternalDNS"
			var address core_v1.NodeAddress
			for _, address = range item.Status.Addresses {
				if address.Type == core_v1.NodeInternalIP {
					ip = address.Address
				}
				if address.Type == core_v1.NodeHostName {
					hostname = address.Address
				}
			}
		}

		var os string
		os = item.Status.NodeInfo.OperatingSystem

		var os_image string
		os_image = item.Status.NodeInfo.OSImage

		var arch string
		arch = item.Status.NodeInfo.Architecture

		var kernel string
		kernel = item.Status.NodeInfo.KernelVersion

		var cpu string
		cpu = item.Status.Capacity.Cpu().String()

		var memory string
		var memory2 int64

		{
			memory = item.Status.Capacity.Memory().String()
			memory2 = item.Status.Capacity.Memory().Value()
			// memory2 = int64(math.Round(float64(memory2) / 1000 / 1000 / 1000))
			// memory2 = int64(math.Round(float64(memory2) / 1024 / 1024 / 1024))
			memory2 = int64(math.Ceil(float64(memory2) / 1024 / 1024 / 1024))
		}

		var storage string
		var storage2 int64

		{
			storage = item.Status.Capacity.StorageEphemeral().String()
			storage2 = item.Status.Capacity.StorageEphemeral().Value()
			// storage2 = int64(math.Round(float64(storage2) / 1000 / 1000 / 1000))
			// storage2 = int64(math.Round(float64(storage2) / 1024 / 1024 / 1024))
			storage2 = int64(math.Ceil(float64(storage2) / 1024 / 1024 / 1024))
		}

		var runtime string
		runtime = item.Status.NodeInfo.ContainerRuntimeVersion

		nodes = append(
			nodes,
			map[string]interface{}{
				"cluster_id": cluster_id2,
				"name":       name,
				"status":     status,
				"roles":      roles,
				"age":        age,
				"version":    version,
				"ip":         ip,
				"hostname":   hostname,
				"os":         os,
				"os_image":   os_image,
				"arch":       arch,
				"kernel":     kernel,
				"cpu":        cpu,
				"memory":     memory,
				"memory2":    memory2,
				"storage":    storage,
				"storage2":   storage2,
				"runtime":    runtime,
			},
		)
	}

	util.Api(response, 200, nodes)
}
