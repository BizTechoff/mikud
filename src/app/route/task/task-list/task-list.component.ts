import { Component, OnDestroy, OnInit } from '@angular/core';
import { Remult } from 'remult';
import { Task } from '../../../entity/task';

@Component({
    selector: 'app-task-list',
    templateUrl: './task-list.component.html',
    styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit, OnDestroy {
    tasks: Task[] = [];
    newTask: Partial<Task> = {};

    constructor(private remult: Remult) {
    }

    unsubscribe = () => { }
    ngOnInit() {
        this.unsubscribe = this.remult.repo(Task).liveQuery({})
            .subscribe(info =>
                this.tasks = info.applyChanges(this.tasks)
            )
        // this.loadTasks();
    }

    ngOnDestroy() {
        if (this.unsubscribe) this.unsubscribe()
    }

    async loadTasks() {
        this.tasks = await this.remult.repo(Task).find();
    }

    async addTask() {
        if (this.newTask.title) {
            const taskRepo = this.remult.repo(Task);
            await taskRepo.insert(this.newTask);
            this.newTask = {};
            // this.loadTasks();
        }
    }

    async toggleCompletion(task: Task) {
        // console.log('toggleCompletion',task.isCompleted)
        task.isCompleted = !!task.isCompleted;
        await this.remult.repo(Task).save(task);
    }
}
