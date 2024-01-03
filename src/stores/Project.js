class Project {
    constructor({name='untitled', description='', tags=[], auto_weight=true, weight=100, progress=0, points=1, tasks=[]}) {
        this.name = name
        this.description = description
        this.tags = tags
        this.auto_weight = auto_weight
        this.weight = weight
        this.progress = progress
        this.points = points
        this.tasks = tasks
    }

    


}

export default Project