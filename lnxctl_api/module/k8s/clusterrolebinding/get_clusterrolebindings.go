package clusterrolebinding

import (
	"context"
	"fmt"
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

func GetClusterrolebindings(response http.ResponseWriter, request *http.Request) {
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

	var clusterrolebinding_list *rbac_v1.ClusterRoleBindingList
	clusterrolebinding_list, err = clientset.RbacV1().ClusterRoleBindings().List(context.Background(), meta_v1.ListOptions{})
	util.Raise(err)

	var clusterrolebindings []map[string]interface{}
	clusterrolebindings = make([]map[string]interface{}, 0)

	var item rbac_v1.ClusterRoleBinding
	for _, item = range clusterrolebinding_list.Items {
		var name string
		name = item.Name

		var role string
		role = fmt.Sprintf("%s/%s", item.RoleRef.Kind, item.RoleRef.Name)

		var age string
		{
			var creation_timestamp time.Time
			var creation_timestamp2 time.Duration

			creation_timestamp = item.CreationTimestamp.Time
			creation_timestamp2 = time.Since(creation_timestamp)
			age = duration.ShortHumanDuration(creation_timestamp2)
		}

		var users []string
		var groups []string
		var servieaccounts []string

		users = make([]string, 0)
		groups = make([]string, 0)
		servieaccounts = make([]string, 0)

		var subject rbac_v1.Subject
		for _, subject = range item.Subjects {
			// log.Printf("%+v\n", subject)
			// User|Group|ServiceAccount
			switch subject.Kind {
			case "User":
				users = append(users, subject.Name)
			case "Group":
				groups = append(groups, subject.Name)
			case "ServiceAccount":
				servieaccounts = append(servieaccounts, fmt.Sprintf("%s/%s", subject.Namespace, subject.Name))
			}
		}

		clusterrolebindings = append(
			clusterrolebindings,
			map[string]interface{}{
				"cluster_id":      cluster_id2,
				"name":            name,
				"role":            role,
				"age":             age,
				"users":           users,
				"groups":          groups,
				"serviceaccounts": servieaccounts,
			},
		)
	}

	util.Api(response, 200, clusterrolebindings)
}
