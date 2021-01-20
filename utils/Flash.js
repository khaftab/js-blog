class Flash {
    constructor(req) {
        this.req = req
        this.success = this.extractFlashMessage('success')
        this.fail = this.extractFlashMessage('fail')
    }

    extractFlashMessage(name) {
        const message = this.req.flash(name)
        return message.length ? message[0] : false
    }

    hasMessage() {
        return !this.success && !this.fail ? false : true
    }

    static getMessage(req) {
        const flash = new Flash(req)
        return {
            success: flash.success,
            fail: flash.fail,
            hasMessage: flash.hasMessage()
        }
    }
}

module.exports = Flash