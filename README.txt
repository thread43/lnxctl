lnxctl - linux/docker/kubernetes web terminal



-- screenshot
https://thread43.github.io/img/lnxctl_linux_host.png
https://thread43.github.io/img/lnxctl_docker_container.png
https://thread43.github.io/img/lnxctl_kubernetes_pod.png



-- download
wget "https://thread43.github.io/pkg/lnxctl_v20260415.tar.gz"
tar xzvf lnxctl_v20260415.tar.gz
cd lnxctl
./lnxctl



-- usage
./lnxctl
./lnxctl --help
./lnxctl --port=1234
./lnxctl --host="0.0.0.0"
./lnxctl --host="127.0.0.1"
./lnxctl --log="file"
./lnxctl --log="stdout"
./lnxctl --sqlite="lnxctl.db"
./lnxctl --mysql="root:123456@tcp(127.0.0.1:3306)/lnxctl"



-- login
http://127.0.0.1:1234/
admin/admin
guest/guest
