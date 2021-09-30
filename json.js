const fs = require('fs');
const path = require('path');
module.exports = class json {
    constructor(filename) {
        this.filename = filename;
        this.file = fs.readFileSync(path.join(__dirname, this.filename), 'utf8')
        this.data = JSON.parse(this.file);
        this.update = () => {
            fs.writeFileSync(
                path.join(__dirname, this.filename),
                JSON.stringify(this.data)
            );
        }
    }
}