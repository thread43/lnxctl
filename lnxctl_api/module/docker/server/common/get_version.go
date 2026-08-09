package common

import (
	"context"

	"github.com/moby/moby/api/types/system"
	"github.com/moby/moby/client"

	"lnxctl/util"
)

func GetVersion(host string) (string, error) {
	var err error

	var docker_client *client.Client
	docker_client, err = client.New(client.WithHost(host))
	util.Raise(err)
	defer func() {
		_ = docker_client.Close()
	}()

	var system_info_result client.SystemInfoResult
	system_info_result, err = docker_client.Info(context.Background(), client.InfoOptions{})
	util.Raise(err)

	var info system.Info
	info = system_info_result.Info

	var version string
	version = info.ServerVersion

	return version, nil
}
