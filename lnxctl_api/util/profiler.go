package util

import (
	"log"
	"runtime"
	"time"
)

func InitProfiler() {
	go func() {
		// for range time.Tick(time.Second * 60) {
		// 	log.Println("active goroutines:", runtime.NumGoroutine())
		// }

		for {
			log.Println("active goroutines:", runtime.NumGoroutine())
			time.Sleep(60 * time.Second)
		}
	}()
}
