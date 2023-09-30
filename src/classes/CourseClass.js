class RegisteredCourse {
    constructor(name) {
        this.name = name;
        this.groups = [];
    }

    addGroup(group) {
        this.groups.push(group);
    }
}

class Group {
    constructor(name) {
        this.name = name;
        this.sessions = [];
    }
}

class Session {
    constructor(day, time_start, time_end) {
        this.day = day;
        this.time_start = time_start;
        this.time_end = time_end;
    }
}
