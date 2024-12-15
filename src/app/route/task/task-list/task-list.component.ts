import { Component, OnDestroy, OnInit } from '@angular/core';
import { Remult } from 'remult';
import { openDialog } from '../../../common-ui-elements';
import { YesNoQuestionComponent } from '../../../common/yes-no-question/yes-no-question.component';
import { Task } from '../../../entity/task';

@Component({
    selector: 'app-task-list',
    templateUrl: './task-list.component.html',
    styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit, OnDestroy {
    whom = 'ערן'
    taskRepo = this.remult.repo(Task);
    tasks: Task[] = [];
    newTask = this.taskRepo.create({ whom: this.whom })
    editmode = false

    constructor(private remult: Remult) {
    }

    unsubscribe = () => { }
    ngOnInit() {
        this.unsubscribe = this.remult.repo(Task).liveQuery({ orderBy: { updated: 'desc' } })
            .subscribe(info => {
                this.tasks = info.applyChanges(this.tasks)
                this.whomChanged() 
                this.orderTasks();
                // this.setTasks(info.applyChanges(this.tasks))
                // this.tasks.sort((a, b) => b.dueDate - +a.dueDate)
            })
        // this.loadTasks();
    }

    orderTasks() {
        this.tasks.sort((a,b) => +b.created - +a.created)
    }

    whomChanged() {
        // this.tasks = this.tasks.filter(t=>t.whom === this.whom)
        // console.log('dsdsds')
    }

    ngOnDestroy() {
        if (this.unsubscribe) this.unsubscribe()
    }

    async addTask() {
        if (this.newTask.description) {
            const taskRepo = this.remult.repo(Task);
            this.newTask.whom = this.whom
            await taskRepo.insert(this.newTask);
            this.newTask = this.taskRepo.create({ whom: this.whom })
            this.orderTasks()
            // this.loadTasks();
        }
    }

    async updateTask() {
        if (this.newTask) {
            const taskRepo = this.remult.repo(Task);
            await taskRepo.save(this.newTask);
            this.orderTasks()
        }
    }

    clear() {
        this.editmode = false
        this.newTask = this.taskRepo.create({ whom: this.whom })
    }

    async editTask(t: Task) {
        this.editmode = true
        this.newTask = t
        this.whom = this.newTask.whom
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
