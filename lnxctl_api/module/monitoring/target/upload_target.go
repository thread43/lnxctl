package target

import (
	"encoding/json"
	"log"
	"mime/multipart"
	"net/http"

	"lnxctl/util"
)

func UploadTarget(response http.ResponseWriter, request *http.Request) {
	var err error

	err = request.ParseMultipartForm(64 << 20)
	util.Raise(err)

	var file multipart.File
	var file_header *multipart.FileHeader

	file, file_header, err = request.FormFile("file")
	util.Raise(err)
	defer func() {
		_ = file.Close()
		log.Println("file closed......")
	}()

	log.Println("uploaded file name:", file_header.Filename)
	log.Println("uploaded file size:", file_header.Size)
	log.Println("uploaded file header:", file_header.Header)

	var data []map[string]any
	err = json.NewDecoder(file).Decode(&data)
	util.Raise(err)

	log.Println("data:", data)

	{
		var item map[string]any
		for _, item = range data {
			log.Println("item:", item)

			var name string
			var crontab string
			var type2 float64
			var ping_host string
			var tcp_host string
			var tcp_port string
			var http_url string
			var is_active float64
			var remark string
			var create_time string
			var update_time string

			name = item["name"].(string)
			crontab = item["crontab"].(string)
			type2 = item["type"].(float64)
			ping_host = item["ping_host"].(string)
			tcp_host = item["tcp_host"].(string)
			tcp_port = item["tcp_port"].(string)
			http_url = item["http_url"].(string)
			is_active = item["is_active"].(float64)
			remark = item["remark"].(string)
			create_time = item["create_time"].(string)
			update_time = item["update_time"].(string)

			{
				var query string
				query = `
					INSERT INTO monitoring_target (
						name, crontab, type,
						ping_host,
						tcp_host, tcp_port,
						http_url,
						is_active, remark, create_time, update_time
					)
					VALUES (?,?,?,?,?,?,?,?,?,?,?)
				`
				_, err = util.DB.Exec(
					query,
					name, crontab, type2,
					ping_host,
					tcp_host, tcp_port,
					http_url,
					is_active, remark, create_time, update_time,
				)
				util.Raise(err)
			}
		}
	}

	util.Api(response, 200)
}
