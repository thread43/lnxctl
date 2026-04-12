package role

import (
	"context"
	"net/http"
	"strconv"
	"strings"
	"time"

	rbac_v1 "k8s.io/api/rbac/v1"
	meta_v1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/util/duration"
	"k8s.io/client-go/kubernetes"
	"k8s.io/client-go/rest"

	k8s_common "lnxctl/module/k8s/common"
	"lnxctl/util"
)

func GetRoles(response http.ResponseWriter, request *http.Request) {
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

	var role_list *rbac_v1.RoleList
	role_list, err = clientset.RbacV1().Roles(namespace).List(context.Background(), meta_v1.ListOptions{})
	util.Raise(err)

	var roles []map[string]interface{}
	roles = make([]map[string]interface{}, 0)

	var item rbac_v1.Role
	for _, item = range role_list.Items {
		var namespace string
		namespace = item.Namespace

		var name string
		name = item.Name

		var created_at string
		created_at = item.CreationTimestamp.Format(time.RFC3339)

		var age string
		{
			var creation_timestamp time.Time
			var creation_timestamp2 time.Duration

			creation_timestamp = item.CreationTimestamp.Time
			creation_timestamp2 = time.Since(creation_timestamp)
			age = duration.ShortHumanDuration(creation_timestamp2)
		}

		roles = append(
			roles,
			map[string]interface{}{
				"cluster_id": cluster_id2,
				"namespace":  namespace,
				"name":       name,
				"created_at": created_at,
				"age":        age,
			},
		)
	}

	util.Api(response, 200, roles)
}
