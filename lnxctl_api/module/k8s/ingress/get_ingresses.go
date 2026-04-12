package ingress

import (
	"context"
	"net/http"
	"strconv"
	"strings"
	"time"

	networking_v1 "k8s.io/api/networking/v1"
	meta_v1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/util/duration"
	"k8s.io/client-go/kubernetes"
	"k8s.io/client-go/rest"

	k8s_common "lnxctl/module/k8s/common"
	"lnxctl/util"
)

func GetIngresses(response http.ResponseWriter, request *http.Request) {
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

	var ingress_list *networking_v1.IngressList
	ingress_list, err = clientset.NetworkingV1().Ingresses(namespace).List(context.Background(), meta_v1.ListOptions{})
	util.Raise(err)

	var ingresses []map[string]interface{}
	ingresses = make([]map[string]interface{}, 0)

	var item networking_v1.Ingress
	for _, item = range ingress_list.Items {
		var namespace string
		namespace = item.Namespace

		var name string
		name = item.Name

		var class string
		class = "<none>"
		if item.Spec.IngressClassName != nil {
			class = *item.Spec.IngressClassName
		}

		var hosts []string
		hosts = make([]string, 0)

		{
			var rule networking_v1.IngressRule
			for _, rule = range item.Spec.Rules {
				hosts = append(hosts, rule.Host)
			}
		}

		var age string
		{
			var creation_timestamp time.Time
			var creation_timestamp2 time.Duration

			creation_timestamp = item.CreationTimestamp.Time
			creation_timestamp2 = time.Since(creation_timestamp)
			age = duration.ShortHumanDuration(creation_timestamp2)
		}

		ingresses = append(
			ingresses,
			map[string]interface{}{
				"cluster_id": cluster_id2,
				"namespace":  namespace,
				"name":       name,
				"class":      class,
				"hosts":      hosts,
				"age":        age,
			},
		)
	}

	util.Api(response, 200, ingresses)
}
