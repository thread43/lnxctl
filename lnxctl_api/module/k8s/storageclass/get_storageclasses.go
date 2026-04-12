package storageclass

import (
	"context"
	"net/http"
	"strconv"
	"strings"
	"time"

	core_v1 "k8s.io/api/core/v1"
	storage_v1 "k8s.io/api/storage/v1"
	meta_v1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/util/duration"
	"k8s.io/client-go/kubernetes"
	"k8s.io/client-go/rest"

	k8s_common "lnxctl/module/k8s/common"
	"lnxctl/util"
)

func GetStorageclasses(response http.ResponseWriter, request *http.Request) {
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

	var storageclass_list *storage_v1.StorageClassList
	storageclass_list, err = clientset.StorageV1().StorageClasses().List(context.Background(), meta_v1.ListOptions{})
	util.Raise(err)

	var storageclasses []map[string]interface{}
	storageclasses = make([]map[string]interface{}, 0)

	var item storage_v1.StorageClass
	for _, item = range storageclass_list.Items {
		var namespace string
		namespace = item.Namespace

		var name string
		name = item.Name

		var provisioner string
		provisioner = item.Provisioner

		// Recycle|Delete|Retain
		var reclaim_policy core_v1.PersistentVolumeReclaimPolicy
		reclaim_policy = "Delete"
		if item.ReclaimPolicy != nil {
			reclaim_policy = *item.ReclaimPolicy
		}

		// Immediate|WaitForFirstConsumer
		var volume_binding_mode storage_v1.VolumeBindingMode
		volume_binding_mode = "Immediate"
		if item.VolumeBindingMode != nil {
			volume_binding_mode = *item.VolumeBindingMode
		}

		var allow_volume_expansion bool
		if item.AllowVolumeExpansion != nil {
			allow_volume_expansion = *item.AllowVolumeExpansion
		}

		var age string
		{
			var creation_timestamp time.Time
			var creation_timestamp2 time.Duration

			creation_timestamp = item.CreationTimestamp.Time
			creation_timestamp2 = time.Since(creation_timestamp)
			age = duration.ShortHumanDuration(creation_timestamp2)
		}

		storageclasses = append(
			storageclasses,
			map[string]interface{}{
				"cluster_id":             cluster_id2,
				"namespace":              namespace,
				"name":                   name,
				"provisioner":            provisioner,
				"reclaim_policy":         reclaim_policy,
				"volume_binding_mode":    volume_binding_mode,
				"allow_volume_expansion": allow_volume_expansion,
				"age":                    age,
			},
		)
	}

	util.Api(response, 200, storageclasses)
}
