const socket = io()
const { name, room } = $.deparam(window.location.search) //BOM

socket.on("connect", () => {
    socket.emit("joinRoom", {
        name, room
    })
    console.log("Connected to server")
})
socket.on("disconnect", () => {
    console.log("Disconnected")
})

socket.on("serverMsg", msg => {
    // console.log(msg)
    // const liTag = $(`<li>${msg.content}</li>`)
    // const olTag = $("#messages")
    // olTag.append(liTag)
    //rendter file js thanh html
    const olTag = $("#messages")
    const template = $("#message-template").html();
    const html = Mustache.render(template, {
        from: msg.from,
        createdAt: moment(msg.createdAt).format('hh:mm a'),
        content: msg.content
    })
    olTag.append(html);
})

socket.on('Welcome', msg => {
    console.log(msg)
})

socket.on('newUser', msg => (
    console.log(msg)
))

$("#message-form").on("submit", (e) => {
    e.preventDefault();

    socket.emit('clientMsg', {
        from: name,
        content: $("[name=message]").val()
    })
    $("[name=message]").val("")
    $("#messages").scrollTop($("#messages").height());

})
$("#send-location").on("click", () => {
    if (!navigator.geolocation) {
        alert("Trinh duyet cua ban qua cu") //trinh duyet qua cu trong geolocation ko co navigator
    } else {
        navigator.geolocation.getCurrentPosition(pos => {
            // console.log(pos)
            const lat = pos.coords.latitude
            const lng = pos.coords.longitude
            socket.emit("clientLocation", {
                from: name, lat, lng
            })
        })
    }
})

socket.on("serverLocation", msg => {
    // console.log(msg)
    // const liTag = $(`<li></li>`)
    // const olTag = $("#messages")
    // olTag.append(liTag)
    // const aTag = $(`<a target="_blank" href = "https://www.google.com/maps?q=${msg.lat},${msg.lng}">My location </a>`)
    // liTag.append(aTag)
    const olTag = $("#messages")
    const template = $("#location-template").html();
    const html = Mustache.render(template, {
        from: msg.from,
        createdAt: moment(msg.createdAt).format('hh:mm a'),
        href: `https://www.google.com/maps?q=${msg.lat},${msg.lng}`
    })
    olTag.append(html);
})

socket.on("userList", msg => {
    const olTag = $("<ol></ol>");
    msg.userList.forEach(user => {
        const liTag = $(`<li>${user.name}</li>`)
        olTag.append(liTag)
    })
    $("#users").html(olTag)
})

