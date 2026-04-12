package job

import (
	"context"
	"net/http"
	"strconv"
	"strings"

	batch_v1 "k8s.io/api/batch/v1"
	meta_v1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes"
	"k8s.io/client-go/rest"
	"sigs.k8s.io/yaml"

	k8s_common "lnxctl/module/k8s/common"
	"lnxctl/util"
)

func GetJobYaml(response http.ResponseWriter, request *http.Request) {
	var err error

	var cluster_id string
	var namespace string
	var name string

	cluster_id = strings.TrimSpace(request.FormValue("cluster_id"))
	namespace = strings.TrimSpace(request.FormValue("namespace"))
	name = strings.TrimSpace(request.FormValue("name"))

	if util.IsNotSet(cluster_id, namespace, name) {
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

	var job *batch_v1.Job
	job, err = clientset.BatchV1().Jobs(namespace).Get(context.Background(), name, meta_v1.GetOptions{})
	util.Raise(err)

	var job2 []byte
	job2, err = yaml.Marshal(job)
	util.Raise(err)

	util.Api(response, 200, string(job2))
}
