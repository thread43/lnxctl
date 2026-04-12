package service

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/exec"
	"strconv"
	"strings"

	"github.com/creack/pty"
	"github.com/gorilla/websocket"

	linux_service_common "lnxctl/module/linux/service/common"
	"lnxctl/util"
)

func WsOpenServiceTerminal(response http.ResponseWriter, request *http.Request) {
	defer func() {
		log.Println("bye......")
	}()

	var err error

	var service_id string
	service_id = strings.TrimSpace(request.FormValue("service_id"))

	if util.IsNotSet(service_id) {
		util.Api(response, 400)
		return
	}
	if util.IsNotInt(service_id) {
		util.Api(response, 400)
		return
	}

	var service_id2 int64
	service_id2, err = strconv.ParseInt(service_id, 10, 64)
	util.Raise(err)

	var service map[string]interface{}
	service, err = linux_service_common.GetService(service_id2)
	util.Raise(err)

	var term_cmd string
	term_cmd = service["term_cmd"].(string)
	log.Println("term_cmd:", term_cmd)
	if term_cmd == "" {
		util.Api(response, 400)
	}

	var upgrader = websocket.Upgrader{}
	upgrader = websocket.Upgrader{
		ReadBufferSize:  1024,
		WriteBufferSize: 1024,
		CheckOrigin:     func(request *http.Request) bool { return true },
	}

	var ws *websocket.Conn
	ws, err = upgrader.Upgrade(response, request, nil)
	util.Raise(err)
	defer func() {
		_ = ws.Close()
		log.Println("websocket closed......")
	}()

	StartProcess(ws, service)
}

func StartProcess(ws *websocket.Conn, service map[string]interface{}) {
	var err error

	var term_cmd string
	term_cmd = service["term_cmd"].(string)
	log.Println("term_cmd:", term_cmd)

	var cmd *exec.Cmd
	// cmd = exec.Command("bash")
	// cmd = exec.Command("sh", "-c", "ping localhost")
	// cmd = exec.Command("sh", "-c", "docker exec -it nginx bash")
	// cmd = exec.Command("sh", "-c", "mysql -h127.0.0.1 -uroot -p123456")
	cmd = exec.Command("sh", "-c", term_cmd)
	defer func() {
		err = cmd.Process.Kill()
		util.Skip(err)
		log.Println("cmd killed......")

		// var process_state *os.ProcessState
		// process_state, err = cmd.Process.Wait()
		err = cmd.Wait()
		util.Skip(err)
		log.Println("cmd waited......")
		log.Println("process_state:", cmd.ProcessState)
	}()

	var tty *os.File
	tty, err = pty.Start(cmd)
	util.Raise(err)
	defer func() {
		_ = tty.Close()
		log.Println("tty closed......")
	}()

	// stdout/stderr -> websocket
	go func() {
		defer util.Catch()

		defer func() {
			log.Println("stdout/stderr exited......")
		}()

		var err error

		var buf []byte
		buf = make([]byte, 4096)

		for {
			var length int
			length, err = tty.Read(buf)
			util.Raise(err)

			// fmt.Print(string(buf[:length]))
			// log.Printf("stdout/stderr, %d bytes\n", length)

			err = ws.WriteMessage(websocket.TextMessage, buf[:length])
			util.Raise(err)
		}
	}()

	// websocket -> stdin
	for {
		var message_type int
		var message []byte

		message_type, message, err = ws.ReadMessage()
		if message_type != 1 {
			log.Println("message_type:", message_type)
		}
		if err != nil {
			_ = ws.Close()
			util.Raise(err)
		}

		var message2 map[string]interface{}
		err = json.Unmarshal(message, &message2)
		if err != nil {
			_ = ws.Close()
			util.Raise(err)
		}

		var action string
		var data string
		var cols float64
		var rows float64

		action, _ = message2["action"].(string)
		data, _ = message2["data"].(string)
		cols, _ = message2["cols"].(float64)
		rows, _ = message2["rows"].(float64)

		switch action {
		case "stdin":
			_, err = tty.Write([]byte(data))
			util.Raise(err)
		case "resize":
			err = pty.Setsize(tty, &pty.Winsize{Rows: uint16(rows), Cols: uint16(cols)})
			util.Skip(err)
		default:
			_ = ws.Close()
			err = fmt.Errorf("unknown message type '%s'", action)
			util.Raise(err)
		}
	}
}
