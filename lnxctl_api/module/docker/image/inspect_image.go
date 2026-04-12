package image

import (
	"context"
	"encoding/json"
	"net/http"
	"strconv"
	"strings"

	types_image "github.com/docker/docker/api/types/image"
	"github.com/docker/docker/client"

	docker_common "lnxctl/module/docker/common"
	"lnxctl/util"
)

func InspectImage(response http.ResponseWriter, request *http.Request) {
	var err error

	var server_id string
	var image_id string

	server_id = strings.TrimSpace(request.FormValue("server_id"))
	image_id = strings.TrimSpace(request.FormValue("image_id"))

	if util.IsNotSet(server_id, image_id) {
		util.Api(response, 400)
		return
	}
	if util.IsNotInt(server_id) {
		util.Api(response, 400)
		return
	}

	var server_id2 int64
	server_id2, err = strconv.ParseInt(server_id, 10, 64)
	util.Raise(err)

	var host string
	host, err = docker_common.GetServerHost(server_id2)
	util.Raise(err)

	var docker_client *client.Client
	docker_client, err = client.NewClientWithOpts(client.WithHost(host), client.WithAPIVersionNegotiation())
	util.Raise(err)
	defer func() {
		_ = docker_client.Close()
	}()

	var image types_image.InspectResponse
	// image, _, err = docker_client.ImageInspectWithRaw(context.Background(), image_id)
	image, err = docker_client.ImageInspect(context.Background(), image_id)
	util.Raise(err)

	var image2 []byte
	image2, err = json.Marshal(image)
	util.Raise(err)

	util.Api(response, 200, string(image2))
}
