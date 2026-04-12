package daemonset

import (
	"context"
	"net/http"
	"strconv"
	"strings"
	"time"

	apps_v1 "k8s.io/api/apps/v1"
	core_v1 "k8s.io/api/core/v1"
	meta_v1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/util/duration"
	"k8s.io/client-go/kubernetes"
	"k8s.io/client-go/rest"

	k8s_common "lnxctl/module/k8s/common"
	"lnxctl/util"
)

func GetDaemonsets(response http.ResponseWriter, request *http.Request) {
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

	var daemonset_list *apps_v1.DaemonSetList
	daemonset_list, err = clientset.AppsV1().DaemonSets(namespace).List(context.Background(), meta_v1.ListOptions{})
	util.Raise(err)

	var daemonsets []map[string]interface{}
	daemonsets = make([]map[string]interface{}, 0)

	var item apps_v1.DaemonSet
	for _, item = range daemonset_list.Items {
		var namespace string
		namespace = item.Namespace

		var name string
		name = item.Name

		var desired_number_scheduled int32
		var current_number_scheduled int32
		var number_ready int32
		var updated_number_scheduled int32
		var number_available int32

		desired_number_scheduled = item.Status.DesiredNumberScheduled
		current_number_scheduled = item.Status.CurrentNumberScheduled
		number_ready = item.Status.NumberReady
		updated_number_scheduled = item.Status.UpdatedNumberScheduled
		number_available = item.Status.NumberAvailable

		var node_selector map[string]string
		node_selector = item.Spec.Template.Spec.NodeSelector

		var age string
		{
			var creation_timestamp time.Time
			var creation_timestamp2 time.Duration

			creation_timestamp = item.CreationTimestamp.Time
			creation_timestamp2 = time.Since(creation_timestamp)
			age = duration.ShortHumanDuration(creation_timestamp2)
		}

		var containers []map[string]string
		containers = make([]map[string]string, 0)

		var container core_v1.Container
		for _, container = range item.Spec.Template.Spec.Containers {
			containers = append(
				containers,
				map[string]string{
					"name":  container.Name,
					"image": container.Image,
				})
		}

		daemonsets = append(
			daemonsets,
			map[string]interface{}{
				"cluster_id":               cluster_id2,
				"namespace":                namespace,
				"name":                     name,
				"desired_number_scheduled": desired_number_scheduled,
				"current_number_scheduled": current_number_scheduled,
				"number_ready":             number_ready,
				"updated_number_scheduled": updated_number_scheduled,
				"number_available":         number_available,
				"node_selector":            node_selector,
				"age":                      age,
				"containers":               containers,
			},
		)
	}

	util.Api(response, 200, daemonsets)
}
