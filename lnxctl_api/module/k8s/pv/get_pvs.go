package secret

import (
	"context"
	"fmt"
	"net/http"
	"strconv"
	"strings"
	"time"

	core_v1 "k8s.io/api/core/v1"
	"k8s.io/apimachinery/pkg/api/resource"
	meta_v1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/util/duration"
	"k8s.io/client-go/kubernetes"
	"k8s.io/client-go/rest"

	k8s_common "lnxctl/module/k8s/common"
	"lnxctl/util"
)

func GetPvs(response http.ResponseWriter, request *http.Request) {
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

	var pv_list *core_v1.PersistentVolumeList
	pv_list, err = clientset.CoreV1().PersistentVolumes().List(context.Background(), meta_v1.ListOptions{})
	util.Raise(err)

	var secrets []map[string]interface{}
	secrets = make([]map[string]interface{}, 0)

	var item core_v1.PersistentVolume
	for _, item = range pv_list.Items {
		var namespace string
		namespace = item.Namespace

		var name string
		name = item.Name

		// cpu|memory|storage|ephemeral-storage
		var capacity resource.Quantity
		var capacity2 string

		capacity = item.Spec.Capacity["storage"]
		capacity2 = capacity.String()

		// ReadWriteOnce|ReadOnlyMany|ReadWriteMany|ReadWriteOncePod
		// log.Printf("%v\n", item.Spec.AccessModes)
		var access_modes []core_v1.PersistentVolumeAccessMode
		access_modes = item.Spec.AccessModes

		// Recycle|Delete|Retain
		var reclaim_policy core_v1.PersistentVolumeReclaimPolicy
		reclaim_policy = item.Spec.PersistentVolumeReclaimPolicy

		// Pending|Available|Bound|Released|Failed
		var status core_v1.PersistentVolumePhase
		status = item.Status.Phase

		var claim string
		if item.Spec.ClaimRef != nil {
			claim = fmt.Sprintf("%s/%s", item.Spec.ClaimRef.Namespace, item.Spec.ClaimRef.Name)
		}

		var storage_class string
		storage_class = item.Spec.StorageClassName

		var volume_attributes_class string
		if item.Spec.VolumeAttributesClassName != nil {
			volume_attributes_class = *item.Spec.VolumeAttributesClassName
		}
		if volume_attributes_class == "" {
			volume_attributes_class = "<unset>"
		}

		var reason string
		reason = item.Status.Reason

		var age string
		{
			var creation_timestamp time.Time
			var creation_timestamp2 time.Duration

			creation_timestamp = item.CreationTimestamp.Time
			creation_timestamp2 = time.Since(creation_timestamp)
			age = duration.ShortHumanDuration(creation_timestamp2)
		}

		// Block|Filesystem
		var volume_mode core_v1.PersistentVolumeMode
		volume_mode = *item.Spec.VolumeMode

		secrets = append(
			secrets,
			map[string]interface{}{
				"cluster_id":              cluster_id2,
				"namespace":               namespace,
				"name":                    name,
				"capacity":                capacity2,
				"access_modes":            access_modes,
				"reclaim_policy":          reclaim_policy,
				"status":                  status,
				"claim":                   claim,
				"storage_class":           storage_class,
				"volume_attributes_class": volume_attributes_class,
				"reason":                  reason,
				"age":                     age,
				"volume_mode":             volume_mode,
			},
		)
	}

	util.Api(response, 200, secrets)
}
