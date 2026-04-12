package cronjob

import (
	"context"
	"net/http"
	"strconv"
	"strings"
	"time"

	batch_v1 "k8s.io/api/batch/v1"
	core_v1 "k8s.io/api/core/v1"
	meta_v1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/util/duration"
	"k8s.io/client-go/kubernetes"
	"k8s.io/client-go/rest"

	k8s_common "lnxctl/module/k8s/common"
	"lnxctl/util"
)

func GetCronjobs(response http.ResponseWriter, request *http.Request) {
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

	var cronjob_list *batch_v1.CronJobList
	cronjob_list, err = clientset.BatchV1().CronJobs(namespace).List(context.Background(), meta_v1.ListOptions{})
	util.Raise(err)

	var cronjobs []map[string]interface{}
	cronjobs = make([]map[string]interface{}, 0)

	var item batch_v1.CronJob
	for _, item = range cronjob_list.Items {
		var namespace string
		namespace = item.Namespace

		var name string
		name = item.Name

		var schedule string
		schedule = item.Spec.Schedule

		var timezone string
		timezone = "<none>"
		if item.Spec.TimeZone != nil {
			timezone = *item.Spec.TimeZone
		}

		var suspend bool
		suspend = *item.Spec.Suspend

		var active int
		active = len(item.Status.Active)

		var last_schedule time.Time
		var last_schedule2 time.Duration
		var last_schedule3 string

		last_schedule = item.Status.LastScheduleTime.Time
		last_schedule2 = time.Since(last_schedule)
		last_schedule3 = duration.HumanDuration(last_schedule2)

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
		for _, container = range item.Spec.JobTemplate.Spec.Template.Spec.Containers {
			containers = append(
				containers,
				map[string]string{
					"name":  container.Name,
					"image": container.Image,
				})
		}

		cronjobs = append(
			cronjobs,
			map[string]interface{}{
				"cluster_id":    cluster_id2,
				"namespace":     namespace,
				"name":          name,
				"schedule":      schedule,
				"timezone":      timezone,
				"suspend":       suspend,
				"active":        active,
				"last_schedule": last_schedule3,
				"age":           age,
				"containers":    containers,
			},
		)
	}

	util.Api(response, 200, cronjobs)
}
