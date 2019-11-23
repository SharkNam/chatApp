class Room {
    constructor() {
        this.users = []
    }
    /**
     * @todo them moi 1 user
     */
    addUser(id, name, room) {
        const user = { id, name, room }
        this.users.push(user)
    }

    findUserIndexById(id) {
        return this.users.findIndex(e => e.id === id)
    }

    findUserById(id) {
        const index = this.findUserIndexById(id);
        return this.users[index]
    }

    removeUserById(id) {
        const index = this.findUserIndexById(id)
        const user = this.users[index]
        this.users.splice(index, 1) //compare splice vs slice
        return user;
    }

    findUsersInRoom(room) {
        return this.users.filter(a => a.room === room)
    }
}

module.exports = Room;