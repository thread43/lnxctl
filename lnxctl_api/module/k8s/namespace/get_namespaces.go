package namespace

import (
	"context"
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

func GetNamespaces(response http.ResponseWriter, request *http.Request) {
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

	var namespace_list *core_v1.NamespaceList
	namespace_list, err = clientset.CoreV1().Namespaces().List(context.Background(), meta_v1.ListOptions{})
	util.Raise(err)

	var namespaces []map[string]interface{}
	namespaces = make([]map[string]interface{}, 0)

	var item core_v1.Namespace
	for _, item = range namespace_list.Items {
		var name string
		name = item.Name

		// NamespaceActive NamespacePhase = "Active"
		// NamespaceTerminating NamespacePhase = "Terminating"
		var status string
		status = string(item.Status.Phase)

		var age string
		{
			var creation_timestamp time.Time
			var creation_timestamp2 time.Duration

			creation_timestamp = item.CreationTimestamp.Time
			creation_timestamp2 = time.Since(creation_timestamp)
			age = duration.ShortHumanDuration(creation_timestamp2)
		}

		namespaces = append(
			namespaces,
			map[string]interface{}{
				"cluster_id": cluster_id2,
				"name":       name,
				"status":     status,
				"age":        age,
			},
		)
	}

	util.Api(response, 200, namespaces)
}
