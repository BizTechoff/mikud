import { Component, OnDestroy, OnInit } from '@angular/core';
import { Remult, repo } from 'remult';
import { openDialog } from '../../../common-ui-elements';
import { YesNoQuestionComponent } from '../../../common/yes-no-question/yes-no-question.component';
import { Task } from '../../../entity/task';

@Component({
    selector: 'app-task-list',
    templateUrl: './task-list.component.html',
    styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit, OnDestroy {
    tasks: Task[] = [];
    newTask: Partial<Task> = {};
    editmode = false

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
        if (this.newTask.description) {
            const taskRepo = this.remult.repo(Task);
            await taskRepo.insert(this.newTask);
            var whom = this.newTask.whom
            this.newTask = {};
            this.newTask.whom = whom
            // this.loadTasks();
        }
    }

    async updateTask() {
        if(this.newTask)
        {const taskRepo = this.remult.repo(Task);
        await taskRepo.save(this.newTask);
        }
    }

    async editTask(t: Task) {
        this.newTask = t
    }

    async removeTask(t: Task) {
        if (t) {
            const yes = await openDialog(
                YesNoQuestionComponent,
                (d) => (d.args = { message: 'להסיר את ' + t.description, isAQuestion: true, }),
                (d) => (d?.okPressed)
            )
            if (yes) {
                const taskRepo = this.remult.repo(Task);
                await taskRepo.delete(t);
            }
            // this.newTask = {};
            // this.loadTasks();
        }
    }

    async toggleCompletion(task: Task) {
        // console.log('toggleCompletion',task.isCompleted)
        task.isCompleted = !!task.isCompleted;
        await this.remult.repo(Task).save(task);
    }
}
