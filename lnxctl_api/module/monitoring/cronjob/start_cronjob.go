package cronjob

import (
	"database/sql"
	"fmt"
	"io"
	"log"
	"net"
	"net/http"
	"strconv"
	"time"

	probing "github.com/prometheus-community/pro-bing"
	"github.com/robfig/cron/v3"

	"lnxctl/util"
)

func GetTargets() []map[string]interface{} {
	var err error

	var targets []map[string]interface{}
	targets = make([]map[string]interface{}, 0)

	{
		var query string
		query = `
			SELECT
			id,
			name, crontab, type,
			ping_host,
			tcp_host, tcp_port,
			http_url, http_status_code,
			is_active
			FROM monitoring_target
			WHERE is_active=1
			ORDER BY name
		`

		var rows *sql.Rows
		rows, err = util.DB.Query(query)
		util.Raise(err)
		defer func() {
			_ = rows.Close()
		}()

		for rows.Next() {
			var id sql.NullInt64
			var name sql.NullString
			var crontab sql.NullString
			var type2 sql.NullInt64
			var ping_host sql.NullString
			var tcp_host sql.NullString
			var tcp_port sql.NullString
			var http_url sql.NullString
			var http_status_code sql.NullString
			var is_active sql.NullInt64

			err = rows.Scan(
				&id,
				&name, &crontab, &type2,
				&ping_host,
				&tcp_host, &tcp_port,
				&http_url, &http_status_code,
				&is_active,
			)
			util.Raise(err)

			targets = append(
				targets,
				map[string]interface{}{
					"id":               id.Int64,
					"name":             name.String,
					"crontab":          crontab.String,
					"type":             type2.Int64,
					"ping_host":        ping_host.String,
					"tcp_host":         tcp_host.String,
					"tcp_port":         tcp_port.String,
					"http_url":         http_url.String,
					"http_status_code": http_status_code.String,
					"is_active":        is_active.Int64,
				},
			)
		}
	}

	return targets
}

func UpdateTarget(target_id int64, check_status int64, check_result string) {
	var err error

	var check_time string
	check_time = util.TimeNow()

	{
		var query string
		query = `
			UPDATE monitoring_target
			SET check_status=?, check_result=?, check_time=?
			WHERE id=?
		`
		_, err = util.DB.Exec(
			query,
			check_status, check_result, check_time,
			target_id,
		)
		util.Skip(err)
	}
}

func CheckPing_(ping_host string) (int64, string) {
	var err error

	log.Println("CheckPing......")

	log.Println("ping_host:", ping_host)

	var check_status int64
	var check_result string

	var command string
	// command = "ping 8.8.8.8 -c3"
	// command = "ping 8.8.8.8 -c3 -W3"
	command = fmt.Sprintf("ping %s -c3 -w5", ping_host)
	log.Println("command:", command)

	var output string
	output, err = util.ExecCmd(command)

	if err == nil {
		check_status = 1
	} else {
		check_status = -1
	}
	check_result = output

	log.Println("check_status:", check_status)
	log.Println("check_result:", check_result)

	return check_status, check_result
}

func CheckPing(ping_host string) (int64, string) {
	var err error

	log.Println("CheckPing......")

	log.Println("ping_host:", ping_host)

	var check_status int64
	var check_result string

	// ping_host = "11.22.33.44"
	// ping_host = "8.8.8.8"
	// ping_host = "google.com"

	var pinger *probing.Pinger
	pinger, err = probing.NewPinger(ping_host)
	if err != nil {
		log.Println(err)
		check_status = -1
		check_result = err.Error()
		return check_status, check_result
	}

	pinger.Count = 3
	pinger.Timeout = 5 * time.Second

	log.Printf("ping %s (%s)......\n", pinger.Addr(), pinger.IPAddr())

	err = pinger.Run()
	if err != nil {
		log.Println(err)
		check_status = -1
		check_result = err.Error()
		return check_status, check_result
	}

	var stats *probing.Statistics
	stats = pinger.Statistics()
	log.Printf("stats: %+v\n", stats)

	if stats.PacketsRecv > 0 {
		check_status = 1
	} else {
		check_status = -1
	}
	check_result = fmt.Sprintf(
		"ping %s (%s), %d packets transmitted, %d received, %d%% packet loss",
		stats.Addr, stats.IPAddr, stats.PacketsSent, stats.PacketsRecv, int64(stats.PacketLoss),
	)

	log.Println("check_status:", check_status)
	log.Println("check_result:", check_result)

	return check_status, check_result
}

func CheckTcp(tcp_host string, tcp_port string) (int64, string) {
	var err error

	log.Println("CheckTcp......")

	log.Println("tcp_host:", tcp_host)
	log.Println("tcp_port:", tcp_port)

	var check_status int64
	var check_result string

	var address string
	address = net.JoinHostPort(tcp_host, tcp_port)

	var timeout time.Duration
	timeout = 3 * time.Second

	var conn net.Conn
	conn, err = net.DialTimeout("tcp", address, timeout)
	if err != nil {
		log.Println(err)
	}
	if conn != nil {
		defer func() {
			_ = conn.Close()
		}()
	}

	if err == nil {
		check_status = 1
	} else {
		check_status = -1
		check_result = err.Error()
	}

	return check_status, check_result
}

func CheckHttp(http_url string, http_status_code string) (int64, string) {
	var err error

	log.Println("CheckHttp......")

	log.Println("http_url:", http_url)
	log.Println("http_status_code:", http_status_code)

	var check_status int64
	var check_result string

	var client *http.Client
	client = &http.Client{Timeout: 3 * time.Second}

	var response *http.Response
	response, err = client.Get(http_url)
	if err != nil {
		log.Println(err)
	}
	if response != nil {
		defer func() {
			_ = response.Body.Close()
		}()
	}

	if err == nil {
		// check_status = 1

		if response != nil {
			// check_status = 1

			log.Println("response status:", response.Status)
			log.Println("response headers:", response.Header)

			var status_code int
			status_code = response.StatusCode

			var status_code2 string
			status_code2 = strconv.Itoa(status_code)
			log.Println("response status code:", status_code2)

			var body []byte
			body, err = io.ReadAll(response.Body)
			util.Skip(err)

			var body2 string
			body2 = string(body)
			if len(body2) > 1024 {
				body2 = body2[:1024]
			}
			log.Println("response body:", body2)

			if status_code2 == http_status_code {
				check_status = 1
			} else {
				check_status = -1
			}

			check_result = status_code2 + " " + body2
		} else {
			check_status = -1
		}
	} else {
		check_status = -1
		check_result = err.Error()
	}

	return check_status, check_result
}

func StartCheck() {
	var targets []map[string]interface{}
	targets = GetTargets()

	var target map[string]interface{}
	for _, target = range targets {
		log.Printf("target: %+v\n", target)

		var target_id int64
		target_id = target["id"].(int64)

		var type2 int64
		type2 = target["type"].(int64)

		// var crontab string
		// crontab = target["crontab"].(string)

		if type2 == 1 {
			var ping_host string
			ping_host = target["ping_host"].(string)

			go func() {
				defer util.Catch()

				defer func() {
					log.Println("cronjob routine exited......")
				}()

				var check_status int64
				var check_result string

				check_status, check_result = CheckPing(ping_host)
				UpdateTarget(target_id, check_status, check_result)
			}()
		}

		if type2 == 2 {
			var tcp_host string
			var tcp_port string

			tcp_host = target["tcp_host"].(string)
			tcp_port = target["tcp_port"].(string)

			go func() {
				defer util.Catch()

				defer func() {
					log.Println("cronjob routine exited......")
				}()

				var check_status int64
				var check_result string

				check_status, check_result = CheckTcp(tcp_host, tcp_port)
				UpdateTarget(target_id, check_status, check_result)
			}()
		}

		if type2 == 3 {
			var http_url string
			var http_status_code string

			http_url = target["http_url"].(string)
			http_status_code = target["http_status_code"].(string)

			go func() {
				defer util.Catch()

				defer func() {
					log.Println("cronjob routine exited......")
				}()

				var check_status int64
				var check_result string

				check_status, check_result = CheckHttp(http_url, http_status_code)
				UpdateTarget(target_id, check_status, check_result)
			}()
		}
	}
}

func StartCronjob() {
	var cronjob *cron.Cron
	cronjob = cron.New()

	cronjob.AddFunc("* * * * *", func() {
		log.Println("running every minute......")
		StartCheck()
	})

	cronjob.Start()
	// defer cronjob.Stop()

	log.Println("cronjob started......")

	// select {}
}
