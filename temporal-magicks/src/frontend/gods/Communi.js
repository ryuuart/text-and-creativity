import { God } from "@18nguyenl/artificer";

export default class Communi extends God {
    constructor() {
        super("Communi");

        const wsButton = document.getElementById("websocket");

        let websocketPrefix = "ws";
        if (process.env.NODE_ENV === "production") {
            const websocketPrefix = "wss";
        }
        this.telepathy = new WebSocket(`${websocketPrefix}://${window.location.host}/circle`)

        this.telepathy.addEventListener("message", (ev) => {
            console.log(ev.data);
        })
    }

    communeWords(message) {
        this.telepathy.send(JSON.stringify({ message: message }))
    }

    communeIdea(message) {
        this.telepathy.send()
    }

    manifest() {

    }
}