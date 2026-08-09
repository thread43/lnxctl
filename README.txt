lnxctl - linux/docker/kubernetes dashboard



-- screenshot
https://thread43.github.io/img/lnxctl_index_statistics.png
https://thread43.github.io/img/lnxctl_linux_host.png
https://thread43.github.io/img/lnxctl_linux_service.png
https://thread43.github.io/img/lnxctl_docker_container.png
https://thread43.github.io/img/lnxctl_kubernetes_pod.png
https://thread43.github.io/img/lnxctl_monitoring_target.png



-- download
wget "https://thread43.github.io/pkg/lnxctl_v20260809.tar.gz"
tar xzvf lnxctl_v20260809.tar.gz
cd lnxctl
./lnxctl



-- usage
./lnxctl
./lnxctl --cronjob
./lnxctl --cronjob=false
./lnxctl --debug
./lnxctl --debug=false
./lnxctl --help
./lnxctl --host="0.0.0.0"
./lnxctl --host="127.0.0.1"
./lnxctl --log="file"
./lnxctl --log="stdout"
./lnxctl --mysql="root:123456@tcp(127.0.0.1:3306)/lnxctl"
./lnxctl --port=1234
./lnxctl --sqlite="lnxctl.db"



-- login
http://127.0.0.1:1234/
admin/admin
guest/guest
