package cronjob

import (
	"database/sql"
	"log"

	"github.com/robfig/cron/v3"

	"lnxctl/util"

	linux_host_common "lnxctl/module/linux/host/common"
)

func GetHostIds() []int64 {
	var err error

	var query string
	query = "SELECT id FROM linux_host"

	var host_ids []int64
	host_ids = make([]int64, 0)

	{
		var rows *sql.Rows
		rows, err = util.DB.Query(query)
		util.Raise(err)
		defer func() {
			_ = rows.Close()
		}()

		for rows.Next() {
			var id sql.NullInt64

			err = rows.Scan(&id)
			util.Raise(err)

			host_ids = append(host_ids, id.Int64)
		}
	}

	log.Printf("host_ids: %+v\n", host_ids)

	return host_ids
}

func StartCheck() {
	var err error

	var host_ids []int64
	host_ids = GetHostIds()

	var host_id int64
	for _, host_id = range host_ids {
		err = linux_host_common.UpdateHostInfo(host_id)
		util.Skip(err)
	}
}

func StartCronjob() {
	var cronjob *cron.Cron
	cronjob = cron.New()

	cronjob.AddFunc("*/5 * * * *", func() {
		log.Println("running every 5 minutes......")
		StartCheck()
	})

	cronjob.Start()
	// defer cronjob.Stop()

	log.Println("cronjob started......")

	// select {}
}
